"""
Resume Screening — API views
"""
import io
import logging
import pdfplumber
import docx
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import ScreeningResult
from .nlp_engine import analyze_match
from .serializers import ScreeningResultSerializer

logger = logging.getLogger(__name__)


def _extract_text_from_file(uploaded_file) -> str:
    """Extract plain text from uploaded PDF or DOCX."""
    filename = uploaded_file.name.lower()
    content = uploaded_file.read()

    if filename.endswith('.pdf'):
        text_parts = []
        with pdfplumber.open(io.BytesIO(content)) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text_parts.append(page_text)
        return '\n'.join(text_parts)

    elif filename.endswith('.docx'):
        doc = docx.Document(io.BytesIO(content))
        return '\n'.join(p.text for p in doc.paragraphs if p.text.strip())

    elif filename.endswith('.txt'):
        return content.decode('utf-8', errors='ignore')

    else:
        raise ValueError(f"Unsupported file type: {filename}. Use PDF, DOCX, or TXT.")


class AnalyzeResumeView(APIView):
    """
    POST /api/screening/analyze/
    Body (multipart/form-data):
        - resume: file (PDF | DOCX | TXT)
        - jd_text: str (job description)
        - role: str (optional)
    Returns: ScreeningResult JSON
    """

    def post(self, request):
        resume_file = request.FILES.get('resume')
        jd_text = request.data.get('jd_text', '').strip()
        role = request.data.get('role', 'Software Engineer').strip()

        # --- Validation ---
        if not resume_file:
            return Response({'error': 'No resume file uploaded.'}, status=status.HTTP_400_BAD_REQUEST)
        if not jd_text:
            return Response({'error': 'Job description (jd_text) is required.'}, status=status.HTTP_400_BAD_REQUEST)

        # --- Parse resume ---
        try:
            resume_text = _extract_text_from_file(resume_file)
        except ValueError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Resume parsing error: {e}")
            return Response({'error': 'Failed to parse resume file.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        if len(resume_text.strip()) < 50:
            return Response({'error': 'Could not extract enough text from resume.'}, status=status.HTTP_400_BAD_REQUEST)

        # --- NLP analysis ---
        try:
            result = analyze_match(resume_text, jd_text)
        except Exception as e:
            logger.error(f"NLP analysis error: {e}")
            return Response({'error': 'NLP analysis failed.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # --- Persist result ---
        screening = ScreeningResult.objects.create(
            role=role,
            resume_filename=resume_file.name,
            resume_text=resume_text,
            jd_text=jd_text,
            match_score=result['match_score'],
            sbert_score=result.get('sbert_score'),
            tfidf_score=result['tfidf_score'],
            method=result['method'],
            matched_skills=result['matched_skills'],
            missing_skills=result['missing_skills'],
            resume_skills=result['resume_skills'],
            jd_skills=result['jd_skills'],
            recommendation=result['recommendation'],
        )

        return Response(ScreeningResultSerializer(screening).data, status=status.HTTP_201_CREATED)


class ScreeningHistoryView(APIView):
    """GET /api/screening/history/ — last 20 screenings"""

    def get(self, request):
        results = ScreeningResult.objects.all()[:20]
        return Response(ScreeningResultSerializer(results, many=True).data)
