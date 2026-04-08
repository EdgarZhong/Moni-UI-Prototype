import React from "react";
import MoniHome from "./pages/MoniHomePrototype.jsx";
import MoniEntryPrototype from "./pages/MoniEntryPrototype.jsx";

export default function App() {
  // 应用入口先在同一个手机框架里承接首页与记账页原型切换。
  // 这样既方便比对两页视觉关系，也便于后续把底部导航联动真实接上。
  const [activePage, setActivePage] = React.useState(() => (window.location.hash === "#entry" ? "entry" : "home"));

  // 通过 hash 保持页面可直达，便于自动化截图和后续单页调试。
  React.useEffect(() => {
    window.location.hash = activePage === "entry" ? "entry" : "home";
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
      {activePage === "home" ? <MoniHome onOpenEntry={() => setActivePage("entry")} /> : <MoniEntryPrototype onOpenHome={() => setActivePage("home")} />}
    </div>
  );
}
