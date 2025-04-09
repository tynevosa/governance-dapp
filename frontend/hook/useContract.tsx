// hooks/useContract.ts

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { SEPOLIA_RPC_URL } from "@/lib/contract";

// Type definitions for the contract and its functions
interface UseContractProps {
  address: string;
  abi: any; // Define the ABI type if possible for better type safety
}

export function useContract({ address, abi }: UseContractProps) {
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [provider, setProvider] = useState<ethers.AbstractProvider | null>(
    null
  );
  const [signer, setSigner] = useState<ethers.Signer | null>(null);

  useEffect(() => {
    const initializeContract = async () => {
      let _provider;
      let _signer = null;

      // Check if MetaMask is installed
      if (window.ethereum == null) {
        // MetaMask is not installed, use json rpc provider
        _provider = new ethers.JsonRpcProvider(SEPOLIA_RPC_URL);
      } else {
        // MetaMask is installed, use BrowserProvider to connect
        _provider = new ethers.BrowserProvider(window.ethereum);

        // Request the signer (user wallet) from MetaMask
        try {
          _signer = await _provider.getSigner();
        } catch (error) {
          console.error("User denied wallet access:", error);
        }
      }

      // Create contract instance
      const contractInstance = new ethers.Contract(address, abi, _signer);
      setProvider(_provider);
      setSigner(_signer);
      setContract(contractInstance);
    };

    initializeContract();
  }, [address, abi]);

  return { contract, provider, signer };
}
