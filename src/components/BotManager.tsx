import React, { useState, useEffect } from 'react';
import { Activity, Shield, Settings, Play, Pause, TrendingUp, Zap, Edit, Trash2, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { NetworkSelector } from './NetworkSelector';
import { formatNumber } from '../utils/format';
import { QuoteTokenSelector } from './QuoteTokenSelector';

interface BotConfig {
  id: string;
  name: string;
  networks: string[];
  status: 'running' | 'stopped';
  strategy: {
    type: string;
    settings: {
      quoteToken: string;
      quoteAmount: number;
      buySlippage: number;
      sellSlippage: number;
      gasMultiplier: number;
    };
  };
  security: {
    checkContractVerification: boolean;
    checkHoneypot: boolean;
    minLiquidity: number;
  };
  performance?: {
    totalProfit: number;
    trades: any[];
    balance: number;
  };
}

export const BotManager: React.FC = () => {
  const [bots, setBots] = useState<BotConfig[]>([]);
  const [isAddingBot, setIsAddingBot] = useState(false);
  const [newBot, setNewBot] = useState<Partial<BotConfig>>({
    name: '',
    networks: [],
    strategy: {
      type: 'standard',
      settings: {
        quoteToken: 'USDT',
        quoteAmount: 0.1,
        buySlippage: 1,
        sellSlippage: 1,
        gasMultiplier: 1.1
      }
    },
    security: {
      checkContractVerification: true,
      checkHoneypot: true,
      minLiquidity: 10000
    }
  });

  useEffect(() => {
    const savedBots = localStorage.getItem('tradingBots');
    if (savedBots) {
      setBots(JSON.parse(savedBots));
    }
  }, []);

  const handleAddBot = () => {
    if (!newBot.name || !newBot.networks?.length) {
      return;
    }

    const bot: BotConfig = {
      id: Date.now().toString(),
      name: newBot.name,
      networks: newBot.networks,
      status: 'stopped',
      strategy: newBot.strategy as BotConfig['strategy'],
      security: newBot.security as BotConfig['security'],
      performance: {
        totalProfit: 0,
        trades: [],
        balance: 0
      }
    };

    const updatedBots = [...bots, bot];
    setBots(updatedBots);
    localStorage.setItem('tradingBots', JSON.stringify(updatedBots));
    setIsAddingBot(false);
    setNewBot({
      name: '',
      networks: [],
      strategy: {
        type: 'standard',
        settings: {
          quoteToken: 'USDT',
          quoteAmount: 0.1,
          buySlippage: 1,
          sellSlippage: 1,
          gasMultiplier: 1.1
        }
      },
      security: {
        checkContractVerification: true,
        checkHoneypot: true,
        minLiquidity: 10000
      }
    });
  };

  const handleToggleBot = (botId: string) => {
    setBots(prevBots => {
      const updatedBots = prevBots.map(bot => {
        if (bot.id === botId) {
          return {
            ...bot,
            status: bot.status === 'running' ? 'stopped' : 'running'
          };
        }
        return bot;
      });
      localStorage.setItem('tradingBots', JSON.stringify(updatedBots));
      return updatedBots;
    });
  };

  const handleDeleteBot = (botId: string) => {
    setBots(prevBots => {
      const updatedBots = prevBots.filter(bot => bot.id !== botId);
      localStorage.setItem('tradingBots', JSON.stringify(updatedBots));
      return updatedBots;
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Bot Yönetimi</h2>
        <button
          onClick={() => setIsAddingBot(true)}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="h-5 w-5" />
          Yeni Bot Ekle
        </button>
      </div>

      <div className="grid gap-4">
        {bots.map(bot => (
          <div key={bot.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">{bot.name}</h3>
                <div className="text-sm text-gray-400">
                  {bot.networks.join(', ')} | {bot.strategy.type}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleBot(bot.id)}
                  className={`p-2 rounded-lg ${
                    bot.status === 'running'
                      ? 'bg-red-500/20 text-red-500'
                      : 'bg-green-500/20 text-green-500'
                  }`}
                >
                  {bot.status === 'running' ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </button>
                <button
                  onClick={() => handleDeleteBot(bot.id)}
                  className="p-2 rounded-lg bg-gray-700/50 text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="bg-gray-700/50 p-3 rounded-lg">
                <div className="text-sm text-gray-400">Toplam Kar/Zarar</div>
                <div className={`text-lg font-bold ${
                  (bot.performance?.totalProfit || 0) >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {formatNumber(bot.performance?.totalProfit || 0, 'currency')}
                </div>
              </div>
              <div className="bg-gray-700/50 p-3 rounded-lg">
                <div className="text-sm text-gray-400">İşlem Sayısı</div>
                <div className="text-lg font-bold">
                  {bot.performance?.trades?.length || 0}
                </div>
              </div>
              <div className="bg-gray-700/50 p-3 rounded-lg">
                <div className="text-sm text-gray-400">Durum</div>
                <div className="text-lg font-bold capitalize">
                  {bot.status === 'running' ? 'Çalışıyor' : 'Durdu'}
                </div>
              </div>
            </div>
          </div>
        ))}

        {bots.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            Henüz bot eklenmemiş
          </div>
        )}
      </div>

      <Dialog open={isAddingBot} onOpenChange={setIsAddingBot}>
        <DialogContent className="bg-gray-900 border border-gray-800">
          <DialogHeader>
            <DialogTitle>Yeni Bot Ekle</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Bot İsmi</label>
              <Input
                value={newBot.name}
                onChange={(e) => setNewBot({ ...newBot, name: e.target.value })}
                placeholder="Bot ismi girin"
                className="bg-gray-800 border-gray-700"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Ağlar</label>
              <NetworkSelector
                selected={newBot.networks || []}
                onChange={(networks) => setNewBot({ ...newBot, networks })}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">İşlem Stratejisi</label>
              <select
                value={newBot.strategy?.type}
                onChange={(e) => setNewBot({
                  ...newBot,
                  strategy: { ...newBot.strategy!, type: e.target.value }
                })}
                className="w-full bg-gray-800 border-gray-700 rounded-lg px-3 py-2 text-white"
              >
                <option value="standard">Standart</option>
                <option value="arbitrage">Arbitraj</option>
                <option value="pingpong">PingPong</option>
                <option value="mev">MEV/Sandviç</option>
              </select>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Güvenlik Ayarları</h4>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium">Kontrat Doğrulama</label>
                  <p className="text-sm text-gray-400">Doğrulanmış kontratları kontrol et</p>
                </div>
                <Switch
                  checked={newBot.security?.checkContractVerification}
                  onCheckedChange={(checked) => setNewBot({
                    ...newBot,
                    security: { ...newBot.security!, checkContractVerification: checked }
                  })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium">Honeypot Kontrolü</label>
                  <p className="text-sm text-gray-400">Token'ın satılabilirliğini kontrol et</p>
                </div>
                <Switch
                  checked={newBot.security?.checkHoneypot}
                  onCheckedChange={(checked) => setNewBot({
                    ...newBot,
                    security: { ...newBot.security!, checkHoneypot: checked }
                  })}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleAddBot}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition-colors"
              >
                Bot Ekle
              </button>
              <button
                onClick={() => setIsAddingBot(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors"
              >
                İptal
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};