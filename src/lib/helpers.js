import { Alchemy, Network, Utils } from 'alchemy-sdk';
import { ethers } from 'ethers';

export async function getAlchemy() {
  const config = {
    apiKey: import.meta.env.VITE_ALCHEMY_API_KEY,
    network: Network.ETH_MAINNET,
  };

  const alchemy = new Alchemy(config);

  return alchemy;
}

export function getProvider() {
  // return window.ethereum ? new ethers.providers.AlchemyProvider()
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  return provider;
}

export function isValidAddress(address) {
  return (
    String(address).toLowerCase().startsWith('0x') &&
    String(address).length === 42
  );
}

export const etherscanTokenLink = address =>
  `https://etherscan.io/token/${address}`;

export const formatBalance = (balance, decimals) => {
  const fmt = Intl.NumberFormat('en-US').format(
    Utils.formatUnits(balance, decimals)
  );
  if (fmt.length > 18) {
    return fmt.substring(0, 18) + '...';
  } else {
    return fmt;
  }
};
