import React, { useState, useEffect } from 'react';
import { ChainSelector } from './ChainSelector';
import { TokenInput } from './TokenInput';
import { TradingControls } from './TradingControls';
import { PriceChart } from './PriceChart';
import { Activity, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { formatNumber } from '../utils/format';

interface Trade {
  token: string;
  buyPrice: number;
  currentPrice: number;
  amount: number;
  timestamp: number;
}

interface BotPerformance {
  totalProfit: number;
  trades: Trade[];
  balance: number;
}

interface Bot {
  id: string;
  name: string;
  status: 'running' | 'stopped';
  networks: string[];
  strategy: {
    type: string;
    settings: Record<string, any>;
  };
  performance: BotPerformance;
}

const defaultPerformance: BotPerformance = {
  totalProfit: 0,
  trades: [],
  balance: 0
};

export const TradingInterface = () => {
  const [selectedChain, setSelectedChain] = useState('solana');
  const [tokenAddress, setTokenAddress] = useState('');
  const [activeBots, setActiveBots] = useState<Bot[]>([]);

  useEffect(() => {
    try {
      const savedBots = localStorage.getItem('tradingBots');
      if (savedBots) {
        const parsedBots = JSON.parse(savedBots);
        // Ensure each bot has valid performance data
        const validatedBots = parsedBots.map((bot: Bot) => ({
          ...bot,
          performance: bot.performance || defaultPerformance
        }));
        setActiveBots(validatedBots);
      }
    } catch (error) {
      console.error('Error loading bots:', error);
      setActiveBots([]);
    }
  }, []);

  const toggleBot = (botId: string) => {
    setActiveBots(prev => prev.map(bot => {
      if (bot.id === botId) {
        const newStatus = bot.status === 'running' ? 'stopped' : 'running';
        const updatedBot = { ...bot, status: newStatus };
        
        // Update localStorage
        try {
          const savedBots = JSON.parse(localStorage.getItem('tradingBots') || '[]');
          const updatedBots = savedBots.map((b: Bot) => 
            b.id === botId ? updatedBot : b
          );
          localStorage.setItem('tradingBots', JSON.stringify(updatedBots));
        } catch (error) {
          console.error('Error updating bot status:', error);
        }
        
        return updatedBot;
      }
      return bot;
    }));
  };

  return (
    <div className="space-y-6">
      {activeBots.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-500" />
              <h3 className="text-lg font-semibold">Aktif Bot Performansı</h3>
            </div>
          </div>

          <div className="grid gap-4">
            {activeBots.map(bot => (
              <div key={bot.id} className="bg-gray-700/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium">{bot.name}</h4>
                    <div className="text-sm text-gray-400">
                      {bot.networks.join(', ')} | {bot.strategy.type}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${
                      (bot.performance?.totalProfit || 0) >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {formatNumber(bot.performance?.totalProfit || 0, 'currency')}
                    </div>
                    <div className="text-sm text-gray-400">
                      Toplam Kar/Zarar
                    </div>
                  </div>
                </div>

                {bot.performance?.trades?.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <div className="text-sm font-medium text-gray-400">Aktif İşlemler</div>
                    {bot.performance.trades.map((trade, index) => {
                      const profitPercent = ((trade.currentPrice - trade.buyPrice) / trade.buyPrice) * 100;
                      return (
                        <div key={index} className="flex items-center justify-between bg-gray-800/50 p-2 rounded">
                          <div className="flex items-center gap-2">
                            {profitPercent >= 0 ? (
                              <TrendingUp className="h-4 w-4 text-green-500" />
                            ) : (
                              <TrendingDown className="h-4 w-4 text-red-500" />
                            )}
                            <div>
                              <div className="font-medium">{trade.token}</div>
                              <div className="text-sm text-gray-400">
                                {new Date(trade.timestamp).toLocaleTimeString()}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`font-medium ${
                              profitPercent >= 0 ? 'text-green-500' : 'text-red-500'
                            }`}>
                              {profitPercent >= 0 ? '+' : ''}{profitPercent.toFixed(2)}%
                            </div>
                            <div className="text-sm text-gray-400">
                              {formatNumber(trade.amount, 'number')} token
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="mt-4 flex items-center justify-between bg-gray-800/50 p-3 rounded">
                  <div className="flex items-center gap-2">
                    <Wallet className="h-4 w-4 text-blue-500" />
                    <div className="text-sm font-medium">Cüzdan Bakiyesi</div>
                  </div>
                  <div className="font-bold">
                    {formatNumber(bot.performance?.balance || 0, 'currency')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-800 rounded-lg p-4">
            <ChainSelector value={selectedChain} onChange={setSelectedChain} />
            <TokenInput 
              chain={selectedChain} 
              value={tokenAddress}
              onChange={setTokenAddress}
            />
          </div>
          <PriceChart chain={selectedChain} tokenAddress={tokenAddress} />
        </div>
        
        <div className="space-y-6">
          <TradingControls chain={selectedChain} tokenAddress={tokenAddress} />
        </div>
      </div>
    </div>
  );
};