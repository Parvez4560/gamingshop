"use client";

import Link from "next/link";
import Image from "next/image";

interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Menu({ isOpen, onClose }: MenuProps) {
  return (
    <div
      className={`fixed inset-0 z-50 flex transition-colors duration-300 ${
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      {/* ব্যাকগ্রাউন্ড ব্লার ওভারলে */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* সাইড মেনু প্যানেল (ডান দিক থেকে স্মুথ স্লাইড হয়ে আসবে) */}
      <div 
        className={`relative ml-auto flex h-full w-80 flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out z-10 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        
        {/* মেনু হেডার ও ক্লোজ বাটন */}
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-6">
          <span className="text-lg font-bold text-gray-900">Menu</span>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* মেনু লিংকসমূহ */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
          
          {/* Home */}
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-black transition-colors"
          >
            <Image src="/icons/ui/general/home.svg" alt="Home" width={20} height={20} className="h-5 w-5 object-contain" />
            Home
          </Link>

          {/* Orders */}
          <Link
            href="/orders"
            onClick={onClose}
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-black transition-colors"
          >
            <Image src="/icons/games/shop/shopping-card.svg" alt="Orders" width={20} height={20} className="h-5 w-5 object-contain" />
            Track Order
          </Link>

          {/* Support */}
          <Link
            href="/support"
            onClick={onClose}
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-black transition-colors"
          >
            <Image src="/ui/support.svg" alt="Support" width={20} height={20} className="h-5 w-5 object-contain" />
            Support / Help
          </Link>

          {/* Coc layout */}
          <Link
            href="/clash-of-clans/layout"
            onClick={onClose}
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-black transition-colors"
          >
            <Image src="/ui/coc-layout.svg" alt="COC Layout" width={20} height={20} className="h-5 w-5 object-contain" />
            COC Layout
          </Link>
          
          {/* logout */}
          <Link
            href="/logout"
            onClick={onClose}
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-black transition-colors"
          >
            <Image src="/ui/logout.svg" alt="Logout" width={20} height={20} className="h-5 w-5 object-contain" />
            Log Out
          </Link>

        </div>

        {/* ফুটার */}
        <div className="border-t border-gray-100 p-6 text-center text-xs text-gray-400">
          © 2026 GamingShop. All rights reserved.
        </div>

      </div>
    </div>
  );
}