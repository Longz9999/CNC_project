export const categories = ["Tất cả", "Dao phay", "Mũi khoan", "Insert", "Phụ kiện"];
export const SHIPPING_FREE_FROM = 1500000;
export const SHIPPING_FEE = 35000;
export const VAT_RATE = 0.08;

export const products = [
  {
    id: "em-tiain-10",
    sku: "MK-EM-10-TIALN",
    name: "Dao phay ngón TiAlN Ø10",
    category: "Dao phay",
    price: 485000,
    badge: "Bán chạy",
    meta: "4 me · HRC 55 · 75mm",
    brand: "Mekong Carbide",
    origin: "Đức",
    unit: "cái",
    stock: 24,
    lead: "Có sẵn · xuất kho trong 24 giờ",
    cutting: "Thép C45: Vc 150–180 m/phút · fz 0,04 mm/răng · ap ≤ 10 mm",
    image:
      "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=700&q=80",
    description:
      "Dao phay carbide phủ TiAlN cho thép hợp kim và inox. Hình học 4 me cân bằng giúp thoát phoi nhanh, bề mặt hoàn thiện ổn định.",
    specs: {
      "Đường kính": "Ø10 mm",
      "Chiều dài cắt": "22 mm",
      "Vật liệu": "Carbide · TiAlN",
      "Độ cứng": "Tối đa HRC 55",
    },
  },
  {
    id: "drill-carbide-8",
    sku: "MK-DR-8-3D",
    name: "Mũi khoan carbide Ø8.0",
    category: "Mũi khoan",
    price: 312000,
    badge: "Mới",
    meta: "3×D · Coolant through · 90mm",
    brand: "Mekong Carbide",
    origin: "Nhật Bản",
    unit: "cái",
    stock: 16,
    lead: "Có sẵn · xuất kho trong 24 giờ",
    cutting: "Thép: Vc 80–110 m/phút · f 0,12–0,18 mm/vòng · tưới xuyên tâm",
    image:
      "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=700&q=80",
    description:
      "Mũi khoan carbide nguyên khối 3×D, thiết kế dẫn coolant xuyên tâm cho năng suất cao trên thép và gang.",
    specs: {
      "Đường kính": "Ø8 mm",
      "Chiều sâu": "24 mm",
      "Vật liệu": "Carbide · AlCrN",
      "Góc đỉnh": "140°",
    },
  },
  {
    id: "insert-cnmg-12",
    sku: "MK-IN-CNMG120408",
    name: "Insert tiện CNMG 120408",
    category: "Insert",
    price: 185000,
    badge: "Giá tốt",
    meta: "10 pcs · MP2025 · Thép",
    brand: "Mekong Grade",
    origin: "Hàn Quốc",
    unit: "hộp",
    stock: 42,
    lead: "Có sẵn · giao theo hộp 10 mảnh",
    cutting: "Thép carbon: Vc 180–260 m/phút · ap 1–3 mm · tiện thô đến bán tinh",
    image:
      "https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?auto=format&fit=crop&w=700&q=80",
    description:
      "Insert tiện phủ đa lớp cho gia công thô đến bán tinh thép carbon. Hộp 10 mảnh, cạnh cắt sắc và ổn định.",
    specs: {
      "Mã insert": "CNMG 120408-MP",
      Mác: "MP2025",
      "Vật liệu": "Thép carbon",
      "Đóng gói": "10 mảnh / hộp",
    },
  },
  {
    id: "holder-bt30",
    sku: "MK-HD-BT30-ER32",
    name: "Holder BT30-ER32 / 70L",
    category: "Phụ kiện",
    price: 890000,
    badge: "",
    meta: "G2.5 · 25.000 RPM · 70mm",
    brand: "Mekong Hold",
    origin: "Đài Loan",
    unit: "cái",
    stock: 8,
    lead: "Có sẵn · kiểm độ đảo trước khi giao",
    cutting: "",
    image:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=700&q=80",
    description:
      "Bầu kẹp BT30 cân bằng động G2.5, phù hợp trung tâm gia công tốc độ cao. Bề mặt chống gỉ, độ đảo ≤ 3μm.",
    specs: {
      "Chuẩn côn": "BT30",
      "Chuẩn collet": "ER32",
      "Độ đảo": "≤ 3 μm",
      "Tốc độ": "25.000 RPM",
    },
  },
  {
    id: "face-mill-50",
    sku: "MK-FM-50-4T",
    name: "Dao phay mặt Ø50 / 4T",
    category: "Dao phay",
    price: 1250000,
    badge: "Pro choice",
    meta: "4 insert · 50mm · 45°",
    brand: "Mekong Carbide",
    origin: "Đài Loan",
    unit: "bộ",
    stock: 3,
    lead: "Sắp hết · giữ hàng khi đặt",
    cutting: "Thép: Vc 180–220 m/phút · fz 0,10–0,18 · ap 1,5–2,5 mm",
    image:
      "https://images.unsplash.com/photo-1565439392470-7e58e35f2f9e?auto=format&fit=crop&w=700&q=80",
    description:
      "Dao phay mặt góc 45° cho năng suất bóc vật liệu cao. Thân dao cứng vững, thay insert nhanh. Giá gồm thân dao, chưa gồm insert dự phòng.",
    specs: { "Đường kính": "Ø50 mm", "Số răng": "4", "Góc vào": "45°", Insert: "APKT 1604" },
  },
  {
    id: "collet-er32",
    sku: "MK-CL-ER32-SET",
    name: "Bộ collet ER32 / 6–20mm",
    category: "Phụ kiện",
    price: 740000,
    badge: "",
    meta: "8 pcs · Runout 5μm · DIN6499",
    brand: "Mekong Hold",
    origin: "Đài Loan",
    unit: "bộ",
    stock: 0,
    lead: "Hết hàng · về kho sau 5–7 ngày",
    cutting: "",
    image:
      "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=700&q=80",
    description:
      "Bộ collet ER32 chuẩn DIN6499, dải kẹp 6–20mm. Tối ưu cho độ đồng tâm và thay dao nhanh.",
    specs: { "Dải kẹp": "6–20 mm", "Số lượng": "8 collet", "Độ đảo": "≤ 5 μm", Chuẩn: "DIN 6499" },
  },
  {
    id: "tap-m6",
    sku: "MK-TP-M6-HSSE",
    name: "Ta rô máy M6 × 1.0 / HSS-E",
    category: "Mũi khoan",
    price: 168000,
    badge: "",
    meta: "Coating TiN · 60mm · 2 me",
    brand: "Mekong Cut",
    origin: "Nhật Bản",
    unit: "cái",
    stock: 30,
    lead: "Có sẵn · xuất kho trong 24 giờ",
    cutting: "Thép: Vc 8–12 m/phút · ren thông hoặc ren mù có lỗ mồi đúng đường kính",
    image:
      "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45f7?auto=format&fit=crop&w=700&q=80",
    description:
      "Ta rô máy HSS-E phủ TiN cho ren mù và ren thông trên thép, nhôm. Rãnh xoắn giúp đẩy phoi hiệu quả.",
    specs: {
      "Kích thước": "M6 × 1.0",
      "Chiều dài": "60 mm",
      "Vật liệu": "HSS-E · TiN",
      "Kiểu rãnh": "Xoắn 35°",
    },
  },
  {
    id: "coolant-5l",
    sku: "MK-CL-SYNCUT-5L",
    name: "Dung dịch tưới nguội SynCut 5L",
    category: "Phụ kiện",
    price: 395000,
    badge: "",
    meta: "Pha 5% · Semi-synthetic · ISO",
    brand: "SynCut",
    origin: "Việt Nam",
    unit: "can",
    stock: 18,
    lead: "Có sẵn · không gửi kèm dao đã mài",
    cutting: "",
    image:
      "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=700&q=80",
    description:
      "Dung dịch tưới nguội bán tổng hợp cho máy CNC, kiểm soát bọt tốt và bảo vệ chi tiết khỏi ăn mòn.",
    specs: {
      "Dung tích": "5 Lít",
      "Tỷ lệ pha": "5%",
      "Ứng dụng": "Thép · Nhôm · Inox",
      pH: "8.8 – 9.2",
    },
  },
];

// Intl.NumberFormat is expensive to construct; reuse one instance instead of
// allocating a new formatter (and its ICU data bindings) on every call.
const vndFormatter = new Intl.NumberFormat("vi-VN");
export const formatVnd = (value) => vndFormatter.format(value) + "₫";
export const stockLabel = (stock) =>
  stock <= 0 ? "Hết hàng" : stock <= 5 ? `Còn ${stock}` : "Còn hàng";

export const calculateOrderTotals = (
  subtotal,
  { vat = false, shippingZone = "inner-city" } = {},
) => {
  const safeSubtotal = Math.max(0, Number(subtotal) || 0);
  const innerCity = shippingZone === "inner-city";
  const shipping = innerCity && safeSubtotal > 0 && safeSubtotal < SHIPPING_FREE_FROM ? SHIPPING_FEE : 0;
  const vatAmount = vat ? Math.round(safeSubtotal * VAT_RATE) : 0;

  return {
    subtotal: safeSubtotal,
    shipping,
    vat: vatAmount,
    total: safeSubtotal + shipping + vatAmount,
    shippingLabel: !innerCity ? "Báo phí sau" : shipping ? formatVnd(shipping) : "Miễn phí",
  };
};
