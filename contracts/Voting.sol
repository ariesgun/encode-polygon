pragma solidity ^0.8.0;
//SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/access/Ownable.sol";


contract Voting is Ownable {

  enum Choice {Yes, No, Abstain}

  struct Votes {
    uint yes;
    uint no;
    uint abstain;
  }
  
  uint256 public votingStart;
  uint256 public immutable votingDuration;
  uint256 public votersCount = 0;
  Votes public votesTotal;

  string public proposalUri;

  mapping (address => Choice) public choices;
  mapping (address => bool) public voted;


  modifier voteNotOpen() {
    require(votingStart == 0, "Voting already opened");
    _;
  }
  
  modifier isVoteOpen() {
    require(
      getBlockTimestamp() < (votingStart + votingDuration),
      "Voting is not open"
    );
    _;
  }

  modifier isVoteClosed() {
    require(
      votingStart != 0 &&
      getBlockTimestamp() >= (votingStart + votingDuration),
      "Voting is not closed"
    );
    _;
  }

  constructor(uint256 _roundDuration, string memory _proposalUri) public {
    require(_roundDuration < 31536000, "Round duration too long");
    votingDuration = _roundDuration;
    proposalUri = _proposalUri;
  }

  function startVote() public voteNotOpen onlyOwner {
    votingStart = getBlockTimestamp();
  }

  function getBlockTimestamp() public view returns (uint256) {
    return block.timestamp;
  }

  function getVotesResult() public view returns (Votes memory) {
    return votesTotal;
  }

  function voteYes() public isVoteOpen {
    require(!voted[address(this)], "You already voted");
    voted[address(this)] = true;
    choices[address(this)] = Choice.Yes;
    votersCount += 1;
    votesTotal.yes += 1;
  }

  function voteNo() public isVoteOpen {
    require(!voted[address(this)], "You already voted");
    voted[address(this)] = true;
    choices[address(this)] = Choice.No;
    votersCount += 1;
    votesTotal.no += 1;
  }

  function voteAbstain() public isVoteOpen {
    require(!voted[address(this)], "You already voted");
    voted[address(this)] = true;
    choices[address(this)] = Choice.Abstain;
    votersCount += 1;
    votesTotal.abstain += 1;
  }


}