import Header from "../components/layout/Header/Header";
import GameCategoryCard from "../components/home/GameCategoryCard";

// গেমগুলোর ক্যাটাগরি ডাটা
const gameCategories = [
  {
    id: 1,
    name: "Clash of Clans",
    slug: "clash-of-clans",
    description: "Gems, Gold Pass & Top-up",
    image: "/coc-banner.png",
  },
  {
    id: 2,
    name: "Free Fire",
    slug: "free-fire",
    description: "Diamonds & Level-up Pass",
    image: "/gamingshop.svg",
  },
  {
    id: 3,
    name: "PUBG Mobile",
    slug: "pubg-mobile",
    description: "UC Top-up & Royale Pass",
    image: "/gamingshop.svg",
  },
  {
    id: 4,
    name: "Roblox",
    slug: "roblox",
    description: "Robux & Gift Cards",
    image: "/gamingshop.svg",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* হেডার কম্পোনেন্ট */}
      <Header />

      {/* গেম সিলেক্ট করার সেকশন */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900">Select Your Game</h2>
          <p className="mt-2 text-sm text-gray-500">
            Login to view available top-up packages and special offers.
          </p>
        </div>

        {/* গেম কার্ডগুলোর গ্রিড */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {gameCategories.map((game) => (
            <GameCategoryCard key={game.id} game={game} />
          ))}
        </div>
      </section>
    </main>
  );
}