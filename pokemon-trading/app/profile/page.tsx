'use client';
import { useEffect, useState } from 'react';
import { FaEthereum, FaEdit, FaTwitter, FaDiscord, FaExchangeAlt } from 'react-icons/fa';
import { MdVerified } from 'react-icons/md';
import {useAccount} from 'wagmi'
import {ethers} from 'ethers'
import abi from "../../abi/abi.json"
import pokeball from '../../assests/pokeball.png';
import { useRouter } from 'next/navigation';

interface NFT{
  id: number,
  uri: any,
  amount: any
}

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('Collected');
  const [nft, setNft] = useState<NFT[]>([]);
  const {address} = useAccount()
  // const contractAddress = "0x255Fe08DfEB4C1b20EC5F63771070E4bE9e28841";
  const contractAddress = "0x14c03AE4342aa2ed24235B3ABFDd0C0aAc118815";
  const [requested, setRequested] = useState<NFT[]>([]);
  const [offered, setOffered] = useState<NFT[]>([]);

  const router = useRouter();

  const transferNFT = async (tokenId: number) => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi.abi, signer);
    const tx = await contract.transferNFT(address, "0x9CF6cb8A7c3B9B07564BAB8bC612785792e1FB82", tokenId);
    await tx.wait();
    console.log(tx)
  }

  useEffect(() => {
    async function getRequested() {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi.abi, provider);

        const response = await fetch(`http://localhost:3001/request?address=${address}`);
        const { requests } = await response.json();
        console.log(requests);

        const requested = await Promise.all(
          requests.map(async (request: any) => {
            // const uriInterested = await contract.tokenURI(1);
            const uriInterested = await contract.tokenURI(request.intrestedNFT);
            const uriInterestedData = await fetch(`https://ipfs.io/ipfs/bafybeide72hl3dkhv2e5ibzrigb7ciqri4klzq2jp3gizcaecc3zheyxuy/${uriInterested.split("/").pop()}`);
            if (!uriInterestedData.ok) throw new Error("Failed to fetch token URI");
            const uriInterestedJson = await uriInterestedData.json();

            // const uriOffered = await contract.tokenURI(2);
            const uriOffered = await contract.tokenURI(request.offeredNFT);
            const uriOfferedData = await fetch(`https://ipfs.io/ipfs/bafybeide72hl3dkhv2e5ibzrigb7ciqri4klzq2jp3gizcaecc3zheyxuy/${uriOffered.split("/").pop()}`);
            if (!uriOfferedData.ok) throw new Error("Failed to fetch token URI");
            const uriOfferedJson = await uriOfferedData.json();

            return {
              ...request,
              uriInterested: uriInterestedJson,
              uriOffered: uriOfferedJson,
              tokenIdF: request.offeredNFT,
              tokenIdI: request.intrestedNFT,
            };
          })
        );

        const res = await fetch(`http://localhost:3001/offer?address=${address}`);
        if(!res.ok) throw new Error('Failed to fetch offered NFTs');
        const {offers} = await res.json();

        const offered = await Promise.all(
          offers.map(async (offer:any)=>{
            const uriOffered = await contract.tokenURI(offer.offeredNFT);
            // const uriOffered = await contract.tokenURI(3);
            const uriOfferedData = await fetch(`https://ipfs.io/ipfs/bafybeide72hl3dkhv2e5ibzrigb7ciqri4klzq2jp3gizcaecc3zheyxuy/${uriOffered.split("/").pop()}`);
            if(!uriOfferedData.ok) throw new Error('Failed to fetch token URI');
            const uriOfferedJson = await uriOfferedData.json();

            const uriInterested = await contract.tokenURI(offer.intrestedNFT);
            // const uriInterested = await contract.tokenURI(5);
            const uriInterestedData = await fetch(`https://ipfs.io/ipfs/bafybeide72hl3dkhv2e5ibzrigb7ciqri4klzq2jp3gizcaecc3zheyxuy/${uriInterested.split("/").pop()}`);
            if(!uriInterestedData.ok) throw new Error('Failed to fetch token URI');
            const uriInterestedJson = await uriInterestedData.json();
            
            
            return {
              ...offer,
              uriOffered: uriOfferedJson,
              uriInterested: uriInterestedJson,
              tokenIdF: offer.offeredNFT,
              tokenIdI: offer.intrestedNFT,
            }
          })
        )

        setRequested(requested);
        setOffered(offered);
      } catch (error) {
        console.error("Error fetching requested NFTs:", error);
      }
    }

    getRequested();
  }, []);

  useEffect(()=>{
    async function  getNfts() {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi.abi, provider);
      const tokenId = await contract.tokenId();
      // console.log(currentTokenId)
      console.log(tokenId)
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
          setNft((prev:NFT[])=>{
            if(prev.some((x:NFT)=>x.id===i)){
              return prev;
            }
            return [...prev, {id:i, uri:data, amount:ethers.formatEther(amount)}]
          })
        }
      }
    }
    getNfts()
  },[])


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
      {/* Profile Header */}
      <div className="relative mb-20">
        {/* Cover Image */}
        <div className="h-64 rounded-xl overflow-hidden">
          <img className='w-full h-full object-cover' src="https://wallpapers.com/images/featured/pokemon-background-17x8jxp3vmf1tef0.jpg" alt="" />
        </div>
        
        {/* Profile Picture & Info */}
        <div className="absolute -bottom-16 left-8 flex items-end">
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-4 border-gray-800 overflow-hidden">
              <img src="https://i.pinimg.com/236x/3a/cb/17/3acb1799544e0d1ff9e07d30c14bec94.jpg" alt="" className='w-full h-full object-cover' />
            </div>
            <button className="absolute bottom-0 right-0 bg-gray-800 p-2 rounded-full hover:bg-gray-700">
              <FaEdit />
            </button>
          </div>
          
          <div className="ml-6 mb-4">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">Ash Ketchum</h1>
              <MdVerified className="text-blue-500 text-2xl" />
            </div>
            <p className="text-gray-400">Pokemon Master • Joined May 2024</p>
          </div>
        </div>

        {/* Stats & Social */}
        <div className="absolute right-8 bottom-4 flex items-center gap-6">
          <div className="flex gap-4">
            <SocialButton icon={<FaTwitter />} username="@ash_ketchum" />
            <SocialButton icon={<FaDiscord />} username="ash#1234" />
          </div>
          <button className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg transition-all">
            Edit Profile
          </button>
        </div>
      </div>

      {/* Profile Stats */}
      <div className="grid grid-cols-4 gap-6 mb-12">
        <StatBox label="NFTs Collected" value="142" />
        <StatBox label="Total Value" value="45.3 ETH" />
        <StatBox label="Trades" value="156" />
        <StatBox label="Rare Pokemon" value="23" />
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-700 mb-8">
        <div className="flex gap-8">
          <TabButton 
            active={activeTab === 'collected'} 
            onClick={() => setActiveTab('collected')}
            label="Collected"
            count="142"
          />
          <TabButton 
            active={activeTab === 'Requested'} 
            onClick={() => setActiveTab('Requested')}
            label="Requested"
            count="38"
          />
          <TabButton 
            active={activeTab === 'Offered'} 
            onClick={() => setActiveTab('Offered')}
            label="Offered"
            count="56"
          />
        </div>
      </div>

      {activeTab === 'Collected' ? (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Store</h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
            {nft.length > 0 ? (
              nft.map((i: NFT) => (
                <NFTCard key={i.id} data={i} />
              ))
            ) : (
              <div className='col-span-full h-[400px] flex flex-col justify-center items-center'>
                <div className='animate-bounce mb-4'>
                  <img 
                    src={pokeball.src} 
                    alt="Loading" 
                    className='w-16 h-16'
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <></>
      )}

      {activeTab === 'Requested' ? (
        <div>
          {requested.length < 0 ? (
            <></>
          ) : (
            <div className='flex gap-4'>
              {requested.map((i: any) => (
                <div className='grid grid-cols-12 justify-between items-center p-4 bg-gray-800 rounded-lg'>
                  <div id='interedtedNFT' className='col-span-5'>
                    <img src={i.uriOffered.image} alt="" className='w-full h-auto rounded-md' />
                  </div>
                  <div className='col-span-2 flex flex-col items-center mx-4'>
                    <p className='text-green-500 mb-2'>Online</p>
                    <button
                      onClick={() => {
                        const query = new URLSearchParams({ details: encodeURIComponent(JSON.stringify(i)) }).toString();
                        router.push(`/trade?${query}`);
                      }}
                      className='bg-purple-500 text-white px-4 py-2 rounded-md mb-2'
                    >
                      Trade
                    </button>
                    <FaExchangeAlt className='text-white text-2xl' />
                  </div>
                  <div id='offeredNFT' className='col-span-5'>
                    <img src={i.uriInterested.image} alt="" className='w-full h-auto rounded-md' />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <></>
      )}

      {activeTab === 'Offered' ? (
        <div>
        {offered.length < 0 ? (
          <></>
        ) : (
          <div className='flex gap-4'>
            {offered.map((i: any) => (
              <div className='grid grid-cols-12 justify-between items-center p-4 bg-gray-800 rounded-lg'>
                <div id='interedtedNFT' className='col-span-5'>z
                  <img src={i.uriOffered.image} alt="" className='w-full h-auto rounded-md' />
                </div>
                <div className='col-span-2 flex flex-col items-center mx-4'>
                  <p className='text-green-500 mb-2'>Online</p>
                  <button
                    onClick={() => {
                      const query = new URLSearchParams({ details: encodeURIComponent(JSON.stringify(i)) }).toString();
                      router.push(`/trade?${query}`);
                    }}
                    className='bg-purple-500 text-white px-4 py-2 rounded-md mb-2'
                  >
                    Trade
                  </button>
                  <FaExchangeAlt className='text-white text-2xl' />
                </div>
                <div id='offeredNFT' className='col-span-5'>
                  <img src={i.uriInterested.image} alt="" className='w-full h-auto rounded-md' />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      ) : (
        <></>
      )}
      <button onClick={()=>transferNFT(1)}>Transfer</button>
      
    </div>
  );
};

const SocialButton = ({ icon, username }: { icon: React.ReactNode, username: string }) => (
  <button className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition-all">
    {icon}
    <span>{username}</span>
  </button>
);

const StatBox = ({ label, value }: { label: string, value: string }) => (
  <div className="bg-gray-800 p-6 rounded-xl">
    <p className="text-2xl font-bold mb-1">{value}</p>
    <p className="text-gray-400 text-sm">{label}</p>
  </div>
);

const TabButton = ({ active, onClick, label, count }: { active: boolean, onClick: () => void, label: string, count: string }) => (
  <button 
    onClick={onClick}
    className={`pb-4 px-2 relative ${active ? 'text-white' : 'text-gray-400'}`}
  >
    <div className="flex items-center gap-2">
      {label}
      {count && <span className="text-sm text-gray-500">({count})</span>}
    </div>
    {active && (
      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-600"></div>
    )}
  </button>
);

const NFTCard = ({data}:{data:NFT}) => {
  const router = useRouter();
  
  return (
    <div className="bg-gray-800  overflow-hidden hover:transform hover:scale-105 transition-all">
      <div className="aspect-auto  flex justify-center items-center bg-gradient-to-br ">
        <img className='p-3 py-5 ' src={data.uri.image} alt="" />
      </div>
      <div className="p-6">
        <div className=" mb-2 flex justify-between items-center">
          <span className='text-lg font-bold'>{data.uri.name}</span>
          <button onClick={()=>router.push(`/details/${data.id}`)} className='bg-purple-500 text-white tx-sm px-2 py-1 rounded-md'>More...</button>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-purple-400">
            <FaEthereum />
            <span>{data.amount} ETH</span>
          </div>
          <span className="text-gray-400">Rare</span>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
