'use client';

import { useState } from 'react';
import FloatingInput from '@/components/FloatingInput';
import Header from '@/components/layout/Header/Header';

export default function LoginPage() {
  const [isActive, setIsActive] = useState(false);

  // পাসওয়ার্ড এবং রুলস বক্সের জন্য স্টেট
  const [password, setPassword] = useState('');
  const [showPasswordRules, setShowPasswordRules] = useState(false);

  // পাসওয়ার্ড শর্তগুলো চেক করার লজিক
  const validations = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    noSpace: !/\s/.test(password) && password.length > 0,
  };

  return (
    <>
      {/* হেডার সবার উপরে ফিক্সড */}
      <Header />

      {/* মূল কন্টেইনার */}
      <main className="h-[calc(100vh-4rem)] w-full overflow-hidden bg-white relative flex flex-col md:block">
        
        {/* ================= MOBILE & DESKTOP TOGGLE CONTAINER ================= */}
        <div
          className={`
            toggle-container
            w-full md:w-1/2
            h-[72px] md:h-full
            fixed md:absolute
            top-16 md:top-0
            left-0 md:left-1/2
            z-30
            overflow-hidden
            transition-all duration-500 ease-in-out
            ${
              isActive
                ? 'md:-translate-x-full md:rounded-r-[50px] md:rounded-l-none'
                : 'md:rounded-l-[50px] md:rounded-r-none'
            }
          `}
        >
          {/* ================= DESKTOP TOGGLE ================= */}
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
              hidden md:block
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
              <h1 className="text-2xl font-bold mb-2">
                Welcome Back!
              </h1>
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
              <h1 className="text-2xl font-bold mb-2">
                Hello, Gamer!
              </h1>
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

          {/* ================= MOBILE TOGGLE ================= */}
          <div className="bg-[#81007f] text-white h-full flex md:hidden items-center justify-center shadow-md">
            {isActive ? (
              <button
                type="button"
                onClick={() => setIsActive(false)}
                className="w-full h-full text-sm font-semibold uppercase tracking-wider"
              >
                Sign In
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsActive(true)}
                className="w-full h-full text-sm font-semibold uppercase tracking-wider"
              >
                Sign Up
              </button>
            )}
          </div>
        </div>


        {/* ================= FORMS CONTAINER ================= */}
        <div
          className={`relative bg-white w-full h-full flex-1 overflow-y-auto md:overflow-hidden transition-all duration-500 pt-[72px] md:pt-0 ${
            isActive ? 'active' : ''
          }`}
        >
          {/* ================= SIGN UP FORM ================= */}
          <div
            className={`
              form-container sign-up
              absolute top-0 h-full w-full md:w-1/2 left-0
              transition-all duration-500 ease-in-out
              z-10
              ${
                isActive
                  ? `
                    translate-y-0
                    opacity-100
                    pointer-events-auto
                    md:translate-x-full
                  `
                  : `
                    -translate-y-full
                    opacity-0
                    pointer-events-none
                    md:translate-y-0
                    md:opacity-0
                  `
              }
            `}
          >
            <form className="bg-white flex items-center justify-center flex-col px-6 md:px-10 h-full py-8 md:py-0 text-center w-full">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Create Account
              </h1>

              <FloatingInput type="text" id="signup-name" label="Name" />
              <FloatingInput type="email" id="signup-email" label="Email" />

              {/* পাসওয়ার্ড ফিল্ড এবং ডানপাশে ইনফো আইকন */}
              <div className="relative w-full mb-3">
                <div className="relative">
                  <FloatingInput 
                    type="password" 
                    id="signup-password" 
                    label="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  
                  {/* ডান পাশের ইনফো আইকন */}
                  <button
                    type="button"
                    onClick={() => setShowPasswordRules(!showPasswordRules)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#81007f] transition p-1 z-10 cursor-pointer"
                    title="Password requirements"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                </div>

                {/* শর্তগুলোর পপআপ বক্স */}
                {showPasswordRules && (
                  <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl p-3 text-left z-30 text-xs space-y-1.5">
                    <p className="font-semibold text-gray-700 mb-1">Password must contain:</p>
                    
                    <div className={`flex items-center gap-2 ${validations.length ? 'text-green-600' : 'text-gray-500'}`}>
                      <span>{validations.length ? '✅' : '❌'}</span> At least 8 characters
                    </div>
                    <div className={`flex items-center gap-2 ${validations.uppercase ? 'text-green-600' : 'text-gray-500'}`}>
                      <span>{validations.uppercase ? '✅' : '❌'}</span> At least 1 uppercase letter (A–Z)
                    </div>
                    <div className={`flex items-center gap-2 ${validations.lowercase ? 'text-green-600' : 'text-gray-500'}`}>
                      <span>{validations.lowercase ? '✅' : '❌'}</span> At least 1 lowercase letter (a–z)
                    </div>
                    <div className={`flex items-center gap-2 ${validations.number ? 'text-green-600' : 'text-gray-500'}`}>
                      <span>{validations.number ? '✅' : '❌'}</span> At least 1 number (0–9)
                    </div>
                    <div className={`flex items-center gap-2 ${validations.noSpace ? 'text-green-600' : 'text-gray-500'}`}>
                      <span>{validations.noSpace ? '✅' : '❌'}</span> No spaces
                    </div>
                  </div>
                )}
              </div>

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
              absolute top-0 h-full w-full md:w-1/2 left-0
              transition-all duration-500 ease-in-out
              z-20
              ${
                isActive
                  ? `
                    translate-y-full
                    opacity-0
                    pointer-events-none
                    md:translate-x-full
                    md:translate-y-0
                  `
                  : `
                    translate-y-0
                    opacity-100
                    pointer-events-auto
                    md:translate-x-0
                  `
              }
            `}
          >
            <form className="bg-white flex items-center justify-center flex-col px-6 md:px-10 h-full py-8 md:py-0 text-center w-full">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Gaming Shop Login
              </h1>

              <FloatingInput type="email" id="signin-email" label="Email" />
              <FloatingInput type="password" id="signin-password" label="Password" />

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
        </div>

      </main>
    </>
  );
}