import React from "react";
import "./App.css";
import MainBody from "./components/UserDashboard";

function App() {
  return (
    <>
      <div className="flex items-center justify-between px-4 py-2 max-w-screen-xl mx-auto w-full flex-wrap">
        <div className="w-full flex justify-center items-center gap-4 mb-4">
          <div className="w-24 h-24 rounded-full overflow-hidden transform hover:scale-110 transition-transform duration-300 hover:rotate-3 hover:shadow-lg hover:shadow-purple-500/50">
            <img
              src="/logo.jpeg"
              alt="VibeChain Logo"
              className="w-full h-full object-cover animate-spin-slow hover:animate-none"
            />
          </div>
          <h1 className="text-7xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent animate-pulse hover:animate-none hover:from-purple-600 hover:to-blue-400 transition-colors duration-500 font-['Lexend']">
            VibeChain
          </h1>
        </div>
      </div>
      <MainBody />
    </>
  );
}

export default App;