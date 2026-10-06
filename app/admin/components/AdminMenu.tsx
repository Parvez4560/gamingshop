"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminMenu({ isOpen, onClose }: MenuProps) {
  const pathname = usePathname();
  const router = useRouter();

  // COC Layout মেইন ড্রপডাউন ওপেন/ক্লোজ স্টেট
  const [isCocOpen, setIsCocOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('admin_auth_token');
    router.replace('/admin/login');
  };

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

      {/* সাইড মেনু প্যানেল */}
      <div 
        className={`relative ml-auto flex h-full w-80 flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out z-10 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        
        {/* মেনু হেডার ও ক্লোজ বাটন */}
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-6">
          <span className="text-lg font-bold text-gray-900">Admin Menu</span>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <img
              src="/icons/ui/actions/close.svg"
              alt="Close"
              className="h-5 w-5"
            />
          </button>
        </div>

        {/* মেনু লিংকসমূহ */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
          
          {/* Dashboard */}
          <Link
            href="/admin/dashboard"
            onClick={onClose}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium transition-colors ${
              pathname === '/admin/dashboard' 
                ? 'bg-blue-50 text-blue-600 font-semibold' 
                : 'text-gray-700 hover:bg-gray-100 hover:text-black'
            }`}
          >
            <Image src="/icons/ui/navigation/home.svg" alt="Dashboard" width={20} height={20} className="h-5 w-5 object-contain" />
            Dashboard
          </Link>

          {/* COC Layout Dropdown */}
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => setIsCocOpen(!isCocOpen)}
              className="w-full flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-black transition-colors"
            >
              <div className="flex items-center gap-3">
                <Image src="/ui/coc-layout.svg" alt="COC Layout" width={20} height={20} className="h-5 w-5 object-contain" />
                <span>COC Layout</span>
              </div>
              
              {/* অ্যারো আইকন যা ক্লিক করলে ঘুরবে */}
              <img
                src="/icons/ui/actions/chevron-down.svg"
                alt="Toggle Arrow"
                className={`h-4 w-4 transition-transform duration-300 ${
                  isCocOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>

            {/* এই অংশটুকু নিচ থেকে স্লাইড হয়ে বের হবে */}
            <div 
              className={`overflow-hidden transition-all duration-300 ease-in-out pl-4 space-y-1 ${
                isCocOpen ? "max-h-40 opacity-100 py-1" : "max-h-0 opacity-0 py-0"
              }`}
            >
              {/* ১. Home Village */}
              <Link
                href="/admin/clash-of-clans/layout/home-village"
                onClick={onClose}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <span>🏠</span>
                <span>Home Village</span>
              </Link>

              {/* ২. Builder Base */}
              <Link
                href="/admin/clash-of-clans/layout/builder-base"
                onClick={onClose}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <span>🏗️</span>
                <span>Builder Base</span>
              </Link>

              {/* ৩. Clan Capital */}
              <Link
                href="/admin/clash-of-clans/layout/clan-capital"
                onClick={onClose}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <span>⚔️</span>
                <span>Clan Capital</span>
              </Link>
            </div>
          </div>

          {/* Settings */}
          <Link
            href="/admin/settings"
            onClick={onClose}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium transition-colors ${
              pathname === '/admin/settings' 
                ? 'bg-blue-50 text-blue-600 font-semibold' 
                : 'text-gray-700 hover:bg-gray-100 hover:text-black'
            }`}
          >
            <Image src="/ui/support.svg" alt="Settings" width={20} height={20} className="h-5 w-5 object-contain" />
            Settings
          </Link>
          
        </div>

        {/* লগআউট বাটন সেকশন */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={() => {
              onClose();
              handleLogout();
            }}
            className="w-full flex items-center justify-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
          >
            <Image src="/ui/logout.svg" alt="Logout" width={20} height={20} className="h-5 w-5 object-contain" />
            Log Out
          </button>
        </div>

        {/* ফুটার */}
        <div className="border-t border-gray-100 p-4 text-center text-xs text-gray-400">
          © 2026 GamingShop Admin. All rights reserved.
        </div>

      </div>
    </div>
  );
}