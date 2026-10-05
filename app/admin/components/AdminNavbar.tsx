"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import AdminMenu from "./AdminMenu";

export default function AdminNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/90 backdrop-blur-md shadow-sm">
        <div className="mx-auto flex h-16 w-full items-center justify-between px-6 lg:px-8">

          {/* ব্র্যান্ড লোগো এবং নাম */}
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <div className="h-9 w-9 relative">
              <Image
                src="/ui/gamingshop.svg"
                alt="Gaming Shop"
                width={36}
                height={36}
                className="object-contain"
              />
            </div>
            <span className="text-xl font-bold text-gray-900">
              GamingShop <span className="text-xs font-semibold px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full ml-1">Admin</span>
            </span>
          </Link>

          {/* ডান পাশের মেনু টগল বাটন */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              aria-label="Open menu"
              className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
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

      {/* স্লাইড-আউট মেনু কম্পোনেন্ট */}
      <AdminMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}