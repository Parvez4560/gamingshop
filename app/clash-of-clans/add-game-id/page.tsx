'use client';

import React, { useState, useEffect, ChangeEvent, useMemo } from 'react';
import Navbar from './components/Navbar';
import GameAccountForm from './components/GameAccountForm';
import ItemQuantityControl from './components/ItemQuantityControl';
import ItemQuickInputModal, { ActiveModal } from './components/ItemQuickInputModal';
import JsonDataModal from './components/JsonDataModal';

interface ModuleLimit {
  id: string;
  maxLevel: number;
}

interface LimitData {
  minCount?: number;
  maxCount?: number;
  maxLevel?: number | null;
  prevMaxLevel?: number | null;
  canMerge?: boolean;
  mergeTarget?: any[];
  modules?: ModuleLimit[] | null;
}

interface ItemData {
  itemId: string;
  name: string;
  subType?: string;
  mainType?: string;
  category?: string;
  craftedModulesMetadata?: Record<string, { name: string }> | null;
  unlockRequirement?: { buildingId: string; minBuildingLevel: number } | null;
  minTownHallForUpgrade?: number | null;
  limitsByBuildingLevel?: Record<string, { maxLevel: number }> | null;
  limits?: LimitData | null;
}

interface SubRow {
  id: string;
  count: number;
  level: number;
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
  subRows?: SubRow[];
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
  const [isJsonModalOpen, setIsJsonModalOpen] = useState<boolean>(false);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSubTypes, setSelectedSubTypes] = useState<string[]>([]);

  useEffect(() => {
    async function fetchMasterMapping() {
      try {
        const res = await fetch('/backend-api/coc-guard/mapping?category=home-village');
        const result = await res.json();
        if (!res.ok) throw new Error(result.message || 'Fetch error');
      } catch (err: any) {
        console.error("Master mapping error:", err.message);
      }
    }
    fetchMasterMapping();
  }, []);

  const calculateDynamicSelections = (
    currentSelections: Record<string, UserSelection>,
    items: ItemData[],
    currentTownHall: string
  ) => {
    const updated = { ...currentSelections };
    const thNumber = parseInt(currentTownHall || '1', 10);

    items.forEach(item => {
      if (!updated[item.itemId]) return;

      if (item.limitsByBuildingLevel) {
        let currentBuildingLevel = 1;

        if (item.unlockRequirement) {
          const parentBuilding = updated[item.unlockRequirement.buildingId];

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

        if (item.minTownHallForUpgrade && thNumber < item.minTownHallForUpgrade) {
          updated[item.itemId].isLocked = false;
          updated[item.itemId].level = 1;
          updated[item.itemId].maxLevel = 1;
          return;
        }

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
      if (!response.ok) throw new Error(result.message || 'Fetch error');
      
      if (result.success && Array.isArray(result.items)) {
        setTownHallItems(result.items);

        const initialSelections: Record<string, UserSelection> = {};
        result.items.forEach((item: ItemData) => {
          const limits = item.limits || {};
          const minC = typeof limits.minCount === 'number' ? limits.minCount : 1;
          const maxC = typeof limits.maxCount === 'number' ? limits.maxCount : 1;
          const maxL = limits.maxLevel ? Number(limits.maxLevel) : null;

          const defaultLevel = limits.prevMaxLevel ?? maxL ?? 1;

          initialSelections[item.itemId] = {
            count: minC,
            level: defaultLevel,
            minCount: minC,
            maxCount: maxC,
            baseMaxCount: maxC,
            maxLevel: maxL,
            isLocked: false,
            subRows: []
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

  const getTotalItemCount = (selection: UserSelection) => {
    const subTotal = (selection.subRows || []).reduce((sum, r) => sum + r.count, 0);
    return selection.count + subTotal;
  };

  // 🎯 ১. মূল রো-এর প্লাস/মাইনাস চেঞ্জ
  const handleMainValueChange = (itemId: string, field: 'count' | 'level', delta: number) => {
    setUserSelections(prev => {
      const current = prev[itemId];
      if (!current || current.isLocked) return prev;

      if (field === 'count') {
        const total = getTotalItemCount(current);
        const newMainCount = current.count + delta;

        if (newMainCount < 1) return prev;
        if (delta > 0 && total >= current.maxCount) return prev;

        const tempSelections = {
          ...prev,
          [itemId]: { ...current, count: newMainCount }
        };
        return calculateDynamicSelections(tempSelections, townHallItems, selectedTownHall);
      } else {
        const newVal = current.level + delta;
        const maxVal = current.maxLevel || 1;
        if (newVal < 1 || newVal > maxVal) return prev;

        const tempSelections = {
          ...prev,
          [itemId]: { ...current, level: newVal }
        };
        return calculateDynamicSelections(tempSelections, townHallItems, selectedTownHall);
      }
    });
  };

  // 🎯 ২. ওয়াল/বিল্ডিং এর জন্য বাল্ক স্প্লিট রো তৈরি
  const addSubRow = (itemId: string) => {
    setUserSelections(prev => {
      const current = prev[itemId];
      if (!current || current.count <= 1) return prev;

      const isWall = current.maxCount > 50; 
      const defaultSplitCount = isWall ? Math.floor(current.count / 2) : 1; // ওয়ালের জন্য অর্ধেক বা কাস্টম স্প্লিট

      const subRows = current.subRows || [];
      const newSubRow: SubRow = {
        id: Date.now().toString(),
        count: defaultSplitCount,
        level: Math.max(1, (current.level || 1) - 1)
      };

      return {
        ...prev,
        [itemId]: {
          ...current,
          count: current.count - defaultSplitCount, // মূল রো থেকে কেটে সাব-রো তে ট্রান্সফার
          subRows: [...subRows, newSubRow]
        }
      };
    });
  };

  // 🎯 ৩. সাব-রো ভ্যালু পরিবর্তন ও ০ বানালে অটো মার্জ ব্যাক
  const handleSubRowValueChange = (itemId: string, rowId: string, field: 'count' | 'level', delta: number) => {
    setUserSelections(prev => {
      const current = prev[itemId];
      if (!current || !current.subRows) return prev;

      let returnedToMain = 0;

      const updatedSubRows = current.subRows.map(row => {
        if (row.id !== rowId) return row;

        if (field === 'count') {
          const newCnt = row.count + delta;

          if (newCnt <= 0) {
            returnedToMain = row.count; 
            return null;
          }

          const currentTotal = getTotalItemCount(current);
          if (delta > 0 && currentTotal >= current.maxCount) return row;

          return { ...row, count: newCnt };
        } else {
          const maxLvl = current.maxLevel || 1;
          const newLvl = Math.min(maxLvl, Math.max(1, row.level + delta));
          return { ...row, level: newLvl };
        }
      }).filter(Boolean) as SubRow[];

      return {
        ...prev,
        [itemId]: {
          ...current,
          count: current.count + returnedToMain,
          subRows: updatedSubRows
        }
      };
    });
  };

  // 🎯 ৪. ইনপুট মডাল সরাসরি ম্যানুয়াল সংখ্যা ইনপুট দেওয়ার জন্য (যেমন ওয়ালের ৩০০/২০০ বসানো)
  const openInputModal = (
    itemId: string, 
    type: 'count' | 'level', 
    title: string, 
    currentVal: number, 
    min: number, 
    max: number,
    subRowId?: string
  ) => {
    setActiveModal({ itemId, type, title, currentValue: currentVal, min, max, subRowId } as any);
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

      const subRowId = (activeModal as any).subRowId;

      if (subRowId && current.subRows) {
        // সাব-রো কাস্টম কাউন্ট এডিট
        let diff = 0;
        const updatedSubRows = current.subRows.map(r => {
          if (r.id === subRowId) {
            diff = val - r.count;
            return { ...r, [activeModal.type]: val };
          }
          return r;
        }).filter(r => r.count > 0);

        return {
          ...prev,
          [activeModal.itemId]: {
            ...current,
            count: Math.max(1, current.count - diff), // মেইন রো-এর সাথে এডজাস্ট
            subRows: updatedSubRows
          }
        };
      } else {
        // মেইন রো এডিট
        const tempSelections = {
          ...prev,
          [activeModal.itemId]: {
            ...current,
            [activeModal.type]: val
          }
        };
        return calculateDynamicSelections(tempSelections, townHallItems, selectedTownHall);
      }
    });

    setActiveModal(null);
  };

  const handleImportJson = (importedData: any) => {
    if (!importedData || typeof importedData !== 'object') return;

    if (importedData.tag) setPlayerTag(importedData.tag);
    if (importedData.townHall) setSelectedTownHall(String(importedData.townHall));

    setUserSelections(prev => {
      const updated = { ...prev };

      const allItems = [
        ...(importedData.buildings || []),
        ...(importedData.heroes || []),
        ...(importedData.units || []),
        ...(importedData.spells || []),
        ...(importedData.pets || []),
        ...(importedData.equipment || []),
        ...(importedData.traps || []),
        ...(importedData.siege_machines || [])
      ];

      const groupedByData: Record<string, any[]> = {};
      allItems.forEach(item => {
        if (item.data) {
          const idStr = String(item.data);
          if (!groupedByData[idStr]) groupedByData[idStr] = [];
          groupedByData[idStr].push(item);
        }
      });

      Object.keys(updated).forEach(itemId => {
        const itemRecords = groupedByData[itemId];
        if (itemRecords && itemRecords.length > 0) {
          const firstRecord = itemRecords[0];
          const maxC = updated[itemId].maxCount;
          const maxL = updated[itemId].maxLevel || 1;

          updated[itemId].count = Math.min(maxC, Math.max(1, Number(firstRecord.cnt) || 1));
          updated[itemId].level = Math.min(maxL, Math.max(1, Number(firstRecord.lvl) || 1));

          if (itemRecords.length > 1) {
            const extraSubRows: SubRow[] = [];
            for (let i = 1; i < itemRecords.length; i++) {
              extraSubRows.push({
                id: `${Date.now()}_${i}`,
                count: Math.min(maxC, Math.max(1, Number(itemRecords[i].cnt) || 1)),
                level: Math.min(maxL, Math.max(1, Number(itemRecords[i].lvl) || 1))
              });
            }
            updated[itemId].subRows = extraSubRows;
          }
        }
      });

      return calculateDynamicSelections(updated, townHallItems, selectedTownHall);
    });
  };

  const visibleUnlockedItems = useMemo(() => {
    return townHallItems.filter(item => {
      const selection = userSelections[item.itemId];
      return selection && !selection.isLocked;
    });
  }, [townHallItems, userSelections]);

  const availableSubTypes = useMemo(() => {
    const subTypesSet = new Set<string>();
    visibleUnlockedItems.forEach(item => {
      if (item.subType && item.subType.trim() !== '') {
        subTypesSet.add(item.subType.trim());
      }
    });
    return Array.from(subTypesSet);
  }, [visibleUnlockedItems]);

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
    <div className="min-h-screen bg-gray-50 pb-16 relative text-gray-900">
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

            {/* STICKY SEARCH BAR + JSON ACTION BUTTON */}
            <div className="sticky top-[64px] z-10 bg-gray-50/95 backdrop-blur-md pt-2 pb-3 mb-4 border-b border-gray-200 shadow-xs -mx-4 px-4 sm:-mx-6 sm:px-6">
              <div className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Search building, hero, troop name or ID..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{ WebkitTextFillColor: '#111827' }}
                      className="w-full pl-9 pr-4 py-2 text-sm bg-white text-gray-900 border border-gray-300 rounded-lg shadow-xs focus:outline-none focus:ring-2 focus:ring-[#81007f]"
                    />
                    <svg className="w-4 h-4 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>

                  <button
                    onClick={() => setIsJsonModalOpen(true)}
                    className="p-2 bg-white border border-gray-300 hover:border-[#81007f] hover:bg-purple-50 rounded-lg shadow-xs transition-colors flex items-center justify-center"
                    title="Open JSON Code Modal"
                  >
                    <img src="/icons/ui/actions/json-data.svg" alt="JSON Data" className="w-5 h-5" />
                  </button>
                </div>

                {availableSubTypes.length > 0 && (
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
                    <button
                      onClick={() => setSelectedSubTypes([])}
                      className={`px-3 py-1 rounded-full font-medium whitespace-nowrap transition-colors ${
                        selectedSubTypes.length === 0
                          ? 'bg-[#81007f] text-white'
                          : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      All ({visibleUnlockedItems.length})
                    </button>
                    {availableSubTypes.map(subType => (
                      <button
                        key={subType}
                        onClick={() => toggleSubTypeFilter(subType)}
                        className={`px-3 py-1 rounded-full font-medium capitalize whitespace-nowrap transition-colors ${
                          selectedSubTypes.includes(subType)
                            ? 'bg-[#81007f] text-white'
                            : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        {subType}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredDisplayItems.map((item) => {
                const selection = userSelections[item.itemId];
                const isSingleCountOnly = selection.minCount === 1 && selection.maxCount === 1;
                const subRows = selection.subRows || [];
                const currentTotal = getTotalItemCount(selection);

                return (
                  <div key={item.itemId} className="border border-gray-200 p-4 rounded-xl bg-white shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center">
                        <h4 className="font-bold text-gray-900">{item.name}</h4>
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-mono">
                          ID: {item.itemId}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1 flex items-center justify-between">
                        <span>
                          {isSingleCountOnly ? 'Single Quantity' : `Total Selected: ${currentTotal} / Max: ${selection.maxCount}`}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100 flex flex-col gap-3">
                      {/* Row 1: Main Control */}
                      <div className={`flex items-center text-sm ${isSingleCountOnly ? 'justify-end' : 'justify-between'}`}>
                        {!isSingleCountOnly && (
                          <ItemQuantityControl
                            label="Count"
                            value={selection.count}
                            min={1}
                            max={selection.maxCount}
                            onIncrease={() => handleMainValueChange(item.itemId, 'count', 1)}
                            onDecrease={() => handleMainValueChange(item.itemId, 'count', -1)}
                            onOpenModal={() => openInputModal(
                              item.itemId,
                              'count',
                              `${item.name} - Count`,
                              selection.count,
                              1,
                              selection.maxCount
                            )}
                          />
                        )}

                        {selection.maxLevel && (
                          <ItemQuantityControl
                            label="Level"
                            value={selection.level}
                            min={1}
                            max={selection.maxLevel}
                            onIncrease={() => handleMainValueChange(item.itemId, 'level', 1)}
                            onDecrease={() => handleMainValueChange(item.itemId, 'level', -1)}
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

                      {/* Row 2+: Duplicate SubRows */}
                      {subRows.map((row) => (
                        <div key={row.id} className="flex items-center justify-between text-sm pt-2 border-t border-dashed border-gray-200">
                          <ItemQuantityControl
                            label="Count"
                            value={row.count}
                            min={0}
                            max={selection.maxCount}
                            onIncrease={() => handleSubRowValueChange(item.itemId, row.id, 'count', 1)}
                            onDecrease={() => handleSubRowValueChange(item.itemId, row.id, 'count', -1)}
                            onOpenModal={() => openInputModal(
                              item.itemId,
                              'count',
                              `${item.name} - Sub Count`,
                              row.count,
                              0,
                              selection.maxCount,
                              row.id
                            )}
                          />

                          {selection.maxLevel && (
                            <ItemQuantityControl
                              label="Level"
                              value={row.level}
                              min={1}
                              max={selection.maxLevel || 1}
                              onIncrease={() => handleSubRowValueChange(item.itemId, row.id, 'level', 1)}
                              onDecrease={() => handleSubRowValueChange(item.itemId, row.id, 'level', -1)}
                              onOpenModal={() => openInputModal(
                                item.itemId,
                                'level',
                                `${item.name} - Sub Level`,
                                row.level,
                                1,
                                selection.maxLevel || 1,
                                row.id
                              )}
                            />
                          )}
                        </div>
                      ))}

                      {/* Add Duplicate Row Button */}
                      {!isSingleCountOnly && selection.count > 1 && (
                        <div className="flex justify-center pt-1">
                          <button
                            onClick={() => addSubRow(item.itemId)}
                            className="w-full py-1.5 border border-dashed border-purple-300 text-[#81007f] hover:bg-purple-50 text-xs font-semibold rounded-lg transition-colors"
                          >
                            + Add Another Level Row
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Direct Input Modal */}
      {activeModal && (
        <ItemQuickInputModal
          activeModal={activeModal}
          inputValue={inputValue}
          setInputValue={setInputValue}
          onClose={() => setActiveModal(null)}
          onSave={handleModalSave}
        />
      )}

      {/* JSON Import/Export Modal */}
      <JsonDataModal
        isOpen={isJsonModalOpen}
        onClose={() => setIsJsonModalOpen(false)}
        playerTag={playerTag}
        townHall={selectedTownHall}
        userSelections={userSelections}
        townHallItems={townHallItems}
        onImportJson={handleImportJson}
      />
    </div>
  );
}