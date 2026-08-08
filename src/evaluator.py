import os
import json
from groq import Groq
from dotenv import load_dotenv

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

MODEL = "llama-3.3-70b-versatile"

SCORE_SYSTEM_PROMPT = """You are an interview evaluator. Given a question and
a candidate's answer, score it 1-10 and give a one-sentence justification.
Return ONLY valid JSON: {"score": int, "justification": "string"}"""

FINAL_SYSTEM_PROMPT = """You are an interview evaluator. Given a full
transcript of questions, answers, and scores, produce an overall evaluation.
Return ONLY valid JSON:
{"average_score": float, "strengths": ["string"], "gaps": ["string"], "overall_verdict": "string"}"""


def score_answer(question: str, answer: str) -> dict:
    response = client.chat.completions.create(
        model=MODEL,
        max_tokens=200,
        messages=[
            {"role": "system", "content": SCORE_SYSTEM_PROMPT},
            {
                "role": "user",
                "content": f"Question: {question}\nAnswer: {answer}",
            },
        ],
    )
    raw = (
        response.choices[0]
        .message.content.strip()
        .replace("```json", "")
        .replace("```", "")
        .strip()
    )
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        return {"score": 0, "justification": "Could not parse evaluation"}


def final_evaluation(transcript: list) -> dict:
    response = client.chat.completions.create(
        model=MODEL,
        max_tokens=500,
        messages=[
            {"role": "system", "content": FINAL_SYSTEM_PROMPT},
            {
                "role": "user",
                "content": f"Transcript:\n{json.dumps(transcript, indent=2)}",
            },
        ],
    )
    raw = (
        response.choices[0]
        .message.content.strip()
        .replace("```json", "")
        .replace("```", "")
        .strip()
    )
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        return {
            "average_score": 0,
            "strengths": [],
            "gaps": [],
            "overall_verdict": "Could not parse",
        }
