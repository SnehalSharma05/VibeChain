import React, { useState } from "react";

interface UpdatePriceModalProps {
  isOpen: boolean;
  songName: string;
  currentPrice: string;
  onClose: () => void;
  onSubmit: (newPrice: string) => void;
}

export function UpdatePriceModal({
  isOpen,
  songName,
  currentPrice,
  onClose,
  onSubmit,
}: UpdatePriceModalProps) {
  const [newPrice, setNewPrice] = useState(currentPrice);

  const handleSubmit = () => {
    onSubmit(newPrice);
    setNewPrice(currentPrice);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-zinc-800 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">
          Update Price for "{songName}"
        </h2>
        <div className="mb-4">
          <label className="block text-zinc-400 mb-2">
            New Price (VC Coins)
          </label>
          <input
            type="number"
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
            className="w-full bg-zinc-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-fuchsia-600"
            placeholder="Enter new price in VC"
            min="0"
            step="0.01"
            required
          />
        </div>
        <div className="flex space-x-4">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-gradient-to-tr from-fuchsia-600 to-violet-600 px-4 py-2 rounded-md font-semibold"
          >
            Update Price
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-zinc-700 px-4 py-2 rounded-md font-semibold"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}