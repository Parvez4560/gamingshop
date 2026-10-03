'use client'; 

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/layout/Header/Header';

// একই ফোল্ডারে থাকা ডাটা ফাইলগুলো ইমপোর্ট করা হলো
import { homeHalls } from './homeVillageData';
import { builderHalls } from './builderBaseData';
import { capitalHalls } from './capitalPeakData';

export default function TownHallSelectionPage() {
  const [activeVillage, setActiveVillage] = useState('home-village');

  // বর্তমান ট্যাব অনুযায়ী সঠিক ডাটা সিলেক্ট করা
  const getCurrentItems = () => {
    if (activeVillage === 'home-village') return homeHalls;
    if (activeVillage === 'builder-base') return builderHalls;
    if (activeVillage === 'capital-peak') return capitalHalls;
    return homeHalls;
  };

  const currentItems = getCurrentItems();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ১. মূল হেডার বার (sticky top-0) */}
      <Header />

      {/* ২. দ্বিতীয় সাব-বার (sticky top-16 দিয়ে হেডারের নিচে আটকে রাখা হয়েছে) */}
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
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl capitalize">
            Select Your {activeVillage.replace('-', ' ')}
          </h1>
        </div>

        {/* কার্ডগুলোর গ্রিড */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {currentItems.map((item) => (
            <Link
              key={item.id}
              href={item.route}
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