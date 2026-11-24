# AI News – Phân tích tin tức bằng AI (MVC)

Giao diện web thuần **HTML · CSS · JavaScript**, tổ chức theo mô hình **MVC**, dữ liệu theo ERD `ai_news_analyzer`.
Giao diện không cần cài đặt hay build. Riêng chức năng **phân tích bài viết** cần bật backend (xem mục Chạy thử).

Dự án gồm hai khối:

```
ai_news_analyzer/
├── frontend/    Giao diện MVC thuần HTML / CSS / JS (cổng 8000)
└── backend/     API FastAPI phân tích bài báo bằng AI (cổng 8001)
```

## Chạy thử
**Frontend:** `cd frontend` rồi `python -m http.server 8000` và vào `http://localhost:8000`. Hoặc mở thẳng file `frontend/index.html` bằng trình duyệt (bấm đúp).

**Backend:** xem hướng dẫn trong `backend/README.md`, server chạy ở cổng 8001. Cần bật backend trước thì nút **Phân tích** ở trang chủ mới hoạt động. Chưa có API key Gemini thì để `USE_MOCK_AI=true` trong `backend/.env` (kết quả giả lập, trang kết quả có ghi chú rõ).

Nếu frontend không gọi được backend, trang chủ hiện thông báo "Không kết nối được máy chủ phân tích". Địa chỉ backend đặt ở `frontend/app/core/app.js` (`apiBase`).

Tài khoản demo:

| Vai trò | Email | Mật khẩu |
|---|---|---|
| Người dùng | `user@ainews.vn` | `user1234` |
| Quản trị viên | `admin@ainews.vn` | `admin123` |

Mã xác nhận ở bước quên mật khẩu: `123456`.

## Cấu trúc thư mục

```
frontend/
├── index.html                  Khung trang, nạp CSS và JS theo thứ tự
├── assets/css/
│   ├── base.css                Biến màu (sáng/tối), reset, kiểu chữ
│   ├── layout.css              Header, điều hướng, menu xổ xuống, footer, toast
│   ├── components.css          Nút, form, thẻ, bảng, tab, huy hiệu
│   ├── pages.css               Kiểu riêng từng trang (trang chủ, đăng nhập, kết quả, dashboard, quản trị)
│   └── responsive.css          Màn hình nhỏ
└── app/
    ├── main.js                 Điểm khởi động
    ├── core/                   Hạ tầng dùng chung
    │   ├── app.js              Tạo vùng tên window.App và cấu hình (apiBase = địa chỉ backend)
    │   ├── api.js              Gọi backend (POST /api/analyze) và đổi lỗi thành thông báo tiếng Việt
    │   ├── utils.js            Hàm tiện ích (esc, fmt, avg...)
    │   ├── validator.js        Kiểm tra dữ liệu form
    │   ├── session.js          Phiên đăng nhập
    │   ├── events.js           Bắt sự kiện qua data-action / data-form / data-input
    │   └── router.js           Điều hướng #hash và phân quyền
    ├── models/                 (M) Dữ liệu và nghiệp vụ, không đụng tới DOM
    │   ├── database.js         Dữ liệu mẫu theo ERD + hàm truy cập bảng
    │   ├── UserModel.js        users
    │   ├── CategoryModel.js    categories
    │   ├── SourceModel.js      sources, authors
    │   ├── ArticleModel.js     articles, similar_articles
    │   ├── AnalysisModel.js    article_analysis: lưu kết quả từ backend, tính các thanh điểm
    │   ├── BookmarkModel.js    bookmarks
    │   ├── ReportModel.js      reports
    │   └── HistoryModel.js     analysis_history
    ├── views/                  (V) Chỉ tạo HTML và thao tác giao diện
    │   ├── components/         icons.js, ui.js (huy hiệu, bảng, biểu đồ, thẻ)
    │   ├── LayoutView.js       Header, footer, toast, vùng nội dung
    │   ├── HomeView.js · AuthView.js · ResultView.js · DashboardView.js
    │   ├── HistoryView.js · BookmarksView.js · MyReportsView.js · ProfileView.js
    │   └── admin/              Khung quản trị và 5 trang: tổng quan, người dùng, bài viết, nguồn tin, chuyên mục, báo cáo
    └── controllers/            (C) Nhận sự kiện, gọi Model, chọn View để hiển thị
        ├── LayoutController.js
        ├── AuthController.js   Đăng nhập (user/admin), đăng ký, quên mật khẩu
        ├── HomeController.js   Phân tích bài viết: gọi backend, lưu kết quả, mở trang kết quả
        ├── ArticleController.js  Kết quả, lưu bài, báo cáo bài
        ├── UserController.js   Dashboard, lịch sử, hồ sơ
        └── AdminController.js  Toàn bộ khu quản trị
```

## Luồng hoạt động

```
Người dùng thao tác  ->  Events (data-action / data-form)  ->  Controller
Controller  ->  Api (phân tích bài viết: gọi backend)  ->  kết quả AI
Controller  ->  Model (đọc/ghi dữ liệu)  ->  trả dữ liệu về Controller
Controller  ->  View.render(dữ liệu)  ->  HTML hiển thị trong #app
```

- **Router** (`core/router.js`) khai báo từng route kèm quyền: `auth`, `role: "admin" | "user"`, `guest`.
- **View không gọi Model**, **Model không biết DOM**. Controller là nơi duy nhất nối hai bên.
- Thêm một trang mới: tạo `XxxView.js`, thêm route và handler vào controller, rồi thêm thẻ `<script>` vào `index.html`.

## Nối với backend
Phân tích bài viết đã được nối với backend: `HomeController` gọi `App.Api.analyze()` (`core/api.js`) tới `POST /api/analyze`, rồi `AnalysisModel.save()` lưu kết quả (bài viết, nguồn, tác giả, điểm, phần giải thích) vào dữ liệu trong bộ nhớ và mở trang kết quả. Trang kết quả hiện đủ 5 thanh điểm dạng điểm đạt/điểm tối đa (ví dụ 22/25) và phần "Vì sao bài viết được đánh giá như vậy".

Chưa nối:
- Dữ liệu vẫn nằm trong bộ nhớ (`app/models/database.js`), tải lại trang sẽ về dữ liệu mẫu. Bước sau lưu vào MySQL `ai_news_analyzer` qua backend.
- Bài viết tương tự đang lấy từ dữ liệu mẫu, chưa dùng embedding. Điểm "Đối chiếu chéo" nhờ đó ở mức trung lập (50).
- Đăng nhập vẫn dùng tài khoản mẫu trong bộ nhớ.

## Ghi chú
- Giá trị enum (`role`, `status`, `trust_level`, trạng thái báo cáo) là giả định vì ERD không ghi giá trị.
- Các file JS nạp bằng thẻ `<script>` thường (không dùng ES module) để mở trực tiếp được bằng `file://`.
- Font Be Vietnam Pro và Source Serif 4 tải từ Google Fonts, nếu không có mạng sẽ dùng font hệ thống.
