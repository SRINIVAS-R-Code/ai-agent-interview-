# Interview Agent

Conducts a structured interview session: generates role-specific questions,
scores each candidate answer, and produces a final evaluation with
strengths and gaps.

## How It Works
1. Given a role/skill (e.g. "Backend Software Engineer"), Claude generates
   5 role-relevant interview questions of increasing difficulty.
2. Each question is paired with a candidate answer (sample answers included;
   swap in real typed/transcribed answers to test your own responses).
3. Each answer is scored 1–10 with a one-sentence justification.
4. The full transcript is passed back to Claude for a final evaluation:
   average score, strengths, gaps, and an overall verdict.
5. Results are saved to `output/transcript.json` and
   `output/evaluation_summary.json`.

## Setup

### 1. Install
```bash
git clone https://github.com/YOUR_USERNAME/interview-agent.git
cd interview-agent
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Configure API Key
```bash
cp .env.example .env
```
Edit `.env` and add your key:
```
ANTHROPIC_API_KEY=sk-ant-your-key-here
```
Get one at https://console.anthropic.com

### 3. Run
```bash
cd src
python main.py
```

Runs a full 5-question mock interview for "Backend Software Engineer",
prints each Q/A/score live, then prints the final evaluation.
Results are saved to `output/`.

## Using Your Own Role or Answers
- Change `role = "Backend Software Engineer"` in `src/main.py` to any role/skill.
- Replace `SAMPLE_ANSWERS` in `src/main.py` with real candidate answers
  (typed or transcribed) to evaluate an actual session.

## Sample Output
```
Q1: What's the difference between REST and GraphQL?
A:  REST uses stateless HTTP methods and resources identified by URLs...
Score: 8/10 — Correctly identifies the core architectural distinction.
------------------------------------------------------------

FINAL EVALUATION
Average Score : 7.6
Strengths     : ['Clear technical explanations', 'Practical examples']
Gaps          : ['Could go deeper on scalability tradeoffs']
Verdict       : Strong candidate for a backend role, solid fundamentals.
```

Full transcript and summary written to `output/transcript.json` and
`output/evaluation_summary.json`.

## Project Structure

```
interview-agent/
├── src/
│   ├── question_gen.py   # role → interview questions (Claude)
│   ├── evaluator.py      # per-answer scoring + final evaluation (Claude)
│   └── main.py           # orchestration loop
├── output/               # generated after running
├── .env.example
├── requirements.txt
├── README.md
└── TRADEOFFS.md
```

See `TRADEOFFS.md` for design choices and limitations.
