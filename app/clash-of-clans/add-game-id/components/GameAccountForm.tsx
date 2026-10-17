'use client';

import React, { ChangeEvent } from 'react';

interface GameAccountFormProps {
  playerTag: string;
  setPlayerTag: (val: string) => void;
  playerName: string;
  setPlayerName: (val: string) => void;
  selectedTownHall: string;
  handleTownHallChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

export default function GameAccountForm({
  playerTag,
  setPlayerTag,
  playerName,
  setPlayerName,
  selectedTownHall,
  handleTownHallChange
}: GameAccountFormProps) {
  return (
    <div className="bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Game Account & Guard Setup
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            Player Tag
          </label>
          <input
            type="text"
            placeholder="#2ABC123"
            value={playerTag}
            onChange={(e) => setPlayerTag(e.target.value)}
            className="w-full border border-gray-300 p-2.5 rounded-lg text-sm font-medium text-gray-900 placeholder:text-gray-400 bg-white focus:ring-2 focus:ring-[#81007f] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            Account Name
          </label>
          <input
            type="text"
            placeholder="Account Name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="w-full border border-gray-300 p-2.5 rounded-lg text-sm font-medium text-gray-900 placeholder:text-gray-400 bg-white focus:ring-2 focus:ring-[#81007f] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            Select Town Hall
          </label>
          <select
            value={selectedTownHall}
            onChange={handleTownHallChange}
            className="w-full border border-gray-300 p-2.5 rounded-lg text-sm font-semibold text-[#81007f] bg-white focus:ring-2 focus:ring-[#81007f] focus:outline-none cursor-pointer"
          >
            <option value="">-- Select Town Hall --</option>
            {Array.from({ length: 18 }, (_, i) => i + 1).map((th) => (
              <option key={th} value={th}>Town Hall {th}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}