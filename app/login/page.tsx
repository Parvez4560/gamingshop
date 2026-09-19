'use client';

import { useState } from 'react';
import FloatingInput from '@/components/FloatingInput';
import Header from '@/components/layout/Header/Header';

export default function LoginPage() {
  const [isActive, setIsActive] = useState(false);

  return (
    <>
      {/* হেডার সবার উপরে ফিক্সড */}
      <Header />

      <main className="min-h-[calc(100vh-4rem)] bg-white w-full relative">
        
        {/* ========================================================= */}
        {/* 1. মোবাইল লেআউট (শুধুমাত্র মোবাইলের জন্য দৃশ্যমান: md:hidden) */}
        {/* ========================================================= */}
        <div className="block md:hidden w-full relative">
          
          {/* হেডারের নিচে ফিক্সড টগল বার */}
          <div className="sticky top-16 z-35 w-full h-[60px] bg-[#81007f] text-white flex items-center justify-center shadow-md">
            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              className="w-full h-full text-sm font-semibold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
            >
              {isActive ? (
                <span>Switch to Sign In ▾</span>
              ) : (
                <span>Switch to Sign Up ▾</span>
              )}
            </button>
          </div>

          {/* মোবাইল ফর্ম কন্টেইনার (ওপর থেকে স্লাইড হয়ে আসবে) */}
          <div className="relative w-full bg-white p-6 overflow-hidden min-h-[calc(100vh-10rem)] flex items-center justify-center">
            
            {/* Mobile Sign In */}
            <div
              className={`
                w-full max-w-sm bg-white transition-all duration-500 ease-in-out absolute
                ${
                  isActive
                    ? '-translate-y-full opacity-0 pointer-events-none'
                    : 'translate-y-0 opacity-100 pointer-events-auto'
                }
              `}
            >
              <form className="flex items-center justify-center flex-col text-center w-full py-4">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">
                  Gaming Shop Login
                </h1>

                <FloatingInput type="email" id="mob-signin-email" label="Email" />
                <FloatingInput type="password" id="mob-signin-password" label="Password" />

                <a
                  href="#"
                  className="text-gray-600 text-xs my-3 hover:text-[#81007f] self-start"
                >
                  Forgot Your Password?
                </a>

                <button
                  type="submit"
                  className="w-full bg-[#81007f] text-white text-xs font-semibold py-3 rounded-lg uppercase tracking-wider mt-4 cursor-pointer hover:bg-[#620060] transition"
                >
                  Sign In
                </button>
              </form>
            </div>

            {/* Mobile Sign Up */}
            <div
              className={`
                w-full max-w-sm bg-white transition-all duration-500 ease-in-out absolute
                ${
                  isActive
                    ? 'translate-y-0 opacity-100 pointer-events-auto'
                    : 'translate-y-full opacity-0 pointer-events-none'
                }
              `}
            >
              <form className="flex items-center justify-center flex-col text-center w-full py-4">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">
                  Create Account
                </h1>

                <FloatingInput type="text" id="mob-signup-name" label="Name" />
                <FloatingInput type="email" id="mob-signup-email" label="Email" />
                <FloatingInput type="password" id="mob-signup-password" label="Password" />

                <button
                  type="submit"
                  className="w-full bg-[#81007f] text-white text-xs font-semibold py-3 rounded-lg uppercase tracking-wider mt-4 cursor-pointer hover:bg-[#620060] transition"
                >
                  Sign Up
                </button>
              </form>
            </div>

          </div>
        </div>


        {/* ========================================================= */}
        {/* 2. ডেস্কটপ লেআউট (আগের মতো সম্পূর্ণ ঠিক রাখা হলো: hidden md:block) */}
        {/* ========================================================= */}
        <div
          className={`hidden md:block relative bg-white overflow-hidden
          w-full min-h-[calc(100vh-4rem)]
          transition-all duration-500
          ${isActive ? 'active' : ''}`}
        >

          {/* ================= SIGN UP FORM ================= */}
          <div
            className={`
              form-container sign-up
              absolute top-0 h-full w-1/2 left-0
              transition-all duration-500 ease-in-out
              z-10

              ${
                isActive
                  ? `
                    translate-x-full
                    opacity-100
                    pointer-events-auto
                  `
                  : `
                    translate-x-0
                    opacity-0
                    pointer-events-none
                  `
              }
            `}
          >
            <form className="bg-white flex items-center justify-center flex-col px-10 h-full text-center w-full">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Create Account
              </h1>

              <FloatingInput type="text" id="desk-signup-name" label="Name" />
              <FloatingInput type="email" id="desk-signup-email" label="Email" />
              <FloatingInput type="password" id="desk-signup-password" label="Password" />

              <button
                type="submit"
                className="bg-[#81007f] text-white text-xs font-semibold py-3 px-11 rounded-lg uppercase tracking-wider mt-3 cursor-pointer hover:bg-[#620060] transition"
              >
                Sign Up
              </button>
            </form>
          </div>


          {/* ================= SIGN IN FORM ================= */}
          <div
            className={`
              form-container sign-in
              absolute top-0 h-full w-1/2 left-0
              transition-all duration-500 ease-in-out
              z-20

              ${
                isActive
                  ? `
                    translate-x-full
                    opacity-0
                    pointer-events-none
                  `
                  : `
                    translate-x-0
                    opacity-100
                    pointer-events-auto
                  `
              }
            `}
          >
            <form className="bg-white flex items-center justify-center flex-col px-10 h-full text-center w-full">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Gaming Shop Login
              </h1>

              <FloatingInput type="email" id="desk-signin-email" label="Email" />
              <FloatingInput type="password" id="desk-signin-password" label="Password" />

              <a
                href="#"
                className="text-gray-600 text-xs my-3 hover:text-[#81007f]"
              >
                Forgot Your Password?
              </a>

              <button
                type="submit"
                className="bg-[#81007f] text-white text-xs font-semibold py-3 px-11 rounded-lg uppercase tracking-wider mt-1 cursor-pointer hover:bg-[#620060] transition"
              >
                Sign In
              </button>
            </form>
          </div>


          {/* ================= TOGGLE CONTAINER ================= */}
          <div
            className={`
              toggle-container
              absolute
              top-0
              left-1/2
              w-1/2
              h-full
              overflow-hidden
              transition-all duration-500 ease-in-out
              z-[1000]
              ${
                isActive
                  ? '-translate-x-full rounded-r-[50px] rounded-l-none'
                  : 'rounded-l-[50px] rounded-r-none'
              }
            `}
          >
            <div
              className={`
                toggle
                bg-[#81007f]
                text-white
                h-full
                relative
                -left-full
                w-[200%]
                transition-all duration-500 ease-in-out
                ${isActive ? 'translate-x-1/2' : 'translate-x-0'}
              `}
            >
              {/* DESKTOP LEFT */}
              <div
                className={`
                  toggle-panel
                  toggle-left
                  absolute
                  w-1/2
                  h-full
                  flex items-center justify-center flex-col
                  px-8
                  text-center
                  top-0
                  transition-all duration-500 ease-in-out
                  ${isActive ? 'translate-x-0' : '-translate-x-[200%]'}
                `}
              >
                <h1 className="text-2xl font-bold mb-2">Welcome Back!</h1>
                <p className="text-xs leading-5 tracking-wide mb-5">
                  To keep connected with us please login with your personal info
                </p>
                <button
                  type="button"
                  onClick={() => setIsActive(false)}
                  className="bg-transparent border border-white text-white text-xs font-semibold py-2.5 px-9 rounded-lg uppercase tracking-wider cursor-pointer hover:bg-white/10 transition"
                >
                  Sign In
                </button>
              </div>

              {/* DESKTOP RIGHT */}
              <div
                className={`
                  toggle-panel
                  toggle-right
                  absolute
                  right-0
                  w-1/2
                  h-full
                  flex items-center justify-center flex-col
                  px-8
                  text-center
                  top-0
                  transition-all duration-500 ease-in-out
                  ${isActive ? 'translate-x-[200%]' : 'translate-x-0'}
                `}
              >
                <h1 className="text-2xl font-bold mb-2">Hello, Gamer!</h1>
                <p className="text-xs leading-5 tracking-wide mb-5">
                  Enter your personal details and start your journey with Gaming Shop
                </p>
                <button
                  type="button"
                  onClick={() => setIsActive(true)}
                  className="bg-transparent border border-white text-white text-xs font-semibold py-2.5 px-9 rounded-lg uppercase tracking-wider cursor-pointer hover:bg-white/10 transition"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>

        </div>

      </main>
    </>
  );
}