import hre from "hardhat";

async function main() {
  const contract = await hre.viem.deployContract("ChallengeMarket", ["0xc8E94b4eBE3ec2F87964B42f7DF10d90B36B8365"]);
  console.log(contract.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});