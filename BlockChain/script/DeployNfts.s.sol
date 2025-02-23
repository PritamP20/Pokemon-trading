pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {Nft} from "../src/Nft.sol";

contract DeployNfts is Script {
    string[] private uris = [
        "https://silver-tricky-trout-945.mypinata.cloud/ipfs/bafybeide72hl3dkhv2e5ibzrigb7ciqri4klzq2jp3gizcaecc3zheyxuy/Charmander.json",
        "https://silver-tricky-trout-945.mypinata.cloud/ipfs/bafybeide72hl3dkhv2e5ibzrigb7ciqri4klzq2jp3gizcaecc3zheyxuy/Charmeleon.json",
        "https://silver-tricky-trout-945.mypinata.cloud/ipfs/bafybeide72hl3dkhv2e5ibzrigb7ciqri4klzq2jp3gizcaecc3zheyxuy/Charmeleon2.json",
        "https://silver-tricky-trout-945.mypinata.cloud/ipfs/bafybeide72hl3dkhv2e5ibzrigb7ciqri4klzq2jp3gizcaecc3zheyxuy/Desclops.json",
        "https://silver-tricky-trout-945.mypinata.cloud/ipfs/bafybeide72hl3dkhv2e5ibzrigb7ciqri4klzq2jp3gizcaecc3zheyxuy/Dusknoir.json",
        "https://silver-tricky-trout-945.mypinata.cloud/ipfs/bafybeide72hl3dkhv2e5ibzrigb7ciqri4klzq2jp3gizcaecc3zheyxuy/Fezandipiti.json",
        "https://silver-tricky-trout-945.mypinata.cloud/ipfs/bafybeide72hl3dkhv2e5ibzrigb7ciqri4klzq2jp3gizcaecc3zheyxuy/Froakie.json",
        "https://silver-tricky-trout-945.mypinata.cloud/ipfs/bafybeide72hl3dkhv2e5ibzrigb7ciqri4klzq2jp3gizcaecc3zheyxuy/Frogadier.json",
        "https://silver-tricky-trout-945.mypinata.cloud/ipfs/bafybeide72hl3dkhv2e5ibzrigb7ciqri4klzq2jp3gizcaecc3zheyxuy/Greninja.json",
        "https://silver-tricky-trout-945.mypinata.cloud/ipfs/bafybeide72hl3dkhv2e5ibzrigb7ciqri4klzq2jp3gizcaecc3zheyxuy/Mew.json",
        "https://silver-tricky-trout-945.mypinata.cloud/ipfs/bafybeide72hl3dkhv2e5ibzrigb7ciqri4klzq2jp3gizcaecc3zheyxuy/Pikachu.json",
        "https://silver-tricky-trout-945.mypinata.cloud/ipfs/bafybeide72hl3dkhv2e5ibzrigb7ciqri4klzq2jp3gizcaecc3zheyxuy/Pikachu2.json",
        "https://silver-tricky-trout-945.mypinata.cloud/ipfs/bafybeide72hl3dkhv2e5ibzrigb7ciqri4klzq2jp3gizcaecc3zheyxuy/Raichu.json",
        "https://silver-tricky-trout-945.mypinata.cloud/ipfs/bafybeide72hl3dkhv2e5ibzrigb7ciqri4klzq2jp3gizcaecc3zheyxuy/Raichu2.json"

    ];

    function run() external{
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        console.log("Deployer address: ", deployer);

        uint256 tokenId;
        vm.startBroadcast(deployerPrivateKey);
        Nft nft = new Nft(deployer);

        for (uint i = 0; i < uris.length; i++) {
            tokenId = nft.mint(deployer, uris[i], 0.00001 ether);
            console.log("Minted NFT ID:", tokenId);
            console.log("Token URI:", uris[i]);
            nft.approvalNFT(tokenId);
        }

        vm.stopBroadcast();

        console.log("Nft deployed at address: ", address(nft));
    }
}

// 0x2382BebBb576DdA54E6fAbc0f26B275BdcE3aCC4

//   Deployer address:  0x204E8DEf7E6c467cEbCeBbC5c89ad86Bf3003FE3
//   Nft deployed at address:  0x7703DD57cBB940719Fda3250c766E6c156C5a844