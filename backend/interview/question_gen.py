"""
Interview App — Groq-powered question generation
"""
import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

_client = None

def _get_client():
    global _client
    if _client is None:
        api_key = os.getenv("GROQ_API_KEY", "")
        _client = Groq(api_key=api_key)
    return _client

MODEL = "llama-3.3-70b-versatile"

SYSTEM_PROMPT = """You are an expert technical interviewer.
Generate exactly N interview questions for the given role.
Rules:
- One question per line, no numbering, no bullet points, no extra text.
- Mix conceptual understanding, practical application, and problem-solving.
- Start easier, increase difficulty progressively.
- Make questions specific and relevant to the role.
- If a job description is provided, tailor questions to it."""


def generate_questions(role: str, n: int = 5, jd_context: str = "") -> list:
    """Generate N interview questions for a role, optionally guided by JD context."""
    context_clause = ""
    if jd_context.strip():
        # Use first 600 chars of JD to guide question generation
        context_clause = f"\n\nJob Description context:\n{jd_context[:600]}"

    response = _get_client().chat.completions.create(
        model=MODEL,
        max_tokens=600,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {
                "role": "user",
                "content": f"Role: {role}{context_clause}\n\nGenerate {n} interview questions.",
            },
        ],
    )
    text = response.choices[0].message.content.strip()
    questions = [q.strip("- •").strip() for q in text.split("\n") if q.strip()]
    return questions[:n]
