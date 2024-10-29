import React from 'react';
import { Input } from './ui/input';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { QuoteTokenSelector } from './QuoteTokenSelector';
import { BotConfig } from '../types/bot';

interface BotEditorProps {
  bot: BotConfig;
  onUpdate: (bot: BotConfig) => void;
  onClose: () => void;
}

export const BotEditor: React.FC<BotEditorProps> = ({ bot, onUpdate, onClose }) => {
  const handleSettingChange = (key: string, value: any) => {
    onUpdate({
      ...bot,
      strategy: {
        ...bot.strategy,
        settings: {
          ...bot.strategy.settings,
          [key]: value
        }
      }
    });
  };

  const handleSecurityChange = (key: string, value: any) => {
    onUpdate({
      ...bot,
      security: {
        ...bot.security,
        [key]: value
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Bot Düzenle: {bot.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          {/* Bot Name */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Bot İsmi</label>
            <Input
              value={bot.name}
              onChange={(e) => onUpdate({ ...bot, name: e.target.value })}
              className="bg-gray-800 border-gray-700"
            />
          </div>

          {/* Quote Token Selection */}
          {bot.networks.map(network => (
            <div key={network}>
              <QuoteTokenSelector
                network={network}
                value={bot.strategy.settings.quoteToken}
                onChange={(value) => handleSettingChange('quoteToken', value)}
              />
            </div>
          ))}

          {/* Trading Settings */}
          <div className="space-y-4">
            <h3 className="font-medium">İşlem Ayarları</h3>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                İşlem Miktarı
              </label>
              <Input
                type="number"
                value={bot.strategy.settings.quoteAmount}
                onChange={(e) => handleSettingChange('quoteAmount', parseFloat(e.target.value))}
                className="bg-gray-800 border-gray-700"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Alış Kayması (%)
              </label>
              <Slider
                value={[bot.strategy.settings.buySlippage]}
                onValueChange={([value]) => handleSettingChange('buySlippage', value)}
                min={0.1}
                max={10}
                step={0.1}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Satış Kayması (%)
              </label>
              <Slider
                value={[bot.strategy.settings.sellSlippage]}
                onValueChange={([value]) => handleSettingChange('sellSlippage', value)}
                min={0.1}
                max={10}
                step={0.1}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Gas Çarpanı
              </label>
              <Slider
                value={[bot.strategy.settings.gasMultiplier]}
                onValueChange={([value]) => handleSettingChange('gasMultiplier', value)}
                min={1}
                max={2}
                step={0.1}
              />
            </div>
          </div>

          {/* Security Settings */}
          <div className="space-y-4">
            <h3 className="font-medium">Güvenlik Ayarları</h3>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium">Kontrat Doğrulama</label>
                  <p className="text-sm text-gray-400">Doğrulanmış kontratları kontrol et</p>
                </div>
                <Switch
                  checked={bot.security.checkContractVerification}
                  onCheckedChange={(checked) => handleSecurityChange('checkContractVerification', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium">Honeypot Kontrolü</label>
                  <p className="text-sm text-gray-400">Token'ın satılabilirliğini kontrol et</p>
                </div>
                <Switch
                  checked={bot.security.checkHoneypot}
                  onCheckedChange={(checked) => handleSecurityChange('checkHoneypot', checked)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Min. Likidite (USD)
              </label>
              <Input
                type="number"
                value={bot.security.minLiquidity}
                onChange={(e) => handleSecurityChange('minLiquidity', parseFloat(e.target.value))}
                className="bg-gray-800 border-gray-700"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={() => onUpdate(bot)}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition-colors"
          >
            Kaydet
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors"
          >
            İptal
          </button>
        </div>
      </div>
    </div>
  );
};