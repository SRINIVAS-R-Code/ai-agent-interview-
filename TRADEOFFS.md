# Tradeoffs & Design Reasoning

This document captures the key design decisions made during development and the reasoning behind each choice.

---

## 1. NLP Engine: SBERT over TF-IDF alone

**Decision**: Use Sentence-BERT (`all-MiniLM-L6-v2`) as the primary similarity method, with TF-IDF as a fallback.

**Why SBERT?**
- TF-IDF is purely lexical: "developer" and "engineer" score zero similarity despite being near-synonyms. A candidate whose resume says "software developer" would unfairly score low against a JD using "engineer".
- SBERT produces dense semantic embeddings that capture meaning. Cosine similarity on these embeddings correctly identifies semantic overlap.
- `all-MiniLM-L6-v2` was chosen specifically because it offers the best speed/accuracy tradeoff at 90MB — production-viable without GPU.

**Why keep TF-IDF?**
- `sentence-transformers` requires PyTorch (241MB download). Some reviewers may face network or hardware constraints.
- TF-IDF activates automatically as a fallback — the system never fails, just degrades gracefully.
- The weighted blend (`0.7 × SBERT + 0.3 × TF-IDF`) also uses TF-IDF to reward exact keyword matches (important for ATS-style screening).

**Considered but rejected**: OpenAI embeddings (cost/API dependency), BM25 (no semantic understanding), SpaCy similarity (less accurate on short texts).

---

## 2. Backend: Django over Flask/FastAPI

**Decision**: Django + Django REST Framework instead of Flask (the original prototype).

**Why Django?**
- **ORM + migrations**: Free persistent storage with `python manage.py migrate`. Flask requires SQLAlchemy setup.
- **DRF serializers**: Auto-validates inputs, generates clean JSON output, handles file upload parsing.
- **Admin interface**: `django-admin` gives a free database browser at `/admin/`.
- **Scalability path**: Django apps (screening, interview) are modular and can be extracted into microservices later.

**Why not FastAPI?**
- FastAPI is excellent for pure APIs but lacks built-in ORM, admin, and file handling. For a 24-hour challenge with a database requirement, Django ships faster.
- FastAPI's async model would require an async ORM (SQLAlchemy async or Tortoise) — added complexity.

**Tradeoff**: Django is heavier than Flask (~50ms cold start vs ~5ms). For a demo with <100 users, this is irrelevant. At scale, cache with Redis or serve behind gunicorn with multiple workers.

---

## 3. LLM: Groq (LLaMA 3.3 70B) over OpenAI

**Decision**: Groq API with LLaMA 3.3 70B Versatile.

**Why Groq?**
- **Speed**: Groq's LPU inference delivers ~700 tokens/second — interview questions generate in <1 second.
- **Cost**: Free tier is sufficient for this project; no billing surprises for reviewers.
- **Privacy**: Runs on Meta's open-weight model — no proprietary model lock-in.

**Why LLaMA 3.3 70B specifically?**
- Strong instruction following for structured JSON output (scoring, evaluation).
- 70B parameters provides quality comparable to GPT-4 for structured tasks.
- The `versatile` variant handles both short (question gen) and longer (evaluation) contexts well.

**Tradeoff**: Groq's free tier has rate limits (~30 requests/minute). For concurrent users in production, add a queue (Celery + Redis) and consider a paid tier.

---

## 4. Database: SQLite over PostgreSQL

**Decision**: SQLite as the default development database.

**Why SQLite?**
- **Zero setup**: Reviewers can clone and run with no external DB dependencies.
- **File-based**: The `db.sqlite3` file is self-contained — easy to inspect, reset, or share.
- **Django ORM abstracts it**: Switching to PostgreSQL for production requires only changing the `DATABASES` setting — no code changes.

**When to switch**: Any multi-threaded production environment, concurrent write operations, or > 1GB of data. Change `ENGINE` to `django.db.backends.postgresql` and set `DB_*` env vars.

---

## 5. PDF Parsing: pdfplumber over PyPDF2

**Decision**: `pdfplumber` instead of `PyPDF2`.

**Why pdfplumber?**
- PyPDF2 often fails on PDFs with complex layouts (multi-column, tables, headers) — common in professionally formatted resumes.
- pdfplumber uses `pdfminer.six` internally and preserves reading order much better.
- Handles scanned PDFs more gracefully (though OCR still requires Tesseract — noted as a limitation).

**Tradeoff**: pdfplumber is slower (~100ms per page) vs PyPDF2 (~10ms). For resume screening (single document), this is imperceptible.

---

## 6. Frontend: React + Vite over server-rendered templates

**Decision**: Separate React SPA instead of Django templates.

**Why React?**
- The interview session requires real-time state (per-question scoring, answer reveal, progress bar) that Django templates would need JavaScript for anyway.
- Component separation (LandingPage → ResumeScreening → InterviewSession → EvaluationDashboard) maps cleanly to the 4-phase user flow.
- Vite's HMR makes the development loop extremely fast.

**Tradeoff**: Adds `npm install` to setup. Mitigated by documenting this clearly in the README.

---

## 7. What Doesn't Work Yet (Honest Limitations)

| Limitation | Workaround | Future Fix |
|---|---|---|
| OCR for scanned PDFs | Use text-based PDFs | Add Tesseract via `pytesseract` |
| No authentication | Single-user demo only | Add Django auth + JWT |
| SBERT requires torch download | TF-IDF fallback activates | Pre-download model in setup script |
| Rate limits on Groq free tier | Single-user demo acceptable | Celery + Redis queue for production |
| No streaming responses | Polling after submit | WebSocket / SSE for real-time typing |

---

## 8. What I Would Do With More Time

1. **Streaming LLM responses**: Use SSE to stream the question/evaluation text as it generates
2. **Resume parsing improvements**: OCR for scanned PDFs, table extraction for skills sections
3. **Custom skill taxonomy per JD**: Extract skills from the JD itself rather than a static list
4. **Multi-language support**: SBERT supports 50+ languages with the `paraphrase-multilingual-MiniLM-L12-v2` model
5. **Calibration layer**: Score normalization to reduce LLM variance in scoring
6. **Batch screening**: Upload multiple resumes and rank candidates against one JD
