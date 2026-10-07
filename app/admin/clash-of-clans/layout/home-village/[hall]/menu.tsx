"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Menu({ isOpen, onClose }: MenuProps) {
  const params = useParams();
  const router = useRouter();
  const hallId = params?.hall as string;

  if (!isOpen) return null;

  return (
    <>
      {/* ব্যাকগ্রাউন্ড ওভারলে */}
      <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* মেনু প্যানেল */}
      <div className="fixed right-0 top-0 z-50 h-full w-72 bg-white shadow-2xl p-6 flex flex-col justify-between border-l border-gray-100">
        
        {/* ওপরের অংশ */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <h3 className="text-base font-bold text-gray-900">Quick Menu</h3>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-700 font-bold text-lg"
            >
              ✕
            </button>
          </div>

          {/* অপশনগুলোর লিংক */}
          <div className="space-y-2">
            <Link
              href="/admin/dashboard"
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-700 hover:bg-purple-50 hover:text-[#81007f] transition-colors"
            >
              <span>🏠</span> Dashboard
            </Link>

            <Link
              href={`/admin/clash-of-clans/layout/home-village/${hallId}/add-layout`}
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-700 hover:bg-purple-50 hover:text-[#81007f] transition-colors"
            >
              <span>➕</span> Add New Layout
            </Link>

            {/* 🚀 ভবিষ্যতে নতুন কোনো ফিচার যুক্ত করতে চাইলে ঠিক এখানে আরেকটি লিংক বা অপশন বসিয়ে দিতে পারবেন */}
          </div>
        </div>

        {/* নিচের লগআউট বাটন */}
        <div className="border-t border-gray-100 pt-4">
          <button
            onClick={() => {
              onClose();
              localStorage.removeItem('admin_auth_token');
              router.replace('/admin/login');
            }}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
          >
            <span>🚪</span> Log Out
          </button>
        </div>

      </div>
    </>
  );
}