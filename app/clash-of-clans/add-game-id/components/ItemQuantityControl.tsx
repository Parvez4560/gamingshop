'use client';

import React from 'react';

interface ItemQuantityControlProps {
  label: string;
  value: number;
  min: number;
  max: number;
  onIncrease: () => void;
  onDecrease: () => void;
  onOpenModal: () => void;
}

export default function ItemQuantityControl({
  label,
  value,
  min,
  max,
  onIncrease,
  onDecrease,
  onOpenModal,
}: ItemQuantityControlProps) {
  return (
    <div className="flex items-center space-x-2">
      <span className="text-gray-600 font-medium text-xs">{label}:</span>
      
      <button
        type="button"
        onClick={onDecrease}
        disabled={value <= min}
        className="w-7 h-7 bg-red-500 text-white rounded font-bold hover:bg-red-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center justify-center cursor-pointer"
      >
        -
      </button>

      <button
        type="button"
        onClick={onOpenModal}
        className="font-bold px-2 py-0.5 rounded border border-dashed border-gray-300 hover:border-[#81007f] hover:bg-purple-50 hover:text-[#81007f] transition-all cursor-pointer text-gray-800 text-xs min-w-[32px] text-center"
        title={`Click to edit ${label.toLowerCase()} directly`}
      >
        {value}
      </button>

      <button
        type="button"
        onClick={onIncrease}
        disabled={value >= max}
        className="w-7 h-7 bg-green-500 text-white rounded font-bold hover:bg-green-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center justify-center cursor-pointer"
      >
        +
      </button>
    </div>
  );
}