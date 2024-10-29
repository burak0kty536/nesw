export interface WalletInfo {
  id: string;
  name: string;
  address: string;
  network: string;
  rpcUrl: string;
  wsUrl: string;
  privateKey: string;
}

export interface TokenBalance {
  symbol: string;
  name: string;
  logo?: string;
  balance: number;
  usdValue: number;
  tokenId: string;
}