# BÁO CÁO KẾ HOẠCH QUẢN TRỊ DỰ ÁN PHẦN MỀM
## DỰ ÁN: HỆ SINH THÁI QUẢN LÝ VÀ ĐẶT MÓN NHÀ HÀNG O2O (RESTAURANT BOOKING O2O ECOSYSTEM)

* **Môn học:** Quản trị Dự án Phần mềm
* **Học viên / Sinh viên:** Lê Quang Luân - Mã SV: 24ITE064
* **Công nghệ thực tế của Dự án:** React Native (Expo), NestJS, MySQL & Prisma ORM, Socket.io, VietQR, Cloudinary, Telegram Bot Notification, Ollama AI (RAG).

---

## CHƯƠNG I: XÁC ĐỊNH DỰ ÁN & MỤC TIÊU (PROJECT INITIATION & SCOPE)

### 1.1. Tổng Quan Dự Án & Bài Toán Giải Quyết
* **Tên dự án:** Hệ sinh thái Quản lý & Đặt món Nhà hàng O2O (Restaurant Booking O2O Ecosystem).
* **Mô hình kiến trúc:** Client - Server (Mobile Client React Native Expo + Backend Server NestJS REST API / WebSocket).
* **Mô hình vận hành O2O (Online-to-Offline):** Tích hợp hoàn hảo giữa 2 hình thức:
  1. **Online (Delivery):** Khách hàng xem menu, đặt món giao tận nhà trên ứng dụng di động.
  2. **Offline (Dine-in QR):** Khách đến trực tiếp quán quét mã QR tại bàn, tự gọi món bằng điện thoại cá nhân.

#### Vấn đề thực tế hiện tại của nhà hàng truyền thống:
1. **Khách hàng phải chờ đợi lâu:** Vào giờ cao điểm, nhân viên không ghi order kịp, gây ùn tắc và trải nghiệm kém.
2. **Dễ xảy ra sai sót / nhầm đơn:** Ghi chép tay thủ công dễ nhầm món, sót topping hoặc giao nhầm bàn.
3. **Khó theo dõi trạng thái đơn hàng:** Khách không biết đơn của mình đang ở bước nào (bếp đang nấu, đã hoàn tất hay đang giao).
4. **Tốn chi phí nhân sự:** Quán phải duy trì lượng lớn nhân viên order và nhân viên trực tổng đài tư vấn.
5. **Quản lý phân tán & đối soát vất vả:** Khó kiểm soát giao dịch chuyển khoản ngân hàng, thống kê doanh thu và báo cáo thủ công tốn nhiều thời gian.

 **Bài toán dự án giải quyết:** Cung cấp một hệ sinh thái O2O tự động hóa quy trình gọi món, chuyển đơn trực tiếp xuống bếp qua WebSocket, thanh toán VietQR động kèm đối soát 1-touch và tích hợp Trợ lý AI tư vấn menu cá nhân hóa.

---

### 1.2. Mục Tiêu Dự Án
#### Mục tiêu tổng quát:
Xây dựng hệ sinh thái phần mềm O2O hỗ trợ quản lý và đặt món nhà hàng toàn diện, tối ưu hóa quy trình từ gọi món, chế biến, thanh toán đến CSKH, giúp tăng **40% hiệu suất phục vụ** và giảm **90% rủi ro nhầm đơn**.

#### Mục tiêu cụ thể:
* **Mobile App Đa nền tảng:** Xây dựng ứng dụng di động mượt mà cho cả iOS và Android (React Native Expo).
* **Gọi món O2O qua mã QR:** Cho phép khách quét mã QR dán tại bàn để gọi món tự động, hệ thống tự động ghim `tableId`.
* **Thanh toán VietQR & Đối soát 1-touch:** Tạo mã VietQR động tự động điền tiền/nội dung, cho phép tải biên lai lên Cloudinary để Admin duyệt nhanh.
* **Trợ lý AI Tư vấn (Ollama RAG):** Tích hợp AI đọc menu từ Database để tự động tư vấn món theo ngân sách & sở thích.
* **Thông báo Real-time & Telegram Bot:** Cập nhật trạng thái đơn real-time (Socket.io) và tự động push tin nhắn đơn mới sang nhóm Telegram của nhà hàng.
* **Admin & Staff Dashboard:** Trang quản trị cho phép quản lý Menu (CRUD món/danh mục), sơ đồ bàn (Table Map), phân quyền và xem báo cáo doanh thu trực quan.

---

### 1.3. Phân Quyền & Đối Tượng Sử Dụng (Role-based Requirements)

| Đối tượng | Quyền hạn & Nhu cầu sử dụng |
| :--- | :--- |
| ** Khách hàng (Customer)** | Xem menu, tìm kiếm/lọc món, quét QR tại bàn (Dine-in) hoặc đặt giao về (Delivery), thêm giỏ hàng, đặt món, thanh toán VietQR, chat CSKH real-time, tư vấn AI, theo dõi trạng thái đơn, đánh giá món ăn. |
| ** Nhân viên / Bếp (Staff/Kitchen)** | Giám sát sơ đồ bàn real-time (Trống, Đang phục vụ, Bảo trì), tiếp nhận đơn mới, cập nhật 5 bước vòng đời đơn (`PENDING`  `CONFIRMED`  `COOKING`  `SERVED`  `COMPLETED`), chat hỗ trợ khách. |
| ** Quản trị viên (Admin)** | Quản lý thực đơn & danh mục (CRUD + upload Cloudinary), quản lý bàn ăn & sinh mã QR, duyệt đối soát VietQR 1-touch, nhận cảnh báo Telegram Bot, quản lý nhân viên, xem báo cáo doanh thu & xuất Excel/CSV. |

---

### 1.4. Yêu Cầu Chức Năng (Functional Requirements)

```
HỆ THỐNG QUẢN LÝ VÀ ĐẶT MÓN O2O
│
├──  NHÓM KHÁCH HÀNG (CUSTOMER)
│   ├── F01 – Xem Menu & Danh mục sản phẩm
│   ├── F02 – Tìm kiếm & Lọc món ăn theo tên / giá / danh mục
│   ├── F03 – Trợ lý AI Tư vấn món ăn (Ollama RAG)
│   ├── F04 – Quét mã QR tại bàn gọi món (O2O Dine-in)
│   ├── F05 – Quản lý Giỏ hàng (Thêm, sửa số lượng, xóa)
│   ├── F06 – Đặt món (Chọn hình thức Delivery hoặc Dine-in)
│   ├── F07 – Thanh toán VietQR & Upload ảnh biên lai chuyển khoản
│   ├── F08 – Theo dõi trạng thái đơn hàng real-time
│   ├── F09 – Chat trực tiếp với Nhân viên nhà hàng (Socket.io)
│   └── F10 – Đánh giá & Phản hồi chất lượng món ăn
│
├──  NHÓM NHÂN VIÊN & BẾP (STAFF & KITCHEN)
│   ├── F11 – Quản lý Sơ đồ bàn ăn real-time (Table Map)
│   ├── F12 – Tiếp nhận & Xác nhận đơn hàng mới
│   ├── F13 – Cập nhật trạng thái vòng đời đơn hàng
│   └── F14 – Chat hỗ trợ và giải đáp thắc mắc khách hàng
│
└──  NHÓM QUẢN TRỊ VIÊN (ADMIN)
    ├── F15 – Quản lý Thực đơn & Danh mục (CRUD món + Ảnh Cloudinary)
    ├── F16 – Quản lý Bàn ăn & Xuất mã QR Bàn
    ├── F17 – Duyệt đối soát thanh toán VietQR 1-touch
    ├── F18 – Nhận thông báo Push tự động qua Telegram Bot
    ├── F19 – Báo cáo Thống kê Doanh thu & Xuất file Excel/CSV
    └── F20 – Quản lý Tài khoản Nhân viên & Phân quyền RBAC
```

---

### 1.5. Yêu Cầu Phi Chức Năng (Non-Functional Requirements)
* **Hiệu năng (Performance):** Phản hồi API REST < 200ms; thời gian đẩy tin nhắn Socket.io real-time < 100ms. Phục vụ ổn định đồng thời 500+ truy cập.
* **Bảo mật (Security):** Mã hóa mật khẩu bằng `Bcrypt`, xác thực người dùng qua `JWT Token`, phân quyền vai trò (RBAC) chặt chẽ giữa Customer, Staff, Admin.
* **Tương thích & Giao diện (Compatibility & UX):** Hoạt động mượt mà trên cả Android & iOS qua Expo, thiết kế giao diện chuẩn Tailwind/NativeWind thân thiện và dễ thao tác.

---

### 1.6. Xác Định Nhân Sự Dự Án (Project Team Structure - 5 Nhân sự)

| Thành viên | Vai trò | Trách nhiệm chính |
| :---: | :--- | :--- |
| **Thành viên A (Lê Quang Luân)** |  **Project Manager (PM) & BA** | Quản lý tiến độ, thu thập yêu cầu, lập WBS, PERT, Gantt Chart, quản lý rủi ro và điều phối nhân sự. |
| **Thành viên B** |  **UI/UX & Mobile Lead** | Thiết kế Wireframe/Figma, xây dựng ứng dụng di động React Native Expo cho Khách hàng & Nhân viên. |
| **Thành viên C** |  **Backend Lead** | Phát triển NestJS REST API, thiết kế Database Prisma/MySQL, bảo mật JWT & phân quyền RBAC. |
| **Thành viên D** |  **Integration & AI Engineer** | Tích hợp Socket.io Real-time, VietQR API, Cloudinary Storage, Telegram Bot & AI Ollama RAG. |
| **Thành viên E** |  **Software Tester (QA/QC)** | Lập Test Case, thực hiện Unit Test, Integration Test, System Test và UAT. |

---

### 1.7. Mô Hình Phát Triển (Agile/Scrum - 4 Sprints / 8 Tuần)
* 🟢 **Sprint 1 (Tuần 1 - 2):** Phân tích yêu cầu, thiết kế Database Prisma/MySQL, thiết kế UI/UX Figma.
* **Sprint 2 (Tuần 3 - 4):** Xây dựng Backend NestJS Core (Auth, Catalog, Table) & Mobile UI Menu/Home.
* 🟠 **Sprint 3 (Tuần 5 - 6):** Xây dựng luồng Đặt món O2O (QR Scan, Delivery), VietQR Payment, Cloudinary Upload, Socket.io Chat.
* **Sprint 4 (Tuần 7 - 8):** Tích hợp Telegram Bot, Ollama AI RAG, Admin Dashboard, Testing toàn diện & Deploy Server/App.

---

## CHƯƠNG II: CẤU TRÚC PHÂN CHIA CÔNG VIỆC (WBS - WORK BREAKDOWN STRUCTURE)

```
1.0 KHỞI ĐỘNG VÀ PHÂN TÍCH YÊU CẦU (INITIATION & REQUIREMENTS)
├── 1.1 Xác định bối cảnh & Bài toán O2O
├── 1.2 Thu thập & Lập hồ sơ yêu cầu nghiệp vụ
├── 1.3 Phân tích yêu cầu Chức năng & Phi chức năng
└── 1.4 Lập Kế hoạch Quản lý Dự án & Project Charter

2.0 THIẾT KẾ HỆ THỐNG (SYSTEM DESIGN)
├── 2.1 Thiết kế Cơ sở dữ liệu (Prisma Schema / MySQL)
├── 2.2 Thiết kế Kiến trúc REST API & WebSocket Gateway
├── 2.3 Thiết kế Giao diện UI/UX Mobile App (Figma)
└── 2.4 Thiết kế Kiến trúc Tích hợp AI (Ollama RAG) & VietQR / Telegram

3.0 PHÁT TRIỂN NỀN TẢNG MÁY CHỦ - BACKEND (NESTJS & PRISMA)
├── 3.1 Khởi tạo Project NestJS & Cấu hình Prisma / MySQL / Cloudinary
├── 3.2 Xây dựng Module Authentication & Phân quyền RBAC (JWT/Bcrypt)
├── 3.3 Xây dựng Module Danh mục & Món ăn (Catalog API + Upload ảnh)
├── 3.4 Xây dựng Module Bàn ăn & Sinh mã QR Bàn
├── 3.5 Xây dựng Module Đơn hàng & Quản lý Vòng đời đơn (Order API)
├── 3.6 Xây dựng Module Thanh toán VietQR & Đối soát Biên lai
├── 3.7 Xây dựng Real-time Socket.io Gateway (Live Chat & Order Push)
└── 3.8 Tích hợp Telegram Bot Notification & Ollama AI RAG Assistant

4.0 PHÁT TRIỂN NỀN TẢNG DI ĐỘNG - MOBILE APP (REACT NATIVE EXPO)
├── 4.1 Khởi tạo Project Expo, Cấu hình Navigation & NativeWind UI
├── 4.2 Xây dựng Màn hình Home, Danh mục & Chi tiết món ăn
├── 4.3 Xây dựng Chức năng Quét mã QR Bàn (Dine-in Camera Scanner)
├── 4.4 Xây dựng Giỏ hàng & Luồng Đặt món (Delivery & Dine-in)
├── 4.5 Xây dựng Màn hình Thanh toán VietQR & Tải ảnh Biên lai
├── 4.6 Xây dựng Màn hình Live Chat Real-time & Trợ lý Tư vấn AI
├── 4.7 Xây dựng Giao diện Nhân viên (Sơ đồ bàn, Tiếp nhận & Đổi trạng thái đơn)
└── 4.8 Xây dựng Giao diện Admin Dashboard (CRUD Món, Duyệt thanh toán, Báo cáo Doanh thu)

5.0 KIỂM THỬ VÀ ĐẢM BẢO CHẤT LƯỢNG (TESTING & QA)
├── 5.1 Unit Testing API (NestJS Jest)
├── 5.2 Integration Testing (API + Database + Cloudinary + Socket.io)
├── 5.3 System & Mobile UI Testing trên thiết bị Android/iOS thật
└── 5.4 UAT (User Acceptance Testing) & Kiểm thử Tải/Bảo mật

6.0 TRIỂN KHAI VÀ BÀN GIAO (DEPLOYMENT & CLOSURE)
├── 6.1 Deploy Backend REST API & Socket Gateway
├── 6.2 Cấu hình Database Production & Seed Data
├── 6.3 Build APK/IPA Mobile App & Cấu hình IP LAN / Domain
└── 6.4 Tổng kết Dự án, Nghiệm thu & Viết Tài liệu Hướng dẫn Sử dụng
```

---

## CHƯƠNG III: ƯỚC LƯỢNG THỜI GIAN, PERT VÀ ĐƯỜNG GĂNG (CRITICAL PATH)

### 3.1. Bảng Ước Lượng Thời Gian & Quan Hệ Phụ Thuộc (Task Schedule & Dependencies)

| Mã CV | Tên Công việc | Công việc trước (Predecessor) | Thời gian (Ngày) | Người phụ trách |
| :---: | :--- | :---: | :---: | :--- |
| **A** | Thu thập & Phân tích Yêu cầu | - | 4 | PM / BA |
| **B** | Thiết kế Database (Prisma Schema) | A | 3 | Backend Lead |
| **C** | Thiết kế UI/UX Wireframe (Figma) | A | 5 | UI/UX Designer |
| **D** | Khởi tạo Project Base (Backend + Mobile) | B, C | 2 | Fullstack Lead |
| **E** | Backend Core (Auth, Product & Category API) | D | 5 | Backend Lead |
| **F** | Backend Order, Table Map & VietQR API | E | 6 | Backend Lead |
| **G** | Backend Real-time Socket.io, Telegram Bot & AI RAG | E | 5 | Integration Eng |
| **H** | Mobile App UI Base (Home, Menu & QR Scanner) | D | 6 | Mobile Lead |
| **I** | Mobile Cart, Checkout & VietQR Upload | H, F | 5 | Mobile Lead |
| **J** | Mobile Live Chat, AI Assistant & Staff UI | H, G | 5 | Mobile Lead |
| **K** | Admin Dashboard & Report Module | F | 4 | Backend/Mobile |
| **L** | Kiểm thử Tích hợp & Hệ thống (System Testing) | I, J, K | 5 | Tester |
| **M** | Deploy Backend, Server Config & Build Mobile App | L | 3 | DevOps / PM |
| **N** | Lập tài liệu nghiệm thu & Bàn giao dự án | M | 2 | PM |

---

### 3.2. Mô Tả Sơ Đồ Mạng PERT (PERT Network Diagram)

```
          ┌────────► C (5d) ────────┐
          │                         │
A (4d) ───┼                         ├─► D (2d) ───┬─► E (5d) ───┬─► F (6d) ───┬─► I (5d) ───┐
          │                         │             │             │             │             │
          └────────► B (3d) ────────┘             │             ├─► G (5d) ───┼─► J (5d) ───┼─► L (5d) ─► M (3d) ─► N (2d)
                                                  │             │             │             │
                                                  └────────────► H (6d) ──────┴─► K (4d) ───┘
```

---

### 3.3. Xác Định Đường Găng (Critical Path) & Thời Gian Dự Trữ (Float)

#### Các đường truyền trong sơ đồ mạng:
1. **Path 1:** A  C  D  E  F  I  L  M  N = 4 + 5 + 2 + 5 + 6 + 5 + 5 + 3 + 2 = **37 ngày**
2. **Path 2:** A  C  D  E  F  K  L  M  N = 4 + 5 + 2 + 5 + 6 + 4 + 5 + 3 + 2 = **36 ngày**
3. **Path 3:** A  C  D  E  G  J  L  M  N = 4 + 5 + 2 + 5 + 5 + 5 + 5 + 3 + 2 = **34 ngày**
4. **Path 4:** A  C  D  H  I  L  M  N = 4 + 5 + 2 + 6 + 5 + 5 + 3 + 2 = **32 ngày**
5. **Path 5:** A  B  D  E  F  I  L  M  N = 4 + 3 + 2 + 5 + 6 + 5 + 5 + 3 + 2 = **35 ngày**

#### Kết quả phân tích:
* **Đường găng (Critical Path):** **A  C  D  E  F  I  L  M  N**
* **Tổng thời gian dự án:** **37 ngày** (Tương đương 8 tuần làm việc).
* **Thời gian dự trữ (Float):**
  * Công việc **B** (Thiết kế DB): Total Float = **2 ngày**.
  * Công việc **G** (Socket/Bot/AI): Total Float = **3 ngày**.
  * Công việc **K** (Admin Dashboard): Total Float = **1 ngày**.
  * Công việc **H** (Mobile Base UI): Total Float = **5 ngày**.
  * Tất cả công việc trên Đường găng (**A, C, D, E, F, I, L, M, N**) có **Float = 0 ngày** (không được trễ tiến độ).

---

## CHƯƠNG IV: TIẾN ĐỘ GANTT CHART VÀ QUẢN LÝ RỦI RO

### 4.1. Biểu Đồ Tiến Độ Gantt (Gantt Chart - 8 Tuần)

```
CÔNG VIỆC                             TUẦN 1  TUẦN 2  TUẦN 3  TUẦN 4  TUẦN 5  TUẦN 6  TUẦN 7  TUẦN 8
─────────────────────────────────────────────────────────────────────────────────────────────────
A: Thu thập & Phân tích Yêu cầu       ██████
B: Thiết kế Database Prisma           ░░░███
C: Thiết kế UI/UX Figma               ████████
D: Setup Base (Backend/Mobile)                ████
E: Backend Core (Auth/Catalog)                     ████████
F: Backend Order/Table/VietQR                              ██████████
G: Backend Socket/Bot/AI RAG                               ░░████████
H: Mobile App UI Base                         ░░██████████
I: Mobile Cart/Checkout/VietQR                                       ██████████
J: Mobile Live Chat/Staff UI                                         ░░████████
K: Admin Dashboard & Reports                                         ░░░░██████
L: System Testing & QA                                                         ██████████
M: Deployment & Build App                                                                ██████
N: Handover & Documentation                                                                    ████
```
*(Ghi chú: `████` thể hiện công việc nằm trên Đường găng; `░░██` thể hiện công việc có khoảng dự trữ Float)*

--

### 4.2. Quản Lý Rủi Ro Dự Án (Risk Management)

| STT | Mã | Mô tả Rủi ro | Khả năng (P) | Ảnh hưởng (I) | Ưu tiên | Giải pháp Phòng ngừa & Xử lý (Mitigation Strategy) |
| :-: | :-: | :--- | :---: | :---: | :---: | :--- |
| 1 | **R01** | Thay đổi yêu cầu nghiệp vụ (Scope Creep) | Cao | Cao | **Rất Cao** | Chốt Freeze Yêu cầu sau Sprint 1. Mọi thay đổi phát sinh phải qua quy trình Change Request (CR) đánh giá ảnh hưởng tiến độ. |
| 2 | **R02** | Lỗi IP LAN / Network khi kết nối Mobile Expo với Server dev | Cao | Trung bình | **Cao** | Tạo file `config/ip.ts` cấu hình tập trung IP IPv4 của máy dev, chuẩn bị tài liệu hướng dẫn khắc phục sự cố kết nối mạng. |
| 3 | **R03** | Sai sót trong đối soát biên lai VietQR của khách | Trung bình | Cao | **Cao** | Lưu trữ ảnh biên lai an toàn trên Cloudinary, xây dựng màn hình đối soát 1-touch hiển thị mã VietQR song song với ảnh chuyển khoản. |
| 4 | **R04** | Trễ tiến độ module AI RAG Ollama hoặc Socket Gateway | Trung bình | Cao | **Trung bình** | Mô-đun hóa thiết kế. Nếu AI gặp sự cố, hệ thống tự động fallback dùng tìm kiếm thường mà không nghẽn luồng đặt hàng. |
| 5 | **R05** | Thành viên trễ tiến độ công việc | Trung bình | Cao | **Cao** | Họp Daily Standup 15 phút hằng ngày trong Agile/Scrum, theo dõi tiến độ công việc và hỗ trợ ngay khi xuất hiện nút thắt cổ chai (bottleneck). |
| 6 | **R06** | Mất mát dữ liệu Database | Thấp | Rất Cao | **Rất Cao** | Sử dụng Prisma Migration để quản lý schema phiên bản; lập script tự động sao lưu (backup) cơ sở dữ liệu MySQL định kỳ hằng ngày. |

---

## CHƯƠNG V: CHI PHÍ VÀ ĐÁNH GIÁ TIẾN ĐỘ (COST & CONTROL)

### 5.1. Ước Tính Chi Phí Dự Án (Project Cost Budgeting)

#### 1. Chi phí Nhân sự (Labor Costs - 8 Tuần ~ 2 Tháng):
* Project Manager / BA (1 người): 12.000.000 VNĐ/tháng × 2 = **24.000.000 VNĐ**
* Mobile Frontend Developer (1 người): 10.000.000 VNĐ/tháng × 2 = **20.000.000 VNĐ**
* Backend Developer (1 người): 10.000.000 VNĐ/tháng × 2 = **20.000.000 VNĐ**
* Integration / AI Engineer (1 người): 10.000.000 VNĐ/tháng × 2 = **20.000.000 VNĐ**
* QA / Tester (1 người): 8.000.000 VNĐ/tháng × 2 = **16.000.000 VNĐ**
 *Tổng Chi phí Nhân sự:* **100.000.000 VNĐ**

#### 2. Chi phí Hạ tầng & Dịch vụ Cloud (Infrastructure Costs):
* Cloud Server Hosting (VPS cho NestJS API & MySQL): 1.500.000 VNĐ/tháng × 2 = **3.000.000 VNĐ**
* Cloudinary API Storage & CDN (Lưu trữ ảnh món ăn, biên lai): **500.000 VNĐ**
* Tên miền Domain (.com / .vn 1 năm): **450.000 VNĐ**
* Chi phí Máy chủ Local cho AI Ollama RAG: **2.000.000 VNĐ**
 *Tổng Chi phí Hạ tầng:* **5.950.000 VNĐ**

#### 3. Chi phí Công cụ & Dự phòng (Tools & Contingency):
* Công cụ Quản lý & Thiết kế (Figma Pro, Postman, Jira): **1.500.000 VNĐ**
* Chi phí Dự phòng Rủi ro (Contingency Reserve ~ 10%): **10.500.000 VNĐ**
 *Tổng Chi phí Công cụ & Dự phòng:* **12.000.000 VNĐ**

 **TỔNG CHI PHÍ DỰ KIẾN (TOTAL PROJECT BUDGET):** **117.950.000 VNĐ**

--

### 5.2. Đánh Giá Tiến Độ & Kiểm Soát Chi Phí (Earned Value Management - EVM)

Tại mốc đánh giá giữa dự án (**Cuối Tuần 4**):
* **PV (Planned Value - Giá trị Kế hoạch):** Dự kiến hoàn thành 50% khối lượng = **58.975.000 VNĐ**.
* **EV (Earned Value - Giá trị Thực tế Đạt được):** Thực tế hoàn thành 45% khối lượng (xong Sprint 1 và 80% Sprint 2) = **53.077.500 VNĐ**.
* **AC (Actual Cost - Chi phí Thực tế Đã chi):** **56.000.000 VNĐ**.

#### Đánh giá các chỉ số chỉ báo:
* **Chỉ số Tiến độ (SPI = EV / PV):** 53.077.500 / 58.975.000 = **0.90** (< 1.0)  *Dự án đang chậm tiến độ khoảng 10%*.
* **Chỉ số Chi phí (CPI = EV / AC):** 53.077.500 / 56.000.000 = **0.95** (< 1.0)  *Chi phí thực tế đang hơi vượt so với khối lượng công việc đạt được*.

#### Giải pháp Điều chỉnh của Trưởng dự án (PM Actions):
1. Đẩy mạnh nguồn lực giải quyết các công việc nằm trên **Đường găng (Critical Path)**: Module Backend Order (`F`) và Mobile Checkout (`I`).
2. Tận dụng thời gian dự trữ (Float) của các tác vụ không găng (như Admin Dashboard `K` và Socket Base `G`) để điều chuyển nhân lực hỗ trợ module chính.
3. Thường xuyên theo dõi tiến độ qua Daily Standup để tháo gỡ nghẽn kết nối API ngay lập tức.

---

## KẾT LUẬN TỔNG THỂ DỰ ÁN

Báo cáo Kế hoạch Quản trị Dự án Phần mềm cho **"Hệ sinh thái Quản lý & Đặt món Nhà hàng O2O"** đã chuẩn hóa toàn bộ công nghệ thực tế của dự án (`React Native Expo`, `NestJS`, `Prisma`, `MySQL`, `VietQR`, `Socket.io`, `Cloudinary`, `Telegram Bot`, `Ollama AI`) thành một hồ sơ quản lý hoàn chỉnh:
1. Xác định chính xác **Bài toán, Phạm vi & Yêu cầu O2O**.
2. Phân chia cây **WBS 6 Cấp** logic và bao quát.
3. Lập bảng tiến độ, sơ đồ **PERT** và tìm ra **Đường găng (Critical Path)** chuẩn xác dài **37 ngày**.
4. Xây dựng **Biểu đồ Gantt 8 tuần**, **Bảng Quản lý Rủi ro** sát thực tế và phân tích tài chính **EVM**.
