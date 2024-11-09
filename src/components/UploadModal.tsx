import React, { useState, useRef } from "react";
interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    price: string;
    file: string; //changed from File | null to string
    description: string;
    genre: string;
  }) => void;
  walletAddress: string;
}

// Add this function at the top level
export function UploadModal({ isOpen, onClose, onSubmit, walletAddress }: UploadModalProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

    let globalMusicId = 0; // Global counter for unique IDs

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!file) return;
      setIsUploading(true);
      try {
        // Upload MP3 file
        const formData = new FormData();
        formData.append('file', file);
    
        const fileResponse = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIwZWJlNGYzMi0xMjJhLTQwMTktYmFkOC00N2RmMWIwNWNhZGYiLCJlbWFpbCI6InVubmF0aGNoaXR0aW1hbGxhQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI0ODc1NGE4N2Y4NjZkNzQwOGZiMSIsInNjb3BlZEtleVNlY3JldCI6IjRiNjNjNDQyNjUwOGY2Njc0NzU4MjhlMmM0Y2MxZmZkMjU3NWM5Yzk3ODk0MmRlN2ZkOTgyNjM2ZGNiN2ExYTEiLCJleHAiOjE3NjI2NjU5NzZ9.2xjWie4o5Hyop8R7WQ8yZSaNXSNakMRlyTG0yDbVl1s`
          },
          body: formData
        });

        const fileData = await fileResponse.json();
        const mp3IpfsUrl = `https://gateway.pinata.cloud/ipfs/${fileData.IpfsHash}`;

        // Create metadata JSON
        const metadata = {
          name,
          description,
          genre,
          artist_name: walletAddress,
          ipfs_url: mp3IpfsUrl,
          timestamp: Date.now()
        };

        // Upload metadata JSON with unique ID
        const jsonBlob = new Blob([JSON.stringify(metadata)], { type: 'application/json' });
        const jsonFormData = new FormData();
        jsonFormData.append('file', jsonBlob);
        jsonFormData.append('pinataMetadata', JSON.stringify({
          name: `music_${globalMusicId}.json`
        }));

        const jsonResponse = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIwZWJlNGYzMi0xMjJhLTQwMTktYmFkOC00N2RmMWIwNWNhZGYiLCJlbWFpbCI6InVubmF0aGNoaXR0aW1hbGxhQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI0ODc1NGE4N2Y4NjZkNzQwOGZiMSIsInNjb3BlZEtleVNlY3JldCI6IjRiNjNjNDQyNjUwOGY2Njc0NzU4MjhlMmM0Y2MxZmZkMjU3NWM5Yzk3ODk0MmRlN2ZkOTgyNjM2ZGNiN2ExYTEiLCJleHAiOjE3NjI2NjU5NzZ9.2xjWie4o5Hyop8R7WQ8yZSaNXSNakMRlyTG0yDbVl1s`
          },
          body: jsonFormData
        });

        globalMusicId++; // Increment the global counter

        onSubmit({ 
          name, 
          price, 
          file: mp3IpfsUrl,
          description, 
          genre 
        });

        // Reset form
        setName("");
        setPrice("");
        setDescription("");
        setGenre("");
        setFile(null);

      } catch (error) {
        console.error('Upload error:', error);
      }
      finally {
        setIsUploading(false);
      }
    };
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  if (!isOpen) return null;
  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-zinc-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">Upload New Track</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-zinc-400 mb-2">Track Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-zinc-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-fuchsia-600"
              placeholder="Enter track name"
              required
            />
          </div>

          <div>
            <label className="block text-zinc-400 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-zinc-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-fuchsia-600 h-24"
              placeholder="Enter track description"
              required
            />
          </div>

          <div>
            <label className="block text-zinc-400 mb-2">Genre</label>
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full bg-zinc-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-fuchsia-600"
              required
            >
              <option value="">Select genre</option>
              <option value="electronic">Electronic</option>
              <option value="rock">Rock</option>
              <option value="jazz">Jazz</option>
              <option value="classical">Classical</option>
              <option value="hip-hop">Hip Hop</option>
              <option value="ambient">Ambient</option>
            </select>
          </div>

          <div>
            <label className="block text-zinc-400 mb-2">Price (VC Coins)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full bg-zinc-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-fuchsia-600"
              placeholder="Enter price in VC"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div>
            <label className="block text-zinc-400 mb-2">Upload MP3</label>
            <div className="relative">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="audio/mp3"
                className="hidden"
                required
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-zinc-700 rounded-md p-2 text-left hover:bg-zinc-600 transition-colors"
              >
                {file ? file.name : "Choose MP3 file"}
              </button>
              {file && (
                <span className="absolute right-2 top-2 text-green-500">✓</span>
              )}
            </div>
          </div>

          <div className="flex space-x-4 mt-6">
          <button
          type="submit"
          disabled={isUploading}
          className={`bg-gradient-to-tr from-fuchsia-600 to-violet-600 px-6 py-2 rounded-md font-semibold flex-1 hover:opacity-90 transition-all flex items-center justify-center ${isUploading ? 'opacity-75' : ''}`}
        >
          {isUploading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Uploading to IPFS...
            </>
          ) : (
            'Upload Track'
          )}
        </button>
          </div>  
        </form>
      </div>
    </div>
  );
}