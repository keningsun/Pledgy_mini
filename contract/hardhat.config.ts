import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import "@nomicfoundation/hardhat-verify";

const config: HardhatUserConfig = {
  solidity: "0.8.27",
  networks: {
    'world-chain-sepolia': {
      url: 'https://worldchain-sepolia.g.alchemy.com/public',
      accounts: [process.env.PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: {
      // Is not required by blockscout. Can be any non-empty string
      'world-chain-sepolia': ""
    },
    customChains: [
      {
        network: "world-chain-sepolia",
        chainId: 4801,
        urls: {
          apiURL: "https://worldchain-sepolia.explorer.alchemy.com/api",
          browserURL: "https://worldchain-sepolia.explorer.alchemy.com",
        }
      }
    ]
  },
  sourcify: {
    enabled: true
  }
};

export default config;
