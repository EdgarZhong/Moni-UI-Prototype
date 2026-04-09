import React, { useState, useCallback, useMemo, useRef, useEffect } from "react";

/* ═══════════════════════════════════════════════════════
   Moni 设置页可交互原型
   ── 与首页 / 记账页共享同一套设计 token 与视觉语言 ──
   ═══════════════════════════════════════════════════════ */

// ── 设计 Token（完全复用首页 config.js） ──
const C = {
  bg: "#F5F0EB", white: "#FFF", dark: "#222",
  coral: "#FF6B6B", blue: "#7EC8E3", yellow: "#F9D56E",
  mint: "#4ECDC4", amber: "#E88B4D", muted: "#999",
  sub: "#888", border: "#DDD", line: "#EEE",
  warmBg: "#FFF8F0", warmBd: "#F0C89A",
  pinkBg: "#FFF0F0", pinkBd: "#FFB8B8",
  greenBg: "#F0F8F0", greenText: "#3B6D11",
  blueBg: "#EBF5FF", orangeBg: "#FFF5EB",
  purple: "#B8A0D2", burgundy: "#C97B84", gray: "#C5C5C5",
};

const PHONE_W = 390;
const PHONE_H = 860;

/* ── Mock 数据 ── */
const MOCK_LEDGERS = [
  { id: "daily", name: "日常开销", isDefault: true },
  { id: "travel", name: "旅行基金", isDefault: false },
];

const MOCK_TAGS = [
  { key: "正餐", desc: "日常正餐支出（早午晚），仅限双人用餐，不含大餐和零食" },
  { key: "零食", desc: "零食、饮品、小吃等非正餐食品" },
  { key: "交通", desc: "公共交通、打车、加油、停车等出行费用" },
  { key: "娱乐", desc: "电影、游戏、演出、会员订阅等娱乐消费" },
  { key: "大餐", desc: "聚餐、大餐、宴请、高档餐厅等特殊餐饮" },
  { key: "购物", desc: "日用品、服装、电子产品、网购等购物消费" },
  { key: "其他", desc: "所有未落入用户显式标签的兜底支出", isSystem: true },
];

const MOCK_MEMORY = [
  "我是西工大学生，和女朋友一起生活，正餐只统计双人用餐",
  "单笔餐饮 > 70元视为大餐/聚餐，归 大餐",
  "同一餐点时段已有正餐，后续小吃/面包归 零食",
  "大餐的补差价（即使金额很小）也归 大餐",
  "杨国福麻辣烫：正餐，通常 40-60 元",
  "益禾堂：奶茶饮品，归 零食",
  "云上南山咖啡：虽是咖啡店但卖简餐，正餐时段+合理金额 → 正餐",
];

const MOCK_SNAPSHOTS = [
  { id: "2026-04-08_14-30-00-000", trigger: "ai_learn", summary: "学习：新增 3 条偏好规则", isCurrent: true },
  { id: "2026-04-07_09-15-00-000", trigger: "user_edit", summary: "用户手动编辑", isCurrent: false },
  { id: "2026-04-05_20-00-00-000", trigger: "ai_learn", summary: "学习：修改金额阈值判定", isCurrent: false },
  { id: "2026-04-03_11-30-00-000", trigger: "ledger_init", summary: "账本初始化：空记忆", isCurrent: false },
];

const PROVIDERS = [
  { id: "deepseek", name: "DeepSeek", hasBaseUrl: false },
  { id: "moonshot", name: "Moonshot", hasBaseUrl: false },
  { id: "siliconflow", name: "SiliconFlow", hasBaseUrl: false },
  { id: "modelscope", name: "ModelScope", hasBaseUrl: false },
  { id: "zhipu", name: "智谱 AI", hasBaseUrl: false },
  { id: "custom", name: "自定义", hasBaseUrl: true },
];

/* ═══════════════════════════════
   公共组件
   ═══════════════════════════════ */

function seededShapes(seed, count, bounds) {
  const shapes = []; let st = seed;
  const r = () => { st = (st * 16807) % 2147483647; return st / 2147483647; };
  const cols = [C.coral, C.blue, C.yellow, C.mint, C.amber, C.purple];
  const types = ["circle", "square", "triangle", "zigzag"];
  for (let i = 0; i < count; i++) {
    shapes.push({ id: i, type: types[Math.floor(r() * types.length)], color: cols[Math.floor(r() * cols.length)], x: bounds.x + r() * bounds.w, y: bounds.y + r() * bounds.h, size: 5 + r() * 9, rotation: r() * 45, opacity: 0.06 + r() * 0.1 });
  }
  return shapes;
}

function Decor({ seed = 555 }) {
  const shapes = useMemo(() => seededShapes(seed, 6, { x: 0, y: 40, w: PHONE_W, h: PHONE_H }), [seed]);
  return (
    <svg style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }} width="100%" height="100%">
      {shapes.map(s => {
        if (s.type === "circle") return <circle key={s.id} cx={s.x} cy={s.y} r={s.size / 2} fill={s.color} opacity={s.opacity} />;
        if (s.type === "square") return <rect key={s.id} x={s.x} y={s.y} width={s.size} height={s.size} rx="1.5" fill={s.color} opacity={s.opacity} transform={`rotate(${s.rotation} ${s.x + s.size / 2} ${s.y + s.size / 2})`} />;
        if (s.type === "triangle") return <polygon key={s.id} points={`${s.x},${s.y + s.size} ${s.x + s.size / 2},${s.y} ${s.x + s.size},${s.y + s.size}`} fill={s.color} opacity={s.opacity} />;
        return <line key={s.id} x1={s.x} y1={s.y} x2={s.x + s.size * 1.6} y2={s.y} stroke={s.color} strokeWidth="2" strokeLinecap="round" opacity={s.opacity} />;
      })}
    </svg>
  );
}

function Logo() {
  return (
    <svg width="100" height="34" viewBox="0 0 140 42">
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

function NavIcon() {
  return (<svg width="34" height="34" viewBox="0 0 52 52"><path d="M12 40C12 40 12 16 14.5 12C16 10 17 10.5 23 24C23 24 24 26.5 25 24C26 21.5 29 10.5 30.5 12C32 13.5 33 40 33 40" stroke="#F5F0EB" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" /><circle cx="39" cy="13" r="4.4" fill={C.coral} opacity=".88" /><circle cx="31" cy="7.2" r="3" fill={C.blue} opacity=".76" /><rect x="34" y="5.1" width="4.6" height="4.6" rx="1" fill={C.yellow} opacity=".68" transform="rotate(18 36.4 7.5)" /></svg>);
}

function GearIcon({ active }) {
  const c = active ? C.dark : "#8E8E8E"; const w = active ? "1.8" : "1.6";
  return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3.2" stroke={c} strokeWidth={w} /><path d="M12 2.5v2.2M12 19.3v2.2M4.92 4.92l1.56 1.56M17.52 17.52l1.56 1.56M2.5 12h2.2M19.3 12h2.2M4.92 19.08l1.56-1.56M17.52 6.48l1.56-1.56" stroke={c} strokeWidth={w} strokeLinecap="round" /></svg>);
}

function NoteIcon() {
  return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8l-5-5z" stroke="#8E8E8E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /><path d="M14 3v5h5M9 13h6M9 17h4" stroke="#8E8E8E" strokeWidth="1.6" strokeLinecap="round" /></svg>);
}

function ChevronRight({ color = C.muted }) {
  return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>);
}

function BackArrow() {
  return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke={C.dark} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>);
}

/* ── 通用二级页头 ── */
function SubPageHeader({ title, onBack, rightAction }) {
  return (
    <div style={{ display: "flex", alignItems: "center", padding: "14px 16px 10px", gap: 8, position: "sticky", top: 0, zIndex: 10, background: C.bg }}>
      <div onClick={onBack} style={{ cursor: "pointer", padding: 4 }}><BackArrow /></div>
      <div style={{ flex: 1, fontSize: 17, fontWeight: 700, color: C.dark }}>{title}</div>
      {rightAction}
    </div>
  );
}

/* ── 设置行项 ── */
function SettingRow({ icon, label, desc, value, onClick, danger, badge }) {
  return (
    <div onClick={onClick} style={{ display: "flex", alignItems: "center", padding: "14px 0", gap: 12, cursor: onClick ? "pointer" : "default", borderBottom: `0.5px solid ${C.line}` }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: danger ? C.pinkBg : C.blueBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0 }}>{icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: danger ? C.coral : C.dark }}>{label}</div>
        {desc && <div style={{ fontSize: 11, color: C.sub, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{desc}</div>}
      </div>
      {badge && <div style={{ padding: "2px 8px", borderRadius: 999, background: C.coral, color: C.white, fontSize: 10, fontWeight: 700 }}>{badge}</div>}
      {value && <div style={{ fontSize: 12, color: C.sub, maxWidth: 120, textAlign: "right", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value}</div>}
      {onClick && <ChevronRight />}
    </div>
  );
}

/* ── 区块容器 ── */
function SectionCard({ title, children, subtitle }) {
  return (
    <div style={{ margin: "0 16px 14px", background: C.white, border: `2px solid ${C.dark}`, borderRadius: 16, padding: "16px 16px 6px", position: "relative", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 8 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.dark, letterSpacing: 0.5 }}>{title}</div>
        {subtitle && <div style={{ fontSize: 10, color: C.sub }}>{subtitle}</div>}
      </div>
      {children}
    </div>
  );
}

/* ── 底部导航 ── */
function BottomNav({ onOpenHome, onOpenEntry }) {
  return (
    <div style={{ background: C.white, borderTop: `1.5px solid ${C.border}`, paddingTop: 3, paddingBottom: "max(env(safe-area-inset-bottom), 8px)", display: "flex", justifyContent: "space-around", alignItems: "flex-end", flexShrink: 0, zIndex: 20 }}>
      <div style={{ textAlign: "center", padding: "4px 16px" }}><GearIcon active /><div style={{ fontSize: 10, color: C.dark, fontWeight: 700, marginTop: 2 }}>设置</div></div>
      <div onClick={onOpenHome} style={{ position: "relative", textAlign: "center", cursor: "pointer" }}><div style={{ marginTop: -12 }}><div style={{ width: 52, height: 52, background: C.dark, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", transform: "rotate(2deg)" }}><NavIcon /></div><div style={{ fontSize: 10, fontWeight: 700, marginTop: 3, color: C.dark }}>首页</div></div></div>
      <div onClick={onOpenEntry} style={{ textAlign: "center", padding: "4px 16px", cursor: "pointer" }}><NoteIcon /><div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>记账</div></div>
    </div>
  );
}

/* ── 弹窗 ── */
function Dialog({ visible, title, children, onClose }) {
  if (!visible) return null;
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.35)" }} />
      <div onClick={e => e.stopPropagation()} style={{ position: "relative", width: "85%", maxHeight: "75%", background: C.white, borderRadius: 18, border: `2px solid ${C.dark}`, padding: "20px 18px 16px", overflow: "auto" }}>
        {title && <div style={{ fontSize: 16, fontWeight: 700, color: C.dark, marginBottom: 14 }}>{title}</div>}
        {children}
      </div>
    </div>
  );
}

/* ── 底部抽屉 ── */
function BottomSheet({ visible, title, children, onClose }) {
  if (!visible) return null;
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 50 }} onClick={onClose}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.3)" }} />
      <div onClick={e => e.stopPropagation()} style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: C.white, borderRadius: "20px 20px 0 0", border: `2px solid ${C.dark}`, borderBottom: "none", padding: "8px 18px 24px", maxHeight: "70%" }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: C.border, margin: "0 auto 12px" }} />
        {title && <div style={{ fontSize: 16, fontWeight: 700, color: C.dark, marginBottom: 14 }}>{title}</div>}
        <div style={{ overflowY: "auto", maxHeight: "55vh" }}>{children}</div>
      </div>
    </div>
  );
}

/* ── 按钮 ── */
function Btn({ children, onClick, variant = "primary", full, disabled, small }) {
  const base = { padding: small ? "8px 14px" : "12px 20px", borderRadius: 12, fontSize: small ? 12 : 14, fontWeight: 700, cursor: disabled ? "not-allowed" : "pointer", textAlign: "center", transition: "all .15s", opacity: disabled ? 0.45 : 1 };
  const styles = {
    primary: { ...base, background: C.dark, color: C.bg, border: `2px solid ${C.dark}` },
    secondary: { ...base, background: C.white, color: C.dark, border: `1.5px solid ${C.border}` },
    danger: { ...base, background: C.pinkBg, color: C.coral, border: `1.5px solid ${C.pinkBd}` },
    mint: { ...base, background: C.mint, color: C.white, border: `2px solid ${C.mint}` },
    ghost: { ...base, background: "transparent", color: C.sub, border: "none" },
  };
  return <div onClick={disabled ? undefined : onClick} style={{ ...styles[variant], ...(full ? { width: "100%", boxSizing: "border-box" } : { display: "inline-block" }) }}>{children}</div>;
}

/* ── Toast ── */
function Toast({ message, visible }) {
  if (!visible) return null;
  return (
    <div style={{ position: "absolute", top: 60, left: "50%", transform: "translateX(-50%)", zIndex: 60, background: C.white, borderRadius: 12, padding: "10px 20px", border: `2px solid ${C.dark}`, boxShadow: "0 6px 20px rgba(0,0,0,.12)", fontSize: 13, fontWeight: 600, color: C.dark, whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ width: 22, height: 22, borderRadius: 7, background: C.mint, display: "inline-flex", alignItems: "center", justifyContent: "center", color: C.white, fontSize: 12, fontWeight: 700 }}>✓</span>
      {message}
    </div>
  );
}

/* ═══════════════════════════════════════
   二级页面：AI 配置（S1-S5）
   ═══════════════════════════════════════ */
function AIConfigPage({ onBack }) {
  const [provider, setProvider] = useState("deepseek");
  const [showKey, setShowKey] = useState(false);
  const [model] = useState("deepseek-chat");
  const [testing, setTesting] = useState(false);
  const [testOk, setTestOk] = useState(null);

  const handleTest = () => {
    setTesting(true); setTestOk(null);
    setTimeout(() => { setTesting(false); setTestOk(true); setTimeout(() => setTestOk(null), 2500); }, 1800);
  };
  const cur = PROVIDERS.find(p => p.id === provider);

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <SubPageHeader title="AI 配置" onBack={onBack} />
      <div style={{ flex: 1, overflowY: "auto", padding: "0 16px 24px" }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: C.sub, marginBottom: 8, marginTop: 4 }}>AI 提供方</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 18 }}>
          {PROVIDERS.map(p => (
            <div key={p.id} onClick={() => setProvider(p.id)} style={{ padding: "8px 14px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", border: provider === p.id ? `2px solid ${C.dark}` : `1.5px solid ${C.border}`, background: provider === p.id ? C.dark : C.white, color: provider === p.id ? C.bg : C.dark, transition: "all .15s" }}>{p.name}</div>
          ))}
        </div>
        <div style={{ fontSize: 12, fontWeight: 600, color: C.sub, marginBottom: 8 }}>API Key</div>
        <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
          <input readOnly value={showKey ? "sk-abc123def456gh789ijkl" : "sk-••••••••••••••••"} style={{ flex: 1, padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${C.border}`, fontSize: 13, fontFamily: "monospace", background: C.white, color: C.dark, outline: "none" }} />
          <div onClick={() => setShowKey(!showKey)} style={{ padding: "10px 12px", borderRadius: 10, border: `1.5px solid ${C.border}`, cursor: "pointer", fontSize: 12, color: C.sub }}>{showKey ? "隐藏" : "显示"}</div>
        </div>
        {cur?.hasBaseUrl && (<><div style={{ fontSize: 12, fontWeight: 600, color: C.sub, marginBottom: 8 }}>Base URL</div><input defaultValue="https://api.example.com/v1" style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${C.border}`, fontSize: 13, background: C.white, color: C.dark, outline: "none", marginBottom: 18, boxSizing: "border-box" }} /></>)}
        <div style={{ fontSize: 12, fontWeight: 600, color: C.sub, marginBottom: 8 }}>当前模型</div>
        <div style={{ padding: "12px 14px", borderRadius: 10, border: `1.5px solid ${C.border}`, background: C.white, marginBottom: 18, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 14, fontWeight: 600, fontFamily: "monospace", color: C.dark }}>{model}</span>
          <span style={{ fontSize: 11, color: C.mint, fontWeight: 600 }}>● 生效中</span>
        </div>
        <div style={{ fontSize: 12, fontWeight: 600, color: C.sub, marginBottom: 10 }}>推理参数</div>
        <div style={{ background: C.white, border: `1.5px solid ${C.border}`, borderRadius: 12, padding: "12px 14px", marginBottom: 18 }}>
          {[{ l: "Max Tokens", v: "4096" }, { l: "Temperature", v: "0.3" }].map((p, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: i === 0 ? `0.5px solid ${C.line}` : "none" }}>
              <span style={{ fontSize: 13, color: C.dark }}>{p.l}</span>
              <span style={{ fontSize: 13, fontFamily: "monospace", color: C.sub }}>{p.v}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", marginTop: 4 }}>
            <span style={{ fontSize: 13, color: C.dark }}>启用思考</span>
            <div style={{ width: 40, height: 22, borderRadius: 11, background: C.mint, position: "relative", cursor: "pointer" }}>
              <div style={{ width: 18, height: 18, borderRadius: 9, background: C.white, position: "absolute", top: 2, right: 2, boxShadow: "0 1px 4px rgba(0,0,0,.15)" }} />
            </div>
          </div>
        </div>
        <Btn full onClick={handleTest} variant={testing ? "secondary" : "primary"} disabled={testing}>{testing ? "测试中…" : "测试连接"}</Btn>
        {testOk && <div style={{ marginTop: 10, padding: "10px 14px", borderRadius: 10, background: C.greenBg, border: `1.5px solid ${C.mint}30`, fontSize: 12, color: C.greenText, fontWeight: 600, textAlign: "center" }}>✓ 连接成功，模型响应正常</div>}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   二级页面：自述（S8）
   ═══════════════════════════════════════ */
function SelfDescPage({ onBack }) {
  const [text, setText] = useState("我是西工大学生，和女朋友元希一起生活。我们都不喝酒，偶尔喝奶茶。学校附近吃饭为主，偶尔出去改善。我对支出比较在意但不抠门。");
  const [saved, setSaved] = useState(false);
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <SubPageHeader title="自述" onBack={onBack} rightAction={<Btn small onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }} variant="primary">保存</Btn>} />
      <div style={{ flex: 1, overflowY: "auto", padding: "0 16px 24px" }}>
        <div style={{ padding: "10px 14px", borderRadius: 12, background: C.warmBg, border: `1.5px solid ${C.warmBd}`, marginBottom: 14, fontSize: 12, color: C.amber, lineHeight: 1.5 }}>💡 自述是你写给 AI 的个人说明，帮助它理解你的消费习惯和偏好。对所有账本生效，AI 会优先参考。</div>
        <textarea data-selectable value={text} onChange={e => setText(e.target.value)} style={{ width: "100%", minHeight: 240, padding: 14, borderRadius: 12, border: `1.5px solid ${C.border}`, fontSize: 14, lineHeight: 1.7, color: C.dark, background: C.white, outline: "none", resize: "vertical", fontFamily: "inherit", boxSizing: "border-box" }} />
        <div style={{ fontSize: 11, color: C.sub, marginTop: 8, textAlign: "right" }}>{text.length} 字</div>
      </div>
      <Toast visible={saved} message="自述已保存" />
    </div>
  );
}

/* ═══════════════════════════════════════
   二级页面：账本管理（S9-S12）
   ═══════════════════════════════════════ */
function LedgerManagePage({ onBack }) {
  const [ledgers, setLedgers] = useState(MOCK_LEDGERS);
  const [activeId, setActiveId] = useState("daily");
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [showRename, setShowRename] = useState(null);
  const [renameTo, setRenameTo] = useState("");
  const [showDelete, setShowDelete] = useState(null);

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <SubPageHeader title="账本管理" onBack={onBack} rightAction={<Btn small onClick={() => setShowCreate(true)} variant="primary">+ 新建</Btn>} />
      <div style={{ flex: 1, overflowY: "auto", padding: "0 16px 24px" }}>
        {ledgers.map(l => (
          <div key={l.id} style={{ display: "flex", alignItems: "center", padding: "14px 0", borderBottom: `0.5px solid ${C.line}`, gap: 12 }}>
            <div onClick={() => setActiveId(l.id)} style={{ width: 20, height: 20, borderRadius: 10, border: activeId === l.id ? `6px solid ${C.mint}` : `2px solid ${C.border}`, cursor: "pointer", flexShrink: 0, boxSizing: "border-box" }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.dark }}>{l.name}</div>
              <div style={{ fontSize: 11, color: C.sub, marginTop: 2 }}>{l.isDefault ? "默认账本" : "自建账本"}{activeId === l.id ? " · 当前使用" : ""}</div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <div onClick={() => { setShowRename(l); setRenameTo(l.name); }} style={{ padding: "5px 10px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 11, color: C.sub, cursor: "pointer" }}>改名</div>
              {!l.isDefault && <div onClick={() => setShowDelete(l)} style={{ padding: "5px 10px", borderRadius: 8, border: `1px solid ${C.pinkBd}`, fontSize: 11, color: C.coral, cursor: "pointer" }}>删除</div>}
            </div>
          </div>
        ))}
      </div>
      <Dialog visible={showCreate} title="新建账本" onClose={() => setShowCreate(false)}>
        <input data-selectable autoFocus value={newName} onChange={e => setNewName(e.target.value)} placeholder="输入账本名称" style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${C.border}`, fontSize: 14, outline: "none", marginBottom: 16, boxSizing: "border-box" }} />
        <div style={{ display: "flex", gap: 10 }}><Btn full variant="secondary" onClick={() => setShowCreate(false)}>取消</Btn><Btn full onClick={() => { if (newName.trim()) { setLedgers([...ledgers, { id: Date.now().toString(), name: newName.trim(), isDefault: false }]); setNewName(""); setShowCreate(false); } }} disabled={!newName.trim()}>创建</Btn></div>
      </Dialog>
      <Dialog visible={!!showRename} title="重命名账本" onClose={() => setShowRename(null)}>
        <input data-selectable autoFocus value={renameTo} onChange={e => setRenameTo(e.target.value)} style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${C.border}`, fontSize: 14, outline: "none", marginBottom: 16, boxSizing: "border-box" }} />
        <div style={{ display: "flex", gap: 10 }}><Btn full variant="secondary" onClick={() => setShowRename(null)}>取消</Btn><Btn full onClick={() => { if (renameTo.trim() && showRename) { setLedgers(ledgers.map(l => l.id === showRename.id ? { ...l, name: renameTo.trim() } : l)); setShowRename(null); } }} disabled={!renameTo.trim()}>确定</Btn></div>
      </Dialog>
      <Dialog visible={!!showDelete} title="删除账本" onClose={() => setShowDelete(null)}>
        <div style={{ fontSize: 14, color: C.dark, lineHeight: 1.6, marginBottom: 16 }}>确定要删除 <strong>「{showDelete?.name}」</strong> 吗？<br /><span style={{ color: C.coral, fontSize: 12 }}>此操作不可恢复。账本下所有交易数据、AI 记忆、预算配置都将被清除。</span></div>
        <div style={{ display: "flex", gap: 10 }}><Btn full variant="secondary" onClick={() => setShowDelete(null)}>取消</Btn><Btn full variant="danger" onClick={() => { if (showDelete) { setLedgers(ledgers.filter(l => l.id !== showDelete.id)); setShowDelete(null); } }}>确认删除</Btn></div>
      </Dialog>
    </div>
  );
}

/* ═══════════════════════════════════════
   二级页面：标签管理（S15-S18 + S32 渐进式重分类）
   ═══════════════════════════════════════ */
function TagManagePage({ onBack }) {
  const [tags, setTags] = useState(MOCK_TAGS);
  const [showAdd, setShowAdd] = useState(false);
  const [addName, setAddName] = useState(""); const [addDesc, setAddDesc] = useState("");
  const [editTag, setEditTag] = useState(null); const [editDesc, setEditDesc] = useState("");
  const [deleteTag, setDeleteTag] = useState(null);
  const [reclassDialog, setReclassDialog] = useState(null);
  const [reclassScope, setReclassScope] = useState(null);

  const handleAddTag = () => { if (!addName.trim() || !addDesc.trim()) return; setTags([...tags.filter(t => t.key !== "其他"), { key: addName.trim(), desc: addDesc.trim() }, tags.find(t => t.key === "其他")].filter(Boolean)); setAddName(""); setAddDesc(""); setShowAdd(false); setReclassDialog({ type: "add", tagKey: addName.trim() }); };
  const handleEditDesc = () => { if (!editTag || !editDesc.trim()) return; const k = editTag.key; setTags(tags.map(t => t.key === k ? { ...t, desc: editDesc.trim() } : t)); setEditTag(null); setReclassDialog({ type: "editDesc", tagKey: k }); };
  const handleDeleteTag = () => { if (!deleteTag) return; const k = deleteTag.key; setTags(tags.filter(t => t.key !== k)); setDeleteTag(null); setReclassDialog({ type: "delete", tagKey: k }); };

  const renderReclass = () => {
    if (!reclassDialog) return null;
    const { type, tagKey } = reclassDialog;
    if (type === "add") return (
      <Dialog visible title={`标签「${tagKey}」已新增`} onClose={() => setReclassDialog(null)}>
        <div style={{ fontSize: 13, color: C.dark, lineHeight: 1.6, marginBottom: 16 }}>新标签已添加。需要让 AI 现在就使用新标签对现有交易分类吗？</div>
        <div style={{ display: "flex", gap: 10 }}><Btn full variant="secondary" onClick={() => setReclassDialog(null)}>暂时跳过</Btn><Btn full variant="mint" onClick={() => setReclassDialog(null)}>现在启动分类</Btn></div>
      </Dialog>
    );
    if (type === "delete") return (
      <Dialog visible title="选择重分类范围" onClose={() => setReclassDialog(null)}>
        <div style={{ fontSize: 13, color: C.dark, lineHeight: 1.6, marginBottom: 14 }}>标签「{tagKey}」已删除，原属该标签的交易已重置为未分类。请选择 AI 重分类范围：</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Btn full variant="secondary" onClick={() => setReclassDialog(null)}>仅受影响的交易</Btn>
          <Btn full variant="primary" onClick={() => { setReclassDialog(null); setReclassScope("deleteFull"); }}>全账本所有未锁定交易</Btn>
        </div>
        <div onClick={() => setReclassDialog(null)} style={{ textAlign: "center", fontSize: 12, color: C.sub, marginTop: 10, cursor: "pointer" }}>稍后处理</div>
      </Dialog>
    );
    if (type === "editDesc") return (
      <Dialog visible title="标签定义已更改" onClose={() => setReclassDialog(null)}>
        <div style={{ fontSize: 13, color: C.dark, lineHeight: 1.6, marginBottom: 14 }}>标签「{tagKey}」的描述已更新。需要根据新定义重新分类吗？</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Btn full variant="secondary" onClick={() => setReclassDialog(null)}>暂时跳过</Btn>
          <Btn full variant="secondary" onClick={() => setReclassDialog(null)}>该标签下仅未锁定交易</Btn>
          <Btn full variant="primary" onClick={() => { setReclassDialog(null); setReclassScope("editDescFull"); }}>该标签下所有交易</Btn>
        </div>
      </Dialog>
    );
    return null;
  };

  const renderScope = () => {
    if (!reclassScope) return null;
    return (
      <BottomSheet visible title="以下锁定交易将被包含" onClose={() => setReclassScope(null)}>
        <div style={{ fontSize: 12, color: C.sub, marginBottom: 12, lineHeight: 1.5 }}>勾选后将临时解锁并参与本次重分类。</div>
        {["04-07 杨国福麻辣烫 ¥48", "04-05 星巴克 ¥38", "04-03 校园超市 ¥15.5"].map((tx, i) => (
          <label key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: `0.5px solid ${C.line}`, cursor: "pointer" }}>
            <input type="checkbox" style={{ width: 18, height: 18, accentColor: C.mint }} />
            <span style={{ fontSize: 13, color: C.dark }}>{tx}</span>
            <span style={{ marginLeft: "auto", fontSize: 10, padding: "2px 6px", borderRadius: 6, background: C.orangeBg, color: C.amber }}>已锁定</span>
          </label>
        ))}
        <div style={{ display: "flex", gap: 10, marginTop: 16 }}><Btn full variant="secondary" onClick={() => setReclassScope(null)}>取消</Btn><Btn full onClick={() => setReclassScope(null)}>确认并开始重分类</Btn></div>
      </BottomSheet>
    );
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <SubPageHeader title="标签管理" onBack={onBack} rightAction={<Btn small onClick={() => setShowAdd(true)} variant="primary">+ 新增</Btn>} />
      <div style={{ flex: 1, overflowY: "auto", padding: "0 16px 24px" }}>
        {tags.map(tag => (
          <div key={tag.key} style={{ padding: "14px 0", borderBottom: `0.5px solid ${C.line}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 8, height: 8, borderRadius: 4, background: tag.isSystem ? C.gray : C.mint, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.dark }}>{tag.key}</div>
                <div style={{ fontSize: 11, color: C.sub, marginTop: 3, lineHeight: 1.4 }}>{tag.desc}</div>
              </div>
              {!tag.isSystem && (
                <div style={{ display: "flex", gap: 6 }}>
                  <div onClick={() => { setEditTag(tag); setEditDesc(tag.desc); }} style={{ padding: "4px 8px", borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 10, color: C.sub, cursor: "pointer" }}>编辑</div>
                  <div onClick={() => setDeleteTag(tag)} style={{ padding: "4px 8px", borderRadius: 6, border: `1px solid ${C.pinkBd}`, fontSize: 10, color: C.coral, cursor: "pointer" }}>删除</div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <Dialog visible={showAdd} title="新增标签" onClose={() => setShowAdd(false)}>
        <input data-selectable autoFocus value={addName} onChange={e => setAddName(e.target.value)} placeholder="标签名称" style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${C.border}`, fontSize: 14, outline: "none", marginBottom: 10, boxSizing: "border-box" }} />
        <textarea data-selectable value={addDesc} onChange={e => setAddDesc(e.target.value)} placeholder="标签描述（必填）" style={{ width: "100%", minHeight: 80, padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${C.border}`, fontSize: 13, outline: "none", resize: "vertical", fontFamily: "inherit", marginBottom: 14, boxSizing: "border-box" }} />
        <div style={{ display: "flex", gap: 10 }}><Btn full variant="secondary" onClick={() => setShowAdd(false)}>取消</Btn><Btn full onClick={handleAddTag} disabled={!addName.trim() || !addDesc.trim()}>新增</Btn></div>
      </Dialog>
      <Dialog visible={!!editTag} title={`编辑「${editTag?.key}」描述`} onClose={() => setEditTag(null)}>
        <textarea data-selectable autoFocus value={editDesc} onChange={e => setEditDesc(e.target.value)} style={{ width: "100%", minHeight: 80, padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${C.border}`, fontSize: 13, outline: "none", resize: "vertical", fontFamily: "inherit", marginBottom: 14, boxSizing: "border-box" }} />
        <div style={{ display: "flex", gap: 10 }}><Btn full variant="secondary" onClick={() => setEditTag(null)}>取消</Btn><Btn full onClick={handleEditDesc}>保存</Btn></div>
      </Dialog>
      <Dialog visible={!!deleteTag} title={`删除「${deleteTag?.key}」`} onClose={() => setDeleteTag(null)}>
        <div style={{ fontSize: 13, color: C.dark, lineHeight: 1.6, marginBottom: 14 }}><span style={{ color: C.coral }}>⚠</span> 原属该标签的交易将重置为未分类，实例库与分类预算也将清理。</div>
        <div style={{ display: "flex", gap: 10 }}><Btn full variant="secondary" onClick={() => setDeleteTag(null)}>取消</Btn><Btn full variant="danger" onClick={handleDeleteTag}>确认删除</Btn></div>
      </Dialog>
      {renderReclass()}
      {renderScope()}
    </div>
  );
}

/* ═══════════════════════════════════════
   二级页面：AI 记忆（S19-S24）
   ═══════════════════════════════════════ */
function AIMemoryPage({ onBack }) {
  const [memory, setMemory] = useState(MOCK_MEMORY);
  const [editing, setEditing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showLearn, setShowLearn] = useState(false);
  const [learning, setLearning] = useState(false);
  const [newItem, setNewItem] = useState("");

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <SubPageHeader title="AI 记忆" onBack={onBack} rightAction={<Btn small variant={editing ? "mint" : "secondary"} onClick={() => setEditing(!editing)}>{editing ? "完成" : "编辑"}</Btn>} />
      <div style={{ flex: 1, overflowY: "auto", padding: "0 16px 24px" }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          <div style={{ flex: 1, padding: "10px 12px", borderRadius: 10, background: C.greenBg, border: `1px solid ${C.mint}30` }}><div style={{ fontSize: 10, color: C.sub }}>累计修正</div><div style={{ fontSize: 18, fontWeight: 700, color: C.greenText }}>3 <span style={{ fontSize: 11, fontWeight: 400 }}>/ 5</span></div></div>
          <div style={{ flex: 1, padding: "10px 12px", borderRadius: 10, background: C.blueBg, border: `1px solid ${C.blue}30` }}><div style={{ fontSize: 10, color: C.sub }}>记忆条数</div><div style={{ fontSize: 18, fontWeight: 700, color: C.dark }}>{memory.length}</div></div>
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <Btn small full variant="primary" onClick={() => setShowLearn(true)} disabled={learning}>{learning ? "学习中…" : "⚡ 立即学习"}</Btn>
          <Btn small full variant="secondary" onClick={() => setShowHistory(true)}>📋 历史版本</Btn>
        </div>
        <div style={{ background: C.white, border: `1.5px solid ${C.border}`, borderRadius: 12, overflow: "hidden" }}>
          {memory.map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", padding: "12px 14px", borderBottom: i < memory.length - 1 ? `0.5px solid ${C.line}` : "none", gap: 10 }}>
              <div style={{ fontSize: 12, color: C.mint, fontWeight: 700, flexShrink: 0, marginTop: 1, width: 18 }}>{i + 1}.</div>
              <div style={{ flex: 1, fontSize: 13, color: C.dark, lineHeight: 1.5 }}>{item}</div>
              {editing && <div onClick={() => setMemory(memory.filter((_, j) => j !== i))} style={{ fontSize: 16, color: C.coral, cursor: "pointer", padding: "0 2px" }}>×</div>}
            </div>
          ))}
          {editing && (
            <div style={{ display: "flex", alignItems: "center", padding: "10px 14px", gap: 8, background: C.bg }}>
              <input data-selectable value={newItem} onChange={e => setNewItem(e.target.value)} placeholder="添加新条目…" style={{ flex: 1, padding: "8px 10px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 12, outline: "none" }} />
              <Btn small onClick={() => { if (newItem.trim()) { setMemory([...memory, newItem.trim()]); setNewItem(""); } }}>+</Btn>
            </div>
          )}
        </div>
      </div>
      <Dialog visible={showLearn} title="立即学习" onClose={() => setShowLearn(false)}>
        <div style={{ fontSize: 13, color: C.dark, lineHeight: 1.6, marginBottom: 16 }}>AI 将基于最近修正更新记忆偏好，并自动生成新版本快照。</div>
        <div style={{ display: "flex", gap: 10 }}><Btn full variant="secondary" onClick={() => setShowLearn(false)}>取消</Btn><Btn full onClick={() => { setShowLearn(false); setLearning(true); setTimeout(() => setLearning(false), 2500); }}>开始学习</Btn></div>
      </Dialog>
      <BottomSheet visible={showHistory} title="记忆历史版本" onClose={() => setShowHistory(false)}>
        {MOCK_SNAPSHOTS.map((snap, i) => (
          <div key={snap.id} style={{ display: "flex", alignItems: "center", padding: "12px 0", borderBottom: i < MOCK_SNAPSHOTS.length - 1 ? `0.5px solid ${C.line}` : "none", gap: 10 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 600, fontFamily: "monospace", color: C.dark }}>{snap.id.slice(0, 10)}</span>
                {snap.isCurrent && <span style={{ padding: "1px 6px", borderRadius: 4, background: C.mint, color: C.white, fontSize: 9, fontWeight: 700 }}>当前</span>}
              </div>
              <div style={{ fontSize: 11, color: C.sub, marginTop: 3 }}>{snap.trigger === "ai_learn" ? "🤖 " : snap.trigger === "user_edit" ? "✏️ " : "📌 "}{snap.summary}</div>
            </div>
            {!snap.isCurrent && <div style={{ display: "flex", gap: 6 }}><div style={{ padding: "5px 10px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 10, color: C.sub, cursor: "pointer" }}>回退</div><div style={{ padding: "5px 10px", borderRadius: 8, border: `1px solid ${C.pinkBd}`, fontSize: 10, color: C.coral, cursor: "pointer" }}>删除</div></div>}
          </div>
        ))}
      </BottomSheet>
      <Toast visible={learning} message="AI 正在学习新的偏好…" />
    </div>
  );
}

/* ═══════════════════════════════════════
   二级页面：预算设置（S29-S30）
   ═══════════════════════════════════════ */
function BudgetPage({ onBack }) {
  const [monthly, setMonthly] = useState("3000");
  const [catBudgets, setCatBudgets] = useState({ "正餐": "800", "交通": "300", "娱乐": "200" });
  const [saved, setSaved] = useState(false);
  const total = Object.values(catBudgets).reduce((s, v) => s + (parseFloat(v) || 0), 0);
  const over = monthly && total > parseFloat(monthly);

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <SubPageHeader title="预算设置" onBack={onBack} rightAction={<Btn small onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }} variant="primary">保存</Btn>} />
      <div style={{ flex: 1, overflowY: "auto", padding: "0 16px 24px" }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: C.sub, marginBottom: 8, marginTop: 4 }}>月度总预算</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
          <span style={{ fontSize: 22, fontWeight: 700, color: C.dark }}>¥</span>
          <input data-selectable type="number" value={monthly} onChange={e => setMonthly(e.target.value)} placeholder="0" style={{ flex: 1, padding: "12px 14px", borderRadius: 12, border: `2px solid ${C.dark}`, fontSize: 22, fontWeight: 700, fontFamily: "'Space Mono', monospace", color: C.dark, outline: "none", background: C.white }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: C.sub }}>分类预算</div>
          <div style={{ fontSize: 11, color: over ? C.coral : C.sub }}>合计 ¥{total}{monthly ? ` / ¥${monthly}` : ""}{over && " ⚠ 超出"}</div>
        </div>
        <div style={{ background: C.white, border: `1.5px solid ${over ? C.pinkBd : C.border}`, borderRadius: 12, padding: "4px 14px" }}>
          {MOCK_TAGS.filter(t => !t.isSystem).map((tag, i, arr) => (
            <div key={tag.key} style={{ display: "flex", alignItems: "center", padding: "12px 0", borderBottom: i < arr.length - 1 ? `0.5px solid ${C.line}` : "none", gap: 10 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.dark, width: 48 }}>{tag.key}</div>
              <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ fontSize: 13, color: C.sub }}>¥</span>
                <input data-selectable type="number" value={catBudgets[tag.key] || ""} onChange={e => setCatBudgets({ ...catBudgets, [tag.key]: e.target.value })} placeholder="—" style={{ flex: 1, padding: "6px 8px", borderRadius: 8, border: `1px solid ${C.line}`, fontSize: 13, outline: "none", fontFamily: "monospace", background: "transparent" }} />
              </div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 11, color: C.sub, marginTop: 10, lineHeight: 1.5 }}>留空表示不设预算上限。分类预算之和不应超过月度总预算。</div>
      </div>
      <Toast visible={saved} message="预算已保存" />
    </div>
  );
}

/* ═══════════════════════════════════════
   二级页面：学习设置（S25-S27）
   ═══════════════════════════════════════ */
function LearningSettingsPage({ onBack }) {
  const [autoLearn, setAutoLearn] = useState(true);
  const [threshold, setThreshold] = useState(5);
  const [compThreshold, setCompThreshold] = useState(30);
  const [saved, setSaved] = useState(false);

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <SubPageHeader title="学习设置" onBack={onBack} rightAction={<Btn small onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }} variant="primary">保存</Btn>} />
      <div style={{ flex: 1, overflowY: "auto", padding: "0 16px 24px" }}>
        <div style={{ padding: "10px 14px", borderRadius: 12, background: C.blueBg, border: `1px solid ${C.blue}30`, marginBottom: 16, fontSize: 12, color: C.dark, lineHeight: 1.5 }}>🧠 控制 AI 自动学习行为和记忆收编，仅对当前账本生效。</div>
        <div style={{ background: C.white, border: `1.5px solid ${C.border}`, borderRadius: 12, padding: "14px", marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div><div style={{ fontSize: 14, fontWeight: 600, color: C.dark }}>自动学习</div><div style={{ fontSize: 11, color: C.sub, marginTop: 3 }}>达到阈值后自动触发学习</div></div>
            <div onClick={() => setAutoLearn(!autoLearn)} style={{ width: 44, height: 24, borderRadius: 12, background: autoLearn ? C.mint : C.border, position: "relative", cursor: "pointer", transition: "all .2s" }}>
              <div style={{ width: 20, height: 20, borderRadius: 10, background: C.white, position: "absolute", top: 2, left: autoLearn ? 22 : 2, boxShadow: "0 1px 4px rgba(0,0,0,.15)", transition: "all .2s" }} />
            </div>
          </div>
        </div>
        <div style={{ background: C.white, border: `1.5px solid ${C.border}`, borderRadius: 12, padding: "14px", marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}><div style={{ fontSize: 14, fontWeight: 600, color: C.dark }}>学习阈值</div><div style={{ fontSize: 16, fontWeight: 700, color: C.mint, fontFamily: "monospace" }}>{threshold}</div></div>
          <div style={{ fontSize: 11, color: C.sub, marginBottom: 10 }}>累计修正次数达到该值后触发学习</div>
          <input type="range" min={2} max={20} value={threshold} onChange={e => setThreshold(parseInt(e.target.value))} style={{ width: "100%", accentColor: C.mint }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: C.muted, marginTop: 4 }}><span>2（敏感）</span><span>20（保守）</span></div>
        </div>
        <div style={{ background: C.white, border: `1.5px solid ${C.border}`, borderRadius: 12, padding: "14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}><div style={{ fontSize: 14, fontWeight: 600, color: C.dark }}>收编阈值</div><div style={{ fontSize: 16, fontWeight: 700, color: C.amber, fontFamily: "monospace" }}>{compThreshold}</div></div>
          <div style={{ fontSize: 11, color: C.sub, marginBottom: 10 }}>记忆条目超过此值后允许收编压缩</div>
          <input type="range" min={10} max={60} value={compThreshold} onChange={e => setCompThreshold(parseInt(e.target.value))} style={{ width: "100%", accentColor: C.amber }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: C.muted, marginTop: 4 }}><span>10</span><span>60</span></div>
        </div>
      </div>
      <Toast visible={saved} message="学习设置已保存" />
    </div>
  );
}

/* ═══════════════════════════════════════
   二级页面：全量重新分类（S31 + S32 链路）
   ═══════════════════════════════════════ */
function FullReclassPage({ onBack }) {
  const [confirming, setConfirming] = useState(false);
  const [running, setRunning] = useState(false);

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <SubPageHeader title="全量重新分类" onBack={onBack} />
      <div style={{ flex: 1, overflowY: "auto", padding: "0 16px 24px" }}>
        <div style={{ padding: "14px", borderRadius: 12, background: C.warmBg, border: `1.5px solid ${C.warmBd}`, marginBottom: 18, lineHeight: 1.6 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.dark, marginBottom: 6 }}>⚡ 什么是全量重分类？</div>
          <div style={{ fontSize: 12, color: C.dark }}>AI 将对当前账本中<strong>所有未锁定交易</strong>重新运行分类。已锁定交易不受影响。</div>
        </div>
        <div style={{ background: C.white, border: `1.5px solid ${C.border}`, borderRadius: 12, padding: 14, marginBottom: 18 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.dark, marginBottom: 8 }}>当前账本概况</div>
          {[{ l: "总交易数", v: "127 笔" }, { l: "未锁定", v: "84 笔", c: C.amber }, { l: "已锁定", v: "43 笔", c: C.mint }].map((row, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: i < 2 ? `0.5px solid ${C.line}` : "none" }}>
              <span style={{ fontSize: 13, color: C.sub }}>{row.l}</span><span style={{ fontSize: 13, fontWeight: 600, color: row.c || C.dark }}>{row.v}</span>
            </div>
          ))}
        </div>
        <div style={{ padding: "10px 14px", borderRadius: 10, background: C.pinkBg, border: `1px solid ${C.pinkBd}`, marginBottom: 20, fontSize: 12, color: C.coral, lineHeight: 1.5 }}>⚠ 全量重分类会清理未锁定交易的实例库记录。建议在网络稳定时操作。</div>
        <Btn full variant={running ? "secondary" : "danger"} onClick={() => setConfirming(true)} disabled={running}>{running ? "重分类进行中…" : "开始全量重新分类"}</Btn>
      </div>
      <Dialog visible={confirming} title="确认全量重分类" onClose={() => setConfirming(false)}>
        <div style={{ fontSize: 13, color: C.dark, lineHeight: 1.6, marginBottom: 16 }}>即将对 <strong>84 笔未锁定交易</strong> 发起全量重分类。</div>
        <div style={{ display: "flex", gap: 10 }}><Btn full variant="secondary" onClick={() => setConfirming(false)}>取消</Btn><Btn full variant="danger" onClick={() => { setConfirming(false); setRunning(true); setTimeout(() => setRunning(false), 3000); }}>确认开始</Btn></div>
      </Dialog>
      <Toast visible={running} message="重分类任务已入队" />
    </div>
  );
}

/* ═══════════════════════════════════════
   二级页面：关于（S13）
   ═══════════════════════════════════════ */
function AboutPage({ onBack }) {
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <SubPageHeader title="关于" onBack={onBack} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 32px" }}>
        <div style={{ width: 72, height: 72, background: C.dark, borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}><NavIcon /></div>
        <div style={{ fontSize: 22, fontWeight: 800, color: C.dark, fontFamily: "'Nunito',sans-serif", marginBottom: 4 }}>Moni</div>
        <div style={{ fontSize: 12, color: C.sub, marginBottom: 20 }}>AI 原生个人财务助手</div>
        <div style={{ fontSize: 12, color: C.muted, textAlign: "center", lineHeight: 1.7 }}>越用越聪明的记账伙伴。<br />导入账单，浏览流水，顺手纠错，AI 自动学会。</div>
        <div style={{ marginTop: 28, fontSize: 11, color: C.muted }}>版本 0.1.0 · 构建于 2026-04</div>
        <div style={{ marginTop: 6, fontSize: 11, color: C.muted }}>计算机设计大赛参赛作品</div>
        <div style={{ marginTop: 20, display: "flex", gap: 16 }}>
          {["反馈", "文档", "致谢"].map(t => (<div key={t} style={{ padding: "6px 14px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 12, color: C.sub, cursor: "pointer" }}>{t}</div>))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   设置页 Root
   ═══════════════════════════════════════════ */
function SettingsRoot({ onNavigate }) {
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px 8px", position: "sticky", top: 0, zIndex: 10, background: C.bg }}>
        <Logo /><div style={{ fontSize: 14, fontWeight: 700, color: C.dark }}>设置</div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", paddingBottom: 16 }}>
        <SectionCard title="🌐 全局配置">
          <SettingRow icon="🤖" label="AI 配置" desc="DeepSeek · deepseek-chat" onClick={() => onNavigate("aiConfig")} />
          <SettingRow icon="👤" label="自述" desc="让 AI 了解你的消费习惯" onClick={() => onNavigate("selfDesc")} />
          <SettingRow icon="📚" label="账本管理" value="2 个账本" onClick={() => onNavigate("ledgerManage")} />
          <SettingRow icon="📤" label="数据导出" desc="导出账单数据" value="P2" onClick={() => {}} />
          <SettingRow icon="ℹ️" label="关于" desc="Moni v0.1.0" onClick={() => onNavigate("about")} />
        </SectionCard>
        <SectionCard title="📒 账本：日常开销" subtitle="当前账本配置">
          <SettingRow icon="🏷️" label="标签管理" value={`${MOCK_TAGS.length} 个`} onClick={() => onNavigate("tagManage")} />
          <SettingRow icon="🧠" label="AI 记忆" desc="查看 AI 学到的偏好" value={`${MOCK_MEMORY.length} 条`} onClick={() => onNavigate("aiMemory")} />
          <SettingRow icon="💰" label="预算设置" desc="月度与分类预算" value="¥3,000" onClick={() => onNavigate("budget")} />
          <SettingRow icon="📐" label="学习设置" desc="阈值、自动学习、收编" onClick={() => onNavigate("learnSettings")} />
          <SettingRow icon="🔄" label="全量重新分类" desc="对全账本未锁定交易重新分类" onClick={() => onNavigate("fullReclass")} danger />
        </SectionCard>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   主控制器
   ═══════════════════════════════════════════ */
export default function MoniSettingsPrototype() {
  const [page, setPage] = useState("root");
  const renderPage = () => {
    switch (page) {
      case "aiConfig": return <AIConfigPage onBack={() => setPage("root")} />;
      case "selfDesc": return <SelfDescPage onBack={() => setPage("root")} />;
      case "ledgerManage": return <LedgerManagePage onBack={() => setPage("root")} />;
      case "tagManage": return <TagManagePage onBack={() => setPage("root")} />;
      case "aiMemory": return <AIMemoryPage onBack={() => setPage("root")} />;
      case "budget": return <BudgetPage onBack={() => setPage("root")} />;
      case "learnSettings": return <LearningSettingsPage onBack={() => setPage("root")} />;
      case "fullReclass": return <FullReclassPage onBack={() => setPage("root")} />;
      case "about": return <AboutPage onBack={() => setPage("root")} />;
      default: return <SettingsRoot onNavigate={setPage} />;
    }
  };
  return (
    <div style={{ minHeight: "100vh", margin: 0, background: "#EAE1D8", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 16px" }}>
      <div style={{ width: PHONE_W, height: PHONE_H, background: C.bg, borderRadius: 38, overflow: "hidden", display: "flex", flexDirection: "column", position: "relative", boxShadow: "0 20px 60px rgba(0,0,0,.18)", border: `2px solid ${C.dark}` }}>
        <Decor seed={page === "root" ? 555 : 777} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative", zIndex: 1, overflow: "hidden" }}>{renderPage()}</div>
        <BottomNav onOpenHome={() => {}} onOpenEntry={() => {}} />
      </div>
    </div>
  );
}
