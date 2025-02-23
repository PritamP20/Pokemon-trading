'use client';

import { useEffect, useState, use } from 'react';
import { FaEthereum, FaHeart } from 'react-icons/fa';
import { ethers } from 'ethers';
import abi from '../../../abi/abi.json';
import pokeball from '../../../assests/pokeball.png';
import { address, div, p, q } from 'framer-motion/client';
import { useAccount } from 'wagmi';

interface NFT {
  id: number;
  uri: any;
  amount: any;
}

export default function NFTDetails({ params }: { params: Promise<{ tokenId: string }> }) {
  const resolvedParams = use(params);
  const [nft, setNft] = useState<NFT | null>(null);
  const [tradeTokenA, setTradeTokenA] = useState<number | null>(Number(resolvedParams.tokenId));
  const [tradeTokenB, setTradeTokenB] = useState<number | null>(null);
  // const contractAddress = "0x255Fe08DfEB4C1b20EC5F63771070E4bE9e28841";
  const contractAddress = "0x14c03AE4342aa2ed24235B3ABFDd0C0aAc118815";
  const [userNft, setUserNft] = useState<NFT[]>([]);
  const [showDropDown, setShowDropDown] = useState(false);
  const {address} = useAccount();
  useEffect(()=>{
    async function  getNfts() {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi.abi, provider);
      const tokenId = await contract.tokenId();
      // console.log(currentTokenId)
      console.log("tokenId",tokenId)
      for(let i=0; i<tokenId; i++){
        const owner = await contract.tokenOwner(i);
        if(owner===address){
          const uri = await contract.tokenURI(i);
          const response = await fetch(`https://ipfs.io/ipfs/bafybeide72hl3dkhv2e5ibzrigb7ciqri4klzq2jp3gizcaecc3zheyxuy/${uri.split("/").pop()}`)
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
          const data = await response.json();
          const amount = await contract.getTokenAmount(i);
          setUserNft((prev:NFT[])=>{
            if(prev.some((x:NFT)=>x.id===i)){
              return prev;
            }
            return [...prev, {id:i, uri:data, amount:ethers.formatEther(amount)}]
          })
        }
      }
    }
    getNfts()
  },[resolvedParams.tokenId])

  const proposeTrade = async () => {
    console.log(tradeTokenA, tradeTokenB)
    if(tradeTokenA && tradeTokenB){
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi.abi, signer);
      console.log(contract)
      const partyB = await contract.ownerOf(tradeTokenA);
      console.log(partyB)
      // const tx = await contract.transferNFT(address, "0x9CF6cb8A7c3B9B07564BAB8bC612785792e1FB82", tradeTokenA, {value: ethers.parseEther(nft?.amount)});
      // const tx = await contract.proposeTrade(tradeTokenA, tradeTokenB, partyB);
      // await tx.wait();
      // console.log(tx)
      // console.log("Trade proposed successfully");

      // const txHash = await tx.hash;
      console.log({senderAddress:address, intrestedNFT:tradeTokenA, offeredNFT:tradeTokenB, personBaddress:partyB, personAaddress:address})
      try {
        const respose =await fetch(`http://localhost:3001/offer?address=${address}`,{
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({senderAddress:address, intrestedNFT:tradeTokenA, offeredNFT:tradeTokenB, personBaddress:partyB, personAaddress:address})
        })
        if(!respose.ok){
          throw new Error("Failed to propose trade");
        }
        const data = await respose.json();
        console.log(data);
      } catch (error) {
        console.error("Error proposing trade:", error);
      }
    }
  }

  useEffect(() => {
    async function getNftDetails() {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, abi.abi, provider);
        
        const uri = await contract.tokenURI(resolvedParams.tokenId);
        const response = await fetch(`https://ipfs.io/ipfs/bafybeide72hl3dkhv2e5ibzrigb7ciqri4klzq2jp3gizcaecc3zheyxuy/${uri.split("/").pop()}`);
        const data = await response.json();
        const amount = await contract.getTokenAmount(resolvedParams.tokenId);
        
        setNft({
          id: Number(resolvedParams.tokenId),
          uri: data,
          amount: ethers.formatEther(amount)
        });
      } catch (err) {
        console.error("Error fetching NFT:", err);
      }
    }

    getNftDetails();
  }, [resolvedParams.tokenId]);

  if (!nft) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8 flex justify-center items-center">
        <div className="animate-bounce">
          <img src={pokeball.src} alt="Loading" className="w-16 h-16" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* NFT Card */}
        <div className='relative'>
          <div className="sticky top-20  bg-gray-800 rounded-2xl overflow-hidden">
            <div className=" aspect-square flex justify-center items-center">
              <img className="p-8" src={nft.uri.image} alt={nft.uri.name} />
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">{nft.uri.name}</h1>
            <p className="text-gray-400">{nft.uri.description}</p>
          </div>

          <div className="bg-gray-800/50 rounded-xl p-6 relative">
            <div className="flex justify-between mb-4">
              <div>
                <p className="text-gray-400 text-sm">Current Price</p>
                <div className="flex items-center gap-2 text-xl font-bold">
                  <FaEthereum />
                  <span>{nft.amount} ETH</span>
                </div>
              </div>
              <button className="flex items-center gap-2 bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-600 transition-all">
                <FaHeart className="text-red-500" />
                <span>Add to Favorites</span>
              </button>
            </div>
            <button 
              onClick={() => setShowDropDown(prev => !prev)} 
              className="w-full mb-3 bg-purple-600 hover:bg-purple-700 py-3 rounded-lg transition-all"
            >
              Choose NFT to Trade
            </button>
            {showDropDown && <DropDown userNft={userNft} setTradeTokenB={setTradeTokenB} />}

            <button 
              onClick={proposeTrade} 
              className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-lg transition-all"
            >
              Make Offer
            </button>
          </div>

          {/* Properties */}
          <div>
            <h2 className="text-xl font-bold mb-4">Properties</h2>
            <div className="grid grid-cols-3 gap-4">
              {nft.uri.attributes?.map((attr: any, index: number) => (
                <div key={index} className="bg-gray-800/50 p-4 rounded-lg">
                  <p className="text-purple-400 text-sm mb-1">{attr.trait_type}</p>
                  <p className="font-bold">{attr.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Trading History */}
          <div>
            <h2 className="text-xl font-bold mb-4">Trading History</h2>
            <div className="bg-gray-800/50 rounded-xl p-4">
              <table className="w-full">
                <thead>
                  <tr className="text-gray-400 text-sm">
                    <th className="text-left py-2">Event</th>
                    <th className="text-left py-2">Price</th>
                    <th className="text-left py-2">From</th>
                    <th className="text-left py-2">To</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-gray-700">
                    <td className="py-3">Listed</td>
                    <td className="py-3">
                      <div className="flex items-center gap-1">
                        <FaEthereum />
                        {nft.amount}
                      </div>
                    </td>
                    <td className="py-3 text-gray-400">0x1234...5678</td>
                    <td className="py-3 text-gray-400">--</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DropDown({userNft, setTradeTokenB}:{userNft:NFT[], setTradeTokenB:any}) {
  return (
    <div className='absolute z-10 left-0 right-0 mt-4 bg-gray-800 rounded-xl p-4 border border-gray-700 shadow-xl'>
      <h3 className="text-lg font-bold mb-4">Select NFT to Trade</h3>
      <div className='grid grid-cols-4 gap-4 h-96 overflow-y-auto'>
        {userNft.map((item:NFT) => (
          <button 
            key={item.id}
            onClick={()=>setTradeTokenB(item.id)}
            className='bg-gray-700 rounded-lg p-2 hover:bg-gray-600 cursor-pointer transition-all'
          >
            <img 
              src={item.uri.image} 
              alt={item.uri.name}
              className="w-full h-auto rounded-md mb-2" 
            />
          </button>
        ))}
      </div>
    </div>
  );
}