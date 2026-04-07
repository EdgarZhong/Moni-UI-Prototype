import React, { useMemo } from "react";
import { C, CAT, OVERVIEW_COLORS } from "./config.js";
import { getCategory, seededShapes } from "./helpers.js";

export function Decor() {
  const shapes = useMemo(() => seededShapes(777, 9, { x: 0, y: 40, w: 390, h: 900 }), []);
  return (
    <svg style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "visible" }} width="100%" height="100%">
      {shapes.map((shape) => {
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
  );
}

export function Logo() {
  return (
    <svg width="118" height="38" viewBox="0 0 140 42">
      <text x="4" y="32" fill={C.dark} fontSize="28" fontWeight="800" fontFamily="'Nunito',sans-serif" letterSpacing="-1">
        M
      </text>
      <circle cx="25" cy="32" r="1.8" fill={C.coral} opacity=".75" />
      <text x="30" y="32" fill={C.dark} fontSize="28" fontWeight="800" fontFamily="'Nunito',sans-serif" letterSpacing="-1">
        oni
      </text>
      <circle cx="27" cy="9" r="3.6" fill={C.coral} opacity=".72" />
      <circle cx="20" cy="5" r="2.4" fill={C.blue} opacity=".62" />
      <rect x="23" y="2.5" width="4" height="4" rx=".8" fill={C.yellow} opacity=".55" transform="rotate(20 25 4.5)" />
      <line x1="68" y1="7" x2="75" y2="7" stroke={C.mint} strokeWidth="1.8" strokeLinecap="round" opacity=".35" />
    </svg>
  );
}

export function NavIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 52 52">
      <path d="M12 40C12 40 12 16 14.5 12C16 10 17 10.5 23 24C23 24 24 26.5 25 24C26 21.5 29 10.5 30.5 12C32 13.5 33 40 33 40" stroke="#F5F0EB" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="39" cy="13" r="4.4" fill={C.coral} opacity=".88" />
      <circle cx="31" cy="7.2" r="3" fill={C.blue} opacity=".76" />
      <rect x="34" y="5.1" width="4.6" height="4.6" rx="1" fill={C.yellow} opacity=".68" transform="rotate(18 36.4 7.5)" />
    </svg>
  );
}

export function GearIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="3.2" stroke="#8E8E8E" strokeWidth="1.6" />
      <path d="M12 2.5v2.2M12 19.3v2.2M4.92 4.92l1.56 1.56M17.52 17.52l1.56 1.56M2.5 12h2.2M19.3 12h2.2M4.92 19.08l1.56-1.56M17.52 6.48l1.56-1.56" stroke="#8E8E8E" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function NoteIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="4" y="3" width="16" height="18" rx="3" stroke="#8E8E8E" strokeWidth="1.6" />
      <path d="M8 8h8M8 12h8M12 16h4" stroke="#8E8E8E" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M12 9v6M9 12h6" stroke="#8E8E8E" strokeWidth="1.4" strokeLinecap="round" opacity=".55" />
    </svg>
  );
}

export function TagChip({ category, warning }) {
  if (warning) {
    return <span style={{ fontSize: 10, padding: "1px 7px", borderRadius: 999, fontWeight: 700, background: C.pinkBg, color: "#D85A30", border: "1px dashed #D85A30", whiteSpace: "nowrap" }}>未分类</span>;
  }
  if (!category) {
    return null;
  }
  const meta = CAT[category];
  return <span style={{ fontSize: 10, padding: "1px 7px", borderRadius: 999, fontWeight: 700, background: meta.bg, color: meta.color, whiteSpace: "nowrap" }}>{category}</span>;
}

export function HintCard({ visible, onClose }) {
  if (!visible) {
    return null;
  }
  return (
    <div className="fi" style={{ margin: "6px 16px", background: C.warmBg, border: `1.5px solid ${C.warmBd}`, borderRadius: 10, padding: "8px 12px", display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ fontSize: 13 }}>📄</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, color: "#8B5E2B", fontWeight: 700 }}>距上次导入已 7 天</div>
        <div style={{ fontSize: 10, color: "#A07040" }}>导入新账单看看最近花了多少？</div>
      </div>
      <div style={{ fontSize: 11, color: "#8B5E2B", fontWeight: 600, background: C.white, border: "1px solid #E0C09A", borderRadius: 6, padding: "3px 10px", cursor: "pointer" }}>导入</div>
      <span style={{ fontSize: 14, color: "#CCC", cursor: "pointer" }} onClick={onClose}>×</span>
    </div>
  );
}

export function StatsBar({ rangeLabel, expenseTotal, incomeTotal, count, isCustom }) {
  return (
    <div style={{ margin: "6px 16px", display: "flex", gap: 6 }}>
      {[
        { label: `${rangeLabel}支出`, value: `¥${expenseTotal.toLocaleString()}`, color: C.coral },
        { label: `${rangeLabel}收入`, value: `¥${incomeTotal.toLocaleString()}`, color: C.mint },
        { label: isCustom ? "区间笔数" : "共计", value: `${count} 笔`, color: C.dark },
      ].map((item) => (
        <div key={item.label} style={{ flex: 1, background: C.white, border: `1.5px solid ${C.border}`, borderRadius: 10, padding: "7px 8px", textAlign: "center" }}>
          <div style={{ fontSize: 9, color: C.sub }}>{item.label}</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: item.color, fontFamily: "'Space Mono',monospace" }}>{item.value}</div>
        </div>
      ))}
    </div>
  );
}

export function DisplayBoard({
  currentIndex,
  budgetPct,
  budgetColor,
  hasBudget,
  trendSlice,
  trendMax,
  trendOffset,
  maxTrendOffset,
  onManualSwitch,
  onTrendForward,
  onTrendBackward,
  boardHandlers,
  trendHandlers,
}) {
  return (
    <div
      {...boardHandlers}
      style={{ margin: "4px 16px", overflow: "hidden", borderRadius: 14, border: `2px solid ${C.dark}`, height: 132, position: "relative", background: C.white, touchAction: "pan-x" }}
    >
      <div style={{ transition: "transform .45s cubic-bezier(.4,0,.2,1)", transform: `translateY(-${currentIndex * 132}px)` }}>
        <div style={{ height: 132, padding: "16px 16px 14px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg,${budgetColor} ${budgetPct}%,#EEE ${budgetPct}%)` }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 8 }}>
            <div>
              <div style={{ fontSize: 10, color: C.sub }}>4月预算</div>
              <div style={{ fontSize: 26, fontWeight: 700, color: C.dark, letterSpacing: -1, fontFamily: "'Space Mono',monospace" }}>¥3,128</div>
              <div style={{ fontSize: 11, color: budgetColor, marginTop: 2 }}>剩余 ¥1,872 · 还有 24 天</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 10, color: C.sub }}>日均可用</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: C.dark, fontFamily: "'Space Mono',monospace" }}>¥78</div>
            </div>
          </div>
        </div>

        <div {...trendHandlers} style={{ height: 132, padding: "12px 14px", position: "relative", touchAction: "pan-y" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <div style={{ fontSize: 10, color: C.sub }}>近 7 天支出</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span onClick={onTrendForward} style={{ fontSize: 16, cursor: "pointer", opacity: trendOffset < maxTrendOffset ? 0.55 : 0.2, userSelect: "none" }}>‹</span>
              <span onClick={onTrendBackward} style={{ fontSize: 16, cursor: "pointer", opacity: trendOffset > 0 ? 0.55 : 0.2, userSelect: "none" }}>›</span>
            </div>
          </div>
          <svg width="100%" height="58" viewBox="0 0 260 58" preserveAspectRatio="none">
            <polyline points={trendSlice.map((item, index) => `${index * (260 / 6)},${50 - (item.amount / trendMax) * 42}`).join(" ")} fill="none" stroke={C.mint} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <polygon points={`${trendSlice.map((item, index) => `${index * (260 / 6)},${50 - (item.amount / trendMax) * 42}`).join(" ")} 260,50 0,50`} fill={C.mint} opacity=".08" />
          </svg>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 8, color: "#BBB" }}>
            {trendSlice.map((item, index) => (
              <span key={item.key} style={index === trendSlice.length - 1 && trendOffset === 0 ? { color: C.mint, fontWeight: 700 } : {}}>
                {item.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {hasBudget && (
        <div style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", gap: 5 }}>
          {[0, 1].map((index) => (
            <div key={index} onClick={() => onManualSwitch(index)} style={{ width: 5, height: 5, borderRadius: "50%", background: currentIndex === index ? C.dark : "#CCC", cursor: "pointer" }} />
          ))}
        </div>
      )}
    </div>
  );
}

export function OverviewCard({ rangeLabel, overview, onOpen }) {
  return (
    <div style={{ margin: "6px 16px", background: C.white, border: `1.5px solid ${C.border}`, borderRadius: 12, padding: "10px 14px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: C.dark }}>分类概览</div>
        <div onClick={onOpen} style={{ fontSize: 11, color: C.mint, fontWeight: 600, cursor: "pointer" }}>{rangeLabel} ›</div>
      </div>
      <div style={{ display: "flex", height: 8, borderRadius: 4, overflow: "hidden" }}>
        {overview.map((item) => (
          <div
            key={item.category}
            style={{
              width: `${Math.max(item.percent, 4)}%`,
              background: item.category === "未分类" ? `repeating-linear-gradient(45deg,${OVERVIEW_COLORS["未分类"]}33,${OVERVIEW_COLORS["未分类"]}33 2px,${OVERVIEW_COLORS["未分类"]}55 2px,${OVERVIEW_COLORS["未分类"]}55 4px)` : OVERVIEW_COLORS[item.category],
            }}
          />
        ))}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "3px 10px", marginTop: 6, fontSize: 9, color: "#666" }}>
        {overview.map((item) => (
          <span key={item.category} style={{ display: "flex", alignItems: "center", gap: 3 }}>
            <span style={{ width: 6, height: 6, borderRadius: 1.5, background: item.category === "未分类" ? OVERVIEW_COLORS["未分类"] : OVERVIEW_COLORS[item.category], display: "inline-block" }} />
            {item.category} {item.percent}%
          </span>
        ))}
      </div>
    </div>
  );
}

export function TagRail({ filters, selectedFilter, unclassifiedCount, onSelect }) {
  return (
    <div style={{ margin: 0, background: "transparent", padding: "0 16px 8px" }}>
      <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 2 }}>
        {filters.map((label) => {
          const active = selectedFilter === label;
          const warning = label === "未分类";
          return (
            <div
              key={label}
              onClick={() => onSelect(label)}
              style={{
                padding: "5px 12px",
                borderRadius: 999,
                fontSize: 11,
                whiteSpace: "nowrap",
                cursor: "pointer",
                fontWeight: active ? 700 : 600,
                transition: "all .2s",
                flexShrink: 0,
                background: active ? C.dark : warning ? C.pinkBg : C.white,
                color: active ? C.bg : warning ? "#D85A30" : "#666",
                border: active ? "none" : `1.5px solid ${warning ? C.pinkBd : C.border}`,
              }}
            >
              {label}
              {warning ? ` · ${unclassifiedCount}` : ""}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function DayCard({ day, isExpanded, isAi, aiStop, onToggle, onItemPointerDown, onItemPointerMove, onItemPointerUp, dayRef }) {
  const total = day.visibleItems.reduce((sum, item) => sum + item.a, 0);
  const allClassified = day.items.every((item) => getCategory(item));
  const isCollapsedSummary = !isExpanded && !isAi;

  return (
    <div
      ref={dayRef}
      className={isAi ? "ab" : ""}
      style={{
        background: C.white,
        borderRadius: 14,
        padding: isCollapsedSummary ? "13px 14px" : "12px 14px",
        marginBottom: 8,
        border: isAi ? undefined : isCollapsedSummary ? `1.5px solid ${C.border}` : `2px solid ${C.dark}`,
        opacity: isCollapsedSummary ? 0.76 : 1,
        transition: "all .25s ease",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }} onClick={onToggle}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: C.dark }}>{day.label}</span>
          {isAi && (
            <span style={{ fontSize: 10, color: aiStop ? C.amber : C.mint, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: aiStop ? C.amber : C.mint, animation: "p 1.5s infinite" }} />
              {aiStop ? "正在完成…" : "AI 处理中"}
            </span>
          )}
        </div>
        <span style={{ fontSize: 12, color: C.coral, fontFamily: "'Space Mono',monospace", fontWeight: 500 }}>−¥{total}</span>
      </div>

      {!isExpanded && !isAi && (
        <div style={{ fontSize: 10, color: C.muted, marginTop: 4 }}>
          {day.visibleItems.length} 笔 · {allClassified ? "全部已分类 ✓" : `${day.visibleItems.filter((item) => !getCategory(item)).length} 笔未分类`}
        </div>
      )}

      {(isExpanded || isAi) && (
        <div className="fi" style={{ marginTop: 6 }}>
          {day.visibleItems.map((item, index) => {
            if (isAi && index >= 1) {
              return (
                <div key={item.id} style={{ display: "flex", alignItems: "center", padding: "7px 0", borderBottom: index < day.visibleItems.length - 1 ? `0.5px solid ${C.line}` : "none" }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: "#F5F5F5", marginRight: 10, display: "flex", alignItems: "center", justifyContent: "center" }}><div className="sk" style={{ width: 14, height: 3 }} /></div>
                  <div style={{ flex: 1 }}><div className="sk" style={{ width: 90, height: 10, marginBottom: 4 }} /><div className="sk" style={{ width: 54, height: 8 }} /></div>
                  <div className="sk" style={{ width: 32, height: 10 }} />
                </div>
              );
            }

            const category = getCategory(item);
            const meta = category ? CAT[category] : null;
            const aiOnly = !item.userCat;
            return (
              <div
                key={item.id}
                onPointerDown={(event) => onItemPointerDown(item, event)}
                onPointerMove={onItemPointerMove}
                onPointerUp={onItemPointerUp}
                onPointerCancel={onItemPointerUp}
                onPointerLeave={onItemPointerUp}
                style={{ display: "flex", alignItems: "center", padding: "7px 0", borderBottom: index < day.visibleItems.length - 1 ? `0.5px solid ${C.line}` : "none", cursor: "pointer", userSelect: "none", touchAction: "pan-y" }}
              >
                <div style={{ width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, marginRight: 10, flexShrink: 0, background: category ? meta.bg : C.orangeBg, border: category ? "none" : "1.5px dashed #D85A30" }}>
                  {category ? meta.icons[item.ih % meta.icons.length] : <span style={{ fontSize: 13, color: "#D85A30", fontWeight: 700 }}>?</span>}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: C.dark }}>{item.n}</span>
                    {category ? <TagChip category={category} /> : <TagChip warning />}
                  </div>
                  <div style={{ fontSize: 9, color: C.muted, marginTop: 2, display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" }}>
                    {aiOnly && item.reason && <span style={{ fontSize: 9, padding: "1px 5px", borderRadius: 999, background: C.greenBg, color: C.greenText }}>AI: {item.reason}</span>}
                    <span>{item.t} · {item.pay}</span>
                  </div>
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: category ? C.dark : "#D85A30", flexShrink: 0, marginLeft: 8, fontFamily: "'Space Mono',monospace" }}>¥{item.a}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function BottomNav({ aiOn, aiStop, controlOpen, controlHit, onStartControl, onEndControl, onCancelControl, onUpdateControlHit }) {
  return (
    <div style={{ background: C.white, borderTop: `1.5px solid ${C.border}`, padding: "3px 0 8px", display: "flex", justifyContent: "space-around", alignItems: "flex-end", flexShrink: 0, zIndex: 20 }}>
      <div style={{ textAlign: "center", padding: "4px 16px", cursor: "pointer" }}>
        <GearIcon />
        <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>设置</div>
      </div>
      <div style={{ position: "relative", textAlign: "center", cursor: "pointer", touchAction: "none" }} onPointerDown={onStartControl} onPointerUp={onEndControl} onPointerCancel={onCancelControl} onPointerLeave={onCancelControl}>
        {controlOpen && (
          <div ref={onUpdateControlHit.ref} className="fi" onPointerMove={(event) => onUpdateControlHit.move(event.clientY)} style={{ position: "absolute", bottom: 62, left: "50%", transform: "translateX(-50%)", width: 56, height: 108, borderRadius: 28, overflow: "hidden", border: `2px solid ${C.dark}`, display: "flex", flexDirection: "column", boxShadow: "0 6px 20px rgba(0,0,0,.15)", zIndex: 30, background: C.white }}>
            <div style={{ flex: 1, background: controlHit === "开启" ? C.mint : C.white, color: controlHit === "开启" ? C.white : C.mint, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, borderBottom: `1px solid ${C.border}` }}>开启</div>
            <div style={{ flex: 1, background: controlHit === "关闭" ? C.coral : C.white, color: controlHit === "关闭" ? C.white : C.coral, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>关闭</div>
          </div>
        )}
        <div style={{ marginTop: -12 }}>
          <div className={aiOn || aiStop ? "ag" : ""} style={{ width: 52, height: 52, background: C.dark, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", transform: "rotate(2deg)", transition: "box-shadow .6s", boxShadow: aiStop ? `0 0 0 2.5px ${C.amber},0 0 10px ${C.amber}44` : undefined }}>
            <NavIcon />
          </div>
          <div style={{ fontSize: 10, fontWeight: 700, marginTop: 3, color: aiOn ? (aiStop ? C.amber : C.mint) : C.dark }}>{aiOn ? (aiStop ? "停止中…" : "运行中") : "首页"}</div>
        </div>
      </div>
      <div style={{ textAlign: "center", padding: "4px 16px", cursor: "pointer" }}>
        <NoteIcon />
        <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>记账</div>
      </div>
    </div>
  );
}

export function DragOverlay({ dragItem, dragPoint, hoverCategory, onHover, onLeave, onDrop, onClose }) {
  if (!dragItem) {
    return null;
  }
  return (
    <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 50, display: "flex", flexDirection: "column", padding: 16, touchAction: "none" }}>
      <div style={{ fontSize: 14, color: C.white, fontWeight: 700, textAlign: "center", marginTop: 12, marginBottom: 10 }}>拖放到分类中</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, padding: "0 4px", overflowY: "auto" }}>
        {Object.keys(CAT).map((category) => {
          const meta = CAT[category];
          return (
            <div
              key={category}
              data-drop-category={category}
              onPointerEnter={() => onHover(category)}
              onPointerLeave={onLeave}
              onClick={(event) => {
                event.stopPropagation();
                onDrop(category);
              }}
              style={{ background: C.white, border: `2.5px solid ${hoverCategory === category ? meta.color : C.border}`, borderRadius: 12, padding: "12px 8px", textAlign: "center", cursor: "pointer", transform: hoverCategory === category ? "scale(1.05)" : "scale(1)", transition: "all .2s" }}
            >
              <div style={{ fontSize: 20, marginBottom: 2 }}>{meta.icons[0]}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: meta.color }}>{category}</div>
            </div>
          );
        })}
      </div>
      <div
        style={{
          position: "fixed",
          left: dragPoint?.x ?? 0,
          top: dragPoint?.y ?? 0,
          transform: "translate(-50%, -115%)",
          background: C.white,
          borderRadius: 12,
          padding: "10px 16px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          boxShadow: "0 4px 20px rgba(0,0,0,.2)",
          pointerEvents: "none",
        }}
      >
        <div style={{ width: 32, height: 32, borderRadius: 8, background: C.orangeBg, display: "flex", alignItems: "center", justifyContent: "center", border: "1.5px dashed #D85A30" }}><span style={{ fontSize: 12, color: "#D85A30", fontWeight: 700 }}>?</span></div>
        <div><div style={{ fontSize: 13, fontWeight: 700, color: C.dark }}>{dragItem.n}</div><div style={{ fontSize: 11, color: C.muted }}>¥{dragItem.a}</div></div>
      </div>
      <div onClick={onClose} style={{ position: "absolute", right: 14, top: 12, color: C.white, fontSize: 18, lineHeight: 1, cursor: "pointer" }}>×</div>
    </div>
  );
}

export function ReasonDialog({ item, onClose }) {
  if (!item) {
    return null;
  }
  return (
    <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.45)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div className="fi" style={{ background: C.white, borderRadius: 16, padding: 20, width: "100%", maxWidth: 320, border: `2px solid ${C.dark}` }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: C.dark, marginBottom: 4 }}>已归为「{item.nc}」✓</div>
        <div style={{ fontSize: 12, color: C.muted, marginBottom: 12 }}>想告诉 AI 为什么？（可选）</div>
        <input type="text" placeholder="例：这是下午茶不是正餐" style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: `1.5px solid ${C.border}`, fontSize: 13, outline: "none", fontFamily: "inherit", background: "#FAFAFA" }} />
        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
          <div onClick={onClose} style={{ flex: 1, padding: 10, borderRadius: 10, border: `1.5px solid ${C.border}`, textAlign: "center", fontSize: 13, color: "#666", cursor: "pointer" }}>跳过</div>
          <div onClick={onClose} style={{ flex: 1, padding: 10, borderRadius: 10, background: C.dark, textAlign: "center", fontSize: 13, color: C.bg, fontWeight: 700, cursor: "pointer" }}>完成</div>
        </div>
      </div>
    </div>
  );
}

export function DateRangeDialog({ visible, rangeMode, customStart, customEnd, onClose, onQuickSelect, onCustomStartChange, onCustomEndChange, onConfirmCustom }) {
  if (!visible) {
    return null;
  }
  return (
    <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.4)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={onClose}>
      <div className="fi" onClick={(event) => event.stopPropagation()} style={{ background: C.white, borderRadius: 16, padding: 20, width: "100%", maxWidth: 320, border: `2px solid ${C.dark}` }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: C.dark, marginBottom: 12 }}>选择时间范围</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
          {["今天", "本周", "本月", "近三月"].map((label) => (
            <div key={label} onClick={() => onQuickSelect(label)} style={{ padding: "8px 16px", borderRadius: 20, fontSize: 13, cursor: "pointer", fontWeight: rangeMode === label ? 700 : 500, background: rangeMode === label ? C.dark : C.white, color: rangeMode === label ? C.bg : "#666", border: rangeMode === label ? "none" : `1.5px solid ${C.border}` }}>
              {label}
            </div>
          ))}
        </div>
        <div style={{ fontSize: 11, color: C.sub, marginBottom: 8 }}>自定义范围</div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 16 }}>
          <input type="date" value={customStart} onChange={(event) => onCustomStartChange(event.target.value)} style={{ flex: 1, padding: "8px 10px", borderRadius: 8, border: `1.5px solid ${C.border}`, fontSize: 12, fontFamily: "inherit" }} />
          <span style={{ color: C.muted }}>—</span>
          <input type="date" value={customEnd} onChange={(event) => onCustomEndChange(event.target.value)} style={{ flex: 1, padding: "8px 10px", borderRadius: 8, border: `1.5px solid ${C.border}`, fontSize: 12, fontFamily: "inherit" }} />
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <div onClick={onClose} style={{ flex: 1, padding: 10, borderRadius: 10, border: `1.5px solid ${C.border}`, textAlign: "center", fontSize: 13, color: "#666", cursor: "pointer" }}>取消</div>
          <div onClick={onConfirmCustom} style={{ flex: 1, padding: 10, borderRadius: 10, background: C.dark, textAlign: "center", fontSize: 13, color: C.bg, fontWeight: 700, cursor: "pointer" }}>确定</div>
        </div>
      </div>
    </div>
  );
}
