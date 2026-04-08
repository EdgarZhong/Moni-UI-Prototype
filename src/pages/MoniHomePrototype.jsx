import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AUTO_CAROUSEL_MS,
  C,
  DAYS,
  FILTERS,
  HAS_BUDGET,
  INCOME,
  MANUAL_IDLE_LOCK_MS,
  MANUAL_RESUME_MS,
  PHONE_FRAME_HEIGHT,
  TREND,
} from "../features/moni-home/config.js";
import { buildOverview, getCategory, getRange, isInRange } from "../features/moni-home/helpers.js";
import {
  BottomNav,
  DateRangeDialog,
  DayCard,
  Decor,
  DisplayBoard,
  DragOverlay,
  HintCard,
  Logo,
  OverviewCard,
  ReasonDialog,
  StatsBar,
  TagRail,
} from "../features/moni-home/components.jsx";
import { triggerImpact } from "../platform/haptics.js";

export default function MoniHome({ onOpenEntry }) {
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [trendOffset, setTrendOffset] = useState(0);
  const [trendDragShift, setTrendDragShift] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState("全部");
  const [aiOn, setAiOn] = useState(false);
  const [aiStop, setAiStop] = useState(false);
  const [hintVisible, setHintVisible] = useState(true);
  const [dragItem, setDragItem] = useState(null);
  const [dragPoint, setDragPoint] = useState(null);
  const [hoverCategory, setHoverCategory] = useState(null);
  const [reasonItem, setReasonItem] = useState(null);
  const [controlOpen, setControlOpen] = useState(false);
  const [controlHit, setControlHit] = useState(null);
  const [rangeMode, setRangeMode] = useState("本月");
  const [customStart, setCustomStart] = useState("2026-03-01");
  const [customEnd, setCustomEnd] = useState("2026-04-07");
  const [rangeDialogOpen, setRangeDialogOpen] = useState(false);
  const [stickyRail, setStickyRail] = useState(false);
  const [scrollStage, setScrollStage] = useState("初始");
  const [expandedDays, setExpandedDays] = useState([]);
  const [manualTouchedAt, setManualTouchedAt] = useState(null);
  const [resumeClock, setResumeClock] = useState(Date.now());

  const scrollRef = useRef(null);
  const railRef = useRef(null);
  const dayRefs = useRef({});
  const holdRef = useRef(null);
  const controlRef = useRef(null);
  const boardSwipeRef = useRef(null);
  const trendSwipeRef = useRef(null);
  const pressRef = useRef(null);
  const hoverCategoryRef = useRef(null);
  const dragLockRef = useRef(null);

  const range = useMemo(() => getRange(rangeMode, customStart, customEnd), [rangeMode, customStart, customEnd]);
  const rangeBounds = useMemo(() => {
    const dates = [...DAYS.map((day) => day.id), ...INCOME.map((item) => item.date), ...TREND.map((item) => item.key)].sort();
    return {
      min: dates[0],
      max: dates[dates.length - 1],
    };
  }, []);
  const maxTrendOffset = Math.max(0, TREND.length - 7);
  const trendStepPx = 260 / 6;
  const trendStartIndex = Math.max(0, TREND.length - 7 - trendOffset);
  const trendMinTranslate = -(maxTrendOffset * trendStepPx);
  const trendBaseTranslate = -(trendStartIndex * trendStepPx);
  const trendTrackTranslate = clamp(trendBaseTranslate + trendDragShift, trendMinTranslate, 0);
  const trendTrackMax = Math.max(...TREND.map((item) => item.amount), 1);
  const rangeDays = useMemo(() => DAYS.filter((day) => isInRange(day.id, range)), [range]);

  const filterItems = useCallback(
    (items) => {
      if (selectedFilter === "全部") {
        return items;
      }
      if (selectedFilter === "未分类") {
        return items.filter((item) => !getCategory(item));
      }
      return items.filter((item) => getCategory(item) === selectedFilter);
    },
    [selectedFilter],
  );

  const renderDays = useMemo(
    () => rangeDays.map((day) => ({ ...day, visibleItems: filterItems(day.items) })).filter((day) => day.visibleItems.length > 0),
    [rangeDays, filterItems],
  );

  const latestId = renderDays[0]?.id;
  const expenseItems = useMemo(() => rangeDays.flatMap((day) => day.items), [rangeDays]);
  const expenseTotal = expenseItems.reduce((sum, item) => sum + item.a, 0);
  const incomeTotal = INCOME.filter((item) => isInRange(item.date, range)).reduce((sum, item) => sum + item.amount, 0);
  const txCount = expenseItems.length;
  const unclassifiedCount = expenseItems.filter((item) => !getCategory(item)).length;
  const overview = useMemo(() => buildOverview(expenseItems), [expenseItems]);
  const budgetPct = 62;
  const budgetColor = budgetPct < 70 ? C.mint : budgetPct < 90 ? C.amber : C.coral;

  const syncExpandedDays = useCallback(
    (nextStage) => {
      if (nextStage === "初始") {
        setExpandedDays(latestId ? [latestId] : []);
        return;
      }
      if (nextStage === "完全") {
        setExpandedDays(renderDays.map((day) => day.id));
      }
    },
    [latestId, renderDays],
  );

  const expandVisibleCollapsedDays = useCallback(() => {
    const container = scrollRef.current;
    if (!container) {
      return;
    }
    const containerRect = container.getBoundingClientRect();
    const visibleIds = renderDays
      .filter((day) => {
        const rect = dayRefs.current[day.id]?.getBoundingClientRect();
        return rect && rect.top >= containerRect.top + 24 && rect.top < containerRect.bottom - 72;
      })
      .map((day) => day.id);

    if (visibleIds.length > 0) {
      setExpandedDays((prev) => Array.from(new Set([...prev, ...visibleIds])));
    }
  }, [renderDays]);

  const resetInitialExpanded = useCallback(() => {
    setExpandedDays(latestId ? [latestId] : []);
  }, [latestId]);

  const handleScroll = useCallback(() => {
    const container = scrollRef.current;
    if (!container) {
      return;
    }
    const stickyAt = railRef.current ? Math.max(railRef.current.offsetTop - 8, 120) : 240;
    const sticky = container.scrollTop >= stickyAt;
    const nextStage = container.scrollTop < 18 ? "初始" : container.scrollTop < stickyAt ? "过渡" : "完全";

    setStickyRail(sticky);
    setScrollStage((prev) => {
      if (prev !== nextStage) {
        syncExpandedDays(nextStage);
      }
      return nextStage;
    });

    if (nextStage === "过渡") {
      expandVisibleCollapsedDays();
    }
    if (nextStage === "初始") {
      resetInitialExpanded();
    }
  }, [expandVisibleCollapsedDays, resetInitialExpanded, syncExpandedDays]);

  useEffect(() => {
    if (scrollStage === "初始") {
      resetInitialExpanded();
    }
    if (scrollStage === "完全") {
      setExpandedDays(renderDays.map((day) => day.id));
    }
  }, [scrollStage, renderDays, resetInitialExpanded]);

  useEffect(() => {
    if (!HAS_BUDGET) {
      return undefined;
    }
    const now = Date.now();
    if (manualTouchedAt) {
      const idleLockUntil = manualTouchedAt + MANUAL_IDLE_LOCK_MS;
      const resumeAt = manualTouchedAt + MANUAL_RESUME_MS;
      if (now < idleLockUntil) {
        const timer = setTimeout(() => setResumeClock(Date.now()), idleLockUntil - now);
        return () => clearTimeout(timer);
      }
      if (now < resumeAt) {
        const timer = setTimeout(() => setResumeClock(Date.now()), resumeAt - now);
        return () => clearTimeout(timer);
      }
    }
    const timer = setTimeout(() => {
      setCarouselIndex((prev) => (prev + 1) % 2);
      setResumeClock(Date.now());
    }, AUTO_CAROUSEL_MS);
    return () => clearTimeout(timer);
  }, [carouselIndex, manualTouchedAt, resumeClock]);

  const manualSwitch = useCallback(
    (nextIndex) => {
      if (!HAS_BUDGET) {
        return;
      }
      setCarouselIndex(nextIndex);
      setManualTouchedAt(Date.now());
      setResumeClock(Date.now());
    },
    [],
  );

  const handleBoardSwipeEnd = useCallback(() => {
    if (!boardSwipeRef.current) {
      return;
    }
    const { sx, sy, ex, ey } = boardSwipeRef.current;
    const deltaX = ex - sx;
    const deltaY = ey - sy;
    if (Math.abs(deltaY) > 28 && Math.abs(deltaY) > Math.abs(deltaX)) {
      if (deltaY < 0) {
        manualSwitch(Math.min(1, carouselIndex + 1));
      } else {
        manualSwitch(Math.max(0, carouselIndex - 1));
      }
    }
    boardSwipeRef.current = null;
  }, [carouselIndex, manualSwitch]);

  const handleBoardPointerDown = useCallback((event) => {
    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }
    boardSwipeRef.current = {
      sx: event.clientX,
      sy: event.clientY,
      ex: event.clientX,
      ey: event.clientY,
      axis: null,
    };
  }, []);

  const handleBoardPointerMove = useCallback((event) => {
    if (!boardSwipeRef.current) {
      return;
    }
    const next = { ...boardSwipeRef.current, ex: event.clientX, ey: event.clientY };
    if (!next.axis) {
      const deltaX = Math.abs(next.ex - next.sx);
      const deltaY = Math.abs(next.ey - next.sy);
      if (deltaX > 8 || deltaY > 8) {
        next.axis = deltaY >= deltaX ? "vertical" : "horizontal";
      }
    }
    if (next.axis === "vertical") {
      event.preventDefault();
    }
    boardSwipeRef.current = next;
  }, []);

  const handleTrendSwipeEnd = useCallback(() => {
    if (!trendSwipeRef.current) {
      return;
    }
    const { sx, ex, sy, ey, axis } = trendSwipeRef.current;
    const deltaX = ex - sx;
    const deltaY = ey - sy;
    if (axis === "horizontal") {
      const nextStartIndex = clamp(Math.round(-trendTrackTranslate / trendStepPx), 0, maxTrendOffset);
      setTrendOffset(maxTrendOffset - nextStartIndex);
      setTrendDragShift(0);
    } else if (Math.abs(deltaY) > 28 && Math.abs(deltaY) > Math.abs(deltaX)) {
      if (deltaY > 0) {
        manualSwitch(Math.max(0, carouselIndex - 1));
      } else {
        manualSwitch(Math.min(1, carouselIndex + 1));
      }
    }
    setTrendDragShift(0);
    trendSwipeRef.current = null;
  }, [carouselIndex, manualSwitch, maxTrendOffset, trendStepPx, trendTrackTranslate]);

  const handleTrendPointerDown = useCallback((event) => {
    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }
    event.stopPropagation();
    trendSwipeRef.current = {
      sx: event.clientX,
      ex: event.clientX,
      sy: event.clientY,
      ey: event.clientY,
      axis: null,
    };
  }, []);

  const handleTrendPointerMove = useCallback((event) => {
    if (!trendSwipeRef.current) {
      return;
    }
    event.stopPropagation();
    const next = { ...trendSwipeRef.current, ex: event.clientX, ey: event.clientY };
    if (!next.axis) {
      const deltaX = Math.abs(next.ex - next.sx);
      const deltaY = Math.abs(next.ey - next.sy);
      if (deltaX > 8 || deltaY > 8) {
        next.axis = deltaX >= deltaY ? "horizontal" : "vertical";
      }
    }
    if (next.axis === "horizontal") {
      event.preventDefault();
      setTrendDragShift(event.clientX - next.sx);
    }
    trendSwipeRef.current = next;
  }, []);

  const startHold = useCallback((callback) => {
    clearTimeout(holdRef.current);
    holdRef.current = setTimeout(callback, 420);
  }, []);

  const stopHold = useCallback(() => {
    clearTimeout(holdRef.current);
  }, []);

  const cancelPendingPress = useCallback(() => {
    pressRef.current = null;
    clearTimeout(holdRef.current);
  }, []);

  const lockDragScroll = useCallback(() => {
    if (dragLockRef.current) {
      return;
    }
    dragLockRef.current = {
      bodyOverflow: document.body.style.overflow,
      containerOverflowY: scrollRef.current?.style.overflowY,
      containerTouchAction: scrollRef.current?.style.touchAction,
    };
    document.body.style.overflow = "hidden";
    if (scrollRef.current) {
      scrollRef.current.style.overflowY = "hidden";
      scrollRef.current.style.touchAction = "none";
    }
  }, []);

  const unlockDragScroll = useCallback(() => {
    if (!dragLockRef.current) {
      return;
    }
    document.body.style.overflow = dragLockRef.current.bodyOverflow;
    if (scrollRef.current) {
      scrollRef.current.style.overflowY = dragLockRef.current.containerOverflowY ?? "auto";
      scrollRef.current.style.touchAction = dragLockRef.current.containerTouchAction ?? "auto";
    }
    dragLockRef.current = null;
  }, []);

  const resolveHoverCategory = useCallback((clientX, clientY) => {
    const target = document.elementFromPoint(clientX, clientY)?.closest("[data-drop-category]");
    const category = target?.getAttribute("data-drop-category") ?? null;
    hoverCategoryRef.current = category;
    setHoverCategory(category);
  }, []);

  const handleItemPointerDown = useCallback(
    (item, event) => {
      if (event.pointerType === "mouse" && event.button !== 0) {
        return;
      }
      pressRef.current = {
        item,
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        startScrollTop: scrollRef.current?.scrollTop ?? 0,
        mode: "pending",
      };
      startHold(() => {
        const point = { x: pressRef.current?.startX ?? event.clientX, y: pressRef.current?.startY ?? event.clientY };
        lockDragScroll();
        setDragItem(item);
        setDragPoint(point);
        hoverCategoryRef.current = null;
        setHoverCategory(null);
        void triggerImpact("light");
      });
    },
    [lockDragScroll, startHold],
  );

  const handleItemPointerMove = useCallback(
    (event) => {
      if (!pressRef.current || pressRef.current.pointerId !== event.pointerId || dragItem) {
        return;
      }
      const pressState = pressRef.current;
      const deltaX = event.clientX - pressState.startX;
      const deltaY = event.clientY - pressState.startY;

      if (pressState.mode === "scroll") {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = pressState.startScrollTop - deltaY;
        }
        return;
      }

      if (Math.abs(deltaX) > 8 || Math.abs(deltaY) > 8) {
        if (Math.abs(deltaY) > Math.abs(deltaX)) {
          clearTimeout(holdRef.current);
          pressRef.current = { ...pressState, mode: "scroll" };
          if (scrollRef.current) {
            scrollRef.current.scrollTop = pressState.startScrollTop - deltaY;
          }
          return;
        }
        cancelPendingPress();
      }
    },
    [cancelPendingPress, dragItem],
  );

  const handleItemPointerUp = useCallback(() => {
    if (pressRef.current) {
      pressRef.current = null;
    }
    if (!dragItem) {
      clearTimeout(holdRef.current);
    }
  }, [cancelPendingPress, dragItem]);

  const handleDropCategory = useCallback(
    (category) => {
      setReasonItem({ ...dragItem, nc: category });
      unlockDragScroll();
      setDragItem(null);
      setDragPoint(null);
      setHoverCategory(null);
      hoverCategoryRef.current = null;
      void triggerImpact("medium");
    },
    [dragItem, unlockDragScroll],
  );

  const handleStartControl = useCallback(() => {
    startHold(() => {
      setControlOpen(true);
      setControlHit(null);
      void triggerImpact("light");
    });
  }, [startHold]);

  const handleEndControl = useCallback(() => {
    clearTimeout(holdRef.current);
    if (!controlOpen) {
      return;
    }
    if (controlHit === "开启") {
      setAiOn(true);
      setAiStop(false);
      void triggerImpact("medium");
    }
    if (controlHit === "关闭" && aiOn) {
      setAiStop(true);
      void triggerImpact("medium");
      setTimeout(() => {
        setAiOn(false);
        setAiStop(false);
      }, 2200);
    }
    setControlOpen(false);
    setControlHit(null);
  }, [aiOn, controlHit, controlOpen]);

  const handleCancelControl = useCallback(() => {
    clearTimeout(holdRef.current);
    if (controlOpen) {
      setControlOpen(false);
      setControlHit(null);
    }
  }, [controlOpen]);

  const updateControlHit = useCallback((clientY) => {
    const rect = controlRef.current?.getBoundingClientRect();
    if (!rect) {
      return;
    }
    setControlHit(clientY - rect.top < rect.height / 2 ? "开启" : "关闭");
  }, []);

  const toggleDay = useCallback(
    (dayId) => {
      if (scrollStage === "完全") {
        return;
      }
      setExpandedDays((prev) => (prev.includes(dayId) ? prev.filter((item) => item !== dayId) : [...prev, dayId]));
    },
    [scrollStage],
  );

  useEffect(() => {
    hoverCategoryRef.current = hoverCategory;
  }, [hoverCategory]);

  useEffect(() => {
    if (!dragItem) {
      return undefined;
    }
    const handlePointerMove = (event) => {
      setDragPoint({ x: event.clientX, y: event.clientY });
      resolveHoverCategory(event.clientX, event.clientY);
    };
    const handlePointerEnd = (event) => {
      const target = document.elementFromPoint(event.clientX, event.clientY)?.closest("[data-drop-category]");
      const category = target?.getAttribute("data-drop-category") ?? hoverCategoryRef.current;
      if (category) {
        handleDropCategory(category);
        return;
      }
      unlockDragScroll();
      setDragItem(null);
      setDragPoint(null);
      setHoverCategory(null);
      hoverCategoryRef.current = null;
    };
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerEnd);
    window.addEventListener("pointercancel", handlePointerEnd);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerEnd);
      window.removeEventListener("pointercancel", handlePointerEnd);
    };
  }, [dragItem, handleDropCategory, resolveHoverCategory]);

  useEffect(
    () => () => {
      clearTimeout(holdRef.current);
      unlockDragScroll();
    },
    [unlockDragScroll],
  );

  const boardHandlers = {
    onPointerDown: handleBoardPointerDown,
    onPointerMove: handleBoardPointerMove,
    onPointerUp: handleBoardSwipeEnd,
    onPointerCancel: () => {
      boardSwipeRef.current = null;
    },
  };

  const trendHandlers = {
    onPointerDown: handleTrendPointerDown,
    onPointerMove: handleTrendPointerMove,
    onPointerUp: handleTrendSwipeEnd,
    onPointerCancel: () => {
      setTrendDragShift(0);
      trendSwipeRef.current = null;
    },
  };

  return (
    <div style={{ width: "100%", maxWidth: 390, margin: "0 auto", background: C.bg, borderRadius: 24, border: `2.5px solid ${C.dark}`, overflow: "hidden", position: "relative", fontFamily: "'Nunito',-apple-system,sans-serif", height: PHONE_FRAME_HEIGHT, display: "flex", flexDirection: "column", paddingTop: "env(safe-area-inset-top)" }}>
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
      <style>{`@keyframes rb{0%{border-color:${C.coral}}25%{border-color:${C.yellow}}50%{border-color:${C.blue}}75%{border-color:${C.mint}}100%{border-color:${C.coral}}}@keyframes rbs{0%{box-shadow:0 0 0 2.5px ${C.coral},0 0 12px ${C.coral}44}25%{box-shadow:0 0 0 2.5px ${C.yellow},0 0 12px ${C.yellow}44}50%{box-shadow:0 0 0 2.5px ${C.blue},0 0 12px ${C.blue}44}75%{box-shadow:0 0 0 2.5px ${C.mint},0 0 12px ${C.mint}44}100%{box-shadow:0 0 0 2.5px ${C.coral},0 0 12px ${C.coral}44}}@keyframes p{0%,100%{opacity:1}50%{opacity:.35}}@keyframes sk{0%,100%{opacity:.42}50%{opacity:.16}}@keyframes fu{from{transform:translateY(10px);opacity:0}to{transform:translateY(0);opacity:1}}.ab{animation:rb 3s linear infinite;border-width:2.5px;border-style:solid}.ag{animation:rbs 3s linear infinite}.sk{animation:sk 1.7s ease-in-out infinite;background:#ddd;border-radius:4px}.fi{animation:fu .28s ease-out}*{box-sizing:border-box}::-webkit-scrollbar{display:none}`}</style>
      <Decor />

      <div style={{ padding: "12px 16px 8px", display: "flex", justifyContent: "space-between", alignItems: "center", background: C.bg, zIndex: 20, flexShrink: 0, position: "relative" }}>
        <Logo />
        <div style={{ fontSize: 12, color: "#666", background: C.white, border: `1.5px solid ${C.border}`, borderRadius: 20, padding: "4px 14px", display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }}>
          日常开销
          <svg width="10" height="10" viewBox="0 0 10 10">
            <path d="M2 4L5 7L8 4" stroke="#888" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      <div ref={scrollRef} data-scroll-container onScroll={handleScroll} style={{ flex: 1, overflowY: "auto", overflowX: "hidden", position: "relative", zIndex: 1 }}>
        <DisplayBoard
          currentIndex={carouselIndex}
          budgetPct={budgetPct}
          budgetColor={budgetColor}
          hasBudget={HAS_BUDGET}
          trendData={TREND}
          trendTrackMax={trendTrackMax}
          trendTrackTranslate={trendTrackTranslate}
          trendIsDragging={trendDragShift !== 0}
          maxTrendOffset={maxTrendOffset}
          onManualSwitch={manualSwitch}
          onTrendForward={() => {
            setTrendDragShift(0);
            setTrendOffset((prev) => Math.min(maxTrendOffset, prev + 1));
          }}
          onTrendBackward={() => {
            setTrendDragShift(0);
            setTrendOffset((prev) => Math.max(0, prev - 1));
          }}
          boardHandlers={boardHandlers}
          trendHandlers={trendHandlers}
        />

        <HintCard visible={hintVisible} onClose={() => setHintVisible(false)} />
        <StatsBar rangeLabel={range.label} expenseTotal={expenseTotal} incomeTotal={incomeTotal} count={txCount} isCustom={rangeMode === "自定义"} />
        <OverviewCard rangeLabel={range.label} overview={overview} onOpen={() => setRangeDialogOpen(true)} />

        <div
          ref={railRef}
          style={{
            position: "sticky",
            top: 0,
            zIndex: 15,
            background: C.bg,
            paddingTop: 8,
            borderBottom: `1px solid ${stickyRail ? C.border : "transparent"}`,
          }}
        >
          <TagRail filters={FILTERS} selectedFilter={selectedFilter} unclassifiedCount={unclassifiedCount} onSelect={setSelectedFilter} />
        </div>

        <div style={{ padding: "6px 16px 96px" }}>
          {renderDays.map((day) => (
            <DayCard
              key={day.id}
              day={day}
              isExpanded={expandedDays.includes(day.id)}
              isAi={(aiOn || aiStop) && day.id === "2026-04-04"}
              aiStop={aiStop}
              onToggle={() => toggleDay(day.id)}
              onItemPointerDown={handleItemPointerDown}
              onItemPointerMove={handleItemPointerMove}
              onItemPointerUp={handleItemPointerUp}
              dayRef={(node) => {
                dayRefs.current[day.id] = node;
              }}
            />
          ))}
        </div>
      </div>

      <BottomNav
        aiOn={aiOn}
        aiStop={aiStop}
        controlOpen={controlOpen}
        controlHit={controlHit}
        onStartControl={handleStartControl}
        onEndControl={handleEndControl}
        onCancelControl={handleCancelControl}
        onUpdateControlHit={{ ref: controlRef, move: updateControlHit }}
        // 首页中的“记账”入口负责切换到记账页原型，便于在同一台设备框中联看两页。
        onOpenEntry={onOpenEntry}
      />

      {controlOpen && (
        <div
          onPointerDown={(event) => {
            event.preventDefault();
            event.stopPropagation();
            setControlOpen(false);
            setControlHit(null);
          }}
          style={{ position: "absolute", inset: 0, zIndex: 25, background: "transparent" }}
        />
      )}

      <DragOverlay
        dragItem={dragItem}
        dragPoint={dragPoint}
        hoverCategory={hoverCategory}
        onHover={setHoverCategory}
        onLeave={() => {
          setHoverCategory(null);
          hoverCategoryRef.current = null;
        }}
        onDrop={handleDropCategory}
        onClose={() => {
          unlockDragScroll();
          setDragItem(null);
          setDragPoint(null);
          setHoverCategory(null);
          hoverCategoryRef.current = null;
        }}
      />
      <ReasonDialog item={reasonItem} onClose={() => setReasonItem(null)} />
      <DateRangeDialog
        visible={rangeDialogOpen}
        rangeMode={rangeMode}
        customStart={customStart}
        customEnd={customEnd}
        minDate={rangeBounds.min}
        maxDate={rangeBounds.max}
        onClose={() => setRangeDialogOpen(false)}
        onQuickSelect={(mode) => {
          setRangeMode(mode);
          setRangeDialogOpen(false);
        }}
        onCustomStartChange={setCustomStart}
        onCustomEndChange={setCustomEnd}
        onConfirmCustom={() => {
          setRangeMode("自定义");
          setRangeDialogOpen(false);
        }}
      />
    </div>
  );
}
