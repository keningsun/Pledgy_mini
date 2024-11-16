import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import "@nomicfoundation/hardhat-verify";

const config: HardhatUserConfig = {
  solidity: "0.8.27",
  networks: {
    'world-chain-sepolia': {
      url: 'https://worldchain-sepolia.gateway.tenderly.co',
      accounts: [vars.get("PRIVATE_KEY")],
    },
    'world-chain': {
      url: 'https://worldchain-mainnet.g.alchemy.com/public',
      accounts: [vars.get("PRIVATE_KEY")],
    }
  },
  etherscan: {
    apiKey: {
      // Is not required by blockscout. Can be any non-empty string
      'world-chain-sepolia': "123",
      'world-chain': "123"
    },
    customChains: [
      {
        network: "world-chain-sepolia",
        chainId: 4801,
        urls: {
          apiURL: "https://worldchain-sepolia.explorer.alchemy.com/api",
          browserURL: "https://worldchain-sepolia.explorer.alchemy.com",
        }
      },
      {
        network: "world-chain",
        chainId: 480,
        urls: {
          apiURL: "https://worldchain-mainnet.explorer.alchemy.com/api",
          browserURL: "https://worldchain-mainnet.explorer.alchemy.com",
        }
      }
    ]
  },
  sourcify: {
    enabled: false
  }
};

export default config;
