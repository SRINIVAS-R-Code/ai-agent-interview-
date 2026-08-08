"""
Interview App — Django models
"""
from django.db import models


class InterviewSession(models.Model):
    """One complete interview session."""
    role = models.CharField(max_length=200)
    screening_id = models.IntegerField(null=True, blank=True)  # links to ScreeningResult if started from screening
    n_questions = models.IntegerField(default=5)
    average_score = models.FloatField(null=True, blank=True)
    strengths = models.JSONField(default=list)
    gaps = models.JSONField(default=list)
    overall_verdict = models.TextField(blank=True)
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.role} session — {self.created_at:%Y-%m-%d %H:%M}"


class InterviewAnswer(models.Model):
    """One Q&A pair within a session."""
    session = models.ForeignKey(InterviewSession, on_delete=models.CASCADE, related_name='answers')
    question_number = models.IntegerField()
    question = models.TextField()
    answer = models.TextField()
    score = models.IntegerField(null=True, blank=True)  # 1-10
    justification = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['question_number']

    def __str__(self):
        return f"Q{self.question_number} — Score: {self.score}/10"
