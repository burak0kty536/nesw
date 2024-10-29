import React from 'react';
import { formatNumber } from '../../utils/format';
import type { TokenBalance } from './types';

interface TokenBalanceListProps {
  balances: TokenBalance[];
  isLoading: boolean;
}

export const TokenBalanceList: React.FC<TokenBalanceListProps> = ({ balances, isLoading }) => {
  if (isLoading) {
    return (
      <div className="text-center text-gray-500 py-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto" />
      </div>
    );
  }

  if (balances.length === 0) {
    return (
      <div className="text-center text-gray-500 py-4">
        No tokens found
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {balances.map((token) => (
        <div
          key={`${token.tokenId}-${token.symbol}`}
          className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg"
        >
          <div className="flex items-center gap-3">
            {token.logo && (
              <img
                src={token.logo}
                alt={token.symbol}
                className="w-8 h-8 rounded-full"
              />
            )}
            <div>
              <div className="font-medium">{token.symbol}</div>
              <div className="text-sm text-gray-400">
                {formatNumber(token.balance, 'number')}
              </div>
            </div>
          </div>
          <div className="text-right font-medium">
            {formatNumber(token.usdValue, 'currency')}
          </div>
        </div>
      ))}
    </div>
  );
};