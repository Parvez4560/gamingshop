import Link from "next/link";
import Header from "../components/layout/Header/Header";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      {/* ওয়েবসাইটের মূল হেডার */}
      <Header />

      {/* 404 সেকশন */}
      <section className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl w-full text-center">
          
          {/* বড় করে পরিষ্কার 404 হেডিং (অ্যানিমেশনের উপরে) */}
          <h1 className="text-6xl sm:text-7xl font-black text-gray-800 tracking-wider mb-2">
            404
          </h1>

          {/* অ্যানিমেটেড জিআইএফ ব্যাকগ্রাউন্ড */}
          <div 
            className="bg-center bg-no-repeat h-[300px] w-full bg-contain mx-auto"
            style={{
              backgroundImage: "url('https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif')"
            }}
          ></div>

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