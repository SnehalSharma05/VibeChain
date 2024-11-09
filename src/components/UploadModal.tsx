import React, { useState, useRef } from "react";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    price: string;
    file: File | null;
    description: string;
    genre: string;
  }) => void;
}

export function UploadModal({ isOpen, onClose, onSubmit }: UploadModalProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, price, file, description, genre });
    setName("");
    setPrice("");
    setDescription("");
    setGenre("");
    setFile(null);
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
              className="bg-gradient-to-tr from-fuchsia-600 to-violet-600 px-6 py-2 rounded-md font-semibold flex-1 hover:opacity-90 transition-opacity"
            >
              Upload Track
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-zinc-700 px-6 py-2 rounded-md font-semibold flex-1 hover:bg-zinc-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
