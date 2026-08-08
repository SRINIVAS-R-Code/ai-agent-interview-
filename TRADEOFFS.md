# Design Tradeoffs & Reasoning

## Why sample answers instead of live input
For a 24-hour prototype, hardcoded sample answers make the pipeline fully
reproducible and demonstrable without needing a human present during
review. The `SAMPLE_ANSWERS` dict is a drop-in point — swapping it for
`input()` calls or transcribed audio text is a one-line change in
`main.py`, since the scoring/evaluation logic is answer-source agnostic.

## Why two separate LLM calls (per-answer scoring + final evaluation)
Scoring each answer independently keeps evaluation consistent and prevents
earlier answers from biasing later scores. The final evaluation call then
sees the full transcript at once, which is necessary to identify patterns
(recurring strengths/gaps) that a single-answer view cannot show.

## JSON parsing with fallback
Both `score_answer` and `final_evaluation` expect strict JSON from Claude
and include a try/except fallback if parsing fails, rather than crashing
the whole session on one malformed response.

## Known Limitations
- Sample answers are static; no real-time candidate interaction in this build.
- No retry logic if Claude returns malformed JSON — falls back to a
  zero/empty placeholder instead of re-prompting.
- Question difficulty progression is instructed via prompt only, not
  algorithmically verified.
- No speech-to-text integration for transcribed answers (out of scope
  given the time available).

## What I'd Improve With More Time
- Add real-time CLI input so a live candidate can type answers during the run.
- Add a retry-on-malformed-JSON loop for both scoring calls.
- Support audio input via a speech-to-text step before scoring.
- Add adaptive difficulty: next question generated based on prior answer quality.
- Persist sessions to a database for longitudinal candidate tracking.
