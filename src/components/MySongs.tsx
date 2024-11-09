import React, { useState } from "react";
import { ListModal } from "./List";
import { UpdatePriceModal } from "./UpdatePrice";

const demoSongs = [
  {
    id: "1",
    name: "Ethereal Dreams",
    description: "A journey through ambient soundscapes",
    genre: "Electronic",
    ipfs_url: "https://example.com/song1.mp3",
    image: "https://i.ytimg.com/vi/2SUwOgmvzK4/maxresdefault.jpg",
    forSale: false,
    value: "0.05",
    price_per_play: "0.05",
  },
  {
    id: "2",
    name: "Cosmic Rhythm",
    description: "Deep space beats and stellar harmonies",
    genre: "Ambient",
    ipfs_url: "https://example.com/song2.mp3",
    image: "https://i.scdn.co/image/ab6761610000e5ebd0d5560f6b2ebe39a6d20704",
    forSale: true,
    value: "0.2",
    price_per_play: "0.05",
  },
  {
    id: "3",
    name: "Neural Beats",
    description: "AI-generated melodies with a human touch",
    genre: "Experimental",
    ipfs_url: "https://example.com/song3.mp3",
    image:
      "https://www.entertainmentvine.com/wp-content/uploads/2014/05/MnM-Banner_534aed4d7c3921c21db8f28e4c41f151.jpg",
    forSale: false,
    value: "0.8",
    price_per_play: "0.05",
  },
];

export default function MySongs() {
  const [selectedSong, setSelectedSong] = useState<any>(null);
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const handleList = (price: string) => {
    setIsListModalOpen(false);
    setSelectedSong(null);
  };

  const handleUpdatePrice = (newPrice: string) => {
    setIsUpdateModalOpen(false);
    setSelectedSong(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Songs Collection</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {demoSongs.map((song) => (
          <div
            key={song.id}
            className="bg-zinc-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all"
          >
            <div
              key={song.id}
              className="bg-zinc-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all"
            >
              <div
                className="w-full h-48 bg-cover bg-center rounded-lg mb-4"
                style={{ backgroundImage: `url(${song.image})` }}
              />
              <h2 className="text-xl font-bold mb-2">{song.name}</h2>
              <div className="flex items-center justify-between mb-4">
                <span className="bg-gradient-to-r from-fuchsia-600 to-violet-600 px-3 py-1 rounded-full text-sm">
                  {song.price_per_play}/play
                </span>
                {song.forSale && (
                  <span className="text-green-500 font-semibold">
                    Listed for {song.value} VC
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
                song.forSale
                  ? setIsUpdateModalOpen(true)
                  : setIsListModalOpen(true);
              }}
              className="w-full bg-gradient-to-tr from-fuchsia-600 to-violet-600 px-4 py-2 rounded-md font-semibold hover:opacity-90 transition-opacity"
            >
              {song.forSale ? "Update Price" : "Sell This Track"}
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
