import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10">
            <Image
              src="/gamingshop.svg"
              alt="Gaming Shop"
              width={40}
              height={40}
            />
          </div>

          <span className="text-xl font-bold text-gray-900">
            GamingShop
          </span>
        </div>

        {/* Login & Menu */}
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-semibold text-gray-800 hover:text-black"
          >
            Login
          </Link>

          <button
            type="button"
            aria-label="Open menu"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 hover:bg-gray-100"
          >
            <Image
              src="/menu.svg"
              alt="Menu Icon"
              width={20}
              height={20}
              className="h-5 w-5"
            />
          </button>
        </div>

      </div>
    </header>
  );
}