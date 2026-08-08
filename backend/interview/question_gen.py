"""
Interview App — Groq-powered question generation
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
        api_key = os.getenv("GROQ_API_KEY", "")
        _client = Groq(api_key=api_key)
    return _client

MODEL = "llama-3.3-70b-versatile"

SYSTEM_PROMPT = """You are an expert technical interviewer.
Generate exactly 25 interview questions for the given role:
- 20 multiple-choice questions (MCQ), each with 4 options and 1 correct answer.
- 5 open-ended ("text") questions.

Mix conceptual understanding, practical application, and problem-solving.
Make questions specific and relevant to the role.
If a job description is provided, tailor questions to it.

You MUST return ONLY a valid JSON array of objects. Do not wrap it in markdown code blocks.
Format each question object like this:

For MCQ:
{
  "type": "mcq",
  "text": "Question text here",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correct_answer": "Option A"
}

For Text:
{
  "type": "text",
  "text": "Question text here"
}
"""

def generate_questions(role: str, jd_context: str = "") -> list:
    """Generate 25 mixed-format interview questions for a role, returning a list of dicts."""
    context_clause = ""
    if jd_context.strip():
        # Use first 600 chars of JD to guide question generation
        context_clause = f"\n\nJob Description context:\n{jd_context[:600]}"

    try:
        response = _get_client().chat.completions.create(
            model=MODEL,
            max_tokens=4000,
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {
                    "role": "user",
                    "content": f"Role: {role}{context_clause}\n\nGenerate the JSON array wrapped in an object like this: {{\"questions\": [...]}}",
                },
            ],
        )
        text = response.choices[0].message.content.strip()
        data = json.loads(text)
        questions = data.get("questions", [])
        return questions[:25]
    except Exception as e:
        print(f"Error generating questions: {e}")
        # Fallback to some default questions if JSON parsing fails or Groq errors out
        return [{"type": "text", "text": f"Tell me about your experience as a {role}."}]
