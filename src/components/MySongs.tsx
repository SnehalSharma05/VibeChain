import React, { useState, useEffect } from "react";
import { ListModal } from "./List";
import { UpdatePriceModal } from "./UpdatePrice";
import { getMySongs } from "../songListManager";
import { userAddress, setUserAddress } from "./UserDashboard";
export default function MySongs({ songs }: { songs: any[] }) {
  const [selectedSong, setSelectedSong] = useState<any>(null);
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const handleList = async (price: string) => {
    // After listing logic
    setIsListModalOpen(false);
    setSelectedSong(null);
  };

  const handleUpdatePrice = async (newPrice: string) => {
    // After update logic
    setIsUpdateModalOpen(false);
    setSelectedSong(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Songs Collection</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {songs.map((song) => (
          <div
            key={song.ipfs_url}
            className="bg-zinc-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all"
          >
            <div className="bg-zinc-800 rounded-lg p-6">
              <div
                className="w-full h-48 bg-cover bg-center rounded-lg mb-4"
                style={{ backgroundImage: `url(${song.image_url})` }}
              />
              <h2 className="text-xl font-bold mb-2">{song.name}</h2>
              <div className="flex items-center justify-between mb-4">
                <span className="bg-gradient-to-r from-fuchsia-600 to-violet-600 px-3 py-1 rounded-full text-sm">
                  {song.genre}
                </span>
                {song.buyable && (
                  <span className="text-green-500 font-semibold">
                    Listed for {song.price} VC
                  </span>
                )}
              </div>
              <audio controls className="w-full mb-4 bg-zinc-700 rounded-lg">
                <source src={song.ipfs_url} type="audio/mp3" />
              </audio>
            </div>
            <button
              onClick={() => {
                setSelectedSong(song);
                song.buyable
                  ? setIsUpdateModalOpen(true)
                  : setIsListModalOpen(true);
              }}
              className="w-full bg-gradient-to-tr from-fuchsia-600 to-violet-600 px-4 py-2 rounded-md font-semibold hover:opacity-90 transition-opacity"
            >
              {song.buyable ? "Update Price" : "Sell This Track"}
            </button>
          </div>
        ))}
      </div>

      <ListModal
        isOpen={isListModalOpen}
        songName={selectedSong?.name || ""}
        onClose={() => {
          setIsListModalOpen(false);
          setSelectedSong(null);
        }}
        onSubmit={handleList}
      />

      <UpdatePriceModal
        isOpen={isUpdateModalOpen}
        songName={selectedSong?.name || ""}
        currentPrice={selectedSong?.price || ""}
        onClose={() => {
          setIsUpdateModalOpen(false);
          setSelectedSong(null);
        }}
        onSubmit={handleUpdatePrice}
      />
    </div>
  );
}
