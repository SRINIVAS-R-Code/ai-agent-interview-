from django.test import TestCase
from .models import InterviewSession, InterviewAnswer

class InterviewModelsTest(TestCase):
    def setUp(self):
        self.session = InterviewSession.objects.create(
            role="Backend Engineer",
            n_questions=5,
            screening_id=42
        )

    def test_interview_session_creation(self):
        """Test that an InterviewSession is created successfully."""
        self.assertEqual(self.session.role, "Backend Engineer")
        self.assertEqual(self.session.n_questions, 5)
        self.assertEqual(self.session.screening_id, 42)
        self.assertTrue(self.session.id)

    def test_interview_answer_creation(self):
        """Test that an InterviewAnswer can be linked to a session."""
        answer = InterviewAnswer.objects.create(
            session=self.session,
            question_number=1,
            question_type="written",
            question="Explain REST architecture.",
            answer="Representational State Transfer...",
            score=8,
            justification="Good explanation."
        )
        self.assertEqual(answer.session, self.session)
        self.assertEqual(answer.score, 8)
        self.assertEqual(self.session.answers.count(), 1)
