import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import hre from "hardhat";

describe("ProposalContract", function () {
  // Define fixture for contract deployment
  async function deployProposalContractFixture() {
    const [owner, otherAccount] = await hre.viem.getWalletClients();

    // Deploy the ProposalContract
    const proposalContract = await hre.viem.deployContract("ProposalContract");

    const publicClient = await hre.viem.getPublicClient();

    return {
      proposalContract,
      owner,
      otherAccount,
      publicClient,
    };
  }

  describe("Deployment", function () {
    it("Should deploy the ProposalContract", async function () {
      const { proposalContract } = await loadFixture(deployProposalContractFixture);

      expect(proposalContract.address).to.be.a("string");
      expect(proposalContract.address).to.have.lengthOf(42); // Ethereum address length
    });
  });

  describe("createProposal", function () {
    it("Should create a proposal", async function () {
      const { proposalContract, owner } = await loadFixture(deployProposalContractFixture);

      const title = "Proposal 1";
      const description = "This is the first proposal";

      await proposalContract.write.createProposal([title, description], {
        account: owner.account,
      });

      const proposals = await proposalContract.read.getProposals();
      expect(proposals).to.have.lengthOf(1);
      expect(proposals[0].title).to.equal(title);
      expect(proposals[0].description).to.equal(description);
    });
  });

  describe("getProposals", function () {
    it("Should return all proposals", async function () {
      const { proposalContract } = await loadFixture(deployProposalContractFixture);

      const title1 = "Proposal 1";
      const description1 = "This is the first proposal";
      await proposalContract.write.createProposal([title1, description1], {
        account: (await hre.viem.getWalletClients())[0].account,
      });

      const title2 = "Proposal 2";
      const description2 = "This is the second proposal";
      await proposalContract.write.createProposal([title2, description2], {
        account: (await hre.viem.getWalletClients())[0].account,
      });

      const proposals = await proposalContract.read.getProposals();
      expect(proposals).to.have.lengthOf(2);
      expect(proposals[0].title).to.equal(title1);
      expect(proposals[1].title).to.equal(title2);
    });
  });

  describe("Events", function () {
    it("Should emit an event when a proposal is created", async function () {
      const { proposalContract, owner } = await loadFixture(deployProposalContractFixture);

      const title = "Proposal 3";
      const description = "This is the third proposal";

      const tx = await proposalContract.write.createProposal([title, description], {
        account: owner.account,
      });
    });
  });

  describe("Edge Cases", function () {
    it("Should revert if no proposal is created", async function () {
      const { proposalContract } = await loadFixture(deployProposalContractFixture);

      const proposals = await proposalContract.read.getProposals();
      expect(proposals).to.have.lengthOf(0);
    });
  });
});
