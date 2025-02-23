'use client'
import React from 'react';
import { FaEthereum, FaShieldAlt, FaBolt, FaUsers, FaWallet } from 'react-icons/fa';
import { useRouter } from 'next/navigation';


const App: React.FC = () => {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Navigation
      <nav className="fixed w-full z-50 bg-gray-900/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">PokéTrade NFT</h1>
          <div className="flex items-center gap-8">
            <a href="#marketplace" className="hover:text-purple-400 transition-colors">Marketplace</a>
            <a href="#about" className="hover:text-purple-400 transition-colors">About</a>
            <a href="#contact" className="hover:text-purple-400 transition-colors">Contact</a>
          </div>
        </div>
      </nav> */}

      {/* Hero Section */}
      <section className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-4">
            Trade Rare Pokémon NFTs
          </h1>
          <p className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            in the Digital World
          </p>
          <p className="text-gray-400 text-xl mb-8 max-w-2xl mx-auto">
            Discover, collect, and trade unique Pokémon NFTs on the most trusted platform.
            Join thousands of trainers in the digital revolution.
          </p>
          <div className="flex gap-4 justify-center">
            <button onClick={() => router.push('/shop')} className="bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-lg text-lg transition-all">
              Start Trading
            </button>
            <button className="border border-purple-600 text-purple-400 hover:bg-purple-600/10 px-8 py-3 rounded-lg text-lg transition-all">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <StatCard icon={<FaUsers />} value="50,000+" label="Active Traders" />
            <StatCard icon={<FaEthereum />} value="100K ETH" label="Trading Volume" />
            <StatCard icon={<FaBolt />} value="1M+" label="NFTs Traded" />
            <StatCard icon={<FaShieldAlt />} value="100%" label="Secure Trading" />
          </div>
        </div>
      </section>

      {/* Featured NFTs */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-12 text-center">Featured Pokémon NFTs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <NFTCard key={i} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-12 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard 
              number="01"
              title="Connect Wallet"
              description="Connect your crypto wallet to start trading Pokemon NFTs securely."
            />
            <StepCard 
              number="02"
              title="Choose Pokemon"
              description="Browse through our vast collection of rare and unique Pokemon NFTs."
            />
            <StepCard 
              number="03"
              title="Start Trading"
              description="Buy, sell, or trade Pokemon NFTs with other trainers globally."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-400">
          <p>© 2024 PokéTrade NFT. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

interface StatCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, value, label }) => (
  <div className="bg-gray-800/50 p-6 rounded-xl text-center hover:transform hover:scale-105 transition-all">
    <div className="text-purple-400 text-3xl mb-4 flex justify-center">
      {icon}
    </div>
    <h3 className="text-2xl font-bold mb-2">{value}</h3>
    <p className="text-gray-400">{label}</p>
  </div>
);

const NFTCard: React.FC = () => (
  <div className="bg-gray-800 rounded-xl overflow-hidden hover:transform hover:scale-105 transition-all">
    <div className="aspect-auto flex justify-center items-center bg-gradient-to-br from-purple-500 to-pink-500">
    <img className='p-3 py-5' src="https://dz3we2x72f7ol.cloudfront.net/expansions/prismatic-evolutions/en-us/SV8pt5_EN_47.png" alt="" />
    </div>
    <div className="p-6">
      <h3 className="text-xl font-bold mb-2">Charizard #123</h3>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 text-purple-400">
          <FaEthereum />
          <span>2.5 ETH</span>
        </div>
        <span className="text-gray-400">Rare</span>
      </div>
    </div>
  </div>
);

interface StepCardProps {
  number: string;
  title: string;
  description: string;
}

const StepCard: React.FC<StepCardProps> = ({ number, title, description }) => (
  <div className="bg-gray-800/50 p-6 rounded-xl hover:transform hover:scale-105 transition-all">
    <div className="text-purple-400 text-5xl font-bold mb-4">{number}</div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-gray-400">{description}</p>
  </div>
);

export default App;
