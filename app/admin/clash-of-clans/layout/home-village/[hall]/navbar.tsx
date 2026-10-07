"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Menu from "./menu"; // একই ফোল্ডারে থাকা মেনু কম্পোনেন্ট

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchId, setSearchId] = useState("");
  
  const params = useParams();
  const router = useRouter();
  const hallId = params?.hall as string;

  // আইডি দিয়ে সার্চ হ্যান্ডেল করার ফাংশন (প্রয়োজনমতো এখানে সার্চ লজিক বা ফিল্টার বসাতে পারবেন)
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) return;
    // উদাহরণস্বরূপ: নির্দিষ্ট আইডি দিয়ে ফিল্টার বা রিডাইরেক্ট করার কোড এখানে হবে
    console.log("Searching for ID:", searchId);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/90 backdrop-blur-md shadow-sm">
        <div className="mx-auto flex h-16 w-full items-center justify-between px-6 lg:px-8 gap-4">

          {/* Logo & Name */}
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <div className="h-10 w-10 relative">
              <Image
                src="/icons/gamingshop.svg"
                alt="Gaming Shop"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>

            <span className="text-xl font-bold text-gray-900">
              GamingShop <span className="text-xs font-semibold px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full ml-1">Admin</span>
            </span>
          </Link>

          {/* ২. মেনুর বামপাশে আইডি সার্চ বার */}
          <div className="flex-1 max-w-md mx-2">
            <form onSubmit={handleSearch} className="relative flex items-center">
              <input
                type="text"
                placeholder="Search layout by ID..."
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-xs sm:text-sm text-gray-800 focus:outline-none focus:border-purple-500 transition-all placeholder:text-gray-400 shadow-inner"
              />
              <button
                type="submit"
                className="absolute right-2 bg-purple-100 hover:bg-purple-200 text-[#81007f] px-3 py-1 rounded-lg text-xs font-semibold transition-colors"
              >
                Search
              </button>
            </form>
          </div>

          {/* ৩. ডান পাশের মেনু টগল বাটন */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              aria-label="Open menu"
              className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 hover:bg-gray-100 transition-colors border border-gray-200 shadow-sm"
            >
              <Image
                src="/icons/ui/general/menu.svg"
                alt="Menu Icon"
                width={20}
                height={20}
                className="h-5 w-5 object-contain"
              />
            </button>
          </div>

        </div>
      </header>

      {/* স্লাইড-আউট বা ড্রপডাউন মেনু কম্পোনেন্ট */}
      <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}