# 📊 Báo Cáo Phân Tích Tổng Quan Dự Án Restaurant Booking O2O

## 📌 1. Tổng Quan Dự Án (Project Overview)
- **Tên dự án:** Restaurant Booking O2O Ecosystem (Hệ sinh thái Quản lý & Đặt món Nhà hàng O2O).
- **Mô hình kiến trúc:** Client - Server (Mobile App React Native + Backend NestJS REST API / WebSocket).
- **Mô hình vận hành:** **O2O (Online to Offline)** - Kết hợp giữa đặt giao hàng tận nơi (Delivery) và phục vụ/gọi món trực tiếp tại bàn (Dine-in qua QR).

---

## 🛠️ 2. Công Nghệ Sử Dụng (Tech Stack)

### 🔹 Mobile Client (`/mobile`)
* **Framework:** React Native (sử dụng Expo).
* **Language:** TypeScript.
* **Styling:** NativeWind (Tailwind CSS cho React Native).
* **State Management:** Redux Toolkit / React Context.
* **Navigation:** React Navigation (Stack, Bottom Tabs).
* **Real-time & APIs:** Socket.io-client, Axios.
* **Tính năng thiết bị:** Camera (Quét mã QR Bàn), Image Picker (Tải ảnh chuyển khoản).

### 🔹 Backend Server (`/backend`)
* **Framework:** NestJS (Node.js framework tiêu chuẩn enterprise).
* **Database & ORM:** MySQL + Prisma ORM.
* **Real-time:** Socket.io Gateway.
* **Security & Auth:** JWT (JSON Web Token), Bcrypt Hashing.
* **Media & Cloud Storage:** Cloudinary API (Lưu ảnh món ăn, biên lai thanh toán).
* **AI & Automation:** Tích hợp Ollama LLM (RAG tư vấn món), Telegram Bot Notification API, VietQR API.

---

## 🏛️ 3. Kiến Trúc Cơ Sở Dữ Liệu (Database Schema)

Hệ thống bao gồm các nhóm Entity chính:
1. **Người dùng (User & Auth):** `User`, `Address`, `Otp`, `UserMilestone`
2. **Sản phẩm & Danh mục (Catalog):** `Category`, `Product`, `ProductVariant`
3. **Đơn hàng & Bàn ăn (Core Order & Dine-in):** `Table`, `Order`, `OrderItem`, `Package`, `Promotion`
4. **Thanh toán & Mã QR:** `Payment`, `VietQr`
5. **CSKH & Tương tác (Communication & AI):** `Comment`, `Notification`, `Conversation`, `Message`, `AIInteraction`

---

## 🚀 4. Các Tính Năng Đột Phá (Key Features)

1. 📱 **O2O QR Dine-in (Gọi món tại bàn):**
   - Khách quét mã QR tại bàn ➡️ App tự nhận diện `tableId` ➡️ Khách gọi món ➡️ Đơn hàng tự động truyền xuống bếp kèm ID Bàn.
2. 💳 **Thanh toán VietQR & Đối soát Tự động:**
   - Tạo mã VietQR động chứa sẵn số tiền và nội dung chuyển khoản.
   - Khách tải ảnh chuyển khoản ➡️ Admin kiểm tra đối soát 1-touch.
3. 🤖 **Trợ lý AI Tư vấn Cá nhân hóa (RAG):**
   - AI đọc dữ liệu Menu trực tiếp từ Database ➡️ Tư vấn món theo ngân sách/sở thích của khách.
4. ⚡ **Chat Real-time (Socket.io):**
   - Nhắn tin trực tiếp giữa Khách hàng và Nhân viên phục vụ/Quản lý.
5. 🔔 **Thông báo Telegram Bot:**
   - Tự động gửi tin nhắn báo Đơn hàng mới tới Group Telegram của nhà hàng.

---

### 🤖 4.1 Định Hướng Nâng Cấp Tính Năng AI Độc Lạ (AI Innovation Roadmap)

1. 🍲 **AI Chef Combo & Calorie Matcher (Gợi ý món theo Dinh dưỡng & Ngân sách):**
   - Khách nhập chiều cao, cân nặng, chế độ ăn (Keto, Gym, Giảm cân...) và ngân sách. AI tự động phối hợp các món có sẵn trong Menu thành Combo tối ưu nhất về giá trị dinh dưỡng và chi phí.
2. 📸 **AI Snap & Match Menu (Tìm món ăn bằng ảnh chụp từ Camera):**
   - Khách tải ảnh 1 món ăn bất kỳ. AI Vision phân tích nguyên liệu và tìm kiếm món ăn tương đồng nhất trong Menu nhà hàng để thêm nhanh vào giỏ hàng.
3. 🗣️ **AI Voice Order Assistant (Đặt món bằng Giọng nói):**
   - Tích hợp Speech-to-Text & LLM xử lý ngôn ngữ tự nhiên. Khách chỉ cần nói câu lệnh (VD: *"Cho 2 trà sữa ít đường 1 cơm tấm"*), AI tự động chọn món, phân tích option (ít đường) và thêm vào giỏ hàng.
4. 📊 **AI Sentiment Review & Trend Detector (Phân tích cảm xúc & Cảnh báo sự cố):**
   - AI quét các bình luận/đánh giá của khách. Khi phát hiện nhiều phản hồi tiêu cực về cùng 1 món (VD: *"Mặn quá"*), AI tự động đẩy cảnh báo khẩn cấp sang Telegram cho Admin xử lý kịp thời.

---

## 👥 5. Phân Quyền Hệ Thống (Roles & Permissions)

* **Khách hàng (Customer):** Khám phá menu, quét QR gọi tại bàn, đặt đơn delivery, áp mã giảm giá, chat với quán, thanh toán VietQR, xem lịch sử đơn.
* **Nhân viên (Staff):** Theo dõi sơ đồ bàn real-time, chuyển trạng thái đơn hàng (`PENDING` ➡️ `CONFIRMED` ➡️ `COOKING` ➡️ `SERVED` ➡️ `COMPLETED`), hỗ trợ chat với khách.
* **Quản trị viên (Admin):** Quản lý Menu (CRUD món ăn), quản lý danh mục, tạo mã giảm giá, duyệt đối soát thanh toán VietQR, xem báo cáo thống kê doanh thu.

---

## 📁 6. Cấu Trúc Thư Mục Dự Án (Project Folder Structure)

```text
Res_Booking/
├── backend/                  # NestJS API Backend
│   ├── src/
│   │   ├── modules/          # Các module chức năng (order, table, auth, product, vietQr, chat...)
│   │   ├── prisma/           # Schema database & migrations (prisma.schema)
│   │   └── main.ts           # File khởi chạy server
│   └── package.json
│
├── mobile/                   # React Native (Expo) Mobile App
│   ├── src/
│   │   ├── features/         # Giao diện & logic theo màn hình (at_restaurant, home, menu, vietQr...)
│   │   ├── services/         # API calls & Axios config
│   │   ├── store/            # Redux Slices / State
│   │   └── config/           # Cấu hình IP LAN, constants
│   └── package.json
│
├── README.md                 # Hướng dẫn chạy & giới thiệu chung
└── PROJECT_ANALYSIS.md       # Báo cáo phân tích chi tiết (File này)
```
