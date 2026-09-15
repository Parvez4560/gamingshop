'use client';

import { useState } from 'react';

export default function LoginPage() {
  const [isActive, setIsActive] = useState(false);

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
      {/* মেইন কন্টেইনার */}
      <div className={`relative bg-white rounded-3xl shadow-2xl overflow-hidden w-[768px] max-w-full min-h-[480px] transition-all duration-600 ${isActive ? 'active' : ''}`}>
        
        {/* Sign Up ফর্ম (ডান পাশে থাকবে) */}
        <div className={`form-container sign-up absolute top-0 h-full w-1/2 left-0 transition-all duration-600 ease-in-out z-10 ${isActive ? 'translate-x-full opacity-100 z-50' : 'opacity-0'}`}>
          <form className="bg-white flex items-center justify-center flex-col px-10 h-full text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Create Account</h1>
            <input 
              type="text" 
              placeholder="Name" 
              required
              className="bg-gray-100 border-none my-1 py-3 px-4 text-xs rounded-lg w-full outline-none"
            />
            <input 
              type="email" 
              placeholder="Email" 
              required
              className="bg-gray-100 border-none my-1 py-3 px-4 text-xs rounded-lg w-full outline-none"
            />
            <input 
              type="password" 
              placeholder="Password" 
              required
              className="bg-gray-100 border-none my-1 py-3 px-4 text-xs rounded-lg w-full outline-none"
            />
            <button 
              type="submit"
              className="bg-indigo-600 text-white text-xs font-semibold py-3 px-11 rounded-lg uppercase tracking-wider mt-3 cursor-pointer hover:bg-indigo-700 transition"
            >
              Sign Up
            </button>
          </form>
        </div>

        {/* Sign In ফর্ম (বাম পাশে থাকবে) */}
        <div className={`form-container sign-in absolute top-0 h-full w-1/2 left-0 transition-all duration-600 ease-in-out z-20 ${isActive ? 'translate-x-full' : ''}`}>
          <form className="bg-white flex items-center justify-center flex-col px-10 h-full text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Gaming Shop Login</h1>
            <input 
              type="email" 
              placeholder="Email" 
              required
              className="bg-gray-100 border-none my-1 py-3 px-4 text-xs rounded-lg w-full outline-none"
            />
            <input 
              type="password" 
              placeholder="Password" 
              required
              className="bg-gray-100 border-none my-1 py-3 px-4 text-xs rounded-lg w-full outline-none"
            />
            <a href="#" className="text-gray-600 text-xs my-3 hover:text-indigo-600">Forgot Your Password?</a>
            <button 
              type="submit"
              className="bg-indigo-600 text-white text-xs font-semibold py-3 px-11 rounded-lg uppercase tracking-wider mt-1 cursor-pointer hover:bg-indigo-700 transition"
            >
              Sign In
            </button>
          </form>
        </div>

        {/* টগল বা স্লাইডার প্যানেল কন্টেইনার */}
        <div className={`toggle-container absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-all duration-600 ease-in-out z-1000 rounded-l-[150px] ${isActive ? '-translate-x-full rounded-r-[150px] rounded-l-none' : ''}`}>
          <div className={`toggle bg-indigo-600 text-white h-full relative -left-full w-[200%] transition-all duration-600 ease-in-out ${isActive ? 'translate-x-1/2' : 'translate-x-0'}`}>
            
            {/* টগল লেফট প্যানেল */}
            <div className={`toggle-panel toggle-left absolute w-1/2 h-full flex items-center justify-center flex-col px-8 text-center top-0 transition-all duration-600 ease-in-out ${isActive ? 'translate-x-0' : '-translate-x-[200%]'}`}>
              <h1 className="text-2xl font-bold mb-2">Welcome Back!</h1>
              <p className="text-xs leading-5 tracking-wide mb-5">To keep connected with us please login with your personal info</p>
              <button 
                onClick={() => setIsActive(false)}
                className="bg-transparent border border-white text-white text-xs font-semibold py-2.5 px-9 rounded-lg uppercase tracking-wider cursor-pointer hover:bg-white/10 transition"
              >
                Sign In
              </button>
            </div>

            {/* টগল রাইট প্যানেল */}
            <div className={`toggle-panel toggle-right absolute right-0 w-1/2 h-full flex items-center justify-center flex-col px-8 text-center top-0 transition-all duration-600 ease-in-out ${isActive ? 'translate-x-[200%]' : 'translate-x-0'}`}>
              <h1 className="text-2xl font-bold mb-2">Hello, Gamer!</h1>
              <p className="text-xs leading-5 tracking-wide mb-5">Enter your personal details and start your journey with Gaming Shop</p>
              <button 
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
  );
}