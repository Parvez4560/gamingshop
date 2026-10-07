"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Menu from "./menu";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchId, setSearchId] = useState("");
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false); // মোবাইলে সার্চ বার টগল করার জন্য স্টেট
  
  const params = useParams();
  const router = useRouter();
  const hallId = params?.hall as string;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) return;
    console.log("Searching for ID:", searchId);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/90 backdrop-blur-md shadow-sm">
        <div className="mx-auto flex h-16 w-full items-center justify-between px-4 sm:px-6 lg:px-8 gap-2 sm:gap-4">

          {/* ১. Logo & Name (মোবাইলে স্ক্রিন ছোট থাকলে লোগোর নাম যেন হাইড না হয়, তাই shrink-0 দেওয়া হয়েছে) */}
          <Link href="/admin/dashboard" className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="h-9 w-9 sm:h-10 sm:w-10 relative">
              <Image
                src="/icons/gamingshop.svg"
                alt="Gaming Shop"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>

            <span className="text-base sm:text-xl font-bold text-gray-900 flex items-center">
              GamingShop <span className="text-[10px] sm:text-xs font-semibold px-1.5 sm:px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full ml-1">Admin</span>
            </span>
          </Link>

          {/* ২. ডেস্কটপ সার্চ বার (বড় স্ক্রিনে দেখাবে, অনেক বড় লেখা লিখলে যেন ডানপাশে হারিয়ে না যায় তাই overflow হ্যান্ডেল করা হয়েছে) */}
          <div className="hidden md:flex flex-1 max-w-md mx-2">
            <form onSubmit={handleSearch} className="relative flex items-center w-full">
              <input
                type="text"
                placeholder="Search layout by ID..."
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-4 pr-16 py-2 text-sm text-gray-800 focus:outline-none focus:border-purple-500 transition-all placeholder:text-gray-400 shadow-inner truncate"
              />
              <button
                type="submit"
                className="absolute right-1.5 bg-purple-100 hover:bg-purple-200 text-[#81007f] px-3 py-1 rounded-lg text-xs font-semibold transition-colors"
              >
                Search
              </button>
            </form>
          </div>

          {/* ৩. ডান পাশের বাটনগুলো (মোবাইল সার্চ আইকন + মেনু বাটন) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* মোবাইল সার্চ টগল বাটন (শুধু ছোট স্ক্রিনে দেখাবে) */}
            <button
              type="button"
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              aria-label="Toggle search"
              className="flex md:hidden h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg text-gray-700 hover:bg-gray-100 transition-colors border border-gray-200 shadow-sm"
            >
              <Image
                src="/icons/ui/general/search.svg"
                alt="Search Icon"
                width={18}
                height={18}
                className="h-4 w-4 sm:h-5 sm:w-5 object-contain"
              />
            </button>

            {/* মেনু টগল বাটন */}
            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              aria-label="Open menu"
              className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg text-gray-700 hover:bg-gray-100 transition-colors border border-gray-200 shadow-sm"
            >
              <Image
                src="/icons/ui/general/menu.svg"
                alt="Menu Icon"
                width={18}
                height={18}
                className="h-4 w-4 sm:h-5 sm:w-5 object-contain"
              />
            </button>
          </div>

        </div>

        {/* ৪. মোবাইলের ড্রপডাউন/স্লাইড সার্চ বার (সার্চ আইকনে ক্লিক করলে নিচে ফর্মে বের হবে) */}
        {isMobileSearchOpen && (
          <div className="md:hidden px-4 pb-3 pt-1 bg-white border-t border-gray-100 animate-fadeIn">
            <form onSubmit={handleSearch} className="relative flex items-center w-full">
              <input
                type="text"
                placeholder="Search layout by ID..."
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-4 pr-16 py-2 text-xs text-gray-800 focus:outline-none focus:border-purple-500 transition-all placeholder:text-gray-400 shadow-inner"
              />
              <button
                type="submit"
                className="absolute right-1.5 bg-purple-100 hover:bg-purple-200 text-[#81007f] px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
              >
                Search
              </button>
            </form>
          </div>
        )}
      </header>

      {/* স্লাইড-আউট বা ড্রপডাউন মেনু কম্পোনেন্ট */}
      <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}