'use client'; // Ensure this is at the top of your file

import React, { useEffect, useState } from 'react';
import { FaEthereum, FaPaperPlane, FaHeart, FaShare } from 'react-icons/fa';
import { useSearchParams } from 'next/navigation';
import { ethers } from 'ethers';
import abi from '../../abi/abi.json';
import { address, object } from 'framer-motion/client';
import { useAccount } from 'wagmi';

interface Message {
  id: number;
  sender: string;
  text: string;
  timestamp: string;
}

const TradingPage: React.FC = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: 'Seller', text: "Hi, I'm interested in trading this Pokemon.", timestamp: '10:30 AM' },
    { id: 2, sender: 'You', text: "What's your offer?", timestamp: '10:31 AM' },
  ]);
  // const [tradeTokenA, setTradeTokenA] = useState<number | null>(null);
  // const [tradeTokenB, setTradeTokenB] = useState<number | null>(null);
  const [contract, setContract] = useState<any>(null);


  const {address} = useAccount();

  const searchParams = useSearchParams();
  const detailsParam = searchParams.get('details');
  const details = detailsParam ? JSON.parse(decodeURIComponent(detailsParam)) : null;
  let tradeTokenA = details.tokenIdF
  let tradeTokenB = details.tokenIdI
  console.log(details)
  const contractAddress = "0x14c03AE4342aa2ed24235B3ABFDd0C0aAc118815"; // Update with your contract address

  useEffect(() => {
    const setupContract = async () => {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contractInstance = new ethers.Contract(contractAddress, abi.abi, signer);
      setContract(contractInstance);
    };
    setupContract();
  }, []);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      setMessages([...messages, {
        id: messages.length + 1,
        sender: 'You',
        text: message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      setMessage('');
    }
  };

  

  const approveTrade = async (tokenId: number) => {
    console.log(tradeTokenA,tradeTokenB)
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi.abi, signer);
    const baddress = await contract.tokenOwner(tradeTokenB);
    const aaddress = await contract.tokenOwner(tradeTokenA);
    console.log(aaddress,baddress)
    console.log(address)
    console.log(address, aaddress, tradeTokenA)
    const tx = await contract.transferNFT(address, aaddress, tradeTokenB);
    await tx.wait();
    alert(`Trade approved for ${tradeTokenB}`)
  }
  

  return (
    <div className="min-h-screen mt-2 bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6">
      <div className='flex justify-center gap-4 p-4'>
        <button className='bg-green-600 hover:bg-green-700 p-3 rounded-lg transition-all' onClick={() => approveTrade(1)}>Approve Trade</button>
        <button className='bg-red-600 hover:bg-red-700 p-3 rounded-lg transition-all'>Reject Trade</button>
      </div>
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

        {details ? (
          <>
            <div className='col-span-4 flex flex-col items-center'>
              <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-105">
                <div className="aspect-auto flex justify-center items-center bg-gradient-to-br from-purple-500 to-pink-500">
                  <img className='p-3 py-5' src={details.uriOffered.image} alt="Offered NFT" />
                </div>
                <div className="p-4 text-center">
                  <h3 className="text-lg font-bold">{details.uriOffered.name}</h3>
                  {/* <p className="text-gray-400">Offered by: {details.senderAddress}</p> */}
                </div>
              </div>
            </div>

            {/* Sticky Chat Section */}
            <div className="relative col-span-4">
              <div className="sticky top-20 bg-gray-800/50 rounded-2xl p-6 flex flex-col h-[720px] shadow-lg">
                <div className="border-b border-gray-700 pb-4 mb-4">
                  <h2 className="text-xl font-bold">Trade Discussion</h2>
                  <p className="text-gray-400">with @TrainerRed</p>
                </div>

                <div className="flex-grow overflow-y-auto mb-4 space-y-4">
                  {messages.map((msg) => (
                    <div 
                      key={msg.id} 
                      className={`flex flex-col ${msg.sender === 'You' ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm text-gray-400">{msg.sender}</span>
                        <span className="text-xs text-gray-500">{msg.timestamp}</span>
                      </div>
                      <div className={`px-4 py-2 rounded-xl max-w-[80%] ${
                        msg.sender === 'You' 
                          ? 'bg-purple-600' 
                          : 'bg-gray-700'
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={sendMessage} className="flex gap-4">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-grow bg-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                  <button 
                    type="submit"
                    className="bg-purple-600 hover:bg-purple-700 p-3 rounded-lg transition-all"
                  >
                    <FaPaperPlane />
                  </button>
                </form>
              </div>
            </div>

            <div className='col-span-4 flex flex-col items-center'>
              <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-105">
                <div className="aspect-auto flex justify-center items-center bg-gradient-to-br from-purple-500 to-pink-500">
                  <img className='p-3 py-5' src={details.uriInterested.image} alt="Interested NFT" />
                </div>
                <div className="p-4 text-center">
                  <h3 className="text-lg font-bold">{details.uriInterested.name}</h3>
                  {/* <p className="text-gray-400">Interested by: {details.personAaddress}</p> */}
                </div>
              </div>
            </div>
          </>
        ) : (
          <p className="col-span-12 text-center text-gray-400">No trade details available.</p>
        )}
      </div>
    </div>
  );
};

export default TradingPage;