'use client';

import React from 'react';

export interface ActiveModal {
  itemId: string;
  type: 'count' | 'level';
  title: string;
  currentValue: number;
  min: number;
  max: number;
}

interface ItemQuickInputModalProps {
  activeModal: ActiveModal;
  inputValue: string;
  setInputValue: (val: string) => void;
  onClose: () => void;
  onSave: () => void;
}

export default function ItemQuickInputModal({
  activeModal,
  inputValue,
  setInputValue,
  onClose,
  onSave
}: ItemQuickInputModalProps) {
  // Parse current input to check validation in real-time
  const parsedVal = parseInt(inputValue, 10);
  const isInvalid = isNaN(parsedVal) || parsedVal < activeModal.min || parsedVal > activeModal.max;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-5 w-full max-w-xs animate-in fade-in zoom-in-95 duration-150">
        <h4 className="font-bold text-gray-800 text-sm mb-1">{activeModal.title}</h4>
        <p className="text-xs text-gray-500 mb-4">
          Allowed range: <span className="font-semibold text-gray-700">{activeModal.min}</span> to <span className="font-semibold text-gray-700">{activeModal.max}</span>
        </p>

        {/* Input Box with dynamic error border */}
        <input
          type="number"
          min={activeModal.min}
          max={activeModal.max}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !isInvalid) onSave();
            if (e.key === 'Escape') onClose();
          }}
          className={`w-full border rounded-lg p-2.5 text-center font-extrabold text-lg focus:outline-none transition-all ${
            isInvalid 
              ? 'border-red-500 bg-red-50 text-red-600 focus:ring-2 focus:ring-red-400' 
              : 'border-gray-300 bg-white text-gray-800 focus:ring-2 focus:ring-[#81007f]'
          }`}
        />

        {/* Error message text */}
        {isInvalid && (
          <p className="text-[11px] text-red-500 font-medium mt-1.5 text-center">
            ⚠️ Value must be between {activeModal.min} and {activeModal.max}
          </p>
        )}

        <div className="flex items-center justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          
          {/* Set Value button disabled if input is invalid */}
          <button
            type="button"
            onClick={onSave}
            disabled={isInvalid}
            className="px-4 py-1.5 text-xs font-bold bg-[#81007f] text-white rounded-lg hover:bg-[#660065] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            Set Value
          </button>
        </div>
      </div>
    </div>
  );
}