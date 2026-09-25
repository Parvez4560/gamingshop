"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Menu from "./Menu"; // আলাদা করা মেনু ফাইলটি ইমপোর্ট করা হলো

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/90 backdrop-blur-md shadow-sm">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* Logo & Name */}
          <Link href="/" className="flex items-center gap-3">
            <div className="h-10 w-10">
              <Image
                src="/ui/gamingshop.svg"
                alt="Gaming Shop"
                width={40}
                height={40}
              />
            </div>

            <span className="text-xl font-bold text-gray-900">
              GamingShop
            </span>
          </Link>

          {/* Login & Menu */}
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-base font-bold text-gray-900 antialiased transition-colors hover:text-black"
            >
              Login
            </Link>

            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              aria-label="Open menu"
              className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <Image
                src="/ui/menu.svg"
                alt="Menu Icon"
                width={20}
                height={20}
                className="h-5 w-5"
              />
            </button>
          </div>

        </div>
      </header>

      {/* আলাদা করা মোবাইল মেনু কম্পোনেন্ট */}
      <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}