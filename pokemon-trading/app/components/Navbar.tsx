'use client'

import WalletConnect from './WalletConnect'

export default function Navbar() {
  return (
      <nav className="fixed w-full z-50 text-white bg-gray-900/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">PokéTrade NFT</h1>
          <div className="flex items-center gap-8">
            <a href="/shop" className="hover:text-purple-400 transition-colors">Store</a>
            <a href="/profile" className="hover:text-purple-400 transition-colors">profile</a>
            <a href="/" className="hover:text-purple-400 transition-colors">Home</a>
            <WalletConnect />
          </div>
        </div>
      </nav>
  )
} 