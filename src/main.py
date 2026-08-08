import json
import os
import sys

# Ensure src/ is on the path when run from project root
SRC_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SRC_DIR)
if SRC_DIR not in sys.path:
    sys.path.insert(0, SRC_DIR)

from question_gen import generate_questions
from evaluator import score_answer, final_evaluation

SAMPLE_ANSWERS = {
    0: "REST uses stateless HTTP methods and resources identified by URLs. GraphQL lets clients query exactly the fields they need in a single request.",
    1: "I'd use an index on the frequently filtered column and check the query plan with EXPLAIN to spot full table scans.",
    2: "Python's GIL means only one thread executes Python bytecode at a time, so CPU-bound work needs multiprocessing instead of threading.",
    3: "I'd write unit tests for the core logic, then integration tests for the API layer, and mock external services.",
    4: "For a system handling 1M requests/day I'd add a load balancer, horizontal scaling, caching with Redis, and a message queue for async work.",
}


def run_interview(role: str, n_questions: int = 5):
    print(f"\n{'='*60}")
    print(f"  INTERVIEW AGENT — Role: {role}")
    print(f"{'='*60}\n")

    print("Generating questions...")
    questions = generate_questions(role, n_questions)
    transcript = []

    for i, q in enumerate(questions):
        answer = SAMPLE_ANSWERS.get(i, "No answer provided.")
        result = score_answer(q, answer)
        entry = {
            "question_number": i + 1,
            "question": q,
            "answer": answer,
            "score": result.get("score"),
            "justification": result.get("justification"),
        }
        transcript.append(entry)
        print(f"Q{i+1}: {q}")
        print(f"A:  {answer}")
        print(f"Score: {entry['score']}/10 — {entry['justification']}")
        print("-" * 60)

    summary = final_evaluation(transcript)
    print(f"\n{'='*60}")
    print("FINAL EVALUATION")
    print(f"{'='*60}")
    print(f"Average Score : {summary.get('average_score')}")
    print(f"Strengths     : {summary.get('strengths')}")
    print(f"Gaps          : {summary.get('gaps')}")
    print(f"Verdict       : {summary.get('overall_verdict')}")

    return transcript, summary


if __name__ == "__main__":
    role = "Backend Software Engineer"
    transcript, summary = run_interview(role, n_questions=5)

    output_dir = os.path.join(PROJECT_ROOT, "output")
    os.makedirs(output_dir, exist_ok=True)
    with open(os.path.join(output_dir, "transcript.json"), "w") as f:
        json.dump(transcript, f, indent=2)
    with open(os.path.join(output_dir, "evaluation_summary.json"), "w") as f:
        json.dump(summary, f, indent=2)

    print("\nSaved transcript.json and evaluation_summary.json to output/")
