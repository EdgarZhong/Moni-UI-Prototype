import React from "react";
import MoniHome from "./pages/MoniHomePrototype.jsx";

export default function App() {
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
      <MoniHome />
    </div>
  );
}
