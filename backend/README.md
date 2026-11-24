# Backend AI News Analyzer (FastAPI)

Nhận URL hoặc văn bản bài báo, trả về kết quả phân tích dạng JSON: tóm tắt, chủ đề, từ khóa,
5 điểm thành phần, Trust Score và phần giải thích.

## Chạy trên Windows

```
cd C:\ai_new_analayze\ai_news_analyzer\backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload --port 8001
```

- Mở http://localhost:8001/docs để thử API ngay trên trình duyệt (nút "Try it out").
- Mở http://localhost:8001/api/health để xem server đang chạy chế độ `mock` hay `gemini`.
- Frontend vẫn chạy riêng: `python -m http.server 8000` ở thư mục gốc của repo.

Mặc định `.env.example` đặt `USE_MOCK_AI=true` nên chạy được ngay không cần key (kết quả giả,
`model_name` ghi `mock-ai`). Khi có key: điền `GEMINI_API_KEY`, đặt `USE_MOCK_AI=false`, khởi động lại server.

## Cấu trúc

```
backend/
├── requirements.txt        Danh sách thư viện cần cài
├── .env.example            Mẫu cấu hình (sao chép thành .env, không đưa .env lên GitHub)
├── app/
│   ├── main.py             Tạo ứng dụng, khai báo endpoint, đổi lỗi thành mã HTTP
│   ├── config.py           Đọc .env (key, tên model, CORS, giới hạn)
│   ├── schemas.py          Khuôn dữ liệu vào/ra, tự kiểm tra tính hợp lệ
│   └── services/
│       ├── analyzer.py     Điều phối cả quy trình
│       ├── fetcher.py      URL -> tiêu đề, tác giả, ngày đăng, nội dung (có chặn truy cập địa chỉ nội bộ)
│       ├── gemini.py       Gọi Gemini + chế độ giả lập
│       └── scoring.py      Tính điểm bằng quy tắc, trọng số theo file giao việc
└── tests/test_backend.py   19 bài kiểm thử (không cần mạng, không cần key)
```

Chạy kiểm thử: `python -m unittest discover -s tests -v`

## API

| Method | Đường dẫn | Chức năng |
|---|---|---|
| GET | `/api/health` | Kiểm tra server và chế độ đang chạy |
| POST | `/api/analyze` | Phân tích bài viết |

Gửi `{"url": "https://..."}` hoặc `{"text": "nội dung bài..."}` (đúng một trong hai).
Có thể kèm `"similar_scores": [90, 60]` (độ giống của các bài từ nguồn khác) để tính điểm Đối chiếu.

Mã lỗi: `422` dữ liệu sai hoặc không lấy được nội dung từ URL · `429` vượt giới hạn Gemini ·
`502` Gemini từ chối hoặc trả dữ liệu lỗi · `503` chưa cấu hình key hoặc Gemini bận · `504` quá thời gian chờ.

## Cách tính điểm

| Điểm | Trọng số | Nguồn gốc |
|---|---|---|
| Nguồn tin | 25 | Bảng độ tin cậy nguồn (hiện là dữ liệu mẫu, sau này lấy từ bảng `sources` trong MySQL) |
| Tác giả | 15 | Quy tắc: có tên tác giả 85, không có 30 |
| Bằng chứng | 20 | AI chấm |
| Đối chiếu chéo | 20 | Độ giống của các bài từ nguồn khác; chưa có thì 50 (trung lập) |
| Nội dung | 20 | AI chấm |

Trust Score = trung bình có trọng số (0-100). Từ 75 trở lên: cao · 50-74: trung bình · dưới 50: thấp.
Đây là điểm ước lượng để người dùng tham khảo và tự đối chiếu, không phải kết luận bài đúng hay sai.

## Chưa làm (bước tiếp theo)

1. Nối frontend: sửa `AnalysisModel.analyze()` để gọi `POST /api/analyze` thay cho điểm giả lập.
2. Bài viết tương tự bằng embedding, lấy điểm giống thật rồi truyền vào `similar_scores`.
3. Lưu kết quả vào MySQL `ai_news_analyzer` (bảng `articles`, `article_analysis`, `analysis_history`).
4. Đăng nhập thật (hiện frontend dùng tài khoản mẫu trong bộ nhớ).
