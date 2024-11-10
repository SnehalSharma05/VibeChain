import React, { useState, useEffect } from 'react';

interface Artist {
  id: string;
  name: string;
  songCount: number;
  totalPlays: number;
}

interface Metadata {
  lastMusicId: number;
  totalSongs: number;
  artists: Artist[];
  genres: {
    [key: string]: number;
  };
}

interface SongMetadata {
  name: string;
  description: string;
  genre: string;
  artist_name: string;
  ipfs_url: string;
  timestamp: number;
  price: string;
}

interface SongProps {
  walletAddress: string;
}

export function Songs({ walletAddress }: SongProps) {
  const [songs, setSongs] = useState<SongMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMusicMetadata = async (index: number) => {
    try {
      const response = await fetch(`/music_${index}.json`);
      if (!response.ok) {
        throw new Error('Song metadata not found');
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching music_${index}.json:`, error);
      return null;
    }
  };
  
  useEffect(() => {
    const loadMusicData = async () => {
      setIsLoading(true);
      const response = await fetch('/metadata.json');
      const metadata = await response.json();
      const musicItems = [];
      
      for (let i = 0; i <= metadata.lastMusicId; i++) {
        const songMetadata = await fetchMusicMetadata(i);
        if (songMetadata) {
          musicItems.push(songMetadata);
        }
      }
      setSongs(musicItems);
      setIsLoading(false);
    };
  
    loadMusicData();
  }, []);
  const handlePlay = async (e: React.MouseEvent, ipfsUrl: string) => {
    if (!walletAddress) {
      e.preventDefault();
      alert("Please connect your Petra wallet first");
      return;
    }
  
    // Get current metadata
    const response = await fetch('/metadata.json');
    const metadata: Metadata = await response.json();
    
    const artist = metadata.artists.find((a: Artist) => a.id === walletAddress);
    if (artist) {
      artist.totalPlays++;
      
      // Update metadata file
      await fetch('/metadata.json', {
        method: 'PUT',
        body: JSON.stringify(metadata)
      });
    }
  };
  

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-fuchsia-600"></div>
      </div>
    );
  }

  return (
    <ul className="p-1.5 flex flex-wrap">
      {songs.map((song, index) => (
        <li className="w-full lg:w-1/2 xl:w-1/3 p-1.5" key={index}>
          <div className="block bg-zinc-800 rounded-md w-full overflow-hidden pb-4 shadow-lg">
            <div className="w-full h-40 bg-center bg-cover relative">
              <div className="absolute left-1/2 -translate-x-1/2 bottom-2 w-5/6 bg-white rounded-md flex items-center bg-opacity-30 backdrop-blur-md">
                <div className="w-full p-3">
                  <h3 className="font-semibold">Genre: {song.genre}</h3>
                  <div className="text-sm">{new Date(song.timestamp).toLocaleDateString()}</div>
                </div>
              </div>
            </div>
            
            <h3 className="font-semibold text-lg px-3 mt-2">{song.name}</h3>
            <p className="text-zinc-400 px-3 text-sm">{song.description}</p>
            
            <div className="flex items-center px-3 mt-2">
              <span className="text-zinc-400">Artist: {song.artist_name}</span>
              <span className="text-zinc-400 ml-4">Price: {song.price} VC</span>
            </div>

            <div className="flex mt-2">
              <div className="p-3 w-1/2">
                <button 
                  onClick={(e) => handlePlay(e, song.ipfs_url)}
                  className="bg-gradient-to-tr from-fuchsia-600 to-violet-600 w-full h-12 rounded-md font-semibold"
                >
                  Play Song
                </button>
              </div>
              <div className="p-3 w-1/2">
                <audio src={song.ipfs_url} controls className="w-full" />
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
