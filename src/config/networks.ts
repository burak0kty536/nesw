// Previous imports remain the same...

export interface NetworkConfig {
  id: string;
  name: string;
  icon: string;
  rpcUrl: string;
  wsUrl: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  quoteTokens: {
    symbol: string;
    name: string;
    address?: string;
    decimals: number;
    isNative?: boolean;
  }[];
  blockExplorer: string;
  dexs: {
    name: string;
    routerAddress: string;
    factoryAddress: string;
    type: 'v2' | 'v3';
  }[];
}

export const networks: Record<string, NetworkConfig> = {
  ethereum: {
    id: 'ethereum',
    name: 'Ethereum',
    icon: '⟠',
    rpcUrl: 'https://eth-mainnet.g.alchemy.com/v2/your-api-key',
    wsUrl: 'wss://eth-mainnet.g.alchemy.com/v2/your-api-key',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18
    },
    quoteTokens: [
      {
        symbol: 'ETH',
        name: 'Ethereum',
        decimals: 18,
        isNative: true
      },
      {
        symbol: 'WETH',
        name: 'Wrapped Ethereum',
        address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        decimals: 18
      }
    ],
    blockExplorer: 'https://etherscan.io',
    dexs: [
      {
        name: 'Uniswap V2',
        routerAddress: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
        factoryAddress: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
        type: 'v2'
      },
      {
        name: 'Uniswap V3',
        routerAddress: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
        factoryAddress: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
        type: 'v3'
      }
    ]
  },
  bsc: {
    id: 'bsc',
    name: 'BSC',
    icon: '💎',
    rpcUrl: 'https://bsc-dataseed.binance.org',
    wsUrl: 'wss://bsc-ws-node.nariox.org',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18
    },
    quoteTokens: [
      {
        symbol: 'BNB',
        name: 'Binance Coin',
        decimals: 18,
        isNative: true
      },
      {
        symbol: 'WBNB',
        name: 'Wrapped BNB',
        address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
        decimals: 18
      }
    ],
    blockExplorer: 'https://bscscan.com',
    dexs: [
      {
        name: 'PancakeSwap V2',
        routerAddress: '0x10ED43C718714eb63d5aA57B78B54704E256024E',
        factoryAddress: '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73',
        type: 'v2'
      },
      {
        name: 'PancakeSwap V3',
        routerAddress: '0x13f4EA83D0bd40E75C8222255bc855a974568Dd4',
        factoryAddress: '0x0BFbCF9fa4f9C56B0F40a671Ad40E0805A091865',
        type: 'v3'
      }
    ]
  },
  solana: {
    id: 'solana',
    name: 'Solana',
    icon: '◎',
    rpcUrl: 'https://api.mainnet-beta.solana.com',
    wsUrl: 'wss://api.mainnet-beta.solana.com',
    nativeCurrency: {
      name: 'Solana',
      symbol: 'SOL',
      decimals: 9
    },
    quoteTokens: [
      {
        symbol: 'SOL',
        name: 'Solana',
        decimals: 9,
        isNative: true
      },
      {
        symbol: 'WSOL',
        name: 'Wrapped SOL',
        address: 'So11111111111111111111111111111111111111112',
        decimals: 9
      }
    ],
    blockExplorer: 'https://solscan.io',
    dexs: [
      {
        name: 'Raydium',
        routerAddress: '',
        factoryAddress: '',
        type: 'v2'
      },
      {
        name: 'Jupiter',
        routerAddress: '',
        factoryAddress: '',
        type: 'v3'
      }
    ]
  }
};