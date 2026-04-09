import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { C, CAT, DAYS, PHONE_FRAME_HEIGHT } from "../features/moni-home/config.js";
import { getCategory } from "../features/moni-home/helpers.js";
import { Decor, GearIcon, NavIcon, NoteIcon, TopHeader } from "../features/moni-home/components.jsx";

/**
 * 记账页“最近流水”不是一个独立数据源，也不是本页会话内的临时草稿区。
 * 按当前确认口径，它固定展示“首页最新一天的最新两条记录”，且：
 * 1. 不区分来源（微信 / 支付宝 / 手动）
 * 2. 不受首页 data range 约束
 * 3. 作为信息参考区存在，帮助用户在记账页快速对齐最近消费语境
 *
 * 当前原型仓库本身承担“代码即文档”的职责，因此这里用注释明确固化该规则。
 */
function buildRecentReferenceEntries() {
  const latestDay = DAYS[0];
  if (!latestDay) {
    return [];
  }

  return latestDay.items.slice(0, 2).map((item) => {
    const category = getCategory(item);
    return {
      id: `ref-${item.id}`,
      title: item.n,
      amount: item.a,
      category,
      emoji: category ? CAT[category].icons[item.ih % CAT[category].icons.length] : "📝",
      categoryColor: category ? CAT[category].color : C.muted,
      categoryBg: category ? CAT[category].bg : "#F5F5F5",
    };
  });
}

/**
 * 导入卡静态视觉以 `MoniEntryPage (1).jsx` 为主参考。
 * 这里保留更稳定的层级和品牌语言，不把易漂移的局部尺寸冻结死。
 */
function ImportCard() {
  const decorShapes = useMemo(
    () => [
      { id: "c1", type: "circle", x: 36, y: 28, size: 10, color: C.coral, opacity: 0.14 },
      { id: "c2", type: "circle", x: 326, y: 74, size: 8, color: C.blue, opacity: 0.14 },
      { id: "s1", type: "square", x: 300, y: 22, size: 8, color: C.yellow, opacity: 0.12, rotation: 18 },
      { id: "l1", type: "line", x: 250, y: 48, size: 11, color: C.mint, opacity: 0.12 },
      { id: "t1", type: "triangle", x: 102, y: 88, size: 10, color: C.amber, opacity: 0.1 },
    ],
    [],
  );

  return (
    <div
      style={{
        margin: "0 16px",
        background: C.white,
        border: `2px solid ${C.dark}`,
        borderRadius: 16,
        padding: "20px 18px 14px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <svg style={{ position: "absolute", inset: 0, pointerEvents: "none" }} width="100%" height="100%">
        {decorShapes.map((shape) => {
          if (shape.type === "circle") {
            return <circle key={shape.id} cx={shape.x} cy={shape.y} r={shape.size / 2} fill={shape.color} opacity={shape.opacity} />;
          }
          if (shape.type === "square") {
            return (
              <rect
                key={shape.id}
                x={shape.x}
                y={shape.y}
                width={shape.size}
                height={shape.size}
                rx="1.5"
                fill={shape.color}
                opacity={shape.opacity}
                transform={`rotate(${shape.rotation} ${shape.x + shape.size / 2} ${shape.y + shape.size / 2})`}
              />
            );
          }
          if (shape.type === "triangle") {
            return (
              <polygon
                key={shape.id}
                points={`${shape.x},${shape.y + shape.size} ${shape.x + shape.size / 2},${shape.y} ${shape.x + shape.size},${shape.y + shape.size}`}
                fill={shape.color}
                opacity={shape.opacity}
              />
            );
          }
          return <line key={shape.id} x1={shape.x} y1={shape.y} x2={shape.x + shape.size * 1.6} y2={shape.y} stroke={shape.color} strokeWidth="2" strokeLinecap="round" opacity={shape.opacity} />;
        })}
      </svg>

      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 18,
              background: `linear-gradient(135deg, ${C.mint}24, ${C.blue}22)`,
              border: `1.5px solid ${C.mint}33`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="52" height="52" viewBox="0 0 80 80" fill="none">
              <rect x="16" y="12" width="42" height="52" rx="6" fill={C.white} stroke={C.dark} strokeWidth="2" />
              <rect x="16" y="12" width="42" height="14" rx="6" fill={C.warmBg} stroke={C.dark} strokeWidth="2" />
              <line x1="24" y1="36" x2="50" y2="36" stroke={C.border} strokeWidth="2" strokeLinecap="round" />
              <line x1="24" y1="43" x2="44" y2="43" stroke={C.border} strokeWidth="2" strokeLinecap="round" />
              <line x1="24" y1="50" x2="48" y2="50" stroke={C.border} strokeWidth="2" strokeLinecap="round" />
              <circle cx="52" cy="52" r="13" fill={C.mint} opacity=".9" />
              <path d="M52 45v12M47 53l5 5 5-5" stroke={C.white} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="12" cy="22" r="4" fill={C.coral} opacity=".5" />
              <rect x="60" y="8" width="7" height="7" rx="1" fill={C.yellow} opacity=".55" transform="rotate(18 63.5 11.5)" />
              <circle cx="66" cy="38" r="3" fill={C.blue} opacity=".4" />
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: C.dark, marginBottom: 4, fontFamily: "'Nunito',sans-serif" }}>导入你的账单</div>
            <div style={{ fontSize: 12, color: C.sub, lineHeight: 1.55 }}>从微信或支付宝导出消费记录，Moni 会自动帮你分类整理</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              padding: "12px 14px",
              borderRadius: 12,
              background: "#F0FFF0",
              border: "1.5px solid #7BB97B",
              color: "#3B7A3B",
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            <span style={{ fontSize: 18 }}>微</span>
            微信账单
          </div>
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              padding: "12px 14px",
              borderRadius: 12,
              background: "#F0F5FF",
              border: "1.5px solid #6B9BD2",
              color: "#2B5EA7",
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            <span style={{ fontSize: 18 }}>支</span>
            支付宝账单
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            padding: "8px 0",
            borderRadius: 8,
            background: C.warmBg,
            color: "#8B5E2B",
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          <span style={{ width: 14, height: 14, borderRadius: "50%", border: `1.5px solid ${C.amber}`, color: C.amber, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>i</span>
          不知道怎么导出账单？查看导入指南
          <span style={{ color: "#CBA870" }}>›</span>
        </div>
      </div>
    </div>
  );
}

/**
 * 最近流水区按统一口径展示首页最新一天的最新两条。
 * 这里刻意不展示来源 badge，也不读取首页 data range 过滤结果。
 */
function RecentReferenceList({ entries }) {
  if (!entries.length) {
    return (
      <div
        style={{
          margin: "0 16px",
          padding: "24px 16px",
          textAlign: "center",
          borderRadius: 14,
          border: `1.5px dashed ${C.border}`,
          background: "#FDFCFA",
        }}
      >
        <div style={{ fontSize: 28, marginBottom: 8 }}>📝</div>
        <div style={{ fontSize: 13, color: C.sub, lineHeight: 1.6 }}>
          暂无参考记录
          <br />
          <span style={{ fontSize: 12, color: C.muted }}>该区域后续会读取首页最新一天的两条参考记录</span>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        margin: "0 16px",
        background: C.white,
        border: `1.5px solid ${C.border}`,
        borderRadius: 14,
        padding: "10px 14px",
      }}
    >
      <div style={{ fontSize: 12, fontWeight: 700, color: C.dark, marginBottom: 8 }}>最近流水</div>
      {entries.map((entry, index) => (
        <div
          key={entry.id}
          style={{
            display: "flex",
            alignItems: "center",
            padding: "8px 0",
            borderBottom: index < entries.length - 1 ? `0.5px solid ${C.line}` : "none",
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 10,
              background: entry.categoryBg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 15,
              marginRight: 10,
              flexShrink: 0,
            }}
          >
            {entry.emoji}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.dark }}>{entry.title}</div>
            <div style={{ fontSize: 10, color: C.muted, display: "flex", alignItems: "center", gap: 4 }}>
              <span
                style={{
                  padding: "0 5px",
                  borderRadius: 999,
                  background: entry.categoryBg,
                  color: entry.categoryColor,
                  fontSize: 9,
                  fontWeight: 600,
                }}
              >
                {entry.category ?? "待分类"}
              </span>
            </div>
          </div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              flexShrink: 0,
              color: C.coral,
              fontFamily: "'Space Mono',monospace",
            }}
          >
            −¥{entry.amount}
          </div>
        </div>
      ))}
    </div>
  );
}

function PencilIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" stroke={C.bg} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 6l3 3" stroke={C.bg} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/**
 * 主操作按钮与提示小字属于“最近流水”卡片之后的同级内容，不再单独悬浮在页面中段。
 * 当前口径要求这两个元素紧贴卡片下方，同时在内容流底部保留安全留白，避免与底部首页 icon 过近。
 */
function EntryButton({ pressed, onClick, onPointerDown }) {
  return (
    <div style={{ margin: "0 16px", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <div style={{ fontSize: 11, color: C.sub, textAlign: "center" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
            <path d="M8 2v8M5 7l3 3 3-3" stroke={C.sub} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3 12h10" stroke={C.sub} strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          按住拖入分类 · 或直接点击
        </span>
      </div>

      <div
        onClick={onClick}
        onPointerDown={onPointerDown}
        style={{
          minWidth: 186,
          padding: "15px 28px",
          borderRadius: 16,
          textAlign: "center",
          background: C.dark,
          color: C.bg,
          fontSize: 15,
          fontWeight: 800,
          fontFamily: "'Nunito',sans-serif",
          border: `2px solid ${C.dark}`,
          position: "relative",
          overflow: "hidden",
          boxShadow: pressed ? "0 2px 10px rgba(34,34,34,.12)" : "0 4px 16px rgba(34,34,34,.18)",
          transform: pressed ? "scale(0.97)" : "scale(1)",
          transition: "transform .15s, box-shadow .15s",
          userSelect: "none",
          touchAction: "none",
          cursor: "pointer",
        }}
      >
        <span style={{ position: "absolute", left: 16, top: 9, width: 8, height: 8, borderRadius: "50%", background: C.coral, opacity: 0.55 }} />
        <span style={{ position: "absolute", left: 28, top: 7, width: 5, height: 5, borderRadius: "50%", background: C.blue, opacity: 0.45 }} />
        <span style={{ position: "absolute", left: 24, top: 17, width: 5, height: 5, borderRadius: 1, background: C.yellow, opacity: 0.42, transform: "rotate(20deg)" }} />
        <span style={{ position: "absolute", right: 21, bottom: 10, width: 6, height: 6, borderRadius: "50%", background: C.mint, opacity: 0.36 }} />

        <span style={{ position: "relative", zIndex: 1, display: "inline-flex", alignItems: "center", gap: 8 }}>
          <PencilIcon />
          记一笔
        </span>
      </div>
    </div>
  );
}

function CategoryOverlay({ visible, hoverCat, dragPoint, isDragging, onSelect, onClose }) {
  if (!visible) {
    return null;
  }

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(0,0,0,.5)",
        zIndex: 50,
        display: "flex",
        flexDirection: "column",
        padding: 16,
        touchAction: "none",
      }}
    >
      <div style={{ fontSize: 14, color: C.white, fontWeight: 700, textAlign: "center", marginTop: 12, marginBottom: 10 }}>
        拖放到分类中，开始记一笔
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, padding: "0 4px", overflowY: "auto" }}>
        {Object.entries(CAT).map(([category, meta]) => (
          <div
            key={category}
            data-drop-category={category}
            onClick={() => onSelect(category)}
            style={{
              background: C.white,
              border: `2.5px solid ${hoverCat === category ? meta.color : C.border}`,
              borderRadius: 12,
              padding: "12px 8px",
              textAlign: "center",
              transform: hoverCat === category ? "scale(1.05)" : "scale(1)",
              transition: "all .2s",
              cursor: "pointer",
            }}
          >
            <div style={{ fontSize: 20, marginBottom: 2 }}>{meta.icons[0]}</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: meta.color }}>{category}</div>
          </div>
        ))}
      </div>

      <div
        onClick={onClose}
        style={{
          position: "absolute",
          right: 14,
          top: 12,
          color: C.white,
          fontSize: 18,
          cursor: "pointer",
        }}
      >
        ×
      </div>

      {isDragging && dragPoint && (
        <div style={{ position: "fixed", left: dragPoint.x, top: dragPoint.y, transform: "translate(-50%, -115%)", width: 48, height: 40, borderRadius: 12, background: C.dark, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 24px rgba(0,0,0,.3)", pointerEvents: "none" }}>
          <PencilIcon />
          <div style={{ position: "absolute", top: -4, right: -4 }}>
            <svg width="16" height="14" viewBox="0 0 16 14">
              <circle cx="10" cy="5" r="3.2" fill={C.coral} opacity=".85" />
              <circle cx="5" cy="3" r="2.2" fill={C.blue} opacity=".7" />
              <rect x="8" y="1" width="3" height="3" rx=".6" fill={C.yellow} opacity=".6" transform="rotate(18 9.5 2.5)" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}

function EntryFormPanel({ visible, category, onSave, onClose }) {
  const [amount, setAmount] = useState("");
  const [direction, setDirection] = useState("out");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  });
  const amountRef = useRef(null);

  useEffect(() => {
    if (!visible) {
      return;
    }
    setAmount("");
    setDirection("out");
    setSubject("");
    setDescription("");
    setTimeout(() => amountRef.current?.focus(), 220);
  }, [visible, category]);

  if (!visible || !category) {
    return null;
  }

  const meta = CAT[category];
  const canSave = amount && Number(amount) > 0;

  return (
    <div
      onClick={onClose}
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(0,0,0,.4)",
        zIndex: 55,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        animation: "fadeIn .2s ease",
      }}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        style={{
          background: C.white,
          borderRadius: "20px 20px 0 0",
          padding: "20px 20px 24px",
          border: `2px solid ${C.dark}`,
          borderBottom: "none",
          animation: "slideUp .3s cubic-bezier(.4,0,.2,1)",
          maxHeight: "78%",
          overflowY: "auto",
        }}
      >
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: C.border }} />
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 18,
            padding: "10px 14px",
            borderRadius: 12,
            background: meta.bg,
            border: `1.5px solid ${meta.color}22`,
          }}
        >
          <span style={{ fontSize: 28 }}>{meta.icons[0]}</span>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: meta.color }}>{category}</div>
            <div style={{ fontSize: 11, color: C.sub }}>分类已选定，填写详情</div>
          </div>
        </div>

        <div
          style={{
            marginBottom: 16,
            padding: "16px",
            borderRadius: 14,
            background: "#FAFAF8",
            border: `1.5px solid ${C.border}`,
          }}
        >
          <div style={{ fontSize: 11, color: C.sub, marginBottom: 8, fontWeight: 600 }}>金额 *</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
            <span style={{ fontSize: 24, fontWeight: 700, color: direction === "out" ? C.coral : C.mint, fontFamily: "'Space Mono',monospace" }}>
              {direction === "out" ? "−¥" : "+¥"}
            </span>
            <input
              ref={amountRef}
              type="number"
              inputMode="decimal"
              placeholder="0.00"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              style={{
                flex: 1,
                fontSize: 32,
                fontWeight: 700,
                color: C.dark,
                fontFamily: "'Space Mono',monospace",
                border: "none",
                background: "transparent",
                outline: "none",
                padding: 0,
                WebkitAppearance: "none",
                MozAppearance: "textfield",
              }}
            />
          </div>

          <div style={{ display: "flex", gap: 0, marginTop: 12, borderRadius: 10, overflow: "hidden", border: `1.5px solid ${C.border}` }}>
            {[
              { key: "out", label: "支出", color: C.coral },
              { key: "in", label: "收入", color: C.mint },
            ].map((option) => (
              <div
                key={option.key}
                onClick={() => setDirection(option.key)}
                style={{
                  flex: 1,
                  padding: "8px 0",
                  textAlign: "center",
                  fontSize: 13,
                  fontWeight: direction === option.key ? 700 : 500,
                  background: direction === option.key ? option.color : C.white,
                  color: direction === option.key ? C.white : C.muted,
                  cursor: "pointer",
                  transition: "all .2s",
                }}
              >
                {option.label}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
          <div>
            <div style={{ fontSize: 11, color: C.sub, marginBottom: 4, fontWeight: 600 }}>
              主题 <span style={{ fontWeight: 400, color: C.muted }}>（选填）</span>
            </div>
            <input
              type="text"
              placeholder="这笔花在哪了？比如「火锅聚餐」"
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 10,
                border: `1.5px solid ${C.border}`,
                fontSize: 13,
                fontFamily: "inherit",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div>
            <div style={{ fontSize: 11, color: C.sub, marginBottom: 4, fontWeight: 600 }}>
              补充说明 <span style={{ fontWeight: 400, color: C.muted }}>（选填）</span>
            </div>
            <input
              type="text"
              placeholder="周年聚餐，比较贵的餐厅"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 10,
                border: `1.5px solid ${C.border}`,
                fontSize: 13,
                fontFamily: "inherit",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div>
            <div style={{ fontSize: 11, color: C.sub, marginBottom: 4, fontWeight: 600 }}>
              日期 <span style={{ fontWeight: 400, color: C.muted }}>（默认今天）</span>
            </div>
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 10,
                border: `1.5px solid ${C.border}`,
                fontSize: 13,
                fontFamily: "inherit",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>
        </div>

        <div
          onClick={() => {
            if (!canSave) {
              return;
            }
            onSave({
              amount: Number(amount),
              direction,
              category,
              subject: subject.trim() || undefined,
              description: description.trim() || undefined,
              date,
            });
          }}
          style={{
            padding: "14px 0",
            borderRadius: 14,
            textAlign: "center",
            fontSize: 15,
            fontWeight: 700,
            cursor: canSave ? "pointer" : "not-allowed",
            background: canSave ? C.dark : "#CCC",
            color: canSave ? C.bg : "#999",
            border: canSave ? `2px solid ${C.dark}` : "2px solid #CCC",
            transition: "all .2s",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {canSave && (
            <>
              <span style={{ position: "absolute", left: 16, top: 8, width: 6, height: 6, borderRadius: "50%", background: C.coral, opacity: 0.6 }} />
              <span style={{ position: "absolute", left: 26, top: 5, width: 4, height: 4, borderRadius: "50%", background: C.blue, opacity: 0.5 }} />
              <span style={{ position: "absolute", right: 20, bottom: 8, width: 5, height: 5, borderRadius: 1, background: C.yellow, opacity: 0.5, transform: "rotate(18deg)" }} />
            </>
          )}
          记一笔
        </div>
      </div>
    </div>
  );
}

function SuccessToast({ visible, entry }) {
  if (!visible || !entry) {
    return null;
  }

  return (
    <div
      style={{
        position: "absolute",
        top: 80,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 60,
        background: C.white,
        borderRadius: 14,
        padding: "12px 20px",
        border: `2px solid ${C.dark}`,
        boxShadow: "0 8px 24px rgba(0,0,0,.15)",
        display: "flex",
        alignItems: "center",
        gap: 10,
        whiteSpace: "nowrap",
      }}
    >
      <div style={{ width: 32, height: 32, borderRadius: 10, background: C.mint, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ color: C.white, fontSize: 16, fontWeight: 700 }}>✓</span>
      </div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.dark }}>已记录</div>
        <div style={{ fontSize: 11, color: C.sub }}>
          {entry.direction === "out" ? "−" : "+"}¥{entry.amount} · {entry.category}
        </div>
      </div>
    </div>
  );
}

function EntryBottomNav({ onOpenHome, onOpenSettings }) {
  return (
    <div
      style={{
        background: C.white,
        borderTop: `1.5px solid ${C.border}`,
        paddingTop: 3,
        paddingBottom: "max(env(safe-area-inset-bottom), 8px)",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "flex-end",
        flexShrink: 0,
        zIndex: 20,
      }}
    >
      <div onClick={onOpenSettings} style={{ textAlign: "center", padding: "4px 16px", cursor: onOpenSettings ? "pointer" : "default" }}>
        <GearIcon />
        <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>设置</div>
      </div>
      <div onClick={onOpenHome} style={{ position: "relative", textAlign: "center", cursor: "pointer" }}>
        <div style={{ marginTop: -12 }}>
          <div
            style={{
              width: 52,
              height: 52,
              background: C.dark,
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: "rotate(2deg)",
            }}
          >
            <NavIcon />
          </div>
          <div style={{ fontSize: 10, fontWeight: 700, marginTop: 3, color: C.dark }}>首页</div>
        </div>
      </div>
      <div style={{ textAlign: "center", padding: "4px 16px" }}>
        <NoteIcon active />
        <div style={{ fontSize: 10, color: C.dark, fontWeight: 700, marginTop: 2 }}>记账</div>
      </div>
    </div>
  );
}

export default function MoniEntryPrototype({
  onOpenHome,
  onOpenSettings,
  currentLedgerName = "日常开销",
  ledgers = [],
  activeLedgerId = "",
  onChangeActiveLedgerId = () => {},
}) {
  const recentReferenceEntries = useMemo(() => buildRecentReferenceEntries(), []);
  const [phase, setPhase] = useState("idle");
  const [hoverCat, setHoverCat] = useState(null);
  const [dragPoint, setDragPoint] = useState(null);
  const [selectedCat, setSelectedCat] = useState(null);
  const [pressed, setPressed] = useState(false);
  const [savedCount, setSavedCount] = useState(0);
  const [toastEntry, setToastEntry] = useState(null);
  const [showToast, setShowToast] = useState(false);

  const longPressTimerRef = useRef(null);
  const isPointerDownRef = useRef(false);
  const longPressTriggeredRef = useRef(false);
  const pressStartRef = useRef({ x: 0, y: 0 });
  const hoverCatRef = useRef(null);

  const clearLongPressTimer = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }, []);

  const resetDragState = useCallback(() => {
    setHoverCat(null);
    hoverCatRef.current = null;
    setDragPoint(null);
  }, []);

  const openEntryForm = useCallback((category) => {
    setSelectedCat(category);
    setPhase("form");
    setHoverCat(null);
    hoverCatRef.current = null;
    setDragPoint(null);
  }, []);

  const closeOverlay = useCallback(() => {
    setPhase("idle");
    setHoverCat(null);
    hoverCatRef.current = null;
    setDragPoint(null);
  }, []);

  const handleButtonClick = useCallback(() => {
    if (longPressTriggeredRef.current) {
      longPressTriggeredRef.current = false;
      return;
    }
    setPhase("selecting");
  }, []);

  const handleButtonPointerDown = useCallback(
    (event) => {
      if (event.pointerType === "mouse" && event.button !== 0) {
        return;
      }

      isPointerDownRef.current = true;
      longPressTriggeredRef.current = false;
      pressStartRef.current = { x: event.clientX, y: event.clientY };
      setPressed(true);
      clearLongPressTimer();

      longPressTimerRef.current = setTimeout(() => {
        if (!isPointerDownRef.current) {
          return;
        }
        longPressTriggeredRef.current = true;
        setPhase("dragging");
        setDragPoint({ x: pressStartRef.current.x, y: pressStartRef.current.y });
      }, 400);
    },
    [clearLongPressTimer],
  );

  useEffect(() => {
    if (phase !== "dragging") {
      return undefined;
    }

    const handlePointerMove = (event) => {
      setDragPoint({ x: event.clientX, y: event.clientY });
      const hitElement = document.elementFromPoint(event.clientX, event.clientY);
      const hitCategory = hitElement?.closest?.("[data-drop-category]")?.getAttribute("data-drop-category") ?? null;
      setHoverCat(hitCategory);
      hoverCatRef.current = hitCategory;
    };

    const handlePointerUp = () => {
      isPointerDownRef.current = false;
      setPressed(false);
      clearLongPressTimer();
      if (hoverCatRef.current) {
        openEntryForm(hoverCatRef.current);
        return;
      }
      closeOverlay();
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
    };
  }, [clearLongPressTimer, closeOverlay, openEntryForm, phase]);

  useEffect(() => {
    const shouldLockScroll = phase === "dragging" || phase === "selecting" || phase === "form";
    const previousOverflow = document.body.style.overflow;
    if (shouldLockScroll) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [phase]);

  useEffect(
    () => () => {
      clearLongPressTimer();
    },
    [clearLongPressTimer],
  );

  const handleButtonPointerEnd = useCallback(() => {
    isPointerDownRef.current = false;
    setPressed(false);
    clearLongPressTimer();
  }, [clearLongPressTimer]);

  const handleSave = useCallback((entry) => {
    setSavedCount((count) => count + 1);
    setToastEntry(entry);
    setShowToast(true);
    setPhase("idle");
    setSelectedCat(null);
    resetDragState();
    window.setTimeout(() => {
      setShowToast(false);
    }, 1500);
  }, [resetDragState]);

  return (
    <div
      style={{
        width: 390,
        minHeight: PHONE_FRAME_HEIGHT,
        maxHeight: PHONE_FRAME_HEIGHT,
        background: C.bg,
        borderRadius: 24,
        border: `2.5px solid ${C.dark}`,
        overflow: "hidden",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Nunito', -apple-system, 'Helvetica Neue', 'PingFang SC', sans-serif",
        boxShadow: "0 20px 60px rgba(0,0,0,.18)",
        paddingTop: "env(safe-area-inset-top)",
      }}
    >
      <Decor />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800&family=Space+Mono:wght@400;700&display=swap');
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { transform: translateY(100%) } to { transform: translateY(0) } }
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
      `}</style>

      {/* 使用共享顶栏，保证首页与记账页的品牌位置、账本胶囊样式和间距一致。 */}
      <TopHeader mode="ledger" ledgerName={currentLedgerName} ledgers={ledgers} activeLedgerId={activeLedgerId} onSelectLedger={onChangeActiveLedgerId} />

      <div style={{ flex: 1, overflowY: "auto", position: "relative", zIndex: 1 }}>
        <div style={{ padding: "12px 16px 6px" }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: C.dark, fontFamily: "'Nunito',sans-serif" }}>记账</div>
          <div style={{ fontSize: 12, color: C.sub, marginTop: 2 }}>导入账单或随手记录一笔</div>
        </div>

        <div style={{ padding: "8px 0" }}>
          <ImportCard />
        </div>

        <div style={{ padding: "16px 16px 8px", display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: C.dark, fontFamily: "'Nunito',sans-serif" }}>随手记</div>
          <div style={{ flex: 1, height: 1.5, background: C.border, borderRadius: 1 }} />
          <div style={{ fontSize: 10, color: C.muted, padding: "2px 8px", borderRadius: 999, background: C.white, border: `1px solid ${C.border}` }}>现金 · 补漏</div>
        </div>

        <div style={{ padding: "0 16px 10px" }}>
          <div style={{ fontSize: 12, color: C.sub, lineHeight: 1.55 }}>长按下方按钮，拖到想记录的分类里，即可快速记一笔。</div>
        </div>

        {savedCount > 0 && (
          <div style={{ margin: "0 16px 12px", padding: "10px 14px", borderRadius: 10, background: C.greenBg, border: `1.5px solid ${C.mint}30`, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 14 }}>📝</span>
            <span style={{ fontSize: 12, color: C.greenText, fontWeight: 600 }}>本次已记录 {savedCount} 笔</span>
          </div>
        )}

        <div style={{ padding: "0 0 12px" }}>
          <RecentReferenceList entries={recentReferenceEntries} />
        </div>

        {phase === "idle" && (
          <div style={{ padding: "6px 0 0" }} onPointerUp={handleButtonPointerEnd} onPointerCancel={handleButtonPointerEnd}>
            <EntryButton pressed={pressed} onClick={handleButtonClick} onPointerDown={handleButtonPointerDown} />
          </div>
        )}

        <div style={{ height: 88 }} />
      </div>

      <EntryBottomNav onOpenHome={onOpenHome} onOpenSettings={onOpenSettings} />

      <CategoryOverlay
        visible={phase === "selecting" || phase === "dragging"}
        hoverCat={hoverCat}
        dragPoint={dragPoint}
        isDragging={phase === "dragging"}
        onSelect={openEntryForm}
        onClose={closeOverlay}
      />

      <EntryFormPanel visible={phase === "form"} category={selectedCat} onSave={handleSave} onClose={closeOverlay} />
      <SuccessToast visible={showToast} entry={toastEntry} />
    </div>
  );
}
