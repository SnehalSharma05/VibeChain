import React, { useState, useEffect } from "react";
import { getSonglist } from "../songListManager";

export default function AllSongs() {
  const [songs, setSongs] = useState<any[]>([]);

  useEffect(() => {
    const fetchSongs = async () => {
      const allSongs = await getSonglist();
      setSongs(allSongs);
    };
    fetchSongs();
  }, []);

  return (
    <>
      <h1 className="text-3xl font-bold p-4 bg-gradient-to-r from-fuchsia-600 to-violet-600 bg-clip-text text-transparent">
        Top Songs
      </h1>
      <ul className="p-1.5 flex flex-wrap">
        {songs.map((song) => (
          <li className="w-full lg:w-1/2 xl:w-1/3 p-1.5" key={song.ipfs_url}>
            <div className="block bg-zinc-800 rounded-md w-full overflow-hidden pb-4 shadow-lg">
              <div
                className="w-full h-40 bg-center bg-cover relative"
                style={{ backgroundImage: `url(${song.image_url})` }}
              >
                <div className="absolute left-1/2 -translate-x-1/2 bottom-2 w-5/6 bg-white rounded-md flex items-center bg-opacity-30 backdrop-blur-md">
                  <div className="w-full p-3">
                    <h3 className="font-semibold">Current Price</h3>
                    <div className="">{song.price} VC</div>
                  </div>
                </div>
              </div>

              <h3 className="font-semibold text-lg px-3 mt-2">{song.name}</h3>

              <div className="flex items-center px-3 mt-2">
                <span className="bg-gradient-to-r from-fuchsia-600 to-violet-600 px-3 py-1 rounded-full text-sm">
                  {song.genre}
                </span>
              </div>

              <div className="px-3 mt-2">
                <audio
                  controls
                  className="w-full mb-4 bg-zinc-700 rounded-lg"
                  controlsList="nodownload noplaybackrate"
                >
                  <source src={song.ipfs_url} type="audio/mp3" />
                </audio>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
