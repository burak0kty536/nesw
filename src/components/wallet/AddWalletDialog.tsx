import React from 'react';
import { Input } from '../ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { networks } from '../../config/networks';

interface AddWalletDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  error: string | null;
  isLoading: boolean;
  newWallet: {
    name: string;
    network: string;
    rpcUrl: string;
    wsUrl: string;
    privateKey: string;
  };
  onNewWalletChange: (field: string, value: string) => void;
  onAdd: () => void;
}

export const AddWalletDialog: React.FC<AddWalletDialogProps> = ({
  open,
  onOpenChange,
  error,
  isLoading,
  newWallet,
  onNewWalletChange,
  onAdd
}) => {
  const getPlaceholder = (network: string, type: 'rpc' | 'ws') => {
    const networkConfig = networks[network];
    return type === 'rpc' ? networkConfig?.rpcUrl : networkConfig?.wsUrl;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border border-gray-800">
        <DialogHeader>
          <DialogTitle>Yeni Cüzdan Ekle</DialogTitle>
        </DialogHeader>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="space-y-4 mt-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Blockchain Ağı</label>
            <select
              value={newWallet.network}
              onChange={(e) => onNewWalletChange('network', e.target.value)}
              className="w-full bg-gray-800 border-gray-700 rounded-lg px-3 py-2 text-white"
            >
              <option value="ethereum">Ethereum</option>
              <option value="bsc">BSC</option>
              <option value="solana">Solana</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">HTTP RPC URL</label>
            <Input
              placeholder={getPlaceholder(newWallet.network, 'rpc')}
              value={newWallet.rpcUrl}
              onChange={(e) => onNewWalletChange('rpcUrl', e.target.value)}
              className="bg-gray-800 border-gray-700"
            />
            <p className="text-xs text-gray-500 mt-1">
              Örnek: {getPlaceholder(newWallet.network, 'rpc')}
            </p>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">WebSocket URL</label>
            <Input
              placeholder={getPlaceholder(newWallet.network, 'ws')}
              value={newWallet.wsUrl}
              onChange={(e) => onNewWalletChange('wsUrl', e.target.value)}
              className="bg-gray-800 border-gray-700"
            />
            <p className="text-xs text-gray-500 mt-1">
              Örnek: {getPlaceholder(newWallet.network, 'ws')}
            </p>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Cüzdan İsmi (Opsiyonel)</label>
            <Input
              placeholder="Ana Cüzdan"
              value={newWallet.name}
              onChange={(e) => onNewWalletChange('name', e.target.value)}
              className="bg-gray-800 border-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Private Key</label>
            <Input
              type="password"
              placeholder="Private key girin"
              value={newWallet.privateKey}
              onChange={(e) => onNewWalletChange('privateKey', e.target.value)}
              className="bg-gray-800 border-gray-700"
            />
            <p className="text-xs text-gray-500 mt-1">
              Private key'iniz güvenli bir şekilde saklanacaktır
            </p>
          </div>

          <button
            onClick={onAdd}
            disabled={isLoading || !newWallet.rpcUrl || !newWallet.wsUrl || !newWallet.privateKey}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Ekleniyor...' : 'Cüzdan Ekle'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};