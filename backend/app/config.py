"""Cấu hình backend: đọc từ file .env (hoặc biến môi trường).

Vì sao tách riêng? Mọi giá trị "có thể đổi" (API key, tên model, domain được phép gọi API...)
nằm ở một chỗ. Khi đổi model hay đổi key, chỉ sửa file .env, không đụng tới code.
File .env KHÔNG được đưa lên GitHub (đã có trong .gitignore).
"""
import os
from dataclasses import dataclass
from pathlib import Path

from dotenv import load_dotenv

# Luôn tìm .env cạnh thư mục backend, dù bạn chạy lệnh từ thư mục nào.
_ENV_FILE = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(_ENV_FILE)


def _as_bool(value: str, default: bool = False) -> bool:
    if value is None or value == "":
        return default
    return value.strip().lower() in ("1", "true", "yes", "on")


def _as_list(value: str) -> list:
    return [x.strip() for x in (value or "").split(",") if x.strip()]


@dataclass(frozen=True)
class Settings:
    gemini_api_key: str      # khóa gọi Gemini. Chỉ nằm ở backend, không bao giờ gửi về trình duyệt
    gemini_model: str        # tên model, ví dụ gemini-3.8-flash (dùng đúng tên bạn đã dùng ở AI4Life)
    use_mock_ai: bool        # True = không gọi Gemini, trả kết quả giả để chạy thử khi chưa có key
    cors_origins: list       # các địa chỉ trang web được phép gọi API này
    request_timeout: int     # số giây tối đa chờ khi tải bài báo hoặc gọi Gemini
    max_article_chars: int   # cắt bài báo dài hơn mức này trước khi gửi cho AI (tiết kiệm token)


def get_settings() -> Settings:
    """Đọc cấu hình tại thời điểm gọi để dễ thay đổi khi kiểm thử."""
    return Settings(
        gemini_api_key=os.getenv("GEMINI_API_KEY", "").strip(),
        gemini_model=os.getenv("GEMINI_MODEL", "gemini-3.8-flash").strip(),
        use_mock_ai=_as_bool(os.getenv("USE_MOCK_AI"), default=False),
        cors_origins=_as_list(
            os.getenv(
                "CORS_ORIGINS",
                # "null" là origin của trang mở trực tiếp bằng file:// (bấm đúp index.html)
                "http://localhost:8000,http://127.0.0.1:8000,null",
            )
        ),
        request_timeout=int(os.getenv("REQUEST_TIMEOUT", "30")),
        max_article_chars=int(os.getenv("MAX_ARTICLE_CHARS", "12000")),
    )
