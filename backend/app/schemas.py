"""Khuôn dữ liệu vào/ra của API (dùng Pydantic).

Pydantic tự kiểm tra dữ liệu: nếu frontend gửi thiếu hoặc sai kiểu, FastAPI trả lỗi 422
trước khi code của ta chạy. Các tên trường ở AnalyzeResponse khớp với bảng article_analysis
trong ERD (source_score, trust_score, ...) để sau này lưu thẳng vào MySQL.
"""
from typing import List, Literal, Optional

from pydantic import BaseModel, Field, field_validator, model_validator

# 4 chuyên mục có sẵn trong bảng categories. AI chỉ được chọn trong danh sách này.
CATEGORIES = ["Kinh tế", "Công nghệ", "Sức khỏe", "Xã hội"]


# ----------------------------- DỮ LIỆU VÀO -----------------------------
class AnalyzeRequest(BaseModel):
    """Người dùng gửi URL hoặc dán văn bản. Đúng MỘT trong hai."""

    url: Optional[str] = None
    text: Optional[str] = Field(default=None, max_length=50000)
    # Điểm giống (0-100) của các bài từ nguồn khác. Giai đoạn sau sẽ do embedding tính;
    # hiện để trống thì phần "đối chiếu chéo" ở mức trung lập.
    similar_scores: List[int] = Field(default_factory=list, max_length=20)

    @model_validator(mode="after")
    def _exactly_one(self):
        has_url = bool(self.url and self.url.strip())
        has_text = bool(self.text and self.text.strip())
        if has_url == has_text:
            raise ValueError("Hãy gửi đúng một trong hai: url hoặc text")
        if has_url:
            self.url = self.url.strip()
            if not self.url.lower().startswith(("http://", "https://")):
                raise ValueError("Đường dẫn cần bắt đầu bằng http:// hoặc https://")
        else:
            self.text = self.text.strip()
            if len(self.text) < 20:
                raise ValueError("Nội dung cần ít nhất 20 ký tự để phân tích")
        return self


# ------------------- KẾT QUẢ MÀ GEMINI TRẢ VỀ (nội bộ) -------------------
class AIResult(BaseModel):
    """Phần việc giao cho AI. Mọi con số đều được ép về khoảng 0-100."""

    category: str
    category_confidence: int
    summary: str
    keywords: List[str] = Field(default_factory=list)
    has_author_info: bool = False
    has_publish_date: bool = False
    evidence_score: int
    content_score: int
    positives: List[str] = Field(default_factory=list)
    warnings: List[str] = Field(default_factory=list)

    @field_validator("category_confidence", "evidence_score", "content_score", mode="before")
    @classmethod
    def _clamp(cls, v):
        # AI đôi khi trả 105 hoặc "87" (chuỗi). Ép về số nguyên 0-100.
        return max(0, min(100, int(round(float(v)))))


# ------------------------------ DỮ LIỆU RA ------------------------------
class ArticleInfo(BaseModel):
    title: str
    source_domain: str
    author: str
    published_at: str
    url: str


class Criterion(BaseModel):
    """Một thanh điểm trong phần 'Phân tích độ tin nhiệm' (ví dụ Nguồn tin 22/25)."""

    key: str
    label: str
    score: int          # 0-100
    weight: int         # trọng số (25, 15, 20, 20, 20), tổng 100
    points: float       # điểm đạt được = score/100 * weight
    max_points: int     # = weight


class Explanation(BaseModel):
    type: Literal["ok", "warn"]   # ok = dấu ✓, warn = dấu ⚠
    text: str


class AnalyzeResponse(BaseModel):
    article: ArticleInfo
    category_prediction: str
    category_confidence: int
    summary: str
    keywords: List[str]
    source_score: int
    author_score: int
    evidence_score: int
    crosscheck_score: int
    content_score: int
    trust_score: int
    trust_level: Literal["high", "medium", "low"]
    criteria: List[Criterion]
    explanations: List[Explanation]
    model_name: str
    model_version: str
    analyzed_at: str
