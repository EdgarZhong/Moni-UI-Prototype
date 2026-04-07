export const C = {
  bg: "#F5F0EB",
  white: "#FFF",
  dark: "#222",
  coral: "#FF6B6B",
  blue: "#7EC8E3",
  yellow: "#F9D56E",
  mint: "#4ECDC4",
  amber: "#E88B4D",
  muted: "#999",
  sub: "#888",
  border: "#DDD",
  line: "#EEE",
  warmBg: "#FFF8F0",
  warmBd: "#F0C89A",
  pinkBg: "#FFF0F0",
  pinkBd: "#FFB8B8",
  greenBg: "#F0F8F0",
  greenText: "#3B6D11",
  blueBg: "#EBF5FF",
  orangeBg: "#FFF5EB",
  purple: "#B8A0D2",
  burgundy: "#C97B84",
  gray: "#C5C5C5",
};

export const CAT = {
  正餐: { color: "#D85A30", bg: C.pinkBg, icons: ["🍜", "🍱", "🍚", "🥡"] },
  零食: { color: "#854F0B", bg: "#FFF8EB", icons: ["☕", "🧋", "🍪", "🍦"] },
  交通: { color: "#185FA5", bg: C.blueBg, icons: ["🚇", "🚕", "⛽", "🚌"] },
  娱乐: { color: "#7B2D8B", bg: "#F6EEFA", icons: ["🎬", "🎮", "🎵", "🎭"] },
  大餐: { color: "#8B2252", bg: "#FFF0F5", icons: ["🍷", "🥘", "🦞", "🍣"] },
  健康: { color: "#1A7A4C", bg: "#EEFAF3", icons: ["💊", "🏥", "💪", "🧘"] },
  购物: { color: "#534AB7", bg: "#F3EEFA", icons: ["🛍️", "📦", "👕", "🎁"] },
  教育: { color: "#2D6A9F", bg: "#EDF5FC", icons: ["📚", "🎓", "✏️", "💻"] },
  居住: { color: "#6B5B3E", bg: "#FBF6EE", icons: ["🏠", "💡", "🔧", "🚿"] },
  旅行: { color: "#0E7C6B", bg: "#E8FAF5", icons: ["✈️", "🏨", "🎫", "🗺️"] },
  其他: { color: "#666", bg: "#F5F5F5", icons: ["📝", "💰", "🔖", "📌"] },
};

export const OVERVIEW_COLORS = {
  正餐: C.coral,
  零食: "#F3C86B",
  交通: C.blue,
  娱乐: "#C8A7E8",
  大餐: "#E7A0AE",
  健康: "#77D7BF",
  购物: "#AFA5E6",
  教育: "#93C4EA",
  居住: "#C9B18E",
  旅行: "#87D7C4",
  其他: C.gray,
  未分类: C.amber,
};

export const CATEGORY_ORDER = Object.keys(CAT);
export const FILTERS = ["全部", ...CATEGORY_ORDER, "未分类"];
export const TODAY = "2026-04-07";
export const HAS_BUDGET = true;
export const PHONE_FRAME_HEIGHT = 860;
export const AUTO_CAROUSEL_MS = 30000;
export const MANUAL_IDLE_LOCK_MS = 2 * 60 * 1000;
export const MANUAL_RESUME_MS = 5 * 60 * 1000;

export const INCOME = [
  { date: "2026-04-03", amount: 5000 },
  { date: "2026-03-25", amount: 800 },
];

export const DAYS = [
  {
    id: "2026-04-07",
    label: "今天",
    items: [
      { id: 1, n: "杨国福麻辣烫", a: 45, t: "18:10", pay: "微信", userCat: "正餐", aiCat: "正餐", reason: "餐饮商户，正餐时段", ih: 0 },
      { id: 2, n: "滴滴出行", a: 23, t: "16:30", pay: "支付宝", userCat: null, aiCat: "交通", reason: "出行平台", ih: 1 },
      { id: 3, n: "瑞幸咖啡", a: 18, t: "14:20", pay: "微信", userCat: "零食", aiCat: "零食", reason: "咖啡饮品", ih: 0 },
      { id: 4, n: "益禾堂", a: 12, t: "19:40", pay: "微信", userCat: null, aiCat: null, reason: null, ih: 0 },
      { id: 5, n: "美团外卖", a: 56, t: "12:05", pay: "微信", userCat: null, aiCat: "正餐", reason: "外卖午餐", ih: 3 },
    ],
  },
  {
    id: "2026-04-06",
    label: "昨天",
    items: [
      { id: 7, n: "海底捞火锅", a: 180, t: "19:10", pay: "支付宝", userCat: "大餐", aiCat: "大餐", reason: "多人聚餐，高客单价", ih: 0 },
      { id: 8, n: "地铁充值", a: 50, t: "08:30", pay: "支付宝", userCat: "交通", aiCat: "交通", reason: "公共交通", ih: 0 },
      { id: 9, n: "蜜雪冰城", a: 6, t: "15:00", pay: "微信", userCat: "零食", aiCat: "零食", reason: "饮品", ih: 2 },
      { id: 10, n: "网易云会员", a: 15, t: "22:00", pay: "支付宝", userCat: "娱乐", aiCat: "娱乐", reason: "订阅服务", ih: 2 },
    ],
  },
  {
    id: "2026-04-05",
    label: "4月5日",
    items: [
      { id: 11, n: "肯德基", a: 42, t: "12:30", pay: "微信", userCat: null, aiCat: "正餐", reason: "快餐午餐", ih: 1 },
      { id: 12, n: "京东购物", a: 128, t: "09:00", pay: "支付宝", userCat: "购物", aiCat: "购物", reason: "网购日用", ih: 1 },
      { id: 13, n: "话费充值", a: 50, t: "16:00", pay: "微信", userCat: "居住", aiCat: "居住", reason: "生活缴费", ih: 1 },
      { id: 14, n: "奈雪的茶", a: 28, t: "15:20", pay: "微信", userCat: null, aiCat: null, reason: null, ih: 0 },
    ],
  },
  {
    id: "2026-04-04",
    label: "4月4日",
    items: [
      { id: 15, n: "星巴克", a: 38, t: "10:00", pay: "支付宝", userCat: null, aiCat: "零食", reason: "咖啡饮品", ih: 0 },
      { id: 16, n: "电影票", a: 80, t: "14:00", pay: "微信", userCat: "娱乐", aiCat: "娱乐", reason: "影院消费", ih: 0 },
      { id: 17, n: "打车回家", a: 25, t: "23:00", pay: "支付宝", userCat: null, aiCat: "交通", reason: "夜间出行", ih: 1 },
    ],
  },
];

export const TREND = [120, 95, 180, 45, 210, 88, 156, 67, 142, 53, 198, 110, 75, 230, 89, 165, 42, 190, 78, 135, 105].map(
  (amount, index) => {
    const date = new Date("2026-03-18T12:00:00");
    date.setDate(date.getDate() + index);
    return {
      key: date.toISOString().slice(0, 10),
      label: `${date.getMonth() + 1}/${date.getDate()}`,
      amount,
    };
  },
);
