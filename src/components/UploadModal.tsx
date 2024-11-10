import React, { useState, useRef } from "react";
import { updateSonglist } from '../songListManager'
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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  let buyable = true;
  //let globalMusicId = 0; // Global counter for unique IDs
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !imageFile) return;
    setIsUploading(true);
    try {
      // Upload MP3 file
      const formData = new FormData();
      formData.append('file', file);

      const fileResponse = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer -YOUR_KEY-`
        },
        body: formData
      });

      const fileData = await fileResponse.json();
      const mp3IpfsUrl = `https://gateway.pinata.cloud/ipfs/${fileData.IpfsHash}`;

      // Upload image file
      const imageFormData = new FormData();
      imageFormData.append('file', imageFile);

      const imageResponse = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer -YOUR_KEY-`
        },
        body: imageFormData
      });

      const imageData = await imageResponse.json();
      const imageIpfsUrl = `https://gateway.pinata.cloud/ipfs/${imageData.IpfsHash}`;

      // Create metadata JSON
      const songDetails = {
        name,
        genre,
        buyable,
        price,
        artist_address: walletAddress,
        owner_address: walletAddress,
        ipfs_url: mp3IpfsUrl,
        image_url: imageIpfsUrl,
        timestamp: Date.now()
      };
      updateSonglist(songDetails);
      console.log("songDetails:", songDetails);

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
      setImageFile(null);

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
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Upload New Track</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-zinc-700 rounded-full transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

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
          <div>
            <label className="block text-zinc-400 mb-2">Upload Thumbnail Image</label>
            <div className="relative">
              <input
                type="file"
                ref={imageInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
                required
              />
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                className="w-full bg-zinc-700 rounded-md p-2 text-left hover:bg-zinc-600 transition-colors"
              >
                {imageFile ? imageFile.name : "Choose thumbnail image"}
              </button>
              {imageFile && (
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
