import { useState } from "react";
import { ethers } from "ethers";

export function useWallet() {
  const [connected, setConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>("");

  // Function to connect the wallet
  const connectWallet = async () => {
    if (!connected) {
      if (window.ethereum == null) {
        // MetaMask is not installed
        alert("MetaMask not installed");
      } else {
        try {
          // Connect to the Sepolia network by requesting the user to switch the network in their wallet (e.g., MetaMask)
          const provider = new ethers.BrowserProvider(window.ethereum); // for browser-based providers

          // Check if the wallet is connected to Sepolia, otherwise prompt to switch networks
          const network = await provider.getNetwork();
          if (network.name !== "sepolia") {
            await window.ethereum.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: "0xaa36a7" }], // Sepolia network ID
            });
          }

          // Request wallet connection (MetaMask, etc.)
          await provider.send("eth_requestAccounts", []); // Request wallet access

          const signer = await provider.getSigner(); // Get the signer (wallet)
          const _walletAddress = await signer.getAddress(); // Get wallet address

          setConnected(true);
          setWalletAddress(_walletAddress);
        } catch (error) {
          console.error("Error connecting to Sepolia network:", error);
        }
      }
    }
  };

  // Function to disconnect the wallet
  const disconnectWallet = () => {
    setConnected(false);
    setWalletAddress("");
  };

  return {
    connected,
    walletAddress,
    connectWallet,
    disconnectWallet,
  };
}
