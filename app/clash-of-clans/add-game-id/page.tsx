'use client';

import React, { useState, useEffect, ChangeEvent } from 'react';
import Navbar from './components/Navbar';
import GameAccountForm from './components/GameAccountForm';
import ItemQuantityControl from './components/ItemQuantityControl';
import ItemQuickInputModal, { ActiveModal } from './components/ItemQuickInputModal';

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
  const [activeModal, setActiveModal] = useState<ActiveModal | null>(null);
  const [inputValue, setInputValue] = useState<string>('');

  useEffect(() => {
    async function fetchMasterMapping() {
      try {
        const res = await fetch('/backend-api/coc-guard/mapping?category=home-village');
        const result = await res.json();
        if (!res.ok) throw new Error(result.message || 'Failed to load master mapping');
      } catch (err: any) {
        console.error("Master mapping fetch error:", err.message);
      }
    }
    fetchMasterMapping();
  }, []);

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
      if (!response.ok) throw new Error(result.message || 'Failed to fetch town hall data');
      
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

  const handleValueChange = (itemId: string, field: 'count' | 'level', delta: number) => {
    setUserSelections(prev => {
      const current = prev[itemId];
      if (!current) return prev;

      const newVal = current[field] + delta;
      const minVal = field === 'count' ? current.minCount : 1;
      const maxVal = field === 'count' ? current.maxCount : (current.maxLevel || 1);

      if (newVal < minVal || newVal > maxVal) return prev;

      return {
        ...prev,
        [itemId]: { ...current, [field]: newVal }
      };
    });
  };

  const openInputModal = (
    itemId: string, 
    type: 'count' | 'level', 
    title: string, 
    currentVal: number, 
    min: number, 
    max: number
  ) => {
    setActiveModal({ itemId, type, title, currentValue: currentVal, min, max });
    setInputValue(currentVal.toString());
  };

  const handleModalSave = () => {
    if (!activeModal) return;

    let val = parseInt(inputValue, 10);
    if (isNaN(val)) val = activeModal.min;

    if (val < activeModal.min) val = activeModal.min;
    if (val > activeModal.max) val = activeModal.max;

    setUserSelections(prev => {
      const current = prev[activeModal.itemId];
      if (!current) return prev;

      return {
        ...prev,
        [activeModal.itemId]: {
          ...current,
          [activeModal.type]: val
        }
      };
    });

    setActiveModal(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-10 relative">
      <Navbar />

      <main className="max-w-4xl mx-auto p-4 sm:p-6 mt-4">
        {/* 1. Game Account Input Form */}
        <GameAccountForm
          playerTag={playerTag}
          setPlayerTag={setPlayerTag}
          playerName={playerName}
          setPlayerName={setPlayerName}
          selectedTownHall={selectedTownHall}
          handleTownHallChange={handleTownHallChange}
        />

        {errorMessage && (
          <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-lg text-sm font-semibold border border-red-200">
            {errorMessage}
          </div>
        )}

        {/* 2. Items List */}
        {loading && (
          <p className="text-center text-[#81007f] font-medium py-6 animate-pulse">
            Loading data...
          </p>
        )}

        {!loading && selectedTownHall && (
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Town Hall {selectedTownHall} - Available Items
            </h3>

            {townHallItems.length === 0 ? (
              <p className="text-gray-500 text-center py-6">No items found for this Town Hall.</p>
            ) : (
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
                    <div key={item.itemId} className="border border-gray-200 p-4 rounded-xl bg-white shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-center">
                          <h4 className="font-bold text-gray-800">{item.name}</h4>
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                            ID: {item.itemId}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Limit: {selection.minCount}-{selection.maxCount} | Max Level: {selection.maxLevel || 'N/A'}
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-sm flex-wrap gap-2">
                        {/* Count Control */}
                        <ItemQuantityControl
                          label="Count"
                          value={selection.count}
                          min={selection.minCount}
                          max={selection.maxCount}
                          onIncrease={() => handleValueChange(item.itemId, 'count', 1)}
                          onDecrease={() => handleValueChange(item.itemId, 'count', -1)}
                          onOpenModal={() => openInputModal(
                            item.itemId, 
                            'count', 
                            `${item.name} - Count`, 
                            selection.count, 
                            selection.minCount, 
                            selection.maxCount
                          )}
                        />

                        {/* Level Control */}
                        {selection.maxLevel && (
                          <ItemQuantityControl
                            label="Level"
                            value={selection.level}
                            min={1}
                            max={selection.maxLevel}
                            onIncrease={() => handleValueChange(item.itemId, 'level', 1)}
                            onDecrease={() => handleValueChange(item.itemId, 'level', -1)}
                            onOpenModal={() => openInputModal(
                              item.itemId, 
                              'level', 
                              `${item.name} - Level`, 
                              selection.level, 
                              1, 
                              selection.maxLevel || 1
                            )}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      {/* 3. Quick Input Modal Component */}
      {activeModal && (
        <ItemQuickInputModal
          activeModal={activeModal}
          inputValue={inputValue}
          setInputValue={setInputValue}
          onClose={() => setActiveModal(null)}
          onSave={handleModalSave}
        />
      )}
    </div>
  );
}