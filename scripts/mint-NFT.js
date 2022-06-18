// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { ethers } = require("hardhat");
const hre = require("hardhat");

// const R = require("ramda");
// const IPFS = require("ipfs-core");
// const ipfs = IPFS.create({
// });

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy

  const { create } = await import("ipfs-core");

  const ipfs = await create({
    host: "ipfs.infura.io",
    port: "5001",
    protocol: "https",
  });

  const myNFT = await ethers.getContractAt(
    "MyNFT",
    "0xe5F899DdC451ef9F84AFeC3447B22d12eEE310E6"
  );

  const toAddress = "0x209AeEF18db57A588cD7885C6dC8fA2673e58ac4";

  const buffalo = {
    description: "It's actually a bison?",
    external_url: "https://austingriffith.com/portfolio/paintings/",
    image: "https://austingriffith.com/images/paintings/buffalo.jpg",
    name: "Buffalo",
    attributes: [
      {
        trait_type: "BackgroundColor",
        value: "green",
      },
      {
        trait_type: "Eyes",
        value: "googly",
      },
      {
        trait_type: "Stamina",
        value: 42,
      },
    ],
  };
  console.log("Uploading buffalo...");

  const uploaded = await ipfs.add(JSON.stringify(buffalo));

  console.log("Minting buffalo with IPFS hash (" + uploaded.path + ")");
  await myNFT.mintItem(toAddress, uploaded.path, { gasLimit: 10000000 });
  await sleep(3000);

  const zebra = {
    description: "It's actually a bison?",
    external_url: "https://austingriffith.com/portfolio/paintings/",
    image: "https://austingriffith.com/images/paintings/zebra.jpg",
    name: "Buffalo",
    attributes: [
      {
        trait_type: "BackgroundColor",
        value: "blue",
      },
      {
        trait_type: "Eyes",
        value: "googly",
      },
      {
        trait_type: "Stamina",
        value: 30,
      },
    ],
  };
  console.log("Uploading zebra...");

  const uploadedZebra = await ipfs.add(JSON.stringify(zebra));

  console.log("Minting zebra with IPFS hash (" + uploadedZebra.path + ")");
  await myNFT.mintItem(toAddress, uploadedZebra.path, { gasLimit: 10000000 });
  await sleep(3000);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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
