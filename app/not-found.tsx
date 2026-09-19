import Link from "next/link";
import Header from "../components/layout/Header/Header";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      {/* ওয়েবসাইটের মূল হেডার */}
      <Header />

      {/* ৪১০/৪০৪ অ্যানিমেটেড সেকশন */}
      <section className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl w-full text-center">
          
          {/* ভিডিওর মতো ব্যাকগ্রাউন্ড অ্যানিমেশন জিআইএফ */}
          <div 
            className="bg-center bg-no-repeat h-[380px] flex items-center justify-center bg-contain"
            style={{
              backgroundImage: "url('https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif')"
            }}
          >
            <h1 className="text-7xl font-extrabold text-gray-800 tracking-wider">404</h1>
          </div>

          {/* টেক্সট এবং হোম পেজে যাওয়ার বাটন */}
          <div className="-mt-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
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