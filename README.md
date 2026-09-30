# Mekong CNC Supply

> Website bán dụng cụ cắt gọt CNC (dao phay, mũi khoan, insert, phụ kiện) — giao diện tiếng Việt, chạy hoàn toàn tĩnh, không cần cài đặt phức tạp.

<p align="left">
  <img alt="HTML5" src="https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white" />
  <img alt="CSS3" src="https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white" />
  <img alt="JavaScript" src="https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black" />
  <img alt="Không cần build" src="https://img.shields.io/badge/build-kh%C3%B4ng%20c%E1%BA%A7n-2ea44f" />
</p>

---

## 📖 Mục lục

- [Giới thiệu](#-giới-thiệu)
- [Tính năng](#-tính-năng)
- [Yêu cầu hệ thống](#-yêu-cầu-hệ-thống)
- [Bắt đầu nhanh](#-bắt-đầu-nhanh)
- [Cách sử dụng website](#-cách-sử-dụng-website)
- [Cấu trúc thư mục](#-cấu-trúc-thư-mục)
- [Cách chỉnh sửa nội dung](#-cách-chỉnh-sửa-nội-dung)
- [Chạy kiểm thử](#-chạy-kiểm-thử)
- [Xử lý sự cố thường gặp](#-xử-lý-sự-cố-thường-gặp)
- [Câu hỏi thường gặp](#-câu-hỏi-thường-gặp)
- [Giấy phép](#-giấy-phép)

---

## 🛠 Giới thiệu

**Mekong CNC Supply** là một trang web bán dụng cụ cắt gọt CNC dạng **tĩnh (static)**.
Toàn bộ website chỉ gồm HTML, CSS và JavaScript thuần — **không cần biên dịch, không cần máy chủ backend, không cần cơ sở dữ liệu**.

Điều đó có nghĩa là:

- ✅ Mở lên là chạy, ai cũng dùng được.
- ✅ Có thể đưa lên GitHub Pages, Netlify, Vercel hoặc bất kỳ hosting tĩnh nào.
- ✅ Dễ đọc, dễ sửa, dễ bàn giao cho người khác tiếp quản.

---

## ✨ Tính năng

### Dành cho khách mua hàng

| Nhóm | Chi tiết |
| --- | --- |
| 🏠 Trang chủ | Danh mục sản phẩm, cam kết chất lượng, CTA tư vấn kỹ thuật, lưới sản phẩm nổi bật |
| 🔍 Tìm kiếm & lọc | Tìm theo tên / SKU / thương hiệu / mô tả; lọc theo danh mục, khoảng giá; sắp xếp |
| 🧾 Chi tiết sản phẩm | Cửa sổ (modal) hiển thị thông số kỹ thuật chi tiết |
| 🛒 Giỏ hàng | Ngăn kéo giỏ hàng: tăng/giảm số lượng, xóa, ước tính phí vận chuyển, **lưu tự động vào trình duyệt** |
| 💳 Đặt hàng | Biểu mẫu đặt hàng có kiểm tra dữ liệu, chọn **COD** hoặc **chuyển khoản**, chọn khu vực giao, tính **VAT 8%** |
| 📚 Nội dung thương mại | Quy trình đặt hàng, vận chuyển & thanh toán, chính sách đổi trả / xuất xứ / VAT, FAQ |

### Điểm nổi bật kỹ thuật

- ⚡ **Không phụ thuộc thư viện ngoài** — chỉ HTML/CSS/JS thuần (ES Modules).
- 💾 **Ghi nhớ giỏ hàng** qua `localStorage` (khóa `cnc-cart`), tự bỏ qua dữ liệu cũ/hỏng.
- 🚚 **Miễn phí vận chuyển nội thành** cho đơn từ `1.500.000₫`; phí nội thành `35.000₫`.
- 🧮 **VAT 8%** tính trên tiền hàng.
- 🔒 **Không thu thập dữ liệu thẻ** — COD giới hạn cho đơn dưới `20.000.000₫`.
- ♿ **Hỗ trợ tiếp cận**: nhãn ARIA, vùng live, điều hướng bàn phím, tôn trọng `prefers-reduced-motion`.
- 📱 **Tối ưu di động**: thanh thao tác nhanh, danh mục cuộn ngang, giỏ hàng dạng bottom-sheet.

---

## 💻 Yêu cầu hệ thống

Bạn chỉ cần **một trong hai** cách sau:

- **Cách A (khuyến nghị):** [Node.js](https://nodejs.org/) (>= 18) — dùng `npm`.
- **Cách B:** [Python](https://www.python.org/) (>= 3.8) — chạy máy chủ tĩnh trực tiếp.

> ❗ **Quan trọng:** Đừng mở file `index.html` bằng cách nhấp đúp. Vì website dùng ES Modules, bạn **phải chạy qua máy chủ (server)** thì trang mới hiển thị đúng.

---

## 🚀 Bắt đầu nhanh

### 1. Tải mã nguồn

```bash
git clone https://github.com/Longz9999/CNC_project.git
cd CNC_project
```

### 2. Chạy website

**Cách A — dùng npm:**

```bash
npm run dev
```

**Cách B — dùng Python:**

```bash
python -m http.server 4173
```

### 3. Mở trình duyệt

Truy cập 👉 **http://localhost:4173**

Xong! Bạn sẽ thấy trang chủ Mekong CNC Supply.

> 💡 Nếu cổng `4173` đang bị chiếm, đổi sang cổng khác, ví dụ:
> ```bash
> python -m http.server 4174
> ```
> rồi mở `http://localhost:4174`.

---

## 🧭 Cách sử dụng website

1. **Xem sản phẩm** — kéo xuống phần *Sản phẩm* hoặc nhấp *Khám phá sản phẩm*.
2. **Lọc & tìm kiếm** — dùng ô tìm kiếm, các nút danh mục, thanh trượt giá và menu sắp xếp.
3. **Xem chi tiết** — nhấp vào một sản phẩm để mở cửa sổ thông số kỹ thuật.
4. **Thêm vào giỏ** — nhấn *Thêm vào giỏ*; biểu tượng giỏ hàng ở góc trên sẽ cập nhật số lượng.
5. **Mở giỏ hàng** — nhấn nút *Giỏ hàng* để xem, chỉnh số lượng hoặc xóa sản phẩm.
6. **Đặt hàng** — nhấn *Thanh toán*, điền thông tin, chọn khu vực giao và hình thức thanh toán (COD / chuyển khoản).
7. **Xác nhận** — hệ thống tính VAT, phí ship và hiển thị tổng tiền. Đơn demo được lưu trong trình duyệt (`localStorage['cnc-orders']`).

---

## 📂 Cấu trúc thư mục

```
CNC_project/
├── index.html              # Trang chính (toàn bộ bố cục & nội dung)
├── styles.css              # Toàn bộ giao diện, responsive, hiệu ứng
├── package.json            # Lệnh chạy dev / test
├── README.md               # Tài liệu bạn đang đọc
├── AGENTS.md               # Hướng dẫn cho trợ lý AI / cộng tác viên
└── src/
    ├── catalog.js          # Danh mục sản phẩm + hàm tính tiền, định dạng VND
    ├── app.js              # Toàn bộ logic: lọc, giỏ hàng, đặt hàng, modal
    └── catalog.test.mjs    # Kiểm thử nhanh cho phần tính tổng đơn hàng
```

**Vai trò từng file:**

- `index.html` — bộ khung trang: header, hero, danh mục, lưới sản phẩm, giỏ hàng, footer…
- `styles.css` — màu sắc, bố cục, hiệu ứng chuyển động, giao diện di động.
- `src/catalog.js` — nguồn dữ liệu sản phẩm **duy nhất**. Muốn thêm/sửa sản phẩm thì sửa ở đây.
- `src/app.js` — "bộ não" của trang: đọc dữ liệu và hiển thị, xử lý tương tác người dùng.

---

## ✏️ Cách chỉnh sửa nội dung

### Thêm hoặc sửa sản phẩm

Mở `src/catalog.js` và chỉnh mảng `products`. Mỗi sản phẩm có dạng:

```js
{
  id: "em-tiain-10",                 // Mã định danh duy nhất (không trùng)
  sku: "MK-EM-10-TIALN",             // Mã sản phẩm hiển thị cho khách
  name: "Dao phay ngón TiAlN Ø10",   // Tên sản phẩm
  category: "Dao phay",              // Phải khớp một mục trong mảng categories
  price: 485000,                     // Giá (đơn vị: VNĐ, chỉ ghi số)
  meta: "TiAlN · 4 me · 75mm",       // Dòng mô tả ngắn
  brand: "Mekong Cut",               // Thương hiệu
  origin: "Việt Nam",                // Xuất xứ
  unit: "cái",                       // Đơn vị tính
  stock: 42,                         // Tồn kho (0 = hết hàng)
  image: "https://images.unsplash.com/...", // Ảnh (chỉ nhận URL Unsplash)
  description: "Mô tả chi tiết...",
  specs: { "Đường kính": "10 mm" }   // Thông số kỹ thuật (dạng key–value)
}
```

> ⚠️ **Lưu ý:** `id` phải là **duy nhất**. Trường `image` chỉ chấp nhận URL bắt đầu bằng `https://images.unsplash.com/`.

### Thêm danh mục mới

Sửa mảng `categories` ở đầu `src/catalog.js`. Sau đó đảm bảo `category` của sản phẩm khớp đúng tên danh mục.

### Đổi phí vận chuyển / VAT

Cũng trong `src/catalog.js`:

```js
export const SHIPPING_FREE_FROM = 1500000; // Ngưỡng miễn phí ship nội thành
export const SHIPPING_FEE = 35000;         // Phí ship nội thành
export const VAT_RATE = 0.08;              // VAT 8%
```

### Đổi chữ, tiêu đề, màu sắc

- **Nội dung chữ:** sửa trực tiếp trong `index.html`.
- **Màu sắc, phông, bố cục:** sửa trong `styles.css`.

Sau khi sửa, chỉ cần **lưu file và tải lại trình duyệt** (Ctrl + F5). Không cần build lại.

---

## ✅ Chạy kiểm thử

Dự án có sẵn bộ kiểm thử nhanh cho phần tính tổng đơn hàng (ship, VAT, ngưỡng miễn phí):

```bash
npm test
```

Kết quả mong đợi: tất cả dòng in ra bắt đầu bằng `ok - ...`, không có lỗi.

---

## 🧯 Xử lý sự cố thường gặp

| Triệu chứng | Nguyên nhân & cách khắc phục |
| --- | --- |
| Trang trắng, sản phẩm không hiện | Bạn mở `index.html` trực tiếp. Hãy chạy qua server (`npm run dev` hoặc `python -m http.server`). |
| `Port 4173 already in use` | Cổng đang bận. Đổi cổng: `python -m http.server 4174`. |
| `npm: command not found` | Chưa cài Node.js. Cài tại [nodejs.org](https://nodejs.org/) hoặc dùng cách Python. |
| Ảnh không tải được | Cần có Internet (ảnh lấy từ Unsplash). Kiểm tra kết nối mạng. |
| Giỏ hàng "lạ" sau khi sửa code | Dữ liệu cũ trong trình duyệt. Mở DevTools → Application → Local Storage → xóa `cnc-cart` và `cnc-orders`. |
| Sửa code mà không thấy đổi | Trình duyệt còn cache. Nhấn **Ctrl + F5** để tải lại cứng. |

---

## ❓ Câu hỏi thường gặp

**1. Website có cần cơ sở dữ liệu không?**
Không. Toàn bộ dữ liệu nằm trong `src/catalog.js` và lưu tạm ở trình duyệt.

**2. Đơn hàng có được gửi đi đâu không?**
Không. Đây là bản demo — đơn hàng chỉ lưu cục bộ trong `localStorage` của trình duyệt bạn.

**3. Có thu thập thông tin thẻ không?**
Không. Website không thu thập dữ liệu thẻ. COD giới hạn cho đơn dưới `20.000.000₫`.

**4. Tôi có thể đưa lên hosting tĩnh không?**
Được. GitHub Pages, Netlify, Vercel, Cloudflare Pages… đều chạy tốt vì đây là site tĩnh.

**5. Muốn thêm sản phẩm thì làm ở đâu?**
Sửa mảng `products` trong `src/catalog.js` (xem mục [Cách chỉnh sửa nội dung](#-cách-chỉnh-sửa-nội-dung)).

---

## 📄 Giấy phép

Dự án phục vụ mục đích học tập và demo thương mại. Vui lòng liên hệ chủ sở hữu repo trước khi dùng cho mục đích thương mại chính thức.

---

<p align="center">
  Made with ❤️ for the CNC machining community · <strong>Mekong CNC Supply</strong>
</p>
