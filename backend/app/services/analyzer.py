"""Điều phối toàn bộ quy trình phân tích một bài viết.

    (URL hoặc văn bản)
        -> fetcher.py   : lấy nội dung, tiêu đề, tác giả, ngày đăng
        -> gemini.py    : AI tóm tắt, chọn chủ đề, chấm Bằng chứng + Nội dung
        -> scoring.py   : tính điểm Nguồn, Tác giả, Đối chiếu và điểm tổng
        -> AnalyzeResponse (JSON trả về cho frontend)

Tách riêng khỏi main.py để main.py chỉ lo chuyện web (đường dẫn, lỗi HTTP),
còn nghiệp vụ nằm ở đây và kiểm thử được mà không cần chạy server.
"""
from datetime import datetime, timezone

from ..config import Settings
from ..schemas import AnalyzeRequest, AnalyzeResponse, ArticleInfo
from . import fetcher, gemini, scoring

MODEL_VERSION = "1.0"


def analyze(req: AnalyzeRequest, settings: Settings) -> AnalyzeResponse:
    manual_text = req.url is None

    # 1) Lấy nội dung bài
    if manual_text:
        text = req.text[: settings.max_article_chars]
        first_line = text.strip().splitlines()[0]
        title = first_line[:70] + ("…" if len(first_line) > 70 else "")
        domain, author, published, url = "", "", "", ""
    else:
        art = fetcher.fetch_article(req.url, settings.request_timeout, settings.max_article_chars)
        text, title, domain = art.text, art.title, art.domain
        author, published, url = art.author, art.published_at, art.url

    # 2) AI phân tích nội dung
    ai = gemini.analyze_with_ai(title, text, settings)

    # 3) Tính các điểm bằng quy tắc. Thông tin tác giả/ngày đăng lấy từ thẻ HTML, hoặc từ AI nếu HTML không có.
    has_author = bool(author) or ai.has_author_info
    has_date = bool(published) or ai.has_publish_date
    scores = {
        "source": scoring.source_score(domain),
        "author": scoring.author_score(has_author),
        "evidence": ai.evidence_score,
        "crosscheck": scoring.crosscheck_score(req.similar_scores),
        "content": ai.content_score,
    }
    total = scoring.trust_total(scores)

    return AnalyzeResponse(
        article=ArticleInfo(
            title=title or "(không có tiêu đề)",
            source_domain=domain or "Văn bản nhập tay",
            author=author or ("Có nêu trong bài" if ai.has_author_info else "Không rõ"),
            published_at=published or ("Có nêu trong bài" if ai.has_publish_date else "Không rõ"),
            url=url,
        ),
        category_prediction=ai.category,
        category_confidence=ai.category_confidence,
        summary=ai.summary,
        keywords=ai.keywords,
        source_score=scores["source"],
        author_score=scores["author"],
        evidence_score=scores["evidence"],
        crosscheck_score=scores["crosscheck"],
        content_score=scores["content"],
        trust_score=total,
        trust_level=scoring.trust_level(total),
        criteria=scoring.build_criteria(scores),
        explanations=scoring.build_explanations(ai, domain, has_author, has_date, req.similar_scores, manual_text),
        model_name="mock-ai" if settings.use_mock_ai else settings.gemini_model,
        model_version=MODEL_VERSION,
        analyzed_at=datetime.now(timezone.utc).strftime("%Y-%m-%d"),
    )
