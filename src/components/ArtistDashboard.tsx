import React, { useRef, useState, useEffect } from "react";
const artistStats = {
    totalPlays: 1234567,
    totalEarnings: 45.32,
    monthlyPlays: 123456,
    monthlyEarnings: 12.34,
    topSongs: [
      { title: "Ethereal Melodies", plays: 500000, earnings: 15.5 },
      { title: "Digital Dreams", plays: 300000, earnings: 12.3 },
      { title: "Crypto Beats", plays: 250000, earnings: 8.7 },
    ],
  };

  // Add interface for ArtistDashboard props
interface ArtistDashboardProps {
    onUpload: () => void;
  }
  
export function ArtistDashboard({ onUpload }: ArtistDashboardProps) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Artist Dashboard</h1>
          {/* <button
            onClick={onUpload}
            className="bg-gradient-to-tr from-fuchsia-600 to-violet-600 px-6 py-2 rounded-md font-semibold"
          >
            Release New Track
          </button> */}
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-zinc-800 rounded-lg p-4 shadow-lg">
            <h3 className="text-zinc-400 text-sm">Total Plays</h3>
            <p className="text-2xl font-bold mt-2">
              {artistStats.totalPlays.toLocaleString()}
            </p>
          </div>
          <div className="bg-zinc-800 rounded-lg p-4 shadow-lg">
            <h3 className="text-zinc-400 text-sm">Total Earnings</h3>
            <p className="text-2xl font-bold mt-2">
              {artistStats.totalEarnings} VC
            </p>
          </div>
          <div className="bg-zinc-800 rounded-lg p-4 shadow-lg">
            <h3 className="text-zinc-400 text-sm">Monthly Plays</h3>
            <p className="text-2xl font-bold mt-2">
              {artistStats.monthlyPlays.toLocaleString()}
            </p>
          </div>
          <div className="bg-zinc-800 rounded-lg p-4 shadow-lg">
            <h3 className="text-zinc-400 text-sm">Monthly Earnings</h3>
            <p className="text-2xl font-bold mt-2">
              {artistStats.monthlyEarnings} VC
            </p>
          </div>
        </div>
  
        <div className="bg-zinc-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Top Performing Songs</h2>
          <div className="space-y-4">
            {artistStats.topSongs.map((song, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-zinc-700 rounded-md"
              >
                <div className="flex items-center">
                  <span className="text-lg font-semibold mr-4">#{index + 1}</span>
                  <div>
                    <h3 className="font-semibold">{song.title}</h3>
                    <p className="text-sm text-zinc-400">
                      {song.plays.toLocaleString()} plays
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{song.earnings} VC</p>
                  <p className="text-sm text-zinc-400">earnings</p>
                </div>
              </div>
            ))}
          </div>
        </div>
  
        <div className="mt-8 bg-gradient-to-tr from-fuchsia-600 to-violet-600 rounded-lg p-6 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-xl font-bold mb-2">
              Ready to Drop Your Next Hit?
            </h2>
            <p className="text-white/70 mb-4">
              Upload your new track and start earning VC coins
            </p>
            <button onClick={onUpload} className="bg-white text-gray-900 px-6 py-2 rounded-md font-semibold">
              Upload Track
            </button>
          </div>
          <div className="absolute right-0 top-0 opacity-10">
            <svg className="w-48 h-48" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
          </div>
        </div>
      </div>
    );
  }