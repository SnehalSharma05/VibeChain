import React from "react";
import "./App.css";
import MainBody from "./components/UserDashboard";

function App() {
  return (
    <div className="relative">
      <div className="absolute inset-0">
        <MainBody />
      </div>
    </div>
  );
}

export default App;
