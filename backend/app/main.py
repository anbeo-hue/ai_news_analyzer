"""Điểm vào của backend: tạo ứng dụng FastAPI, khai báo các đường dẫn (endpoint) và xử lý lỗi.

Chạy:  uvicorn app.main:app --reload --port 8001
Xem và thử API trực tiếp trên trình duyệt:  http://localhost:8001/docs
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .config import get_settings
from .schemas import AnalyzeRequest, AnalyzeResponse
from .services import analyzer
from .services.fetcher import FetchError
from .services.gemini import AIError

settings = get_settings()

app = FastAPI(title="AI News Analyzer API", version="1.0.0")

# CORS: trình duyệt mặc định chặn trang ở địa chỉ A (localhost:8000) gọi API ở địa chỉ B (localhost:8001).
# Khai báo danh sách địa chỉ được phép để frontend gọi được backend.
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


@app.get("/api/health")
def health():
    """Kiểm tra server còn sống không và đang chạy chế độ nào. Không bao giờ trả về API key."""
    return {
        "status": "ok",
        "mode": "mock" if settings.use_mock_ai else "gemini",
        "model": settings.gemini_model,
        "api_key_configured": bool(settings.gemini_api_key),
    }


# Hàm thường (def), không phải async: FastAPI tự chạy trong luồng riêng nên việc chờ mạng
# (tải bài, gọi Gemini bằng requests) không làm treo các yêu cầu khác.
@app.post("/api/analyze", response_model=AnalyzeResponse)
def analyze_article(req: AnalyzeRequest):
    """Nhận {url} hoặc {text}, trả về kết quả phân tích (tóm tắt, chủ đề, 5 điểm, Trust Score, giải thích)."""
    try:
        return analyzer.analyze(req, settings)
    except FetchError as e:
        # Người dùng nhập URL không lấy được nội dung -> 422 (dữ liệu đầu vào không xử lý được)
        raise HTTPException(status_code=422, detail=str(e))
    except AIError as e:
        raise HTTPException(status_code=e.status, detail=str(e))
