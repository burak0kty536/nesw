import { ethers } from 'ethers';
import { Connection, PublicKey } from '@solana/web3.js';

export class WalletService {
  private providers: Map<string, any>;

  constructor() {
    this.providers = new Map();
  }

  async connectWallet(privateKey: string, network: string, rpcUrl: string) {
    try {
      if (network === 'solana') {
        return this.connectSolanaWallet(privateKey, rpcUrl);
      } else {
        return this.connectEvmWallet(privateKey, rpcUrl);
      }
    } catch (error) {
      console.error(`${network} wallet connection error:`, error);
      throw error;
    }
  }

  private async connectSolanaWallet(privateKey: string, rpcUrl: string) {
    const connection = new Connection(rpcUrl);
    const keypair = this.getSolanaKeypair(privateKey);
    return {
      address: keypair.publicKey.toString(),
      connection
    };
  }

  private async connectEvmWallet(privateKey: string, rpcUrl: string) {
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);
    return {
      address: await wallet.getAddress(),
      provider
    };
  }

  private getSolanaKeypair(privateKey: string) {
    try {
      const decoded = Buffer.from(privateKey, 'base58');
      return Keypair.fromSecretKey(decoded);
    } catch (error) {
      throw new Error('Invalid Solana private key');
    }
  }

  async getTokenBalances(address: string, network: string): Promise<TokenBalance[]> {
    try {
      if (network === 'solana') {
        return this.getSolanaTokenBalances(address);
      } else {
        return this.getEvmTokenBalances(address, network);
      }
    } catch (error) {
      console.error('Token balance fetch error:', error);
      return [];
    }
  }

  private async getSolanaTokenBalances(address: string): Promise<TokenBalance[]> {
    const connection = this.providers.get('solana');
    if (!connection) return [];

    try {
      const publicKey = new PublicKey(address);
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
        programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')
      });

      return tokenAccounts.value.map(account => {
        const parsedInfo = account.account.data.parsed.info;
        return {
          symbol: parsedInfo.mint,
          name: parsedInfo.mint,
          balance: Number(parsedInfo.tokenAmount.amount) / Math.pow(10, parsedInfo.tokenAmount.decimals),
          usdValue: 0,
          tokenId: parsedInfo.mint // Unique identifier for the token
        };
      });
    } catch (error) {
      console.error('Solana token balance error:', error);
      return [];
    }
  }

  private async getEvmTokenBalances(address: string, network: string): Promise<TokenBalance[]> {
    const provider = this.providers.get(network);
    if (!provider) return [];

    try {
      // For demonstration, returning native token balance only
      const balance = await provider.getBalance(address);
      const symbol = network === 'ethereum' ? 'ETH' : 'BNB';
      
      return [{
        symbol,
        name: symbol,
        balance: Number(ethers.formatEther(balance)),
        usdValue: 0,
        tokenId: '0x0000000000000000000000000000000000000000' // Native token address
      }];
    } catch (error) {
      console.error('EVM token balance error:', error);
      return [];
    }
  }

  removeWallet(address: string, network: string) {
    this.providers.delete(network);
  }
}

interface TokenBalance {
  symbol: string;
  name: string;
  logo?: string;
  balance: number;
  usdValue: number;
  tokenId: string; // Unique identifier for each token
}