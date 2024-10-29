import React from 'react';
import { Badge } from './ui/badge';

interface NetworkSelectorProps {
  selected: string[];
  onChange: (networks: string[]) => void;
}

export const NetworkSelector = ({ selected, onChange }: NetworkSelectorProps) => {
  const networks = [
    { id: 'ethereum', name: 'Ethereum', icon: '⟠' },
    { id: 'bsc', name: 'BSC', icon: '💎' },
    { id: 'solana', name: 'Solana', icon: '◎' }
  ];

  const toggleNetwork = (networkId: string) => {
    if (selected.includes(networkId)) {
      onChange(selected.filter(id => id !== networkId));
    } else {
      onChange([...selected, networkId]);
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="font-medium">Ağ Seçimi</h4>
      <div className="flex flex-wrap gap-2">
        {networks.map(network => (
          <button
            key={network.id}
            onClick={() => toggleNetwork(network.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              selected.includes(network.id)
                ? 'bg-blue-500 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <span>{network.icon}</span>
            <span>{network.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};