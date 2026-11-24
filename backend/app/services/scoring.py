"""Tính 5 điểm thành phần và điểm tin cậy tổng (Trust Score).

Đây là phần "không cần AI": các quy tắc rõ ràng, giải thích được khi bảo vệ đồ án.
Trọng số theo đúng thiết kế trong file giao việc:
    Nguồn tin 25 · Tác giả 15 · Bằng chứng 20 · Đối chiếu 20 · Nội dung 20  (tổng 100)
"""
from statistics import mean
from typing import List, Optional
from urllib.parse import urlparse

from ..schemas import AIResult, Criterion, Explanation

# (key, nhãn hiển thị, trọng số)
CRITERIA = [
    ("source", "Nguồn tin", 25),
    ("author", "Tác giả", 15),
    ("evidence", "Bằng chứng", 20),
    ("crosscheck", "Đối chiếu chéo", 20),
    ("content", "Nội dung", 20),
]

# Độ tin cậy của một số nguồn (lấy từ dữ liệu mẫu của frontend).
# Về sau thay bằng truy vấn cột reliability_score của bảng `sources` trong MySQL.
KNOWN_SOURCES = {
    "baomau.vn": 88,
    "tinnhanh.example": 65,
    "phantich.example": 82,
    "blog-khong-ro.example": 30,
}
UNKNOWN_SOURCE_SCORE = 50   # có URL nhưng nguồn chưa được đánh giá
MANUAL_TEXT_SCORE = 40      # văn bản dán tay, không biết nguồn
NO_CROSSCHECK_SCORE = 50    # chưa có bài tương tự để đối chiếu: để mức trung lập


def domain_of(url: str) -> str:
    """'https://www.baomau.vn/abc' -> 'baomau.vn'"""
    host = (urlparse(url).hostname or "").lower()
    return host[4:] if host.startswith("www.") else host


def source_score(domain: str) -> int:
    if not domain:
        return MANUAL_TEXT_SCORE
    return KNOWN_SOURCES.get(domain, UNKNOWN_SOURCE_SCORE)


def author_score(has_author: bool) -> int:
    # Có tên tác giả thì bài truy được trách nhiệm; ẩn danh thì thấp hơn rõ rệt.
    return 85 if has_author else 30


def crosscheck_score(similar_scores: List[int]) -> int:
    """Nếu có nhiều bài từ nguồn khác nói giống => thông tin được đối chiếu tốt hơn.
    Lấy trung bình độ giống của tối đa 3 bài giống nhất. Không có bài nào thì trung lập (50).
    Đây là quy tắc đơn giản, có thể chỉnh khi đã có embedding thật."""
    cleaned = [max(0, min(100, s)) for s in similar_scores]
    if not cleaned:
        return NO_CROSSCHECK_SCORE
    top = sorted(cleaned, reverse=True)[:3]
    return round(mean(top))


def trust_level(score: int) -> str:
    """Giữ nguyên ngưỡng của frontend (AnalysisModel.level): >=75 cao, >=50 trung bình, còn lại thấp."""
    return "high" if score >= 75 else "medium" if score >= 50 else "low"


def build_criteria(scores: dict) -> List[Criterion]:
    return [
        Criterion(
            key=key,
            label=label,
            score=scores[key],
            weight=weight,
            points=round(scores[key] * weight / 100, 1),
            max_points=weight,
        )
        for key, label, weight in CRITERIA
    ]


def trust_total(scores: dict) -> int:
    """Trung bình có trọng số của 5 điểm (mỗi điểm 0-100) -> 0-100."""
    return round(sum(scores[key] * weight for key, _label, weight in CRITERIA) / 100)


def build_explanations(
    ai: AIResult,
    domain: str,
    has_author: bool,
    has_date: bool,
    similar_scores: List[int],
    manual_text: bool,
) -> List[Explanation]:
    """Danh sách ✓/⚠ giải thích vì sao bài được đánh giá như vậy (phần 'Giải thích AI')."""
    out: List[Explanation] = []

    if manual_text:
        out.append(Explanation(type="warn", text="Nội dung do người dùng dán, không xác định được nguồn"))
    elif domain in KNOWN_SOURCES:
        out.append(Explanation(type="ok", text=f"Nguồn bài viết được xác định rõ ({domain})"))
    else:
        out.append(Explanation(type="warn", text=f"Chưa có đánh giá độ tin cậy cho nguồn {domain}"))

    out.append(
        Explanation(type="ok", text="Có thông tin tác giả")
        if has_author
        else Explanation(type="warn", text="Không thấy thông tin tác giả")
    )
    out.append(
        Explanation(type="ok", text="Có ngày xuất bản")
        if has_date
        else Explanation(type="warn", text="Không thấy ngày xuất bản")
    )
    out.append(
        Explanation(type="ok", text=f"Có {len(similar_scores)} bài tương tự từ nguồn khác để đối chiếu")
        if similar_scores
        else Explanation(type="warn", text="Chưa tìm thấy bài tương tự để đối chiếu")
    )

    # Nhận xét do AI viết (tối đa 3 ý mỗi loại để giao diện gọn).
    out += [Explanation(type="ok", text=t) for t in ai.positives[:3] if t.strip()]
    out += [Explanation(type="warn", text=t) for t in ai.warnings[:3] if t.strip()]
    return out
