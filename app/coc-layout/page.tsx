'use client'; // যেহেতু সাব-বারের ক্লিকের জন্য স্টেট ব্যবহার করা হচ্ছে, তাই পেজটি ক্লায়েন্ট কম্পোনেন্ট হবে

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/layout/Header/Header';

export default function TownHallSelectionPage() {
  // কোন ভিলেজটি সিলেক্ট করা আছে তার স্টেট (ডিফল্ট: home-village)
  const [activeVillage, setActiveVillage] = useState('home-village');

  // TH-18 থেকে TH-3 পর্যন্ত ডাইনামিকালি অ্যারে তৈরি করা
  const townHalls = Array.from({ length: 16 }, (_, i) => {
    const thNumber = 18 - i; // ১৮ থেকে শুরু হয়ে ৩ পর্যন্ত নামবে
    return {
      id: `th-${thNumber}`,
      name: `Town Hall ${thNumber}`,
      image: `/coc/home-village/town-hall/Town_Hall_${thNumber}.webp`
    };
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ১. মূল হেডার বার */}
      <Header />

      {/* ২. দ্বিতীয় সাব-বার (Home Village, Builder Base, Capital Peak) */}
      <div className="w-full bg-white border-b border-gray-200 shadow-sm py-3 px-4">
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
            onClick={() => setActiveVillage('capital-peak')}
            className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
              activeVillage === 'capital-peak'
                ? 'bg-[#81007f] text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Capital Peak
          </button>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        
        {/* পেজের শিরোনাম */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Select Your Town Hall
          </h1>
        </div>

        {/* টাউন হল কার্ডগুলোর গ্রিড */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {townHalls.map((th) => (
            <Link
              key={th.id}
              href={`/clash-of-clans/${th.id}`}
              className="group bg-white rounded-2xl p-5 border border-gray-200 shadow-sm hover:shadow-md hover:border-[#81007f] transition-all duration-300 flex flex-col items-center text-center cursor-pointer"
            >
              {/* টাউন হলের ছবি বা আইকন */}
              <div className="relative w-24 h-24 mb-4 transition-transform duration-300 group-hover:scale-105">
                <Image
                  src={th.image}
                  alt={th.name}
                  fill
                  className="object-contain"
                />
              </div>

              {/* টাউন হলের নাম */}
              <span className="text-base font-bold text-gray-800 group-hover:text-[#81007f] transition-colors">
                {th.name}
              </span>
              
              <div className="mt-2 flex items-center gap-1 text-xs text-gray-500 group-hover:text-[#81007f] transition-colors">
              <span>View Layouts</span>
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