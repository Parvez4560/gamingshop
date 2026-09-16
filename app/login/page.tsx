'use client';

import { useState } from 'react';

export default function LoginPage() {
  const [isActive, setIsActive] = useState(false);

  return (
    <main className="min-h-screen bg-white">
      <div
  className={`relative bg-white overflow-hidden
  w-full min-h-screen
  flex flex-col md:block
  transition-all duration-500
  ${isActive ? 'active' : ''}`}
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
          <form className="bg-white flex items-center justify-center flex-col px-6 md:px-10 h-full py-8 md:py-0 text-center">

            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Create Account
            </h1>

            <input
              type="text"
              placeholder="Name"
              required
              className="bg-gray-100 border-none my-1 py-3 px-4 text-xs rounded-lg w-full outline-none text-gray-900"
            />

            <input
              type="email"
              placeholder="Email"
              required
              className="bg-gray-100 border-none my-1 py-3 px-4 text-xs rounded-lg w-full outline-none text-gray-900"
            />

            <input
              type="password"
              placeholder="Password"
              required
              className="bg-gray-100 border-none my-1 py-3 px-4 text-xs rounded-lg w-full outline-none text-gray-900"
            />

            <button
              type="submit"
              className="bg-indigo-600 text-white text-xs font-semibold py-3 px-11 rounded-lg uppercase tracking-wider mt-3 cursor-pointer hover:bg-indigo-700 transition"
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
          <form className="bg-white flex items-center justify-center flex-col px-6 md:px-10 h-full py-8 md:py-0 text-center">

            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Gaming Shop Login
            </h1>

            <input
              type="email"
              placeholder="Email"
              required
              className="bg-gray-100 border-none my-1 py-3 px-4 text-xs rounded-lg w-full outline-none text-gray-900"
            />

            <input
              type="password"
              placeholder="Password"
              required
              className="bg-gray-100 border-none my-1 py-3 px-4 text-xs rounded-lg w-full outline-none text-gray-900"
            />

            <a
              href="#"
              className="text-gray-600 text-xs my-3 hover:text-indigo-600"
            >
              Forgot Your Password?
            </a>

            <button
              type="submit"
              className="bg-indigo-600 text-white text-xs font-semibold py-3 px-11 rounded-lg uppercase tracking-wider mt-1 cursor-pointer hover:bg-indigo-700 transition"
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
            left-0
            md:left-1/2

            w-full
            md:w-1/2

            h-[72px]
            md:h-full

            overflow-hidden

            transition-all duration-500 ease-in-out

            z-[1000]

            rounded-b-[30px]
            md:rounded-b-none

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
              bg-indigo-600
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

                ${
                  isActive
                    ? 'translate-x-0'
                    : '-translate-x-[200%]'
                }
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

                ${
                  isActive
                    ? 'translate-x-[200%]'
                    : 'translate-x-0'
                }
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
          <div className="bg-indigo-600 text-white h-full flex md:hidden items-center justify-center">

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

      </div>
    </main>
  );
}