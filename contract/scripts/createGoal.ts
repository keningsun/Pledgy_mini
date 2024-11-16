import hre from "hardhat";

async function main() {
    const contract = await hre.viem.getContractAt("ChallengeMarket", "0xE266ABEBbaE5833aF1e32B5ABC816061F638b323");
    let res = await contract.write.createGoal(["abc", 1731763551], {value: 1000000000000000000});

    console.log(res);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});