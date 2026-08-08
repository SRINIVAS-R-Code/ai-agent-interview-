"""
Resume Screening — Django models
"""
from django.db import models


class ScreeningResult(models.Model):
    """Stores one resume-vs-JD screening result."""
    role = models.CharField(max_length=200)
    resume_filename = models.CharField(max_length=255, blank=True)
    resume_text = models.TextField()
    jd_text = models.TextField()

    # NLP scores
    match_score = models.FloatField()          # 0–100
    sbert_score = models.FloatField(null=True, blank=True)
    tfidf_score = models.FloatField()
    method = models.CharField(max_length=20)   # "sbert+tfidf" | "tfidf"

    # Skills
    matched_skills = models.JSONField(default=list)
    missing_skills = models.JSONField(default=list)
    resume_skills = models.JSONField(default=list)
    jd_skills = models.JSONField(default=list)

    recommendation = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.role} — {self.match_score:.1f}% match ({self.created_at:%Y-%m-%d %H:%M})"
