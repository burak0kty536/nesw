import React from 'react';
import { Wallet, RefreshCw, Trash2 } from 'lucide-react';
import { formatAddress } from '../../utils/format';
import { TokenBalanceList } from './TokenBalanceList';
import type { WalletInfo, TokenBalance } from './types';

interface WalletCardProps {
  wallet: WalletInfo;
  balances: TokenBalance[];
  isLoading: boolean;
  onRefresh: () => void;
  onRemove: () => void;
}

export const WalletCard: React.FC<WalletCardProps> = ({
  wallet,
  balances,
  isLoading,
  onRefresh,
  onRemove
}) => {
  const networkIcons = {
    ethereum: '⟠',
    bsc: '💎',
    solana: '◎'
  };

  return (
    <div key={wallet.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">{networkIcons[wallet.network] || <Wallet className="h-5 w-5 text-blue-500" />}</span>
            <div>
              <div className="font-medium">{wallet.name}</div>
              <div className="text-sm text-gray-400">
                {formatAddress(wallet.address)}
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="p-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={onRemove}
            className="p-2 text-red-400 hover:text-red-300 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <TokenBalanceList balances={balances} isLoading={isLoading} />
    </div>
  );
};