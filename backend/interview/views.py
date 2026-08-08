"""
Interview App — API views
"""
import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import InterviewSession, InterviewAnswer
from .serializers import InterviewSessionSerializer
from .question_gen import generate_questions
from .evaluator import score_answer, final_evaluation

logger = logging.getLogger(__name__)


class GenerateQuestionsView(APIView):
    """
    POST /api/interview/questions/
    Body: { "role": str, "jd_context": str (optional), "screening_id": int (optional) }
    Returns: { "session_id": int, "questions": [ { type, text, options?, correct_answer? } ] }
    """
    def post(self, request):
        role = request.data.get('role', '').strip()
        jd_context = request.data.get('jd_context', '')
        screening_id = request.data.get('screening_id')

        if not role:
            return Response({'error': 'role is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            questions = generate_questions(role, jd_context)
        except Exception as e:
            logger.error(f"Question generation error: {e}")
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        session = InterviewSession.objects.create(
            role=role,
            n_questions=len(questions),
            screening_id=screening_id,
        )

        return Response({
            'session_id': session.id,
            'questions': questions,
        }, status=status.HTTP_201_CREATED)


class ScoreAnswerView(APIView):
    """
    POST /api/interview/score/
    Body: { "session_id": int, "question_number": int, "question": str, "answer": str, "question_type": str, "correct_answer": str, "options": list }
    Returns: { "score": int, "justification": str }
    """
    def post(self, request):
        session_id = request.data.get('session_id')
        question_number = request.data.get('question_number', 1)
        question = request.data.get('question', '').strip()
        answer = request.data.get('answer', '').strip()
        question_type = request.data.get('question_type', 'text')
        correct_answer = request.data.get('correct_answer', '')
        options = request.data.get('options', [])

        if not question:
            return Response({'error': 'question is required.'}, status=status.HTTP_400_BAD_REQUEST)

        if question_type == 'mcq':
            if answer == correct_answer:
                result = {"score": 10, "justification": "Correct answer!"}
            else:
                result = {"score": 0, "justification": f"Incorrect. The correct answer was {correct_answer}."}
        else:
            try:
                result = score_answer(question, answer)
            except Exception as e:
                logger.error(f"Scoring error: {e}")
                return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Persist the answer if we have a session
        if session_id:
            try:
                session = InterviewSession.objects.get(id=session_id)
                InterviewAnswer.objects.create(
                    session=session,
                    question_number=question_number,
                    question_type=question_type,
                    question=question,
                    options=options,
                    correct_answer=correct_answer,
                    answer=answer,
                    score=result.get('score', 0),
                    justification=result.get('justification', ''),
                )
            except InterviewSession.DoesNotExist:
                pass  # Non-fatal: score still returned

        return Response(result)


class FinalEvaluationView(APIView):
    """
    POST /api/interview/evaluate/
    Body: { "session_id": int (optional), "transcript": [ {question, answer, score, justification} ] }
    Returns: { average_score, strengths, gaps, overall_verdict, hire_recommendation }
    """
    def post(self, request):
        transcript = request.data.get('transcript', [])
        session_id = request.data.get('session_id')

        if not transcript:
            return Response({'error': 'transcript is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            summary = final_evaluation(transcript)
        except Exception as e:
            logger.error(f"Final evaluation error: {e}")
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Update session record
        if session_id:
            try:
                session = InterviewSession.objects.get(id=session_id)
                session.average_score = summary.get('average_score', 0)
                session.strengths = summary.get('strengths', [])
                session.gaps = summary.get('gaps', [])
                session.overall_verdict = summary.get('overall_verdict', '')
                session.completed = True
                session.save()
            except InterviewSession.DoesNotExist:
                pass

        return Response(summary)


class SessionDetailView(APIView):
    """GET /api/interview/session/<id>/ — retrieve full session with answers"""
    def get(self, request, pk):
        try:
            session = InterviewSession.objects.get(id=pk)
            return Response(InterviewSessionSerializer(session).data)
        except InterviewSession.DoesNotExist:
            return Response({'error': 'Session not found.'}, status=status.HTTP_404_NOT_FOUND)
