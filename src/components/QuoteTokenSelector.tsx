import React from 'react';
import { networks } from '../config/networks';

interface QuoteTokenSelectorProps {
  network: string;
  value: string;
  onChange: (value: string) => void;
}

export const QuoteTokenSelector: React.FC<QuoteTokenSelectorProps> = ({
  network,
  value,
  onChange
}) => {
  const quoteTokens = networks[network]?.quoteTokens || [];

  return (
    <div>
      <label className="block text-sm text-gray-400 mb-1">İşlem Tokeni</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-gray-700 border-gray-600 rounded-lg px-3 py-2 text-white"
      >
        {quoteTokens.map((token) => (
          <option key={token.symbol} value={token.symbol}>
            {token.symbol} ({token.name})
          </option>
        ))}
      </select>
    </div>
  );
};