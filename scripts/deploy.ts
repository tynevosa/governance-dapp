import { createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts'
import { sepolia } from 'viem/chains';
import contractJson from '../artifacts/contracts/Proposal.sol/ProposalContract.json';
import * as dotenv from 'dotenv';

dotenv.config();

const { abi, bytecode } = contractJson;

async function main() {
  const account = privateKeyToAccount(`0x${process.env.PRIVATE_KEY}`);
  const client = createWalletClient({
    account,
    chain: sepolia,
    transport: http(process.env.RPC_URL),
  });

  // deploy smart contract
  const hash = await client.deployContract({
    abi,
    bytecode: bytecode as `0x${string}`,
    args: []
  })

  console.log('Deployment Tx:', hash);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
})