import json
import os
from django.core.management.base import BaseCommand
from interview.question_gen import generate_questions
from interview.evaluator import score_answer, final_evaluation

SAMPLE_ANSWERS = {
    0: "REST uses stateless HTTP methods and resources identified by URLs. GraphQL lets clients query exactly the fields they need in a single request.",
    1: "I'd use an index on the frequently filtered column and check the query plan with EXPLAIN to spot full table scans.",
    2: "Python's GIL means only one thread executes Python bytecode at a time, so CPU-bound work needs multiprocessing instead of threading.",
    3: "I'd write unit tests for the core logic, then integration tests for the API layer, and mock external services.",
    4: "For a system handling 1M requests/day I'd add a load balancer, horizontal scaling, caching with Redis, and a message queue for async work.",
}

class Command(BaseCommand):
    help = 'Runs a simulated interview from the CLI'

    def add_arguments(self, parser):
        parser.add_argument('--role', type=str, default="Backend Software Engineer", help='Role for the interview')
        parser.add_argument('--questions', type=int, default=5, help='Number of questions')

    def handle(self, *args, **options):
        role = options['role']

        self.stdout.write(f"\n{'='*60}")
        self.stdout.write(f"  INTERVIEW AGENT — Role: {role}")
        self.stdout.write(f"{'='*60}\n")
        self.stdout.write("Generating questions...")

        questions = generate_questions(role, jd_context="")
        transcript = []

        for i, q_dict in enumerate(questions):
            q_text = q_dict.get("text", "")
            q_type = q_dict.get("type", "written")
            answer = SAMPLE_ANSWERS.get(i, "No answer provided.")
            result = score_answer(q_text, answer)
            
            entry = {
                "question_number": i + 1,
                "question": q_text,
                "answer": answer,
                "score": result.get("score"),
                "justification": result.get("justification"),
            }
            transcript.append(entry)
            
            self.stdout.write(f"Q{i+1} ({q_type}): {q_text}")
            if q_type == "mcq":
                self.stdout.write(f"Options: {q_dict.get('options', [])}")
            self.stdout.write(f"A:  {answer}")
            self.stdout.write(f"Score: {entry['score']}/10 — {entry['justification']}")
            self.stdout.write("-" * 60)

        summary = final_evaluation(transcript)
        self.stdout.write(f"\n{'='*60}")
        self.stdout.write("FINAL EVALUATION")
        self.stdout.write(f"{'='*60}")
        self.stdout.write(f"Average Score : {summary.get('average_score')}")
        self.stdout.write(f"Strengths     : {summary.get('strengths')}")
        self.stdout.write(f"Gaps          : {summary.get('gaps')}")
        self.stdout.write(f"Verdict       : {summary.get('overall_verdict')}")
