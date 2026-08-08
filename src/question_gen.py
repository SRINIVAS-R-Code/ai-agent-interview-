import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

MODEL = "llama-3.3-70b-versatile"

SYSTEM_PROMPT = """You generate interview questions for a given role/skill.
Return exactly N questions, one per line, no numbering, no extra text.
Questions must be role-relevant, mix conceptual and practical, and increase
slightly in difficulty."""


def generate_questions(role: str, n: int = 5) -> list:
    response = client.chat.completions.create(
        model=MODEL,
        max_tokens=500,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {
                "role": "user",
                "content": f"Role/skill: {role}\nGenerate {n} interview questions.",
            },
        ],
    )
    text = response.choices[0].message.content.strip()
    questions = [q.strip("- ").strip() for q in text.split("\n") if q.strip()]
    return questions[:n]
