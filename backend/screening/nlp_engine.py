"""
NLP Engine — Resume vs Job Description Similarity Scoring

Primary  : Sentence-BERT (all-MiniLM-L6-v2) — semantic cosine similarity
Fallback : TF-IDF + cosine similarity (sklearn) — keyword overlap

Final score = 0.7 * sbert_score + 0.3 * tfidf_score
"""
import re
import logging
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Sentence-BERT (lazy-loaded so startup is fast; falls back if unavailable)
# ---------------------------------------------------------------------------
_sbert_model = None
_sbert_available = False

def _load_sbert():
    global _sbert_model, _sbert_available
    if _sbert_model is not None:
        return _sbert_available
    try:
        from sentence_transformers import SentenceTransformer
        _sbert_model = SentenceTransformer('all-MiniLM-L6-v2')
        _sbert_available = True
        logger.info("SBERT model loaded: all-MiniLM-L6-v2")
    except Exception as exc:
        logger.warning(f"SBERT unavailable ({exc}); using TF-IDF fallback only.")
        _sbert_available = False
    return _sbert_available


# ---------------------------------------------------------------------------
# Skill taxonomy — curated set of common technical + soft skills
# ---------------------------------------------------------------------------
SKILL_TAXONOMY = {
    "languages": [
        "python", "javascript", "typescript", "java", "c++", "c#", "go",
        "rust", "ruby", "php", "swift", "kotlin", "scala", "r", "matlab",
        "sql", "html", "css", "bash", "shell",
    ],
    "frameworks": [
        "react", "vue", "angular", "django", "flask", "fastapi", "spring",
        "node", "express", "nextjs", "nuxt", "svelte", "rails", "laravel",
        "tensorflow", "pytorch", "scikit-learn", "keras", "pandas", "numpy",
    ],
    "tools": [
        "git", "docker", "kubernetes", "aws", "gcp", "azure", "linux",
        "nginx", "postgresql", "mysql", "mongodb", "redis", "kafka",
        "rabbitmq", "elasticsearch", "graphql", "rest", "grpc", "ci/cd",
        "jenkins", "github actions", "terraform", "ansible",
    ],
    "concepts": [
        "machine learning", "deep learning", "nlp", "computer vision",
        "data structures", "algorithms", "system design", "microservices",
        "api design", "agile", "scrum", "tdd", "devops", "llm", "rag",
        "vector database", "embeddings", "transformers",
    ],
}

ALL_SKILLS = [s for skills in SKILL_TAXONOMY.values() for s in skills]


def _extract_skills(text: str) -> set:
    """Extract skills mentioned in text using keyword matching."""
    text_lower = text.lower()
    found = set()
    for skill in ALL_SKILLS:
        # Word-boundary aware match
        pattern = r'\b' + re.escape(skill) + r'\b'
        if re.search(pattern, text_lower):
            found.add(skill)
    return found


def _tfidf_similarity(text_a: str, text_b: str) -> float:
    """TF-IDF cosine similarity between two texts. Returns 0.0–1.0."""
    try:
        vectorizer = TfidfVectorizer(stop_words='english', ngram_range=(1, 2))
        tfidf = vectorizer.fit_transform([text_a, text_b])
        score = float(cosine_similarity(tfidf[0:1], tfidf[1:2])[0][0])
        return round(score, 4)
    except Exception as exc:
        logger.error(f"TF-IDF error: {exc}")
        return 0.0


def _sbert_similarity(text_a: str, text_b: str) -> float:
    """SBERT cosine similarity between two texts. Returns 0.0–1.0."""
    try:
        from sentence_transformers import util
        emb_a = _sbert_model.encode(text_a, convert_to_tensor=True)
        emb_b = _sbert_model.encode(text_b, convert_to_tensor=True)
        score = float(util.cos_sim(emb_a, emb_b)[0][0])
        # Clamp to [0, 1]
        return round(max(0.0, min(1.0, score)), 4)
    except Exception as exc:
        logger.error(f"SBERT error: {exc}")
        return 0.0


def analyze_match(resume_text: str, jd_text: str) -> dict:
    """
    Full NLP analysis: similarity scoring + skill extraction.

    Returns:
        {
            "match_score": float (0–100),
            "sbert_score": float (0–1) | None,
            "tfidf_score": float (0–1),
            "method": "sbert+tfidf" | "tfidf",
            "matched_skills": list[str],
            "missing_skills": list[str],
            "resume_skills": list[str],
            "jd_skills": list[str],
            "recommendation": str,
        }
    """
    # --- Similarity ---
    tfidf_score = _tfidf_similarity(resume_text, jd_text)
    sbert_available = _load_sbert()

    if sbert_available:
        sbert_score = _sbert_similarity(resume_text, jd_text)
        raw_score = 0.7 * sbert_score + 0.3 * tfidf_score
        method = "sbert+tfidf"
    else:
        sbert_score = None
        raw_score = tfidf_score
        method = "tfidf"

    match_score = round(raw_score * 100, 1)

    # --- Skill extraction ---
    resume_skills = _extract_skills(resume_text)
    jd_skills = _extract_skills(jd_text)

    matched_skills = sorted(resume_skills & jd_skills)
    missing_skills = sorted(jd_skills - resume_skills)

    # --- Recommendation ---
    if match_score >= 75:
        recommendation = "Strong Match — Highly recommended for interview."
    elif match_score >= 55:
        recommendation = "Good Match — Worth interviewing with minor skill gaps."
    elif match_score >= 35:
        recommendation = "Partial Match — Significant gaps; consider with caution."
    else:
        recommendation = "Weak Match — Resume does not align well with this role."

    return {
        "match_score": match_score,
        "sbert_score": round(sbert_score, 4) if sbert_score is not None else None,
        "tfidf_score": round(tfidf_score, 4),
        "method": method,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "resume_skills": sorted(resume_skills),
        "jd_skills": sorted(jd_skills),
        "recommendation": recommendation,
    }
