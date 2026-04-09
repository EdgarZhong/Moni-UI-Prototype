import React from "react";
import MoniHome from "./pages/MoniHomePrototype.jsx";
import MoniEntryPrototype from "./pages/MoniEntryPrototype.jsx";
import MoniSettingsPrototype from "./pages/MoniSettingsPrototype.jsx";

export default function App() {
  // 应用入口现在承接首页、设置页、记账页三页原型切换。
  // 这样可以直接验证底部导航闭环，也能观察三页切换时画布和背景是否统一。
  const [activePage, setActivePage] = React.useState(() => {
    if (window.location.hash === "#entry") {
      return "entry";
    }
    if (window.location.hash === "#settings") {
      return "settings";
    }
    return "home";
  });
  // 账本状态提升到 App 层，确保首页、记账页、设置页读写同一份数据。
  const [ledgers, setLedgers] = React.useState([
    { id: "daily", name: "日常开销", isDefault: true },
    { id: "travel", name: "旅行基金", isDefault: false },
  ]);
  const [activeLedgerId, setActiveLedgerId] = React.useState("daily");
  const currentLedgerName = React.useMemo(() => {
    const hit = ledgers.find((item) => item.id === activeLedgerId) || ledgers[0];
    return hit?.name || "未设置账本";
  }, [ledgers, activeLedgerId]);

  // 通过 hash 保持页面可直达，便于后续截图、自测和单页调试。
  React.useEffect(() => {
    if (activePage === "entry") {
      window.location.hash = "entry";
      return;
    }
    if (activePage === "settings") {
      window.location.hash = "settings";
      return;
    }
    window.location.hash = "home";
  }, [activePage]);

  return (
    <div
      style={{
        minHeight: "100vh",
        margin: 0,
        background: "#EAE1D8",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px",
      }}
    >
      {activePage === "home" ? (
        <MoniHome
          onOpenEntry={() => setActivePage("entry")}
          onOpenSettings={() => setActivePage("settings")}
          currentLedgerName={currentLedgerName}
          ledgers={ledgers}
          activeLedgerId={activeLedgerId}
          onChangeActiveLedgerId={setActiveLedgerId}
        />
      ) : null}
      {activePage === "settings" ? (
        <MoniSettingsPrototype
          onOpenHome={() => setActivePage("home")}
          onOpenEntry={() => setActivePage("entry")}
          ledgers={ledgers}
          activeLedgerId={activeLedgerId}
          onChangeLedgers={setLedgers}
          onChangeActiveLedgerId={setActiveLedgerId}
        />
      ) : null}
      {activePage === "entry" ? (
        <MoniEntryPrototype
          onOpenHome={() => setActivePage("home")}
          onOpenSettings={() => setActivePage("settings")}
          currentLedgerName={currentLedgerName}
          ledgers={ledgers}
          activeLedgerId={activeLedgerId}
          onChangeActiveLedgerId={setActiveLedgerId}
        />
      ) : null}
    </div>
  );
}
