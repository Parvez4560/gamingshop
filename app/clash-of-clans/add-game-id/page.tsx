'use client';

import React, { useState, useEffect, ChangeEvent, useMemo } from 'react';
import Navbar from './components/Navbar';
import GameAccountForm from './components/GameAccountForm';
import ItemQuantityControl from './components/ItemQuantityControl';
import ItemQuickInputModal, { ActiveModal } from './components/ItemQuickInputModal';

interface ModuleLimit {
  id: string;
  maxLevel: number;
}

interface MergeTarget {
  optionName: string;
  targetItemId: string;
  count: number;
}

interface LimitData {
  minCount?: number;
  maxCount?: number;
  maxLevel?: number | null;
  prevMaxLevel?: number | null;
  canMerge?: boolean;
  mergeTarget?: MergeTarget[] | null;
  modules?: ModuleLimit[] | null;
  prevModules?: ModuleLimit[] | null;
}

interface UnlockRequirement {
  buildingId: string;
  minBuildingLevel: number;
}

interface ItemData {
  itemId: string;
  name: string;
  subType?: string;
  craftedModulesMetadata?: Record<string, { name: string }> | null;
  unlockRequirement?: UnlockRequirement | null;
  minTownHallForUpgrade?: number | null;
  limitsByBuildingLevel?: Record<string, { maxLevel: number }> | null;
  limits?: LimitData | null;
}

interface UserSelection {
  count: number;
  level: number;
  minCount: number;
  maxCount: number;
  baseMaxCount: number;
  maxLevel: number | null;
  modulesLevel?: Record<string, number>;
  isLocked?: boolean;
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

  // 🔍 সার্চ ও সাব-টাইপ ফিল্টার স্টেট
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSubTypes, setSelectedSubTypes] = useState<string[]>([]);

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

  // 🛡️ ডায়নামিক লজিক ক্যালকুলেটর (পরিশোধিত ও নির্ভুল নিয়ম)
  const calculateDynamicSelections = (
    currentSelections: Record<string, UserSelection>,
    items: ItemData[],
    currentTownHall: string
  ) => {
    const updated = { ...currentSelections };
    const thNumber = parseInt(currentTownHall || '1', 10);

    // ১. মার্জিং লিমিট রিসেট ও রি-ক্যালকুলেট
    items.forEach(item => {
      if (updated[item.itemId]) {
        updated[item.itemId].maxCount = updated[item.itemId].baseMaxCount;
      }
    });

    items.forEach(item => {
      const limits = item.limits || {};
      if (limits.canMerge && Array.isArray(limits.mergeTarget) && limits.mergeTarget.length > 0) {
        let totalDeduction = 0;

        limits.mergeTarget.forEach(target => {
          const targetSelection = updated[target.targetItemId];
          if (targetSelection) {
            const extraCount = Math.max(0, targetSelection.count - targetSelection.minCount);
            totalDeduction += (extraCount * target.count);
          }
        });

        if (updated[item.itemId]) {
          const originalMax = updated[item.itemId].baseMaxCount;
          const minAllowed = updated[item.itemId].minCount;
          const newMax = Math.max(minAllowed, originalMax - totalDeduction);
          updated[item.itemId].maxCount = newMax;

          if (updated[item.itemId].count > newMax) {
            updated[item.itemId].count = newMax;
          }
        }
      }
    });

    // ২. 🧩 আনলক রিকোয়ারমেন্ট, বিল্ডিং লেভেল ও আপগ্রেড লিমিট সিঙ্ক
    items.forEach(item => {
      if (!updated[item.itemId]) return;

      if (item.limitsByBuildingLevel) {
        let currentBuildingLevel = 1;

        // 🎯 ক) দৃশ্যমানতা চেক (unlockRequirement অনুযায়ী)
        if (item.unlockRequirement) {
          const parentBuilding = updated[item.unlockRequirement.buildingId];

          // প্যারেন্ট বিল্ডিং না থাকলে বা আনলকড না হলে আইটেমটি লকড (হিডেন)
          if (!parentBuilding || parentBuilding.isLocked) {
            updated[item.itemId].isLocked = true;
            updated[item.itemId].level = 0;
            return;
          }

          currentBuildingLevel = parentBuilding.level;
          if (currentBuildingLevel < item.unlockRequirement.minBuildingLevel) {
            updated[item.itemId].isLocked = true;
            updated[item.itemId].level = 0;
            return;
          }
        }

        // 🎯 খ) minTownHallForUpgrade চেক (শুধুমাত্র আপগ্রেড কন্ট্রোলের জন্য)
        if (item.minTownHallForUpgrade && thNumber < item.minTownHallForUpgrade) {
          // আইটেম আনলকড থাকলে লেভেল ১ এ ফিক্সড থাকবে (আপগ্রেড বন্ধ)
          updated[item.itemId].isLocked = false;
          updated[item.itemId].level = 1;
          updated[item.itemId].maxLevel = 1;
          return;
        }

        // নরমাল বিল্ডিং/টাউনহল লেভেল অনুযায়ী ডায়নামিক maxLevel সেট করা
        const levelConfig = item.limitsByBuildingLevel[String(currentBuildingLevel)] || item.limitsByBuildingLevel[String(thNumber)];

        if (levelConfig) {
          updated[item.itemId].isLocked = false;
          updated[item.itemId].maxLevel = levelConfig.maxLevel;

          if (updated[item.itemId].level > levelConfig.maxLevel || updated[item.itemId].level === 0) {
            updated[item.itemId].level = levelConfig.maxLevel;
          }
        } else {
          updated[item.itemId].isLocked = true;
          updated[item.itemId].level = 0;
        }
      }
    });

    return updated;
  };

  const handleTownHallChange = async (e: ChangeEvent<HTMLSelectElement>) => {
    const thValue = e.target.value;
    setSelectedTownHall(thValue);
    setTownHallItems([]);
    setUserSelections({});
    setErrorMessage('');
    setSearchQuery('');
    setSelectedSubTypes([]);

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

          const defaultLevel = limits.prevMaxLevel ?? maxL ?? 1;

          const initialModules: Record<string, number> = {};
          if (limits.modules && Array.isArray(limits.modules)) {
            limits.modules.forEach(m => {
              const prevMod = limits.prevModules?.find(pm => pm.id === m.id);
              initialModules[m.id] = prevMod?.maxLevel ?? m.maxLevel ?? 3;
            });
          }

          initialSelections[item.itemId] = {
            count: minC,
            level: defaultLevel,
            minCount: minC,
            maxCount: maxC,
            baseMaxCount: maxC,
            maxLevel: maxL,
            modulesLevel: initialModules,
            isLocked: false
          };
        });

        const syncedSelections = calculateDynamicSelections(initialSelections, result.items, thValue);
        setUserSelections(syncedSelections);
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
      if (!current || current.isLocked) return prev;

      const newVal = current[field] + delta;
      const minVal = field === 'count' ? current.minCount : 1;
      const maxVal = field === 'count' ? current.maxCount : (current.maxLevel || 1);

      if (newVal < minVal || newVal > maxVal) return prev;

      const tempSelections = {
        ...prev,
        [itemId]: { ...current, [field]: newVal }
      };

      return calculateDynamicSelections(tempSelections, townHallItems, selectedTownHall);
    });
  };

  const handleModuleLevelChange = (itemId: string, moduleId: string, delta: number, maxLevel: number) => {
    setUserSelections(prev => {
      const current = prev[itemId];
      if (!current || !current.modulesLevel) return prev;

      const currentModuleLvl = current.modulesLevel[moduleId] ?? 3;
      const newLvl = currentModuleLvl + delta;

      if (newLvl < 3 || newLvl > maxLevel) return prev;

      return {
        ...prev,
        [itemId]: {
          ...current,
          modulesLevel: {
            ...current.modulesLevel,
            [moduleId]: newLvl
          }
        }
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

      const tempSelections = {
        ...prev,
        [activeModal.itemId]: {
          ...current,
          [activeModal.type]: val
        }
      };

      return calculateDynamicSelections(tempSelections, townHallItems, selectedTownHall);
    });

    setActiveModal(null);
  };

  // 🎯 আনলকড (দৃশ্যমান) আইটেমের তালিকা ফিল্টার
  const visibleUnlockedItems = useMemo(() => {
    return townHallItems.filter(item => {
      const selection = userSelections[item.itemId];
      return selection && !selection.isLocked;
    });
  }, [townHallItems, userSelections]);

  // 🏷️ সাব-টাইপ ফিল্টার তালিকা (Dynamic SubType Chips)
  const availableSubTypes = useMemo(() => {
    const subTypesSet = new Set<string>();
    visibleUnlockedItems.forEach(item => {
      if (item.subType && item.subType.trim() !== '') {
        subTypesSet.add(item.subType.trim());
      }
    });
    return Array.from(subTypesSet);
  }, [visibleUnlockedItems]);

  // 🔍 সার্চ ও ফিল্টার অনুযায়ী প্রদর্শিত আইটেম তালিকা
  const filteredDisplayItems = useMemo(() => {
    return visibleUnlockedItems.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.itemId.includes(searchQuery);

      const matchesSubType = selectedSubTypes.length === 0 || 
                             (item.subType && selectedSubTypes.includes(item.subType.trim()));

      return matchesSearch && matchesSubType;
    });
  }, [visibleUnlockedItems, searchQuery, selectedSubTypes]);

  const toggleSubTypeFilter = (subType: string) => {
    setSelectedSubTypes(prev =>
      prev.includes(subType)
        ? prev.filter(s => s !== subType)
        : [...prev, subType]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16 relative">
      <Navbar />

      <main className="max-w-4xl mx-auto p-4 sm:p-6 mt-4">
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

        {loading && (
          <div className="text-center py-10">
            <div className="inline-block w-8 h-8 border-4 border-[#81007f] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[#81007f] font-medium mt-2 text-sm">Loading items...</p>
          </div>
        )}

        {!loading && selectedTownHall && (
          <div className="animate-in fade-in duration-200">

            {/* 📌 STICKY SEARCH & SUBTYPE FILTER BAR */}
            <div className="sticky top-[64px] z-10 bg-gray-50/95 backdrop-blur-md pt-2 pb-3 mb-4 border-b border-gray-200 shadow-xs -mx-4 px-4 sm:-mx-6 sm:px-6">
              <div className="space-y-2.5">
                {/* 🔍 Search Box */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search building, hero, troop name or ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-gray-300 rounded-lg shadow-xs focus:outline-none focus:ring-2 focus:ring-[#81007f] focus:border-transparent"
                  />
                  <svg className="w-4 h-4 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-2.5 text-xs bg-gray-200 hover:bg-gray-300 rounded-full w-4 h-4 flex items-center justify-center text-gray-600"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* 🏷️ Dynamic SubType Chips */}
                {availableSubTypes.length > 0 && (
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
                    <button
                      onClick={() => setSelectedSubTypes([])}
                      className={`px-3 py-1 rounded-full font-medium whitespace-nowrap transition-colors ${
                        selectedSubTypes.length === 0
                          ? 'bg-[#81007f] text-white shadow-xs'
                          : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      All ({visibleUnlockedItems.length})
                    </button>
                    {availableSubTypes.map(subType => {
                      const isSelected = selectedSubTypes.includes(subType);
                      return (
                        <button
                          key={subType}
                          onClick={() => toggleSubTypeFilter(subType)}
                          className={`px-3 py-1 rounded-full font-medium capitalize whitespace-nowrap transition-colors ${
                            isSelected
                              ? 'bg-[#81007f] text-white shadow-xs'
                              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          {subType}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between mb-3">
              <h3 className="text-md font-bold text-gray-700">
                Town Hall {selectedTownHall} Items ({filteredDisplayItems.length})
              </h3>
            </div>

            {filteredDisplayItems.length === 0 ? (
              <p className="text-gray-500 text-center py-8 bg-white rounded-xl border border-dashed border-gray-300">
                No items match your search or filter.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredDisplayItems.map((item) => {
                  const selection = userSelections[item.itemId];
                  const hasModules = item.limits?.modules && Array.isArray(item.limits.modules) && item.limits.modules.length > 0;

                  const isSingleCountOnly = selection.minCount === 1 && selection.maxCount === 1;

                  return (
                    <div key={item.itemId} className="border border-gray-200 p-4 rounded-xl bg-white shadow-xs flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-center">
                          <h4 className="font-bold text-gray-800">{item.name}</h4>
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                            ID: {item.itemId}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1 flex items-center justify-between">
                          <span>
                            {isSingleCountOnly ? 'Single Quantity' : `Limit: ${selection.minCount}-${selection.maxCount}`}
                          </span>
                          {item.limits?.canMerge && (
                            <span className="text-[10px] bg-purple-100 text-[#81007f] px-1.5 py-0.5 rounded font-bold">
                              Mergeable 🛡️
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-gray-100 flex flex-col gap-3">
                        <div className={`flex items-center text-sm ${isSingleCountOnly ? 'justify-end' : 'justify-between'}`}>

                          {!isSingleCountOnly && (
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
                          )}

                          {/* 🎯 Level Control (ডানপাশে সঠিক পজিশনে থাকবে) */}
                          {!hasModules && selection.maxLevel && (
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

                        {/* Crafting Station Modules Sub-Control */}
                        {hasModules && (
                          <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100 space-y-2 mt-1">
                            <span className="text-xs font-bold text-gray-600 block border-b pb-1">
                              Crafted Modules (Min Lvl: 3)
                            </span>
                            {item.limits?.modules?.map((mod) => {
                              const moduleMeta = item.craftedModulesMetadata?.[mod.id];
                              const moduleName = moduleMeta?.name || `Module ${mod.id}`;
                              const currentModLvl = selection.modulesLevel?.[mod.id] ?? 3;

                              return (
                                <div key={mod.id} className="flex items-center justify-between text-xs">
                                  <span className="text-gray-700 font-medium truncate max-w-[120px]">
                                    {moduleName}
                                  </span>
                                  <ItemQuantityControl
                                    label="Lvl"
                                    value={currentModLvl}
                                    min={3}
                                    max={mod.maxLevel}
                                    onIncrease={() => handleModuleLevelChange(item.itemId, mod.id, 1, mod.maxLevel)}
                                    onDecrease={() => handleModuleLevelChange(item.itemId, mod.id, -1, mod.maxLevel)}
                                    onOpenModal={() => {}}
                                  />
                                </div>
                              );
                            })}
                          </div>
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