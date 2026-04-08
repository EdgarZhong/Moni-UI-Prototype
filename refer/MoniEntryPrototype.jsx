import { useState, useRef, useEffect, useMemo, useCallback } from "react";

/* ─── 色彩系统（与首页共享） ─── */
const C = {
  bg: "#F5F0EB", white: "#FFF", dark: "#222",
  coral: "#FF6B6B", blue: "#7EC8E3", yellow: "#F9D56E",
  mint: "#4ECDC4", amber: "#E88B4D",
  muted: "#999", sub: "#888", border: "#DDD", line: "#EEE",
  warmBg: "#FFF8F0", warmBd: "#F0C89A",
  pinkBg: "#FFF0F0", pinkBd: "#FFB8B8",
  greenBg: "#F0F8F0", greenText: "#3B6D11",
  blueBg: "#EBF5FF", orangeBg: "#FFF5EB",
  purple: "#B8A0D2", burgundy: "#C97B84", gray: "#C5C5C5",
};

/* ─── 分类数据（与首页一致） ─── */
const CAT = {
  正餐: { color: "#D85A30", bg: C.pinkBg, icons: ["🍜","🍱","🍚","🥡"] },
  零食: { color: "#854F0B", bg: "#FFF8EB", icons: ["☕","🧋","🍪","🍦"] },
  交通: { color: "#185FA5", bg: C.blueBg, icons: ["🚇","🚕","⛽","🚌"] },
  娱乐: { color: "#7B2D8B", bg: "#F6EEFA", icons: ["🎬","🎮","🎵","🎭"] },
  大餐: { color: "#8B2252", bg: "#FFF0F5", icons: ["🍷","🥘","🦞","🍣"] },
  健康: { color: "#1A7A4C", bg: "#EEFAF3", icons: ["💊","🏥","💪","🧘"] },
  购物: { color: "#534AB7", bg: "#F3EAFA", icons: ["🛍️","📦","👕","🎁"] },
  教育: { color: "#2D6A9F", bg: "#EDF5FC", icons: ["📚","🎓","✏️","💻"] },
  居住: { color: "#6B5B3E", bg: "#FBF6EE", icons: ["🏠","💡","🔧","🚿"] },
  旅行: { color: "#0E7C6B", bg: "#E8FAF5", icons: ["✈️","🏨","🎫","🗺️"] },
  其他: { color: "#666", bg: "#F5F5F5", icons: ["📝","💰","🔖","📌"] },
};
const CATS = Object.keys(CAT);

/* ─── Memphis 印花生成器 ─── */
function seededShapes(seed, count, bounds) {
  const shapes = [];
  let s = seed;
  const rand = () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
  const colors = [C.coral, C.blue, C.yellow, C.mint, C.amber, C.purple];
  const types = ["circle","square","triangle","line"];
  for (let i = 0; i < count; i++) {
    shapes.push({
      id: i, type: types[Math.floor(rand()*4)],
      x: bounds.x + rand()*bounds.w, y: bounds.y + rand()*bounds.h,
      size: 5 + rand()*9, color: colors[Math.floor(rand()*colors.length)],
      opacity: 0.10 + rand()*0.14, rotation: rand()*360,
    });
  }
  return shapes;
}

/* ─── Logo（与首页共享） ─── */
function Logo() {
  return (
    <svg width="100" height="34" viewBox="0 0 140 42">
      <text x="4" y="32" fill={C.dark} fontSize="28" fontWeight="800" fontFamily="'Nunito',sans-serif" letterSpacing="-1">M</text>
      <circle cx="25" cy="32" r="1.8" fill={C.coral} opacity=".75" />
      <text x="30" y="32" fill={C.dark} fontSize="28" fontWeight="800" fontFamily="'Nunito',sans-serif" letterSpacing="-1">oni</text>
      <circle cx="27" cy="9" r="3.6" fill={C.coral} opacity=".72" />
      <circle cx="20" cy="5" r="2.4" fill={C.blue} opacity=".62" />
      <rect x="23" y="2.5" width="4" height="4" rx=".8" fill={C.yellow} opacity=".55" transform="rotate(20 25 4.5)" />
    </svg>
  );
}

/* ─── 底部导航栏图标 ─── */
function NavIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 52 52">
      <path d="M12 40C12 40 12 16 14.5 12C16 10 17 10.5 23 24C23 24 24 26.5 25 24C26 21.5 29 10.5 30.5 12C32 13.5 33 40 33 40" stroke="#F5F0EB" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="39" cy="13" r="4.4" fill={C.coral} opacity=".88"/>
      <circle cx="31" cy="7.2" r="3" fill={C.blue} opacity=".76"/>
      <rect x="34" y="5.1" width="4.6" height="4.6" rx="1" fill={C.yellow} opacity=".68" transform="rotate(18 36.4 7.5)"/>
    </svg>
  );
}
function GearIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="3.2" stroke="#8E8E8E" strokeWidth="1.6"/>
      <path d="M12 2.5v2.2M12 19.3v2.2M4.92 4.92l1.56 1.56M17.52 17.52l1.56 1.56M2.5 12h2.2M19.3 12h2.2M4.92 19.08l1.56-1.56M17.52 6.48l1.56-1.56" stroke="#8E8E8E" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  );
}
function NoteIcon({ active }) {
  const color = active ? C.dark : "#8E8E8E";
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="4" y="3" width="16" height="18" rx="3" stroke={color} strokeWidth={active ? 2 : 1.6} />
      <path d="M8 8h8M8 12h8M12 16h4" stroke={color} strokeWidth={active ? 2 : 1.6} strokeLinecap="round"/>
      {active && <path d="M12 9v6M9 12h6" stroke={color} strokeWidth="1.4" strokeLinecap="round" opacity=".55"/>}
    </svg>
  );
}

/* ─── 铅笔图标（拖拽悬浮块内使用） ─── */
function PencilIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" stroke={C.bg} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14 6l3 3" stroke={C.bg} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

/* ─── 数据导入卡片 ─── */
function ImportCard() {
  const deco = useMemo(() => seededShapes(42, 5, { x: 0, y: 0, w: 358, h: 110 }), []);
  return (
    <div style={{
      margin: "0 16px", borderRadius: 14, border: `2px solid ${C.dark}`,
      background: C.white, overflow: "hidden", position: "relative",
    }}>
      {/* Memphis 装饰印花 */}
      <svg style={{ position:"absolute", inset:0, pointerEvents:"none", overflow:"visible" }} width="100%" height="100%">
        {deco.map(s => {
          if (s.type==="circle") return <circle key={s.id} cx={s.x} cy={s.y} r={s.size/2} fill={s.color} opacity={s.opacity}/>;
          if (s.type==="square") return <rect key={s.id} x={s.x} y={s.y} width={s.size} height={s.size} rx="1.5" fill={s.color} opacity={s.opacity} transform={`rotate(${s.rotation} ${s.x+s.size/2} ${s.y+s.size/2})`}/>;
          if (s.type==="triangle") return <polygon key={s.id} points={`${s.x},${s.y+s.size} ${s.x+s.size/2},${s.y} ${s.x+s.size},${s.y+s.size}`} fill={s.color} opacity={s.opacity}/>;
          return <line key={s.id} x1={s.x} y1={s.y} x2={s.x+s.size*1.6} y2={s.y} stroke={s.color} strokeWidth="2" strokeLinecap="round" opacity={s.opacity}/>;
        })}
      </svg>

      <div style={{ position:"relative", padding: "18px 16px", display:"flex", alignItems:"center", gap: 14 }}>
        {/* 左侧：图标区 */}
        <div style={{
          width: 56, height: 56, borderRadius: 14,
          background: `linear-gradient(135deg, ${C.mint}18, ${C.blue}18)`,
          border: `1.5px solid ${C.mint}40`,
          display:"flex", alignItems:"center", justifyContent:"center", flexShrink: 0,
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="4" width="18" height="16" rx="3" stroke={C.mint} strokeWidth="1.8"/>
            <path d="M7 9h10M7 13h6" stroke={C.mint} strokeWidth="1.8" strokeLinecap="round"/>
            <circle cx="17" cy="16" r="4" fill={C.white} stroke={C.mint} strokeWidth="1.5"/>
            <path d="M17 14v4M15 16h4" stroke={C.mint} strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>

        {/* 中间：文字区 */}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.dark, marginBottom: 3 }}>
            导入账单数据
          </div>
          <div style={{ fontSize: 11, color: C.sub, lineHeight: 1.5 }}>
            从微信或支付宝导出账单，让 AI 帮你自动整理
          </div>
        </div>

        {/* 右侧：操作按钮 */}
        <div style={{
          padding: "8px 14px", borderRadius: 10,
          background: C.dark, color: C.bg,
          fontSize: 12, fontWeight: 700, cursor: "pointer", flexShrink: 0,
          display:"flex", alignItems:"center", gap: 4,
        }}>
          导入
        </div>
      </div>

      {/* 教程入口 */}
      <div style={{
        borderTop: `1px solid ${C.line}`, padding: "9px 16px",
        display:"flex", alignItems:"center", justifyContent:"center", gap: 5,
        cursor: "pointer",
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke={C.mint} strokeWidth="1.5"/>
          <path d="M12 8v1M12 12v4" stroke={C.mint} strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
        <span style={{ fontSize: 11, color: C.mint, fontWeight: 600 }}>
          不知道怎么导出？查看图文教程
        </span>
      </div>
    </div>
  );
}

/* ─── 拖拽蒙版层（分类投放网格） ─── */
function DragOverlay({ dragPoint, hoverCat, onHover, onLeave }) {
  return (
    <div style={{
      position:"absolute", inset:0, background:"rgba(0,0,0,.55)",
      zIndex: 50, display:"flex", flexDirection:"column", padding: 16,
      touchAction:"none",
    }}>
      <div style={{ fontSize: 14, color: C.white, fontWeight: 700, textAlign:"center", marginTop: 12, marginBottom: 10 }}>
        拖放到分类中，开始记一笔
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap: 8, padding:"0 4px", overflowY:"auto" }}>
        {CATS.map(cat => {
          const m = CAT[cat];
          const isHover = hoverCat === cat;
          return (
            <div key={cat}
              data-drop-category={cat}
              onPointerEnter={() => onHover(cat)}
              onPointerLeave={onLeave}
              style={{
                background: C.white,
                border: `2.5px solid ${isHover ? m.color : C.border}`,
                borderRadius: 12, padding:"12px 8px", textAlign:"center",
                cursor:"pointer",
                transform: isHover ? "scale(1.05)" : "scale(1)",
                transition: "all .2s",
              }}
            >
              <div style={{ fontSize: 20, marginBottom: 2 }}>{m.icons[0]}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: m.color }}>{cat}</div>
            </div>
          );
        })}
      </div>

      {/* 悬浮拖拽块 — 铅笔 token */}
      {dragPoint && (
        <div style={{
          position: "fixed",
          left: dragPoint.x, top: dragPoint.y,
          transform: "translate(-50%, -115%)",
          width: 48, height: 40, borderRadius: 12,
          background: C.dark,
          display:"flex", alignItems:"center", justifyContent:"center", gap: 3,
          boxShadow: "0 6px 24px rgba(0,0,0,.3)",
          pointerEvents: "none",
        }}>
          <PencilIcon />
          {/* 品牌三色装饰 */}
          <div style={{ position:"absolute", top: -4, right: -4 }}>
            <svg width="16" height="14" viewBox="0 0 16 14">
              <circle cx="10" cy="5" r="3.2" fill={C.coral} opacity=".85"/>
              <circle cx="5" cy="3" r="2.2" fill={C.blue} opacity=".7"/>
              <rect x="8" y="1" width="3" height="3" rx=".6" fill={C.yellow} opacity=".6" transform="rotate(18 9.5 2.5)"/>
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── 二级面板（投放后弹出） ─── */
function EntryPanel({ category, onClose, onSave }) {
  const meta = CAT[category];
  const [amount, setAmount] = useState("");
  const [direction, setDirection] = useState("out");
  const [subject, setSubject] = useState("");
  const [desc, setDesc] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (!amount || parseFloat(amount) <= 0) return;
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onSave({ amount: parseFloat(amount), direction, category, subject, desc });
    }, 1200);
  };

  if (saved) {
    return (
      <div style={{
        position:"absolute", inset:0, background:"rgba(0,0,0,.45)",
        zIndex: 60, display:"flex", alignItems:"center", justifyContent:"center",
      }}>
        <div style={{
          background: C.white, borderRadius: 20, padding: "32px 40px",
          textAlign:"center", border: `2px solid ${C.dark}`,
          animation: "popIn .3s cubic-bezier(.34,1.56,.64,1)",
        }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>✓</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: C.dark }}>已记录</div>
          <div style={{
            fontSize: 22, fontWeight: 700, color: direction === "out" ? C.coral : C.mint,
            fontFamily: "'Space Mono',monospace", marginTop: 4,
          }}>
            {direction === "out" ? "−" : "+"}¥{parseFloat(amount).toFixed(2)}
          </div>
          <div style={{ fontSize: 12, color: C.sub, marginTop: 4 }}>
            {meta.icons[0]} {category}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      position:"absolute", inset:0, background:"rgba(0,0,0,.45)",
      zIndex: 60, display:"flex", alignItems:"center", justifyContent:"center", padding: 20,
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: C.white, borderRadius: 18, padding: "20px 20px 16px", width:"100%", maxWidth: 340,
        border: `2px solid ${C.dark}`,
        animation: "popIn .3s cubic-bezier(.34,1.56,.64,1)",
      }}>
        {/* 已选分类标示 */}
        <div style={{ display:"flex", alignItems:"center", gap: 10, marginBottom: 16 }}>
          <div style={{
            width: 42, height: 42, borderRadius: 12, background: meta.bg,
            display:"flex", alignItems:"center", justifyContent:"center", fontSize: 20,
            border: `1.5px solid ${meta.color}30`,
          }}>
            {meta.icons[0]}
          </div>
          <div>
            <div style={{ fontSize: 10, color: C.sub }}>记录到</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: meta.color }}>{category}</div>
          </div>
          <div style={{ marginLeft:"auto" }}>
            {/* 收支切换 */}
            <div style={{
              display:"flex", borderRadius: 999, overflow:"hidden",
              border: `1.5px solid ${C.border}`,
            }}>
              {[
                { key: "out", label: "支出", c: C.coral },
                { key: "in", label: "收入", c: C.mint },
              ].map(d => (
                <div key={d.key} onClick={() => setDirection(d.key)} style={{
                  padding: "5px 14px", fontSize: 11, fontWeight: 700, cursor: "pointer",
                  background: direction === d.key ? d.c : C.white,
                  color: direction === d.key ? C.white : C.muted,
                  transition: "all .2s",
                }}>
                  {d.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 金额输入 — Hero */}
        <div style={{
          background: "#FAFAF8", borderRadius: 14, padding: "14px 16px",
          border: `1.5px solid ${C.border}`, marginBottom: 12,
        }}>
          <div style={{ fontSize: 10, color: C.sub, marginBottom: 6 }}>金额</div>
          <div style={{ display:"flex", alignItems:"baseline", gap: 4 }}>
            <span style={{
              fontSize: 13, fontWeight: 700, color: C.dark,
              fontFamily: "'Space Mono',monospace",
            }}>¥</span>
            <input
              type="number" inputMode="decimal" placeholder="0.00"
              value={amount} onChange={e => setAmount(e.target.value)}
              autoFocus
              style={{
                fontSize: 32, fontWeight: 700, color: C.dark,
                fontFamily: "'Space Mono',monospace",
                border: "none", background: "transparent", outline: "none",
                width: "100%", padding: 0,
              }}
            />
          </div>
        </div>

        {/* 可选字段 */}
        <div style={{ display:"flex", flexDirection:"column", gap: 8, marginBottom: 16 }}>
          <input
            placeholder="这笔花在哪了？（选填）"
            value={subject} onChange={e => setSubject(e.target.value)}
            style={{
              padding: "10px 12px", borderRadius: 10, fontSize: 13,
              border: `1.5px solid ${C.border}`, outline: "none",
              fontFamily: "inherit", color: C.dark,
            }}
          />
          <input
            placeholder="补充说明（选填）"
            value={desc} onChange={e => setDesc(e.target.value)}
            style={{
              padding: "10px 12px", borderRadius: 10, fontSize: 13,
              border: `1.5px solid ${C.border}`, outline: "none",
              fontFamily: "inherit", color: C.dark,
            }}
          />
          <div style={{
            padding: "10px 12px", borderRadius: 10, fontSize: 13,
            border: `1.5px solid ${C.border}`, color: C.sub,
            display:"flex", alignItems:"center", justifyContent:"space-between",
          }}>
            <span>日期</span>
            <span style={{ color: C.dark, fontWeight: 600 }}>今天 {new Date().getHours().toString().padStart(2,"0")}:{new Date().getMinutes().toString().padStart(2,"0")}</span>
          </div>
        </div>

        {/* 保存按钮 */}
        <div onClick={handleSave} style={{
          padding: "13px 0", borderRadius: 12, textAlign: "center",
          background: (amount && parseFloat(amount) > 0) ? C.dark : "#CCC",
          color: C.bg, fontSize: 15, fontWeight: 700, cursor: "pointer",
          transition: "background .2s",
        }}>
          保存
        </div>
      </div>
    </div>
  );
}

/* ─── 记一笔按钮 ─── */
function EntryButton({ isDragging, onPointerDown }) {
  return (
    <div style={{
      display:"flex", justifyContent:"center", padding: "0 16px 12px",
    }}>
      <div
        onPointerDown={onPointerDown}
        style={{
          display:"flex", alignItems:"center", justifyContent:"center", gap: 6,
          padding: isDragging ? "0" : "12px 36px",
          width: isDragging ? 48 : "auto",
          height: isDragging ? 40 : "auto",
          borderRadius: isDragging ? 12 : 14,
          background: C.dark, color: C.bg,
          fontSize: 14, fontWeight: 700, cursor: "grab",
          border: `2px solid ${C.dark}`,
          transition: "all .25s cubic-bezier(.34,1.56,.64,1)",
          userSelect: "none", touchAction: "none",
          position: "relative",
          boxShadow: isDragging ? "0 4px 16px rgba(0,0,0,.2)" : "none",
        }}
      >
        {!isDragging && (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" stroke={C.bg} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            记一笔
          </>
        )}
        {isDragging && <PencilIcon />}
        {/* 品牌三色装饰 */}
        <div style={{ position:"absolute", top: -5, right: isDragging ? -5 : -8 }}>
          <svg width="18" height="16" viewBox="0 0 18 16">
            <circle cx="12" cy="6" r="3.5" fill={C.coral} opacity=".8"/>
            <circle cx="6" cy="3.5" r="2.4" fill={C.blue} opacity=".65"/>
            <rect x="9" y="1" width="3.5" height="3.5" rx=".7" fill={C.yellow} opacity=".55" transform="rotate(18 10.75 2.75)"/>
          </svg>
        </div>
      </div>
    </div>
  );
}

/* ─── 背景装饰 ─── */
function Decor() {
  const shapes = useMemo(() => seededShapes(333, 7, { x: 0, y: 40, w: 390, h: 750 }), []);
  return (
    <svg style={{ position:"absolute", inset:0, pointerEvents:"none", zIndex:0, overflow:"visible" }} width="100%" height="100%">
      {shapes.map(s => {
        if (s.type==="circle") return <circle key={s.id} cx={s.x} cy={s.y} r={s.size/2} fill={s.color} opacity={s.opacity}/>;
        if (s.type==="square") return <rect key={s.id} x={s.x} y={s.y} width={s.size} height={s.size} rx="1.5" fill={s.color} opacity={s.opacity} transform={`rotate(${s.rotation} ${s.x+s.size/2} ${s.y+s.size/2})`}/>;
        if (s.type==="triangle") return <polygon key={s.id} points={`${s.x},${s.y+s.size} ${s.x+s.size/2},${s.y} ${s.x+s.size},${s.y+s.size}`} fill={s.color} opacity={s.opacity}/>;
        return <line key={s.id} x1={s.x} y1={s.y} x2={s.x+s.size*1.6} y2={s.y} stroke={s.color} strokeWidth="2" strokeLinecap="round" opacity={s.opacity}/>;
      })}
    </svg>
  );
}

/* ════════════════════════════════════════════════════════════
   主页面组件
   ════════════════════════════════════════════════════════════ */
export default function MoniEntryPrototype() {
  const [phase, setPhase] = useState("idle");
  // idle → dragging → dropped(category) → idle
  const [dragPoint, setDragPoint] = useState(null);
  const [hoverCat, setHoverCat] = useState(null);
  const [droppedCat, setDroppedCat] = useState(null);
  const [successCount, setSuccessCount] = useState(0);
  const containerRef = useRef(null);
  const longPressTimer = useRef(null);
  const isPointerDown = useRef(false);

  /* ─── 长按启动拖拽 ─── */
  const handlePointerDown = useCallback((e) => {
    isPointerDown.current = true;
    const startY = e.clientY;
    const startX = e.clientX;
    longPressTimer.current = setTimeout(() => {
      if (isPointerDown.current) {
        setPhase("dragging");
        setDragPoint({ x: startX, y: startY });
      }
    }, 400);
  }, []);

  /* ─── 全局指针监听 ─── */
  useEffect(() => {
    const handleMove = (e) => {
      if (phase !== "dragging") return;
      setDragPoint({ x: e.clientX, y: e.clientY });
      // 命中检测
      const el = document.elementFromPoint(e.clientX, e.clientY);
      if (el) {
        const cat = el.getAttribute("data-drop-category") || el.closest?.("[data-drop-category]")?.getAttribute("data-drop-category");
        if (cat) { setHoverCat(cat); return; }
      }
      setHoverCat(null);
    };
    const handleUp = () => {
      isPointerDown.current = false;
      clearTimeout(longPressTimer.current);
      if (phase === "dragging") {
        if (hoverCat) {
          setDroppedCat(hoverCat);
          setPhase("dropped");
        } else {
          setPhase("idle");
        }
        setDragPoint(null);
        setHoverCat(null);
      }
    };
    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
    window.addEventListener("pointercancel", handleUp);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
      window.removeEventListener("pointercancel", handleUp);
    };
  }, [phase, hoverCat]);

  const handlePanelClose = () => { setPhase("idle"); setDroppedCat(null); };
  const handleSave = (data) => {
    setSuccessCount(c => c + 1);
    setPhase("idle");
    setDroppedCat(null);
  };

  return (
    <div style={{
      width: 390, minHeight: 860, maxHeight: 860,
      background: C.bg, borderRadius: 32,
      boxShadow: "0 8px 40px rgba(0,0,0,.12)",
      position: "relative", overflow: "hidden",
      fontFamily: "-apple-system,'Helvetica Neue','PingFang SC',sans-serif",
      display: "flex", flexDirection: "column",
    }} ref={containerRef}>
      <Decor />

      {/* ─── Header ─── */}
      <div style={{
        position:"sticky", top:0, zIndex:10, background: C.bg,
        padding: "14px 16px 8px", display:"flex", justifyContent:"space-between", alignItems:"center",
      }}>
        <Logo />
        <div style={{
          padding: "4px 12px", borderRadius: 8,
          border: `1.5px solid ${C.border}`, fontSize: 12, color: C.sub,
          background: C.white,
        }}>
          日常开销 ▾
        </div>
      </div>

      {/* ─── 可滚动主体 ─── */}
      <div style={{ flex:1, overflowY:"auto", position:"relative", zIndex:1 }}>
        {/* 页面标题 */}
        <div style={{ padding: "8px 16px 14px" }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: C.dark, letterSpacing: -0.5 }}>
            记账
          </div>
          <div style={{ fontSize: 12, color: C.sub, marginTop: 2 }}>
            导入账单或快速记一笔
          </div>
        </div>

        {/* ─── 数据导入卡 ─── */}
        <ImportCard />

        {/* ─── 随手记引导区 ─── */}
        <div style={{ padding: "24px 16px 12px" }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.dark, marginBottom: 6 }}>
            随手记
          </div>
          <div style={{ fontSize: 12, color: C.sub, lineHeight: 1.6 }}>
            长按下方按钮，拖到想记录的分类里，即可快速记一笔
          </div>
        </div>

        {/* ─── 随手记区域：分类预览 ─── */}
        <div style={{ padding: "0 16px 8px" }}>
          <div style={{
            display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap: 8,
          }}>
            {CATS.slice(0, 8).map(cat => {
              const m = CAT[cat];
              return (
                <div key={cat} style={{
                  background: C.white, borderRadius: 10, padding: "10px 4px",
                  border: `1.5px solid ${C.border}`, textAlign:"center",
                  opacity: 0.6,
                }}>
                  <div style={{ fontSize: 18 }}>{m.icons[0]}</div>
                  <div style={{ fontSize: 9, color: C.sub, marginTop: 2 }}>{cat}</div>
                </div>
              );
            })}
          </div>
          <div style={{
            fontSize: 10, color: C.muted, textAlign:"center", marginTop: 8, fontStyle:"italic",
          }}>
            ↑ 长按「记一笔」后出现完整分类面板
          </div>
        </div>

        {/* ─── 记录历史提示 ─── */}
        {successCount > 0 && (
          <div style={{
            margin: "12px 16px", padding: "10px 14px", borderRadius: 10,
            background: C.greenBg, border: `1.5px solid ${C.mint}30`,
            display:"flex", alignItems:"center", gap: 8,
          }}>
            <span style={{ fontSize: 14 }}>📝</span>
            <span style={{ fontSize: 12, color: C.greenText, fontWeight: 600 }}>
              本次已记录 {successCount} 笔
            </span>
          </div>
        )}

        {/* 底部留白 */}
        <div style={{ height: 120 }} />
      </div>

      {/* ─── 记一笔按钮（浮动在底部导航上方） ─── */}
      {phase === "idle" && (
        <div style={{ position:"relative", zIndex: 5 }}>
          <EntryButton isDragging={false} onPointerDown={handlePointerDown} />
        </div>
      )}

      {/* ─── 底部导航 ─── */}
      <div style={{
        background: C.white, borderTop: `1.5px solid ${C.border}`,
        paddingTop: 3, paddingBottom: "max(env(safe-area-inset-bottom), 8px)",
        display:"flex", justifyContent:"space-around", alignItems:"flex-end",
        flexShrink: 0, zIndex: 20,
      }}>
        <div style={{ textAlign:"center", padding:"4px 16px", cursor:"pointer" }}>
          <GearIcon />
          <div style={{ fontSize:10, color: C.muted, marginTop: 2 }}>设置</div>
        </div>
        <div style={{ position:"relative", textAlign:"center", cursor:"pointer" }}>
          <div style={{ marginTop: -12 }}>
            <div style={{
              width:52, height:52, background: C.dark, borderRadius:16,
              display:"flex", alignItems:"center", justifyContent:"center",
              transform:"rotate(2deg)",
            }}>
              <NavIcon />
            </div>
            <div style={{ fontSize:10, fontWeight:700, marginTop:3, color: C.dark }}>首页</div>
          </div>
        </div>
        <div style={{ textAlign:"center", padding:"4px 16px", cursor:"pointer" }}>
          <NoteIcon active />
          <div style={{ fontSize:10, color: C.dark, fontWeight: 700, marginTop: 2 }}>记账</div>
        </div>
      </div>

      {/* ─── 拖拽蒙版 ─── */}
      {phase === "dragging" && (
        <DragOverlay
          dragPoint={dragPoint}
          hoverCat={hoverCat}
          onHover={setHoverCat}
          onLeave={() => setHoverCat(null)}
        />
      )}

      {/* ─── 二级录入面板 ─── */}
      {phase === "dropped" && droppedCat && (
        <EntryPanel category={droppedCat} onClose={handlePanelClose} onSave={handleSave} />
      )}

      {/* ─── CSS 动画 ─── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800&family=Space+Mono:wght@400;700&display=swap');
        @keyframes popIn {
          0% { transform: scale(.85); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none; margin: 0;
        }
        input[type="number"] { -moz-appearance: textfield; }
        * { -webkit-tap-highlight-color: transparent; }
        ::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
