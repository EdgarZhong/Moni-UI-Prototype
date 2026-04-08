import React, { useState, useRef, useCallback, useMemo, useEffect } from "react";

/* ─────────────────── 色彩与常量（与首页 config.js 保持一致） ─────────────────── */
const C = {
  bg: "#F5F0EB", white: "#FFF", dark: "#222",
  coral: "#FF6B6B", blue: "#7EC8E3", yellow: "#F9D56E",
  mint: "#4ECDC4", amber: "#E88B4D",
  muted: "#999", sub: "#888", border: "#DDD", line: "#EEE",
  warmBg: "#FFF8F0", warmBd: "#F0C89A",
  pinkBg: "#FFF0F0", pinkBd: "#FFB8B8",
  greenBg: "#F0F8F0", greenText: "#3B6D11",
  blueBg: "#EBF5FF", orangeBg: "#FFF5EB",
};

const CAT = {
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

const PHONE_W = 390;
const PHONE_H = 860;

/* ─────────────────── Memphis 随机装饰生成器（复用首页逻辑） ─────────────────── */
function seededShapes(seed, count, bounds) {
  const shapes = [];
  let s = seed;
  const rand = () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
  const palette = [C.coral, C.blue, C.yellow, C.mint, C.amber, "#B8A0D2", "#C97B84"];
  const types = ["circle", "square", "triangle", "line"];
  for (let i = 0; i < count; i++) {
    shapes.push({
      id: `s${i}`, type: types[Math.floor(rand() * types.length)],
      x: bounds.x + rand() * bounds.w, y: bounds.y + rand() * bounds.h,
      size: 5 + rand() * 9, color: palette[Math.floor(rand() * palette.length)],
      opacity: 0.12 + rand() * 0.18, rotation: rand() * 60 - 30,
    });
  }
  return shapes;
}

/* ─────────────────── Logo 组件（与首页完全一致） ─────────────────── */
function Logo() {
  return (
    <svg width="118" height="38" viewBox="0 0 140 42">
      <text x="4" y="32" fill={C.dark} fontSize="28" fontWeight="800" fontFamily="'Nunito',sans-serif" letterSpacing="-1">M</text>
      <circle cx="25" cy="32" r="1.8" fill={C.coral} opacity=".75" />
      <text x="30" y="32" fill={C.dark} fontSize="28" fontWeight="800" fontFamily="'Nunito',sans-serif" letterSpacing="-1">oni</text>
      <circle cx="27" cy="9" r="3.6" fill={C.coral} opacity=".72" />
      <circle cx="20" cy="5" r="2.4" fill={C.blue} opacity=".62" />
      <rect x="23" y="2.5" width="4" height="4" rx=".8" fill={C.yellow} opacity=".55" transform="rotate(20 25 4.5)" />
      <line x1="68" y1="7" x2="75" y2="7" stroke={C.mint} strokeWidth="1.8" strokeLinecap="round" opacity=".35" />
    </svg>
  );
}

/* ─────────────────── 导航栏图标组件 ─────────────────── */
function NavIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 52 52">
      <path d="M12 40C12 40 12 16 14.5 12C16 10 17 10.5 23 24C23 24 24 26.5 25 24C26 21.5 29 10.5 30.5 12C32 13.5 33 40 33 40" stroke="#F5F0EB" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="39" cy="13" r="4.4" fill={C.coral} opacity=".88" />
      <circle cx="31" cy="7.2" r="3" fill={C.blue} opacity=".76" />
      <rect x="34" y="5.1" width="4.6" height="4.6" rx="1" fill={C.yellow} opacity=".68" transform="rotate(18 36.4 7.5)" />
    </svg>
  );
}

function GearIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="3.2" stroke="#8E8E8E" strokeWidth="1.6" />
      <path d="M12 2.5v2.2M12 19.3v2.2M4.92 4.92l1.56 1.56M17.52 17.52l1.56 1.56M2.5 12h2.2M19.3 12h2.2M4.92 19.08l1.56-1.56M17.52 6.48l1.56-1.56" stroke="#8E8E8E" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function NoteIcon({ active }) {
  const clr = active ? C.coral : "#8E8E8E";
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="4" y="3" width="16" height="18" rx="3" stroke={clr} strokeWidth="1.6" />
      <path d="M8 8h8M8 12h8M12 16h4" stroke={clr} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M12 9v6M9 12h6" stroke={clr} strokeWidth="1.4" strokeLinecap="round" opacity=".55" />
    </svg>
  );
}

/* ─────────────────── 数据导入卡片内部 SVG 插画 ─────────────────── */
function ImportIllustration() {
  // 一个用 Memphis 几何构建的"文件导入"概念插画
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      {/* 文件底板 */}
      <rect x="16" y="12" width="42" height="52" rx="6" fill={C.white} stroke={C.dark} strokeWidth="2" />
      <rect x="16" y="12" width="42" height="14" rx="6" fill={C.warmBg} stroke={C.dark} strokeWidth="2" />
      {/* 文件内容线条 */}
      <line x1="24" y1="36" x2="50" y2="36" stroke={C.border} strokeWidth="2" strokeLinecap="round" />
      <line x1="24" y1="43" x2="44" y2="43" stroke={C.border} strokeWidth="2" strokeLinecap="round" />
      <line x1="24" y1="50" x2="48" y2="50" stroke={C.border} strokeWidth="2" strokeLinecap="round" />
      {/* 向下箭头 — 暗示"导入" */}
      <circle cx="52" cy="52" r="13" fill={C.mint} opacity=".9" />
      <path d="M52 45v12M47 53l5 5 5-5" stroke={C.white} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Memphis 装饰 */}
      <circle cx="12" cy="22" r="4" fill={C.coral} opacity=".5" />
      <rect x="60" y="8" width="7" height="7" rx="1" fill={C.yellow} opacity=".55" transform="rotate(18 63.5 11.5)" />
      <circle cx="66" cy="38" r="3" fill={C.blue} opacity=".4" />
      {/* 文件折角 */}
      <path d="M46 12L58 12L58 24" fill="none" stroke={C.dark} strokeWidth="1.5" opacity=".2" />
    </svg>
  );
}

/* ─────────────────── 数据导入卡片 ─────────────────── */
function ImportCard({ onImport, onGuide }) {
  // 卡片内部的 Memphis 装饰层
  const decorShapes = useMemo(() => seededShapes(3344, 6, { x: 0, y: 0, w: 358, h: 200 }), []);

  return (
    <div style={{
      margin: "0 16px", background: C.white,
      border: `2px solid ${C.dark}`, borderRadius: 16,
      padding: "20px 18px", position: "relative", overflow: "hidden",
    }}>
      {/* 背景装饰 SVG 层 */}
      <svg style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }} width="100%" height="100%">
        {decorShapes.map(sh => {
          if (sh.type === "circle") return <circle key={sh.id} cx={sh.x} cy={sh.y} r={sh.size / 2} fill={sh.color} opacity={sh.opacity * 0.6} />;
          if (sh.type === "square") return <rect key={sh.id} x={sh.x} y={sh.y} width={sh.size} height={sh.size} rx="1.5" fill={sh.color} opacity={sh.opacity * 0.6} transform={`rotate(${sh.rotation} ${sh.x + sh.size / 2} ${sh.y + sh.size / 2})`} />;
          return null;
        })}
      </svg>

      {/* 卡片主内容 */}
      <div style={{ position: "relative", zIndex: 1 }}>
        {/* 上半部分：插画 + 文案 */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
          <ImportIllustration />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: C.dark, marginBottom: 4, fontFamily: "'Nunito',sans-serif" }}>
              导入你的账单
            </div>
            <div style={{ fontSize: 12, color: C.sub, lineHeight: 1.5 }}>
              从微信或支付宝导出消费记录，Moni 会自动帮你分类整理
            </div>
          </div>
        </div>

        {/* 来源选择按钮 */}
        <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
          {/* 微信按钮 */}
          <div
            onClick={() => onImport("wechat")}
            style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              padding: "12px 14px", borderRadius: 12,
              background: "#F0FFF0", border: "1.5px solid #7BB97B",
              cursor: "pointer", transition: "transform .15s",
            }}
            onPointerDown={e => e.currentTarget.style.transform = "scale(0.97)"}
            onPointerUp={e => e.currentTarget.style.transform = "scale(1)"}
            onPointerLeave={e => e.currentTarget.style.transform = "scale(1)"}
          >
            <svg width="22" height="22" viewBox="0 0 24 24">
              <path d="M8.5 3C4.36 3 1 5.69 1 9c0 1.97 1.15 3.72 2.94 4.83L3.5 16l2.59-1.29C7 15.18 8.01 15.37 8.5 15.37c.27 0 .54-.02.8-.05A5.77 5.77 0 008 13c0-3.31 3.13-6 7-6 .34 0 .67.02 1 .07C15.07 4.56 12.07 3 8.5 3z" fill="#51B749" />
              <path d="M23 13c0-2.76-2.69-5-6-5s-6 2.24-6 5 2.69 5 6 5c.73 0 1.43-.1 2.09-.3L21 19l-.61-2.12C22.03 15.86 23 14.51 23 13z" fill="#0CAE0C" />
            </svg>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#3B7A3B" }}>微信账单</span>
          </div>

          {/* 支付宝按钮 */}
          <div
            onClick={() => onImport("alipay")}
            style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              padding: "12px 14px", borderRadius: 12,
              background: "#F0F5FF", border: "1.5px solid #6B9BD2",
              cursor: "pointer", transition: "transform .15s",
            }}
            onPointerDown={e => e.currentTarget.style.transform = "scale(0.97)"}
            onPointerUp={e => e.currentTarget.style.transform = "scale(1)"}
            onPointerLeave={e => e.currentTarget.style.transform = "scale(1)"}
          >
            <svg width="22" height="22" viewBox="0 0 24 24">
              <rect x="2" y="2" width="20" height="20" rx="4" fill="#1677FF" />
              <path d="M7 12.5c2.5-.8 4.5-2 5.5-3.5M17 16c-1.5-.6-4-2-5.5-3 1.5-1.8 2.2-3.5 2.2-3.5H10.5M12 7v2.5M9 14.5c1 1 3 2 5 2.5" stroke="white" strokeWidth="1.3" strokeLinecap="round" fill="none" />
            </svg>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#2B5EA7" }}>支付宝账单</span>
          </div>
        </div>

        {/* 导入指南入口 */}
        <div
          onClick={onGuide}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            padding: "8px 0", borderRadius: 8,
            background: C.warmBg, cursor: "pointer",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="8.5" stroke={C.amber} strokeWidth="1.5" />
            <path d="M10 9v5M10 6.5v.5" stroke={C.amber} strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <span style={{ fontSize: 12, color: "#8B5E2B", fontWeight: 600 }}>不知道怎么导出账单？查看导入指南</span>
          <span style={{ fontSize: 12, color: "#CBA870" }}>›</span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────── 分类选择蒙版（复用首页 DragOverlay 视觉语言） ─────────────────── */
function CategoryOverlay({ visible, hoverCat, onSelect, onClose, dragPoint, isDragging }) {
  if (!visible) return null;
  return (
    <div style={{
      position: "absolute", inset: 0, background: "rgba(0,0,0,.55)",
      zIndex: 50, display: "flex", flexDirection: "column",
      padding: "16px 16px 100px", animation: "fadeIn .2s ease",
      touchAction: "none",
    }}>
      {/* 顶部标题 */}
      <div style={{
        fontSize: 15, color: C.white, fontWeight: 700,
        textAlign: "center", marginTop: 8, marginBottom: 14,
      }}>
        {isDragging ? "拖入分类中…" : "选择分类"}
      </div>

      {/* 分类网格 */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10,
        padding: "0 4px", overflowY: "auto", flex: 1,
      }}>
        {Object.entries(CAT).map(([cat, meta]) => (
          <div
            key={cat}
            data-drop-category={cat}
            onClick={() => onSelect(cat)}
            style={{
              background: C.white,
              border: `2.5px solid ${hoverCat === cat ? meta.color : C.border}`,
              borderRadius: 14, padding: "14px 6px", textAlign: "center",
              cursor: "pointer",
              transform: hoverCat === cat ? "scale(1.08)" : "scale(1)",
              transition: "all .2s cubic-bezier(.4,0,.2,1)",
              boxShadow: hoverCat === cat ? `0 4px 16px ${meta.color}33` : "none",
            }}
          >
            <div style={{ fontSize: 24, marginBottom: 4 }}>{meta.icons[0]}</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: hoverCat === cat ? meta.color : C.dark }}>{cat}</div>
          </div>
        ))}
      </div>

      {/* 关闭按钮 */}
      <div
        onClick={onClose}
        style={{
          position: "absolute", right: 16, top: 14,
          width: 32, height: 32, borderRadius: "50%",
          background: "rgba(255,255,255,.15)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: C.white, fontSize: 18, cursor: "pointer",
        }}
      >×</div>
    </div>
  );
}

/* ─────────────────── 随手记二级录入面板（底部滑入） ─────────────────── */
function EntryFormPanel({ visible, category, onSave, onClose }) {
  const [amount, setAmount] = useState("");
  const [direction, setDirection] = useState("out"); // 'out' | 'in'
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  });
  const amountRef = useRef(null);

  // 面板出现时聚焦到金额输入
  useEffect(() => {
    if (visible && amountRef.current) {
      setTimeout(() => amountRef.current?.focus(), 300);
    }
  }, [visible]);

  // 重置表单
  useEffect(() => {
    if (visible) {
      setAmount("");
      setSubject("");
      setDescription("");
    }
  }, [visible, category]);

  const meta = category ? CAT[category] : null;
  const canSave = amount && parseFloat(amount) > 0;

  const handleSave = () => {
    if (!canSave) return;
    onSave({
      amount: parseFloat(amount),
      direction,
      category,
      subject: subject.trim() || undefined,
      description: description.trim() || undefined,
      date,
    });
  };

  if (!visible || !category) return null;

  return (
    <div style={{
      position: "absolute", inset: 0, background: "rgba(0,0,0,.4)",
      zIndex: 55, display: "flex", flexDirection: "column", justifyContent: "flex-end",
      animation: "fadeIn .2s ease",
    }} onClick={onClose}>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: C.white, borderRadius: "20px 20px 0 0",
          padding: "20px 20px 24px", border: `2px solid ${C.dark}`,
          borderBottom: "none", animation: "slideUp .3s cubic-bezier(.4,0,.2,1)",
          maxHeight: "75%", overflowY: "auto",
        }}
      >
        {/* 面板拉手条 */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: C.border }} />
        </div>

        {/* 分类标识 */}
        <div style={{
          display: "flex", alignItems: "center", gap: 10, marginBottom: 18,
          padding: "10px 14px", borderRadius: 12,
          background: meta.bg, border: `1.5px solid ${meta.color}22`,
        }}>
          <span style={{ fontSize: 28 }}>{meta.icons[0]}</span>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: meta.color }}>{category}</div>
            <div style={{ fontSize: 11, color: C.sub }}>分类已选定，填写详情</div>
          </div>
        </div>

        {/* 金额输入 — 视觉焦点 */}
        <div style={{
          marginBottom: 16, padding: "16px", borderRadius: 14,
          background: "#FAFAF8", border: `1.5px solid ${C.border}`,
        }}>
          <div style={{ fontSize: 11, color: C.sub, marginBottom: 8, fontWeight: 600 }}>金额 *</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
            <span style={{
              fontSize: 24, fontWeight: 700, color: direction === "out" ? C.coral : C.mint,
              fontFamily: "'Space Mono',monospace",
            }}>
              {direction === "out" ? "−¥" : "+¥"}
            </span>
            <input
              ref={amountRef}
              type="number"
              inputMode="decimal"
              placeholder="0.00"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              style={{
                flex: 1, fontSize: 32, fontWeight: 700, color: C.dark,
                fontFamily: "'Space Mono',monospace",
                border: "none", background: "transparent", outline: "none",
                padding: 0, WebkitAppearance: "none", MozAppearance: "textfield",
              }}
            />
          </div>

          {/* 收支方向切换 */}
          <div style={{ display: "flex", gap: 0, marginTop: 12, borderRadius: 10, overflow: "hidden", border: `1.5px solid ${C.border}` }}>
            {[
              { key: "out", label: "支出", color: C.coral },
              { key: "in", label: "收入", color: C.mint },
            ].map(opt => (
              <div
                key={opt.key}
                onClick={() => setDirection(opt.key)}
                style={{
                  flex: 1, padding: "8px 0", textAlign: "center",
                  fontSize: 13, fontWeight: direction === opt.key ? 700 : 500,
                  background: direction === opt.key ? opt.color : C.white,
                  color: direction === opt.key ? C.white : C.muted,
                  cursor: "pointer", transition: "all .2s",
                }}
              >
                {opt.label}
              </div>
            ))}
          </div>
        </div>

        {/* 可选字段 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
          {/* 主题 */}
          <div>
            <div style={{ fontSize: 11, color: C.sub, marginBottom: 4, fontWeight: 600 }}>
              主题 <span style={{ fontWeight: 400, color: C.muted }}>（选填）</span>
            </div>
            <input
              type="text"
              placeholder="这笔花在哪了？比如「火锅聚餐」"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              style={{
                width: "100%", padding: "10px 12px", borderRadius: 10,
                border: `1.5px solid ${C.border}`, fontSize: 13,
                fontFamily: "inherit", outline: "none", boxSizing: "border-box",
                WebkitUserSelect: "text", userSelect: "text",
              }}
            />
          </div>

          {/* 描述 */}
          <div>
            <div style={{ fontSize: 11, color: C.sub, marginBottom: 4, fontWeight: 600 }}>
              补充说明 <span style={{ fontWeight: 400, color: C.muted }}>（选填）</span>
            </div>
            <input
              type="text"
              placeholder="周年聚餐，比较贵的餐厅"
              value={description}
              onChange={e => setDescription(e.target.value)}
              style={{
                width: "100%", padding: "10px 12px", borderRadius: 10,
                border: `1.5px solid ${C.border}`, fontSize: 13,
                fontFamily: "inherit", outline: "none", boxSizing: "border-box",
                WebkitUserSelect: "text", userSelect: "text",
              }}
            />
          </div>

          {/* 日期 */}
          <div>
            <div style={{ fontSize: 11, color: C.sub, marginBottom: 4, fontWeight: 600 }}>
              日期 <span style={{ fontWeight: 400, color: C.muted }}>（默认今天）</span>
            </div>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              style={{
                width: "100%", padding: "10px 12px", borderRadius: 10,
                border: `1.5px solid ${C.border}`, fontSize: 13,
                fontFamily: "inherit", outline: "none", boxSizing: "border-box",
              }}
            />
          </div>
        </div>

        {/* 保存按钮 */}
        <div
          onClick={handleSave}
          style={{
            padding: "14px 0", borderRadius: 14, textAlign: "center",
            fontSize: 15, fontWeight: 700, cursor: canSave ? "pointer" : "not-allowed",
            background: canSave ? C.dark : "#CCC",
            color: canSave ? C.bg : "#999",
            border: canSave ? `2px solid ${C.dark}` : "2px solid #CCC",
            transition: "all .2s", position: "relative", overflow: "hidden",
          }}
        >
          {/* 品牌装饰点 */}
          {canSave && <>
            <span style={{ position: "absolute", left: 16, top: 8, width: 6, height: 6, borderRadius: "50%", background: C.coral, opacity: .6 }} />
            <span style={{ position: "absolute", left: 26, top: 5, width: 4, height: 4, borderRadius: "50%", background: C.blue, opacity: .5 }} />
            <span style={{ position: "absolute", right: 20, bottom: 8, width: 5, height: 5, borderRadius: 1, background: C.yellow, opacity: .5, transform: "rotate(18deg)" }} />
          </>}
          记一笔
        </div>
      </div>
    </div>
  );
}

/* ─────────────────── 成功提示 Toast ─────────────────── */
function SuccessToast({ data, visible }) {
  if (!visible || !data) return null;
  const meta = CAT[data.category];
  return (
    <div style={{
      position: "absolute", top: 80, left: "50%", transform: "translateX(-50%)",
      zIndex: 60, background: C.white, borderRadius: 14,
      padding: "12px 20px", border: `2px solid ${C.dark}`,
      boxShadow: "0 8px 24px rgba(0,0,0,.15)",
      display: "flex", alignItems: "center", gap: 10,
      animation: "slideDown .3s ease, fadeOut .3s ease 1.2s forwards",
      whiteSpace: "nowrap",
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: 10,
        background: C.mint, display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <span style={{ color: C.white, fontSize: 16, fontWeight: 700 }}>✓</span>
      </div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.dark }}>已记录</div>
        <div style={{ fontSize: 11, color: C.sub }}>
          {data.direction === "out" ? "−" : "+"}¥{data.amount} · {data.category}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────── 底部导航栏（记账激活态） ─────────────────── */
function BottomNav({ onHome }) {
  return (
    <div style={{
      background: C.white, borderTop: `1.5px solid ${C.border}`,
      paddingTop: 3, paddingBottom: "max(env(safe-area-inset-bottom), 8px)",
      display: "flex", justifyContent: "space-around", alignItems: "flex-end",
      flexShrink: 0, zIndex: 20,
    }}>
      <div style={{ textAlign: "center", padding: "4px 16px", cursor: "pointer" }}>
        <GearIcon />
        <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>设置</div>
      </div>
      <div onClick={onHome} style={{ position: "relative", textAlign: "center", cursor: "pointer" }}>
        <div style={{ marginTop: -12 }}>
          <div style={{
            width: 52, height: 52, background: C.dark, borderRadius: 16,
            display: "flex", alignItems: "center", justifyContent: "center",
            transform: "rotate(2deg)",
          }}>
            <NavIcon />
          </div>
          <div style={{ fontSize: 10, fontWeight: 700, marginTop: 3, color: C.dark }}>首页</div>
        </div>
      </div>
      <div style={{ textAlign: "center", padding: "4px 16px", cursor: "pointer" }}>
        <NoteIcon active />
        <div style={{ fontSize: 10, color: C.coral, fontWeight: 700, marginTop: 2 }}>记账</div>
      </div>
    </div>
  );
}

/* ─────────────────── 记一笔按钮（可拖拽触发器） ─────────────────── */
function EntryButton({ onTrigger, pulsing }) {
  return (
    <div style={{
      margin: "0 16px", display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
    }}>
      {/* 操作提示文字 */}
      <div style={{ fontSize: 11, color: C.sub, textAlign: "center" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
            <path d="M8 2v8M5 7l3 3 3-3" stroke={C.sub} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3 12h10" stroke={C.sub} strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          按住拖入分类 · 或直接点击
        </span>
      </div>

      {/* 按钮本体 */}
      <div
        onClick={onTrigger}
        style={{
          width: "100%", padding: "16px 0",
          borderRadius: 16, textAlign: "center",
          background: C.dark, color: C.bg,
          fontSize: 16, fontWeight: 800,
          fontFamily: "'Nunito',sans-serif",
          cursor: "pointer",
          border: `2px solid ${C.dark}`,
          position: "relative", overflow: "hidden",
          boxShadow: "0 4px 16px rgba(34,34,34,.18)",
          transition: "transform .15s, box-shadow .15s",
          touchAction: "none",
          // 长按时将由编码 agent 接管 pointerdown 事件
        }}
        onPointerDown={e => {
          e.currentTarget.style.transform = "scale(0.97)";
          e.currentTarget.style.boxShadow = "0 2px 8px rgba(34,34,34,.12)";
        }}
        onPointerUp={e => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 4px 16px rgba(34,34,34,.18)";
        }}
        onPointerLeave={e => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 4px 16px rgba(34,34,34,.18)";
        }}
      >
        {/* 品牌三色装饰 */}
        <span style={{ position: "absolute", left: 18, top: 10, width: 8, height: 8, borderRadius: "50%", background: C.coral, opacity: .55 }} />
        <span style={{ position: "absolute", left: 30, top: 7, width: 5, height: 5, borderRadius: "50%", background: C.blue, opacity: .45 }} />
        <span style={{ position: "absolute", left: 25, top: 18, width: 5, height: 5, borderRadius: 1, background: C.yellow, opacity: .4, transform: "rotate(20deg)" }} />

        <span style={{ position: "absolute", right: 22, bottom: 10, width: 6, height: 6, borderRadius: "50%", background: C.mint, opacity: .4 }} />
        <span style={{ position: "absolute", right: 34, bottom: 14, width: 4, height: 4, borderRadius: 1, background: C.coral, opacity: .3, transform: "rotate(-15deg)" }} />

        {/* 按钮 emoji + 文案 */}
        <span style={{ position: "relative", zIndex: 1, display: "inline-flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 20 }}>✏️</span>
          记一笔
        </span>
      </div>
    </div>
  );
}

/* ─────────────────── 最近手记条目预览 ─────────────────── */
function RecentEntries({ entries }) {
  if (!entries.length) {
    return (
      <div style={{
        margin: "0 16px", padding: "24px 16px", textAlign: "center",
        borderRadius: 14, border: `1.5px dashed ${C.border}`,
        background: "#FDFCFA",
      }}>
        <div style={{ fontSize: 28, marginBottom: 8 }}>📝</div>
        <div style={{ fontSize: 13, color: C.sub, lineHeight: 1.6 }}>
          还没有手动记录<br />
          <span style={{ fontSize: 12, color: C.muted }}>按下方按钮开始记账</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      margin: "0 16px", background: C.white,
      border: `1.5px solid ${C.border}`, borderRadius: 14,
      padding: "10px 14px",
    }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: C.dark, marginBottom: 8 }}>
        最近记录
      </div>
      {entries.map((entry, i) => {
        const meta = CAT[entry.category];
        return (
          <div key={i} style={{
            display: "flex", alignItems: "center", padding: "8px 0",
            borderBottom: i < entries.length - 1 ? `0.5px solid ${C.line}` : "none",
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 10,
              background: meta.bg, display: "flex",
              alignItems: "center", justifyContent: "center",
              fontSize: 15, marginRight: 10, flexShrink: 0,
            }}>
              {meta.icons[0]}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.dark }}>
                {entry.subject || "随手记"}
              </div>
              <div style={{ fontSize: 10, color: C.muted, display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{
                  padding: "0 5px", borderRadius: 999,
                  background: meta.bg, color: meta.color,
                  fontSize: 9, fontWeight: 600,
                }}>{entry.category}</span>
                <span>· 手动记录</span>
              </div>
            </div>
            <div style={{
              fontSize: 14, fontWeight: 600, flexShrink: 0,
              color: entry.direction === "out" ? C.coral : C.mint,
              fontFamily: "'Space Mono',monospace",
            }}>
              {entry.direction === "out" ? "−" : "+"}¥{entry.amount}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   主页面组件 — Moni 记账页
   ═══════════════════════════════════════════════════════════════ */
export default function MoniEntryPage() {
  // ── 页面状态 ──
  const [phase, setPhase] = useState("idle"); // 'idle' | 'selecting' | 'form'
  const [selectedCat, setSelectedCat] = useState(null);
  const [hoverCat, setHoverCat] = useState(null);
  const [recentEntries, setRecentEntries] = useState([]);
  const [toast, setToast] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [guideToast, setGuideToast] = useState(false);

  // ── 装饰层 ──
  const bgShapes = useMemo(() => seededShapes(9527, 7, { x: 0, y: 60, w: PHONE_W, h: PHONE_H - 120 }), []);

  // ── 打开分类选择蒙版 ──
  const handleTriggerEntry = useCallback(() => {
    setPhase("selecting");
    setHoverCat(null);
  }, []);

  // ── 选择分类 → 进入表单 ──
  const handleSelectCategory = useCallback((cat) => {
    setSelectedCat(cat);
    setPhase("form");
  }, []);

  // ── 关闭蒙版/表单 ──
  const handleCloseOverlay = useCallback(() => {
    setPhase("idle");
    setSelectedCat(null);
    setHoverCat(null);
  }, []);

  // ── 保存条目 ──
  const handleSave = useCallback((data) => {
    // 添加到最近记录
    setRecentEntries(prev => [data, ...prev].slice(0, 5));
    // 显示 toast
    setToast(data);
    setShowToast(true);
    // 关闭表单
    setPhase("idle");
    setSelectedCat(null);
    // 1.5 秒后隐藏 toast
    setTimeout(() => setShowToast(false), 1500);
  }, []);

  // ── 导入操作（原型阶段只展示 toast） ──
  const handleImport = useCallback((source) => {
    setGuideToast(true);
    setTimeout(() => setGuideToast(false), 2000);
  }, []);

  const handleGuide = useCallback(() => {
    setGuideToast(true);
    setTimeout(() => setGuideToast(false), 2000);
  }, []);

  return (
    <div style={{
      width: PHONE_W, minHeight: PHONE_H, maxHeight: PHONE_H,
      background: C.bg, borderRadius: 32, overflow: "hidden",
      position: "relative", display: "flex", flexDirection: "column",
      fontFamily: "-apple-system, 'Helvetica Neue', sans-serif",
      boxShadow: "0 8px 40px rgba(0,0,0,.12), 0 2px 8px rgba(0,0,0,.06)",
    }}>
      {/* 全局动画样式 */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800&family=Space+Mono:wght@400;700&display=swap');
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { transform: translateY(100%) } to { transform: translateY(0) } }
        @keyframes slideDown { from { transform: translateY(-20px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
        @keyframes fadeOut { from { opacity: 1 } to { opacity: 0 } }
        @keyframes pulse { 0%,100% { transform: scale(1) } 50% { transform: scale(1.03) } }
        @keyframes float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-4px) } }
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
      `}</style>

      {/* ── 背景 Memphis 装饰层 ── */}
      <svg style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "visible" }} width="100%" height="100%">
        {bgShapes.map(sh => {
          if (sh.type === "circle") return <circle key={sh.id} cx={sh.x} cy={sh.y} r={sh.size / 2} fill={sh.color} opacity={sh.opacity} />;
          if (sh.type === "square") return <rect key={sh.id} x={sh.x} y={sh.y} width={sh.size} height={sh.size} rx="1.5" fill={sh.color} opacity={sh.opacity} transform={`rotate(${sh.rotation} ${sh.x + sh.size / 2} ${sh.y + sh.size / 2})`} />;
          if (sh.type === "triangle") return <polygon key={sh.id} points={`${sh.x},${sh.y + sh.size} ${sh.x + sh.size / 2},${sh.y} ${sh.x + sh.size},${sh.y + sh.size}`} fill={sh.color} opacity={sh.opacity} />;
          return <line key={sh.id} x1={sh.x} y1={sh.y} x2={sh.x + sh.size * 1.6} y2={sh.y} stroke={sh.color} strokeWidth="2" strokeLinecap="round" opacity={sh.opacity} />;
        })}
      </svg>

      {/* ── Header（粘性） ── */}
      <div style={{
        position: "sticky", top: 0, zIndex: 10,
        background: C.bg, padding: "14px 16px 8px",
        borderBottom: `1px solid ${C.border}22`,
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Logo />
          <div style={{
            fontSize: 14, fontWeight: 700, color: C.dark,
            padding: "4px 12px", borderRadius: 8,
            background: C.white, border: `1.5px solid ${C.border}`,
          }}>
            日常开销 ▾
          </div>
        </div>
      </div>

      {/* ── 可滚动内容区 ── */}
      <div style={{ flex: 1, overflowY: "auto", position: "relative", zIndex: 1 }}>
        {/* 页面标题区域 */}
        <div style={{ padding: "12px 16px 6px" }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: C.dark, fontFamily: "'Nunito',sans-serif" }}>
            记账
          </div>
          <div style={{ fontSize: 12, color: C.sub, marginTop: 2 }}>
            导入账单或随手记录一笔
          </div>
        </div>

        {/* ── 数据导入卡片 ── */}
        <div style={{ padding: "8px 0" }}>
          <ImportCard onImport={handleImport} onGuide={handleGuide} />
        </div>

        {/* ── 分隔：随手记区域 ── */}
        <div style={{ padding: "16px 16px 8px", display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: C.dark, fontFamily: "'Nunito',sans-serif" }}>
            随手记
          </div>
          <div style={{ flex: 1, height: 1.5, background: C.border, borderRadius: 1 }} />
          <div style={{
            fontSize: 10, color: C.muted, padding: "2px 8px",
            borderRadius: 999, background: C.white, border: `1px solid ${C.border}`,
          }}>
            现金 · 补漏
          </div>
        </div>

        {/* 最近手记条目 */}
        <div style={{ padding: "0 0 12px" }}>
          <RecentEntries entries={recentEntries} />
        </div>

        {/* 记一笔按钮 */}
        <div style={{ padding: "4px 0 20px" }}>
          <EntryButton onTrigger={handleTriggerEntry} />
        </div>
      </div>

      {/* ── 底部导航栏 ── */}
      <BottomNav onHome={() => {}} />

      {/* ── 分类选择蒙版 ── */}
      <CategoryOverlay
        visible={phase === "selecting"}
        hoverCat={hoverCat}
        onSelect={handleSelectCategory}
        onClose={handleCloseOverlay}
      />

      {/* ── 二级录入面板 ── */}
      <EntryFormPanel
        visible={phase === "form"}
        category={selectedCat}
        onSave={handleSave}
        onClose={handleCloseOverlay}
      />

      {/* ── 成功 Toast ── */}
      <SuccessToast data={toast} visible={showToast} />

      {/* ── 导入操作提示 Toast（原型态） ── */}
      {guideToast && (
        <div style={{
          position: "absolute", top: 80, left: "50%", transform: "translateX(-50%)",
          zIndex: 60, background: C.dark, borderRadius: 12,
          padding: "10px 20px", color: C.bg, fontSize: 13, fontWeight: 600,
          boxShadow: "0 4px 16px rgba(0,0,0,.2)",
          animation: "slideDown .3s ease",
          whiteSpace: "nowrap",
        }}>
          📱 原型演示 · 实际导入流程由编码 agent 实现
        </div>
      )}
    </div>
  );
}
