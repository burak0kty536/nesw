import { EventEmitter } from '../../utils/EventEmitter';

export class MempoolMonitor extends EventEmitter {
  private connections: Map<string, WebSocket>;
  private readonly RPC_URLS: Record<string, string>;
  private readonly SUPPORTED_CHAINS = ['ethereum', 'bsc', 'solana'];

  constructor() {
    super();
    this.connections = new Map();
    this.RPC_URLS = {
      ethereum: 'wss://eth-mainnet.g.alchemy.com/v2/your-api-key',
      bsc: 'wss://bsc-ws-node.nariox.org:443',
      solana: 'wss://api.mainnet-beta.solana.com'
    };
  }

  startMonitoring(chain: string): void {
    if (!chain || !this.SUPPORTED_CHAINS.includes(chain)) {
      throw new Error(`Unsupported chain: ${chain}`);
    }

    if (this.connections.has(chain)) {
      return;
    }

    const rpcUrl = this.RPC_URLS[chain];
    if (!rpcUrl) {
      throw new Error(`No RPC URL configured for chain: ${chain}`);
    }

    try {
      const ws = new WebSocket(rpcUrl);
      
      ws.onopen = () => {
        this.subscribeToMempool(ws, chain);
        this.emit('connected', chain);
      };

      ws.onmessage = (event) => {
        this.handleMempoolTransaction(chain, event.data);
      };

      ws.onerror = (error) => {
        this.emit('error', { chain, error });
      };

      ws.onclose = () => {
        this.connections.delete(chain);
        this.emit('disconnected', chain);
        // Try to reconnect after 5 seconds
        setTimeout(() => this.startMonitoring(chain), 5000);
      };

      this.connections.set(chain, ws);
    } catch (error) {
      this.emit('error', { chain, error });
      throw error;
    }
  }

  private subscribeToMempool(ws: WebSocket, chain: string): void {
    switch (chain) {
      case 'ethereum':
      case 'bsc':
        ws.send(JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'eth_subscribe',
          params: ['newPendingTransactions']
        }));
        break;
      case 'solana':
        ws.send(JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'mempool_subscribe'
        }));
        break;
    }
  }

  private handleMempoolTransaction(chain: string, data: any): void {
    try {
      const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
      
      if (parsedData.method === 'eth_subscription' || parsedData.method === 'mempool_notification') {
        this.emit('transaction', {
          chain,
          data: parsedData.params?.result,
          timestamp: Date.now()
        });
      }
    } catch (error) {
      this.emit('error', { chain, error: 'Failed to parse mempool data' });
    }
  }

  stopMonitoring(chain: string): void {
    const connection = this.connections.get(chain);
    if (connection) {
      connection.close();
      this.connections.delete(chain);
      this.emit('stopped', chain);
    }
  }

  stopAll(): void {
    for (const chain of this.connections.keys()) {
      this.stopMonitoring(chain);
    }
  }
}