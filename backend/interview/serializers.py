from rest_framework import serializers
from .models import InterviewSession, InterviewAnswer


class InterviewAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = InterviewAnswer
        fields = ['id', 'question_number', 'question', 'answer', 'score', 'justification', 'created_at']


class InterviewSessionSerializer(serializers.ModelSerializer):
    answers = InterviewAnswerSerializer(many=True, read_only=True)

    class Meta:
        model = InterviewSession
        fields = [
            'id', 'role', 'screening_id', 'n_questions',
            'average_score', 'strengths', 'gaps',
            'overall_verdict', 'completed', 'created_at', 'answers',
        ]
