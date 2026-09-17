import Image from "next/image";
import Link from "next/link";

export default function GameCategoryCard({ game }) {
  return (
    <Link
      href={`/games/${game.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
    >
      {/* গেমের ছবি বা ব্যানার */}
      <div className="relative h-48 w-full overflow-hidden rounded-xl bg-white border border-gray-100">
        <Image
          src={game.image}
          alt={game.name}
          fill
          priority // এটি যোগ করলে LCP ওয়ার্নিং দূর হয়ে যাবে
          className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* গেমের নাম ও বিবরণ */}
      <div className="mt-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-black">
            {game.name}
          </h3>
          <p className="mt-1 text-sm text-gray-500">{game.description}</p>
        </div>

        {/* অ্যারো বাটন */}
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-700 transition-colors group-hover:bg-black group-hover:text-white">
          →
        </span>
      </div>
    </Link>
  );
}