"use client";

import { useState } from "react";
import Navbar from "./components/Navbar";

export default function AddGameIdPage() {
  const [formData, setFormData] = useState({
    playerTag: "",
    playerName: "",
    townHall: "13",
    trophies: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      
      {/* Navbar কম্পোনেন্ট */}
      <Navbar />

      {/* মূল কন্টেন্ট এরিয়া */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 space-y-8">
        
        {/* পেজের শিরোনাম */}
        <div className="border-b border-gray-100 pb-4">
          <h1 className="text-2xl font-extrabold text-gray-900">
            নতুন Clash of Clans অ্যাকাউন্ট যুক্ত করুন
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            অ্যাকাউন্টের বেসিক তথ্য দিয়ে শুরু করুন। পরবর্তীতে একে একে হিরো, ট্র্যুপস ও প্রাইসিং মডিউলগুলো যুক্ত করা হবে।
          </p>
        </div>

        {/* সেকশন ১: বেসিক ইনফো ফরম */}
        <div id="basic-info" className="bg-gray-50 border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-600"></span>
            প্রাথমিক তথ্য (Basic Information)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Player Tag (যেমন: #2PP0V88UQ) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="playerTag"
                placeholder="#XXXXXXXX"
                value={formData.playerTag}
                onChange={handleChange}
                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-purple-600 shadow-inner"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                ইন-গেম প্লেয়ারের নাম <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="playerName"
                placeholder="নাম লিখুন"
                value={formData.playerName}
                onChange={handleChange}
                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-purple-600 shadow-inner"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Town Hall (TH) লেভেল
              </label>
              <select
                name="townHall"
                value={formData.townHall}
                onChange={handleChange}
                className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-purple-600"
              >
                {[...Array(17)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    Town Hall {i + 1}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                বর্তমান ট্রফি সংখ্যা
              </label>
              <input
                type="number"
                name="trophies"
                placeholder="যেমন: 4500"
                value={formData.trophies}
                onChange={handleChange}
                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-purple-600 shadow-inner"
              />
            </div>

          </div>
        </div>

        {/* লাইভ JSON প্রিভিউ দেখার বক্স */}
        <div className="bg-slate-900 rounded-2xl p-5 text-white shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Live JSON Output Preview</span>
            <span className="text-[10px] text-gray-400">অটো জেনারেটেড ডাটা</span>
          </div>
          <pre className="font-mono text-emerald-400 text-xs overflow-x-auto bg-slate-950 p-3 rounded-xl border border-slate-800">
            {JSON.stringify(formData, null, 2)}
          </pre>
        </div>

      </main>

      {/* ফুটার */}
      <footer className="py-6 text-center text-xs text-gray-400 border-t border-gray-100 bg-white">
        &copy; {new Date().getFullYear()} GamingShop Admin Panel. All rights reserved.
      </footer>

    </div>
  );
}