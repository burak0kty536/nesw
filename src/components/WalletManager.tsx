import React, { useState, useEffect } from 'react';
import { Wallet, Plus, Trash2, RefreshCw, ChevronDown, Shield, Coins } from 'lucide-react';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { WalletService } from '../services/wallet/WalletService';
import { formatNumber, formatAddress } from '../utils/format';
import { AddWalletDialog } from './wallet/AddWalletDialog';
import { WalletCard } from './wallet/WalletCard';
import { WalletInfo, TokenBalance } from './wallet/types';

export const WalletManager: React.FC = () => {
  const [wallets, setWallets] = useState<WalletInfo[]>([]);
  const [balances, setBalances] = useState<Record<string, TokenBalance[]>>({});
  const [totalBalance, setTotalBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});
  const [showAddWallet, setShowAddWallet] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [newWallet, setNewWallet] = useState({
    name: '',
    network: 'ethereum',
    rpcUrl: '',
    wsUrl: '',
    privateKey: ''
  });

  const walletService = new WalletService();

  useEffect(() => {
    loadWallets();
  }, []);

  useEffect(() => {
    wallets.forEach(wallet => {
      fetchBalances(wallet);
    });

    const interval = setInterval(() => {
      wallets.forEach(wallet => {
        fetchBalances(wallet);
      });
    }, 30000);

    return () => clearInterval(interval);
  }, [wallets]);

  const loadWallets = async () => {
    const savedWallets = localStorage.getItem('wallets');
    if (savedWallets) {
      setWallets(JSON.parse(savedWallets));
    }
  };

  const saveWallets = (updatedWallets: WalletInfo[]) => {
    localStorage.setItem('wallets', JSON.stringify(updatedWallets));
    setWallets(updatedWallets);
  };

  const handleNewWalletChange = (field: string, value: string) => {
    setNewWallet(prev => ({ ...prev, [field]: value }));
  };

  const addWallet = async () => {
    try {
      setError(null);
      setIsLoading(prev => ({ ...prev, adding: true }));

      if (!newWallet.privateKey || !newWallet.rpcUrl || !newWallet.wsUrl) {
        throw new Error('Private key, RPC URL ve WebSocket URL gereklidir');
      }

      const result = await walletService.connectWallet(
        newWallet.privateKey,
        newWallet.network,
        newWallet.rpcUrl,
        newWallet.wsUrl
      );

      const walletId = `${newWallet.network}-${Date.now()}`;
      const wallet: WalletInfo = {
        id: walletId,
        name: newWallet.name || `${newWallet.network.toUpperCase()} Wallet ${wallets.length + 1}`,
        address: result.address,
        network: newWallet.network,
        rpcUrl: newWallet.rpcUrl,
        wsUrl: newWallet.wsUrl,
        privateKey: newWallet.privateKey
      };

      const updatedWallets = [...wallets, wallet];
      saveWallets(updatedWallets);
      await fetchBalances(wallet);
      
      setNewWallet({
        name: '',
        network: 'ethereum',
        rpcUrl: '',
        wsUrl: '',
        privateKey: ''
      });
      setShowAddWallet(false);
    } catch (error) {
      setError(error.message || 'Cüzdan eklenirken hata oluştu');
      console.error('Cüzdan ekleme hatası:', error);
    } finally {
      setIsLoading(prev => ({ ...prev, adding: false }));
    }
  };

  const removeWallet = (id: string) => {
    const updatedWallets = wallets.filter(wallet => wallet.id !== id);
    saveWallets(updatedWallets);
    setBalances(prev => {
      const newBalances = { ...prev };
      delete newBalances[id];
      return newBalances;
    });
  };

  const fetchBalances = async (wallet: WalletInfo) => {
    setIsLoading(prev => ({ ...prev, [wallet.id]: true }));
    try {
      const tokenBalances = await walletService.getTokenBalances(wallet);
      setBalances(prev => ({
        ...prev,
        [wallet.id]: tokenBalances
      }));

      const total = Object.values(balances).reduce((sum, tokens) => {
        return sum + tokens.reduce((tokenSum, token) => tokenSum + token.usdValue, 0);
      }, 0);
      setTotalBalance(total);
    } catch (error) {
      console.error('Token balance fetch error:', error);
    }
    setIsLoading(prev => ({ ...prev, [wallet.id]: false }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Toplam Portföy Değeri</h2>
            <p className="text-3xl font-bold text-white mt-2">
              {formatNumber(totalBalance, 'currency')}
            </p>
          </div>
          <Coins className="h-12 w-12 text-white opacity-50" />
        </div>
      </div>

      <button
        onClick={() => setShowAddWallet(true)}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        <Plus className="h-5 w-5" />
        Yeni Cüzdan Ekle
      </button>

      <AddWalletDialog
        open={showAddWallet}
        onOpenChange={setShowAddWallet}
        error={error}
        isLoading={isLoading.adding}
        newWallet={newWallet}
        onNewWalletChange={handleNewWalletChange}
        onAdd={addWallet}
      />

      <div className="grid gap-4">
        {wallets.map((wallet) => (
          <WalletCard
            key={wallet.id}
            wallet={wallet}
            balances={balances[wallet.id] || []}
            isLoading={isLoading[wallet.id]}
            onRefresh={() => fetchBalances(wallet)}
            onRemove={() => removeWallet(wallet.id)}
          />
        ))}

        {wallets.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            Henüz cüzdan eklenmemiş
          </div>
        )}
      </div>
    </div>
  );
};