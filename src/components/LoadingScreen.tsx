import React from "react";

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-zinc-900 flex flex-col items-center justify-center">
      <div className="w-32 h-32 rounded-full overflow-hidden transform hover:scale-110 transition-transform duration-300">
        <img
          src="/logo.jpeg"
          alt="VibeChain Logo"
          className="w-full h-full object-cover animate-spin-slow"
        />
      </div>
      <h1 className="text-4xl font-bold mt-4 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent animate-pulse font-['Lexend']">
        VibeChain
      </h1>
    </div>
  );
}
