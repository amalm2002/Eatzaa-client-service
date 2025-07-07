import { X } from 'lucide-react';
import { WalletModalProps } from '../../../interfaces/user/profile/order-tracking.types';

const WalletModal = ({ isWalletModalOpen, setIsWalletModalOpen, wallet }: WalletModalProps) => {
    if (!isWalletModalOpen || !wallet) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Wallet Details</h2>
                    <button onClick={() => setIsWalletModalOpen(false)} className="text-gray-600 hover:text-gray-800">
                        <X size={24} />
                    </button>
                </div>
                <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Balance</h3>
                    <p className="text-2xl text-teal-600">₹{wallet.balance.toFixed(2)}</p>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Recent Transactions</h3>
                    {wallet.transactions.length > 0 ? (
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                            {wallet.transactions.map((tx, index) => (
                                <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="text-sm text-gray-800">{tx.description}</p>
                                        <p className="text-xs text-gray-600">{new Date(tx.createdAt).toLocaleString()}</p>
                                    </div>
                                    <p
                                        className={`text-sm font-semibold ${tx.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}
                                    >
                                        {tx.type === 'credit' ? '+' : '-'} ₹{tx.amount.toFixed(2)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-600">No transactions found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WalletModal;