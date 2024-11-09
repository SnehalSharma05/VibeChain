import React from "react";
import "./App.css";
import MainBody from "./components/UserDashboard";

function App() {
  return (
    <>
      <div className="flex items-center justify-between px-4 py-2 max-w-screen-xl mx-auto w-full flex-wrap">
        <div className="w-full flex justify-center items-center gap-4 mb-4">
          <div className="w-24 h-24 rounded-full overflow-hidden">
            <img
              src="/logo.png"
              alt="VibeChain Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-7xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent animate-pulse">
            VibeChain
          </h1>
        </div>
      </div>
      <MainBody />
    </>
  );
}

export default App;
