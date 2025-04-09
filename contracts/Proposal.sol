// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract ProposalContract {
    struct Proposal {
        string title;
        string description;
    }

    Proposal[] public proposals;

    function createProposal(string calldata _title, string calldata _description) external {
        proposals.push(Proposal(_title, _description));
    }

    function getProposals() external view returns (Proposal[] memory) {
        return proposals;
    }
}
