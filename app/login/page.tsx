'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // পেজ রিডাইরেক্ট করার জন্য
import FloatingInput from '@/components/FloatingInput';
import Header from '@/components/layout/Header/Header';

export default function LoginPage() {
  const [isActive, setIsActive] = useState(false);
  const router = useRouter();

  // সাইন আপ ফর্মের স্টেট
  const [signupData, setSignupData] = useState({ name: '', email: '', password: '' });
  
  // সাইন ইন (লগইন) ফর্মের স্টেট
  const [signinData, setSigninData] = useState({ email: '', password: '' });

  // লোডিং এবং এরর হ্যান্ডলিং এর জন্য স্টেট
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // ব্যাকএন্ড API এর বেস URL (.env থেকে অথবা সরাসরি)
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://gaming-shop-7jep.onrender.com/api";

  // রেজিস্ট্রেশন হ্যান্ডলার
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      setSuccessMessage('Registration successful! Please sign in.');
      setIsActive(false); // সফল হলে সাইন ইন পেজে নিয়ে যাবে
      setSignupData({ name: '', email: '', password: '' });
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  // লগইন হ্যান্ডলার
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signinData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // টোকেন লোকাল স্টোরেজে সেভ করা
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      setSuccessMessage('Login successful! Redirecting...');
      
      // ড্যাশবোর্ড বা হোম পেজে রিডাইরেক্ট করা (আপনার প্রজেক্ট অনুযায়ী রাউট পরিবর্তন করতে পারেন)
      setTimeout(() => {
        router.push('/'); 
      }, 1000);

    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <main className="h-[calc(100vh-4rem)] w-full overflow-hidden bg-white relative flex flex-col md:block">
        
        {/* এরর বা সাকসেস মেসেজ দেখানোর জন্য (ঐচ্ছিক) */}
        {(errorMessage || successMessage) && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 w-11/2md max-w-md text-center p-3 rounded-lg text-xs font-semibold shadow-md">
            {errorMessage && <div className="bg-red-100 text-red-600 p-2 rounded">{errorMessage}</div>}
            {successMessage && <div className="bg-green-100 text-green-600 p-2 rounded">{successMessage}</div>}
          </div>
        )}

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
          {/* DESKTOP TOGGLE */}
          <div
            className={`
              toggle bg-[#81007f] text-white h-full relative -left-full w-[200%] transition-all duration-500 ease-in-out hidden md:block
              ${isActive ? 'translate-x-1/2' : 'translate-x-0'}
            `}
          >
            <div className={`toggle-panel toggle-left absolute w-1/2 h-full flex items-center justify-center flex-col px-8 text-center top-0 transition-all duration-500 ease-in-out ${isActive ? 'translate-x-0' : '-translate-x-[200%]'}`}>
              <h1 className="text-2xl font-bold mb-2">Welcome Back!</h1>
              <p className="text-xs leading-5 tracking-wide mb-5">To keep connected with us please login with your personal info</p>
              <button
                type="button"
                onClick={() => setIsActive(false)}
                className="bg-transparent border border-white text-white text-xs font-semibold py-2.5 px-9 rounded-lg uppercase tracking-wider cursor-pointer hover:bg-white/10 transition"
              >
                Sign In
              </button>
            </div>

            <div className={`toggle-panel toggle-right absolute right-0 w-1/2 h-full flex items-center justify-center flex-col px-8 text-center top-0 transition-all duration-500 ease-in-out ${isActive ? 'translate-x-[200%]' : 'translate-x-0'}`}>
              <h1 className="text-2xl font-bold mb-2">Hello, Gamer!</h1>
              <p className="text-xs leading-5 tracking-wide mb-5">Enter your personal details and start your journey with Gaming Shop</p>
              <button
                type="button"
                onClick={() => setIsActive(true)}
                className="bg-transparent border border-white text-white text-xs font-semibold py-2.5 px-9 rounded-lg uppercase tracking-wider cursor-pointer hover:bg-white/10 transition"
              >
                Sign Up
              </button>
            </div>
          </div>

          {/* MOBILE TOGGLE */}
          <div className="bg-[#81007f] text-white h-full flex md:hidden items-center justify-center shadow-md">
            {isActive ? (
              <button type="button" onClick={() => setIsActive(false)} className="w-full h-full text-sm font-semibold uppercase tracking-wider">
                Sign In
              </button>
            ) : (
              <button type="button" onClick={() => setIsActive(true)} className="w-full h-full text-sm font-semibold uppercase tracking-wider">
                Sign Up
              </button>
            )}
          </div>
        </div>

        {/* ================= FORMS CONTAINER ================= */}
        <div className={`relative bg-white w-full h-full flex-1 overflow-y-auto md:overflow-hidden transition-all duration-500 pt-[72px] md:pt-0 ${isActive ? 'active' : ''}`}>
          
          {/* ================= SIGN UP FORM ================= */}
          <div className={`form-container sign-up absolute top-0 h-full w-full md:w-1/2 left-0 transition-all duration-500 ease-in-out z-10 ${isActive ? 'translate-y-0 opacity-100 pointer-events-auto md:translate-x-full' : '-translate-y-full opacity-0 pointer-events-none md:translate-y-0 md:opacity-0'}`}>
            <form onSubmit={handleRegister} className="bg-white flex items-center justify-center flex-col px-6 md:px-10 h-full py-8 md:py-0 text-center w-full">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Create Account</h1>

              <FloatingInput 
                type="text" 
                id="signup-name" 
                label="Name" 
                value={signupData.name}
                onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
              />
              <FloatingInput 
                type="email" 
                id="signup-email" 
                label="Email" 
                value={signupData.email}
                onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
              />
              <FloatingInput 
                type="password" 
                id="signup-password" 
                label="Password" 
                value={signupData.password}
                onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
              />

              <button
                type="submit"
                disabled={loading}
                className="bg-[#81007f] text-white text-xs font-semibold py-3 px-11 rounded-lg uppercase tracking-wider mt-3 cursor-pointer hover:bg-[#620060] transition disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Sign Up'}
              </button>
            </form>
          </div>

          {/* ================= SIGN IN FORM ================= */}
          <div className={`form-container sign-in absolute top-0 h-full w-full md:w-1/2 left-0 transition-all duration-500 ease-in-out z-20 ${isActive ? 'translate-y-full opacity-0 pointer-events-none md:translate-x-full md:translate-y-0' : 'translate-y-0 opacity-100 pointer-events-auto md:translate-x-0'}`}>
            <form onSubmit={handleLogin} className="bg-white flex items-center justify-center flex-col px-6 md:px-10 h-full py-8 md:py-0 text-center w-full">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Gaming Shop Login</h1>

              <FloatingInput 
                type="email" 
                id="signin-email" 
                label="Email" 
                value={signinData.email}
                onChange={(e) => setSigninData({ ...signinData, email: e.target.value })}
              />
              <FloatingInput 
                type="password" 
                id="signin-password" 
                label="Password" 
                value={signinData.password}
                onChange={(e) => setSigninData({ ...signinData, password: e.target.value })}
              />

              <a href="#" className="text-gray-600 text-xs my-3 hover:text-[#81007f]">
                Forgot Your Password?
              </a>

              <button
                type="submit"
                disabled={loading}
                className="bg-[#81007f] text-white text-xs font-semibold py-3 px-11 rounded-lg uppercase tracking-wider mt-1 cursor-pointer hover:bg-[#620060] transition disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Sign In'}
              </button>
            </form>
          </div>
        </div>

      </main>
    </>
  );
}