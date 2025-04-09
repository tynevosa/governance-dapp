"use client";

import { useState, useEffect } from "react";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../lib/contract";
import { useWallet } from "@/hook/useWallet";
import { useContract } from "@/hook/useContract";

export default function Home() {
  const { connected, walletAddress, connectWallet, disconnectWallet } =
    useWallet();
  // Connect to the contract using the custom hook
  const { contract, provider } = useContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
  });

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [proposals, setProposals] = useState<any[]>([]); // Store proposals here

  // UseEffect to fetch proposals when the component mounts or wallet is connected
  useEffect(() => {
    if (connected && contract) {
      const fetchProposals = async () => {
        try {
          const proposalsData = await contract.getProposals();
          setProposals(proposalsData);
        } catch (error) {
          console.error("Error fetching proposals:", error);
        }
      };

      fetchProposals();
    }
  }, [connected, contract]);

  // Handle submitting the proposal
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contract) return;

    try {
      const tx = await contract.createProposal(title, description, {
        from: walletAddress,
      });
      await tx.wait(); // Wait for the transaction to be mined
      setTitle("");
      setDescription("");
      alert("Proposal Submitted!");

      // Refresh the proposal list after submission
      const proposalsData = await contract.getProposals();
      setProposals(proposalsData);
    } catch (error) {
      console.error("Error submitting proposal:", error);
      alert("Failed to submit proposal.");
    }
  };

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-4">Governance dApp</h1>

      {/* Wallet connection button */}
      {!connected ? (
        <button
          onClick={() => connectWallet()}
          className="bg-blue-500 px-4 py-2 text-white rounded"
        >
          Connect Wallet
        </button>
      ) : (
        <div>
          <p className="mb-2">Connected as: {walletAddress}</p>
          {/* Disconnect button */}
          <button
            onClick={() => disconnectWallet()}
            className="bg-red-500 px-4 py-2 text-white rounded"
          >
            Disconnect
          </button>

          {/* Proposal submission form */}
          <form onSubmit={handleSubmit} className="my-6">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)} // Update title on change
              placeholder="Proposal Title"
              className="block mb-2 border p-2 w-full"
              required
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)} // Update description on change
              placeholder="Proposal Description"
              className="block mb-2 border p-2 w-full"
              required
            />
            <button
              type="submit"
              className="bg-green-600 px-4 py-2 text-white rounded"
            >
              Submit Proposal
            </button>
          </form>

          <h2 className="text-2xl font-semibold mt-6 mb-2">Proposals</h2>
          {/* Display the list of proposals */}
          {proposals.length > 0 ? (
            proposals.map((p, i) => (
              <div key={i} className="border p-4 rounded mb-2">
                <h3 className="font-bold">{p.title}</h3>
                <p>{p.description}</p>
              </div>
            ))
          ) : (
            <p>No proposals yet.</p>
          )}
        </div>
      )}
    </main>
  );
}
