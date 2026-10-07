"use client";

import { useParams } from "next/navigation";
import Navbar from "./navbar"; // ওই পেজের নিজস্ব ন্যাভবার
import { homeHalls } from "@/app/clash-of-clans/layout/homeVillageData";

export default function HomeVillageLayoutPage() {
  const params = useParams();
  const hallId = params.hall as string;
  const currentHall = homeHalls.find((h) => h.route.includes(hallId));

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* নিজস্ব ন্যাভবার ও মেনু কম্পোনেন্ট */}
      <Navbar />

      {/* পেজের মূল কন্টেন্ট এলাকা */}
      <main className="flex-1 max-w-7xl mx-auto px-4 py-12 w-full flex items-center justify-center">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200 text-center max-w-lg w-full space-y-4">
          
          {/* হলের নাম ও আইকন */}
          <div className="w-16 h-16 bg-purple-50 rounded-2xl mx-auto flex items-center justify-center border border-purple-100">
            <span className="text-2xl">🏰</span>
          </div>

          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">
              {currentHall ? currentHall.name : "Home Village"}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Layout Management Control Panel
            </p>
          </div>

          <div className="pt-4 border-t border-gray-100 text-xs text-gray-400">
            ওপরের ডানপাশের <span className="font-bold text-[#81007f]">⚙️ Menu</span> থেকে খুব সহজেই নতুন লেআউট যোগ করা বা ড্যাশবোর্ডে ফিরে যাওয়া যাবে।
          </div>

        </div>
      </main>
    </div>
  );
}