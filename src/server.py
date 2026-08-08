import os
import sys
import json

SRC_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SRC_DIR)
if SRC_DIR not in sys.path:
    sys.path.insert(0, SRC_DIR)

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from question_gen import generate_questions
from evaluator import score_answer, final_evaluation

app = Flask(__name__, static_folder=os.path.join(PROJECT_ROOT, "web"))
CORS(app)


@app.route("/")
def index():
    return send_from_directory(app.static_folder, "index.html")


@app.route("/api/questions", methods=["POST"])
def api_questions():
    data = request.get_json()
    role = data.get("role", "Software Engineer")
    n = int(data.get("n", 5))
    questions = generate_questions(role, n)
    return jsonify({"questions": questions})


@app.route("/api/score", methods=["POST"])
def api_score():
    data = request.get_json()
    question = data.get("question", "")
    answer = data.get("answer", "")
    result = score_answer(question, answer)
    return jsonify(result)


@app.route("/api/evaluate", methods=["POST"])
def api_evaluate():
    data = request.get_json()
    transcript = data.get("transcript", [])
    result = final_evaluation(transcript)

    # Save outputs
    output_dir = os.path.join(PROJECT_ROOT, "output")
    os.makedirs(output_dir, exist_ok=True)
    with open(os.path.join(output_dir, "transcript.json"), "w") as f:
        json.dump(transcript, f, indent=2)
    with open(os.path.join(output_dir, "evaluation_summary.json"), "w") as f:
        json.dump(result, f, indent=2)

    return jsonify(result)


if __name__ == "__main__":
    print("\n=== Interview Agent Web UI ===")
    print("   Open -> http://localhost:5000\n")
    app.run(debug=True, port=5000)
