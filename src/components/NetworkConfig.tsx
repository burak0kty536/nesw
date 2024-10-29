import React from 'react';
import { Input } from './ui/input';

interface NetworkConfigProps {
  network: string;
  config: {
    rpcUrl: string;
    wssUrl: string;
  };
  onChange: (network: string, config: { rpcUrl: string; wssUrl: string }) => void;
}

export const NetworkConfig = ({ network, config, onChange }: NetworkConfigProps) => {
  const handleChange = (field: 'rpcUrl' | 'wssUrl', value: string) => {
    onChange(network, {
      ...config,
      [field]: value
    });
  };

  const getPlaceholder = (network: string, type: 'rpc' | 'wss') => {
    const examples = {
      ethereum: {
        rpc: 'https://eth-mainnet.g.alchemy.com/v2/YOUR-API-KEY',
        wss: 'wss://eth-mainnet.g.alchemy.com/v2/YOUR-API-KEY'
      },
      bsc: {
        rpc: 'https://bsc-dataseed.binance.org',
        wss: 'wss://bsc-ws-node.nariox.org'
      },
      solana: {
        rpc: 'https://api.mainnet-beta.solana.com',
        wss: 'wss://api.mainnet-beta.solana.com'
      }
    };
    return examples[network as keyof typeof examples][type];
  };

  return (
    <div className="space-y-4 p-4 bg-gray-800/50 rounded-lg">
      <div className="flex items-center gap-2 mb-4">
        <div className="text-xl">
          {network === 'ethereum' ? '⟠' : network === 'bsc' ? '💎' : '◎'}
        </div>
        <h4 className="font-medium capitalize">{network}</h4>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">
            HTTP RPC URL
          </label>
          <Input
            value={config.rpcUrl}
            onChange={(e) => handleChange('rpcUrl', e.target.value)}
            placeholder={getPlaceholder(network, 'rpc')}
            className="bg-gray-800 border-gray-700"
          />
          <p className="text-xs text-gray-500 mt-1">
            Örnek: {getPlaceholder(network, 'rpc')}
          </p>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">
            WebSocket URL
          </label>
          <Input
            value={config.wssUrl}
            onChange={(e) => handleChange('wssUrl', e.target.value)}
            placeholder={getPlaceholder(network, 'wss')}
            className="bg-gray-800 border-gray-700"
          />
          <p className="text-xs text-gray-500 mt-1">
            Örnek: {getPlaceholder(network, 'wss')}
          </p>
        </div>
      </div>
    </div>
  );
};