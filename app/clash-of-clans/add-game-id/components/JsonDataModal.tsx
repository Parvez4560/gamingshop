'use client';

import React, { useState } from 'react';

interface JsonDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerTag: string;
  townHall: string;
  userSelections: Record<string, any>;
  townHallItems: any[];
  onImportJson: (importedData: any) => void;
}

export default function JsonDataModal({
  isOpen,
  onClose,
  playerTag,
  townHall,
  userSelections,
  townHallItems,
  onImportJson
}: JsonDataModalProps) {
  const [jsonText, setJsonText] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!isOpen) return null;

  // 🎯 ইউজার ইনপুটগুলোকে অফিশিয়াল Clash of Clans JSON স্ট্রাকচারে রূপান্তর
  const generateOfficialGameJson = () => {
    const officialData: Record<string, any> = {
      tag: playerTag || "#PLAYER",
      townHall: Number(townHall) || 1,
      timestamp: Math.floor(Date.now() / 1000),
      buildings: [],
      heroes: [],
      units: [],
      spells: [],
      pets: [],
      equipment: [],
      traps: [],
      siege_machines: []
    };

    townHallItems.forEach(item => {
      const selection = userSelections[item.itemId];
      if (!selection || selection.isLocked) return;

      const rawId = Number(item.itemId);
      const subRows = selection.subRows || [];
      const category = (item.mainType || item.category || '').toLowerCase();

      if (category.includes('hero')) {
        officialData.heroes.push({ data: rawId, lvl: selection.level });
      } else if (category.includes('troop') || category.includes('unit')) {
        officialData.units.push({ data: rawId, lvl: selection.level });
      } else if (category.includes('spell')) {
        officialData.spells.push({ data: rawId, lvl: selection.level });
      } else if (category.includes('pet')) {
        officialData.pets.push({ data: rawId, lvl: selection.level });
      } else if (category.includes('equipment')) {
        officialData.equipment.push({ data: rawId, lvl: selection.level });
      } else if (category.includes('trap')) {
        const totalCount = selection.count + subRows.reduce((sum: number, r: any) => sum + r.count, 0);
        officialData.traps.push({ data: rawId, lvl: selection.level, cnt: totalCount });
      } else if (category.includes('siege')) {
        officialData.siege_machines.push({ data: rawId, lvl: selection.level });
      } else {
        // Buildings Handling (Multiple Sub-levels)
        officialData.buildings.push({
          data: rawId,
          lvl: selection.level,
          cnt: selection.count
        });

        subRows.forEach((r: any) => {
          if (r.count > 0) {
            officialData.buildings.push({
              data: rawId,
              lvl: r.level,
              cnt: r.count
            });
          }
        });
      }
    });

    return JSON.stringify(officialData, null, 2);
  };

  const formattedExportData = generateOfficialGameJson();

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedExportData);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImport = () => {
    try {
      setErrorMsg('');
      if (!jsonText.trim()) {
        setErrorMsg('অনুগ্রহ করে ভ্যালিড JSON ডাটা পেস্ট করুন।');
        return;
      }
      const parsed = JSON.parse(jsonText);
      onImportJson(parsed);
      setJsonText('');
      onClose();
    } catch (err: any) {
      setErrorMsg('অবৈধ JSON স্ট্রাকচার! অফিশিয়াল গেম জেসন ডাটা দিন।');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-5 sm:p-6 flex flex-col max-h-[90vh] text-gray-900">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <img src="/icons/ui/actions/json-data.svg" alt="JSON Data" className="w-5 h-5" />
            CoC Official Game JSON (Import / Export)
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 font-bold text-lg p-1"
          >
            ✕
          </button>
        </div>

        {errorMsg && (
          <div className="mb-3 p-2.5 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        <div className="flex-1 overflow-y-auto space-y-4">
          {/* Import Section */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              📥 Paste CoC Raw Game JSON:
            </label>
            <textarea
              rows={5}
              placeholder='Paste CoC Raw JSON here... e.g. {"tag":"#2LJQJULYC8","buildings":[{"data":1000000,"lvl":18,"cnt":4}]}'
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              style={{ WebkitTextFillColor: '#111827' }}
              className="w-full text-xs font-mono p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#81007f] focus:outline-none bg-gray-50 text-gray-900 opacity-100"
            />
            <button
              onClick={handleImport}
              className="mt-2 w-full py-2 bg-[#81007f] hover:bg-[#680066] text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
            >
              Parse & Auto-Fill Form 🚀
            </button>
          </div>

          <hr className="border-gray-200" />

          {/* Export Output Section */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-gray-700">
                📤 Exported Official CoC Structure JSON:
              </label>
              <button
                onClick={handleCopy}
                className="text-xs bg-purple-100 text-[#81007f] hover:bg-purple-200 font-bold px-2.5 py-1 rounded-md transition-colors"
              >
                {copied ? 'Copied! ✓' : 'Copy Code 📋'}
              </button>
            </div>
            <pre className="p-3 bg-gray-900 text-green-400 text-[11px] font-mono rounded-xl max-h-48 overflow-y-auto border border-gray-800">
              {formattedExportData}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}