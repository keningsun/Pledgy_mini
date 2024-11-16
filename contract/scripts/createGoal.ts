import hre from "hardhat";

async function main() {
    const contract = await hre.viem.getContractAt("ChallengeMarket", "0x850abe0abe2b4b114b49a88e9758058085d79bf7");
    let res = await contract.write.createGoal(["abc", "abc", 1731799505, 1731789698888, 1731799505, ""], {value: 1000000000000000});

    console.log(res);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});