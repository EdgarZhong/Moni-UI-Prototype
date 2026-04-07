import { CATEGORY_ORDER, C, TODAY } from "./config.js";

export function getCategory(item) {
  return item.userCat ?? item.aiCat ?? null;
}

export function toDate(value) {
  return new Date(`${value}T00:00:00`);
}

export function formatShortDate(value) {
  const date = toDate(value);
  return `${date.getMonth() + 1}.${date.getDate()}`;
}

export function getRange(mode, start, end) {
  const today = toDate(TODAY);
  if (mode === "今天") {
    return { start: new Date(today), end: today, label: "今天" };
  }
  if (mode === "本周") {
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - 6);
    return { start: weekStart, end: today, label: "本周" };
  }
  if (mode === "本月") {
    return { start: new Date(today.getFullYear(), today.getMonth(), 1), end: today, label: "本月" };
  }
  if (mode === "近三月") {
    const quarterStart = new Date(today);
    quarterStart.setMonth(today.getMonth() - 2);
    quarterStart.setDate(1);
    return { start: quarterStart, end: today, label: "近三月" };
  }
  return {
    start: toDate(start),
    end: toDate(end),
    label: `${formatShortDate(start)} - ${formatShortDate(end)}`,
  };
}

export function isInRange(value, range) {
  const date = toDate(value);
  return date >= range.start && date <= range.end;
}

export function buildOverview(expenseItems) {
  const totals = CATEGORY_ORDER.map((category) => ({
    category,
    total: expenseItems.filter((item) => getCategory(item) === category).reduce((sum, item) => sum + item.a, 0),
  })).filter((item) => item.total > 0);

  const unclassifiedTotal = expenseItems.filter((item) => !getCategory(item)).reduce((sum, item) => sum + item.a, 0);
  const grand = Math.max(totals.reduce((sum, item) => sum + item.total, 0) + unclassifiedTotal, 1);

  return [...totals, { category: "未分类", total: unclassifiedTotal }]
    .filter((item) => item.total > 0)
    .map((item) => ({
      ...item,
      percent: Math.round((item.total / grand) * 100),
    }));
}

export function seededShapes(seed, count, bounds) {
  const shapes = [];
  let state = seed;
  const random = () => {
    state = (state * 16807) % 2147483647;
    return state / 2147483647;
  };
  const colors = [C.coral, C.blue, C.yellow, C.mint, C.amber, C.purple];
  const types = ["circle", "square", "triangle", "zigzag"];

  for (let index = 0; index < count; index += 1) {
    shapes.push({
      id: index,
      type: types[Math.floor(random() * types.length)],
      color: colors[Math.floor(random() * colors.length)],
      x: bounds.x + random() * bounds.w,
      y: bounds.y + random() * bounds.h,
      size: 6 + random() * 10,
      rotation: random() * 45,
      opacity: 0.08 + random() * 0.12,
    });
  }

  return shapes;
}
