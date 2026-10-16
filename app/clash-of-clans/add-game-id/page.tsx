'use client';

import React, { useState, useEffect, ChangeEvent } from 'react';

interface LimitData {
  minCount?: number;
  maxCount?: number;
  maxLevel?: number | null;
}

interface ItemData {
  itemId: string;
  name: string;
  limits: LimitData;
}

interface UserSelection {
  count: number;
  level: number;
  minCount: number;
  maxCount: number;
  maxLevel: number | null;
}

export default function AddGameIdPage() {
  const [playerTag, setPlayerTag] = useState<string>('');
  const [playerName, setPlayerName] = useState<string>('');
  const [selectedTownHall, setSelectedTownHall] = useState<string>('');

  const [townHallItems, setTownHallItems] = useState<ItemData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const [userSelections, setUserSelections] = useState<Record<string, UserSelection>>({});

  // ১. মাস্টার ম্যাপিং ফেচ
  useEffect(() => {
    async function fetchMasterMapping() {
      try {
        const res = await fetch('/backend-api/coc-guard/mapping?category=home-village');
        const result = await res.json();
        
        if (!res.ok) {
          throw new Error(result.message || 'মাস্টার ম্যাপিং লোড করতে ব্যর্থ হয়েছে');
        }
      } catch (err: any) {
        console.error("Master mapping fetch error:", err.message);
      }
    }
    fetchMasterMapping();
  }, []);

  // ২. টাউন হল পরিবর্তনের মাধ্যমে আইটেম ফেচ
  const handleTownHallChange = async (e: ChangeEvent<HTMLSelectElement>) => {
    const thValue = e.target.value;
    setSelectedTownHall(thValue);
    setTownHallItems([]);
    setUserSelections({});
    setErrorMessage('');

    if (!thValue) return;

    setLoading(true);
    try {
      const response = await fetch('/backend-api/coc-guard/townhall-items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ townHall: thValue, category: 'home-village' })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'টাউন হলের ডাটা আনতে সমস্যা হয়েছে');
      }
      
      if (result.success && Array.isArray(result.items)) {
        setTownHallItems(result.items);

        const initialSelections: Record<string, UserSelection> = {};
        result.items.forEach((item: ItemData) => {
          const limits = item.limits || {};
          const minC = typeof limits.minCount === 'number' ? limits.minCount : 1;
          const maxC = typeof limits.maxCount === 'number' ? limits.maxCount : 1;
          const maxL = limits.maxLevel ? Number(limits.maxLevel) : null;

          initialSelections[item.itemId] = {
            count: minC,
            level: 1,
            minCount: minC,
            maxCount: maxC,
            maxLevel: maxL
          };
        });
        setUserSelections(initialSelections);
      }
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCountChange = (itemId: string, delta: number) => {
    setUserSelections(prev => {
      const current = prev[itemId];
      if (!current) return prev;

      const newCount = current.count + delta;
      if (newCount < current.minCount || newCount > current.maxCount) {
        return prev;
      }

      return {
        ...prev,
        [itemId]: { ...current, count: newCount }
      };
    });
  };

  const handleLevelChange = (itemId: string, levelInput: string) => {
    const newLevel = parseInt(levelInput) || 1;
    setUserSelections(prev => {
      const current = prev[itemId];
      if (!current) return prev;

      if (newLevel < 1 || (current.maxLevel && newLevel > current.maxLevel)) {
        return prev;
      }

      return {
        ...prev,
        [itemId]: { ...current, level: newLevel }
      };
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">গেম অ্যাকাউন্ট ও সার্ভার গার্ড সেটআপ</h2>

      {errorMessage && (
        <div className="mb-4 bg-red-100 text-red-600 p-3 rounded-lg text-sm font-semibold">
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Player Tag</label>
          <input
            type="text"
            placeholder="#2ABC123"
            value={playerTag}
            onChange={(e) => setPlayerTag(e.target.value)}
            className="w-full border p-2 rounded focus:ring-2 focus:ring-[#81007f]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Account Name</label>
          <input
            type="text"
            placeholder="Account Name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="w-full border p-2 rounded focus:ring-2 focus:ring-[#81007f]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Town Hall</label>
          <select
            value={selectedTownHall}
            onChange={handleTownHallChange}
            className="w-full border p-2 rounded focus:ring-2 focus:ring-[#81007f] font-semibold text-[#81007f]"
          >
            <option value="">-- টাউন হল সিলেক্ট করুন --</option>
            {Array.from({ length: 18 }, (_, i) => i + 1).map((th) => (
              <option key={th} value={th}>Town Hall {th}</option>
            ))}
          </select>
        </div>
      </div>

      <hr className="my-6" />

      <div>
        <h3 className="text-xl font-semibold mb-4 text-gray-700">
          {selectedTownHall ? `Town Hall ${selectedTownHall} এর জন্য এভেইলেবল আইটেম ও লিমিট` : "দয়া করে প্রথমে টাউন হল সিলেক্ট করুন"}
        </h3>

        {loading && <p className="text-[#81007f] font-medium animate-pulse">সার্ভার থেকে ডাটা লোড হচ্ছে...</p>}

        {!loading && townHallItems.length === 0 && selectedTownHall && (
          <p className="text-gray-500">এই টাউন হলের জন্য কোনো আইটেম পাওয়া যায়নি।</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {townHallItems.map((item) => {
            const limits = item.limits || {};
            const minCount = typeof limits.minCount === 'number' ? limits.minCount : 1;
            const maxCount = typeof limits.maxCount === 'number' ? limits.maxCount : 1;
            const maxLevel = limits.maxLevel || null;

            const selection = userSelections[item.itemId] || {
              count: minCount,
              level: 1,
              minCount,
              maxCount,
              maxLevel
            };

            return (
              <div key={item.itemId} className="border p-4 rounded-lg bg-gray-50 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-lg text-gray-800">{item.name}</h4>
                    <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">ID: {item.itemId}</span>
                  </div>
                  
                  <div className="text-xs text-gray-500 mt-1">
                    কাউন্ট সীমা: {selection.minCount} থেকে {selection.maxCount} | সর্বোচ্চ লেভেল: {selection.maxLevel || 'N/A'}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-200 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-600">সংখ্যা:</span>
                    <button
                      type="button"
                      onClick={() => handleCountChange(item.itemId, -1)}
                      disabled={selection.count <= selection.minCount}
                      className="px-2.5 py-1 bg-red-500 text-white rounded disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    >
                      -
                    </button>
                    <span className="font-bold px-2">{selection.count}</span>
                    <button
                      type="button"
                      onClick={() => handleCountChange(item.itemId, 1)}
                      disabled={selection.count >= selection.maxCount}
                      className="px-2.5 py-1 bg-green-500 text-white rounded disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  {selection.maxLevel && (
                    <div className="flex items-center space-x-1">
                      <span className="text-sm font-medium text-gray-600">লেভেল:</span>
                      <input
                        type="number"
                        min="1"
                        max={selection.maxLevel}
                        value={selection.level}
                        onChange={(e) => handleLevelChange(item.itemId, e.target.value)}
                        className="w-16 border text-center p-1 rounded font-semibold bg-white"
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}