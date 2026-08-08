"""
Interview App — Groq-powered answer scoring and final evaluation
"""
import os
import json
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

_client = None

def _get_client():
    global _client
    if _client is None:
        _client = Groq(api_key=os.getenv("GROQ_API_KEY", ""))
    return _client

MODEL = "llama-3.3-70b-versatile"

SCORE_PROMPT = """You are a strict but fair technical interview evaluator.
Given a question and a candidate's answer, score it 1-10 and explain why in one sentence.
Return ONLY valid JSON: {"score": int, "justification": "string"}
Scoring guide: 1-3=irrelevant/wrong, 4-6=partial/vague, 7-8=solid/correct, 9-10=excellent/comprehensive."""

FINAL_PROMPT = """You are a senior hiring manager. Given a full interview transcript with scores,
produce an honest overall evaluation. Return ONLY valid JSON:
{
  "average_score": float,
  "strengths": ["string", ...],
  "gaps": ["string", ...],
  "overall_verdict": "string",
  "hire_recommendation": "Strong Yes" | "Yes" | "Maybe" | "No"
}"""


def score_answer(question: str, answer: str) -> dict:
    """Score a single answer 1-10 with justification."""
    if not answer.strip():
        return {"score": 0, "justification": "No answer provided."}

    response = _get_client().chat.completions.create(
        model=MODEL,
        max_tokens=200,
        messages=[
            {"role": "system", "content": SCORE_PROMPT},
            {"role": "user", "content": f"Question: {question}\nAnswer: {answer}"},
        ],
    )
    raw = (
        response.choices[0].message.content.strip()
        .replace("```json", "").replace("```", "").strip()
    )
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        return {"score": 0, "justification": "Could not parse evaluation."}


def final_evaluation(transcript: list) -> dict:
    """Produce holistic evaluation from full transcript."""
    response = _get_client().chat.completions.create(
        model=MODEL,
        max_tokens=600,
        messages=[
            {"role": "system", "content": FINAL_PROMPT},
            {"role": "user", "content": f"Transcript:\n{json.dumps(transcript, indent=2)}"},
        ],
    )
    raw = (
        response.choices[0].message.content.strip()
        .replace("```json", "").replace("```", "").strip()
    )
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        return {
            "average_score": 0.0,
            "strengths": [],
            "gaps": [],
            "overall_verdict": "Evaluation could not be parsed.",
            "hire_recommendation": "Maybe",
        }
