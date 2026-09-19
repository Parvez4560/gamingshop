"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "../components/layout/Header/Header";
import { notFoundAnimations } from "../components/animations/notFound";
import LostTravelerAnimation from "../components/animations/notFound/LostTravelerAnimation";

export default function NotFound() {
  const [RandomAnimation, setRandomAnimation] = useState<any>(null);

  useEffect(() => {
    // পেজ ক্লায়েন্ট সাইডে লোড হওয়ার পর র্যান্ডমলি একটি অ্যানিমেশন সিলেক্ট করবে
    const randomIndex = Math.floor(Math.random() * notFoundAnimations.length);
    setRandomAnimation(() => notFoundAnimations[randomIndex]);
  }, []);

  // যতক্ষণ না সিলেক্ট হচ্ছে, ডিফল্টভাবে একটি অ্যানিমেশন দেখাবে
  const SelectedAnimation = RandomAnimation || LostTravelerAnimation;

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      {/* ওয়েবসাইটের মূল হেডার */}
      <Header />

      {/* 404 সেকশন */}
      <section className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl w-full text-center">
          
          {/* 404 হেডিং */}
          <h1 className="text-6xl sm:text-7xl font-black text-gray-800 tracking-wider mb-2">
            404
          </h1>

          {/* ডাইনামিক র্যান্ডম অ্যানিমেশন রেন্ডার হবে */}
          <SelectedAnimation />

          {/* নিচের টেক্সট এবং হোম পেজে যাওয়ার বাটন */}
          <div className="mt-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Look like you're lost
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              The page you are looking for is not available or has been moved.
            </p>
            
            <Link 
              href="/" 
              className="inline-block px-6 py-3 text-white font-medium bg-[#39ac31] hover:bg-[#32982a] transition-all rounded-lg shadow-sm"
            >
              Go to Home
            </Link>
          </div>

        </div>
      </section>
    </main>
  );
}