'use client'; 

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AdminNavbar from '@/app/admin/components/AdminNavbar'; // আপনার অ্যাডমিন নেভবার

import { homeHalls } from '@/app/clash-of-clans/layout/homeVillageData';
import { builderHalls } from '@/app/clash-of-clans/layout/builderBaseData';
import { capitalHalls } from '@/app/clash-of-clans/layout/clanCapitalData';

export default function AdminTownHallSelectionPage() {
  const [activeVillage, setActiveVillage] = useState('home-village');

  const getCurrentItems = () => {
    if (activeVillage === 'home-village') return homeHalls;
    if (activeVillage === 'builder-base') return builderHalls;
    if (activeVillage === 'clan-capital') return capitalHalls;
    return homeHalls;
  };

  const currentItems = getCurrentItems();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ১. অ্যাডমিন হেডার ও স্লাইড মেনু */}
      <AdminNavbar />

      {/* ২. সাব-বার (ট্যাব ফিল্টারিং) */}
      <div className="sticky top-16 z-40 w-full bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm py-3 px-4 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 sm:gap-6">
          <button
            onClick={() => setActiveVillage('home-village')}
            className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
              activeVillage === 'home-village'
                ? 'bg-[#81007f] text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Home Village
          </button>

          <button
            onClick={() => setActiveVillage('builder-base')}
            className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
              activeVillage === 'builder-base'
                ? 'bg-[#81007f] text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Builder Base
          </button>

          <button
            onClick={() => setActiveVillage('clan-capital')}
            className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
              activeVillage === 'clan-capital'
                ? 'bg-[#81007f] text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Clan Capital
          </button>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        
        {/* পেজের শিরোনাম */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl capitalize">
            Manage {activeVillage.replace('-', ' ')} Layouts
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Select a level to manage, edit, or upload base layouts for admin panel.
          </p>
        </div>

        {/* কার্ডগুলোর গ্রিড */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {currentItems.map((item) => (
            <Link
              key={item.id}
              href={`/admin/clash-of-clans/layout/${item.id}`} // অ্যাডমিন রাউটিং পাথ
              className="group bg-white rounded-2xl p-5 border border-gray-200 shadow-sm hover:shadow-md hover:border-[#81007f] transition-all duration-300 flex flex-col items-center text-center cursor-pointer"
            >
              {/* ছবি */}
              <div className="relative w-24 h-24 mb-4 transition-transform duration-300 group-hover:scale-105">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-contain"
                />
              </div>

              {/* নাম */}
              <span className="text-base font-bold text-gray-800 group-hover:text-[#81007f] transition-colors">
                {item.name}
              </span>
              
              <div className="mt-2 flex items-center gap-1 text-xs text-gray-500 group-hover:text-[#81007f] transition-colors">
                <span>Manage Layouts</span>
                <Image
                  src="/ui/right-arrow.svg"
                  alt="Arrow Icon"
                  width={14}
                  height={14}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </div>
            </Link>
          ))}
        </div>

      </main>
    </div>
  );
}