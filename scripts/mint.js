// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { ethers } = require("hardhat");
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const myContract = await ethers.getContractAt(
    "Voting",
    "0x71AeD8CD169002362f2B90BA4BbFaaF4f3E6c7B2"
  );

  let results = await myContract.getVotesResult();
  console.log("Vote Results: ", results);

  const timestamp = await myContract.getBlockTimestamp();
  console.log("Timestamp: ", timestamp);

  // let txn = await myContract.startVote();
  // await txn.wait();

  const txn = await myContract.voteYes();
  await txn.wait();

  results = await myContract.getVotesResult();
  console.log("Vote Results: ", results);

  // console.log("Voting deployed to:", voting.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
