from rest_framework import serializers
from .models import ScreeningResult


class ScreeningResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScreeningResult
        fields = [
            'id', 'role', 'resume_filename', 'match_score',
            'sbert_score', 'tfidf_score', 'method',
            'matched_skills', 'missing_skills',
            'resume_skills', 'jd_skills',
            'recommendation', 'created_at',
        ]
