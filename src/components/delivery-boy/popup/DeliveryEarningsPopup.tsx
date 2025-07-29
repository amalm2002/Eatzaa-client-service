import React, { useState, useEffect } from 'react';
import { X, Trophy, Sparkles, CheckCircle, Zap } from 'lucide-react';
import { EarningsPopupProps } from '../../../interfaces/delivery-boy/popup/earnings-popup-msg.types';



export const EarningsPopup: React.FC<EarningsPopupProps> = ({
    isOpen = true,
    onClose = () => { },
    earnings = 125.50,
    orderDetails = {
        orderId: '#FD12345',
        customerName: 'Sarah Johnson',
        deliveryTime: '18 mins',
    },
}) => {
    const [showConfetti, setShowConfetti] = useState(false);
    const [animateEarnings, setAnimateEarnings] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => setShowConfetti(true), 200);
            setTimeout(() => setAnimateEarnings(true), 500);
            setTimeout(() => setShowSuccess(true), 800);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const celebrationSparkles = Array.from({ length: 40 }, (_, i) => {
        const angle = (i * 360) / 40;
        const distance = Math.random() * 200 + 50;
        const x = Math.cos((angle * Math.PI) / 180) * distance;
        const y = Math.sin((angle * Math.PI) / 180) * distance;

        return (
            <div
                key={i}
                className={`absolute text-xl ${i % 6 === 0
                        ? 'text-orange-400'
                        : i % 6 === 1
                            ? 'text-yellow-400'
                            : i % 6 === 2
                                ? 'text-orange-300'
                                : i % 6 === 3
                                    ? 'text-yellow-300'
                                    : i % 6 === 4
                                        ? 'text-orange-500'
                                        : 'text-yellow-500'
                    } ${showConfetti ? 'animate-ping' : ''}`}
                style={{
                    left: '50%',
                    top: '50%',
                    transform: showConfetti ? `translate(${x}px, ${y}px)` : 'translate(-50%, -50%)',
                    transition: `all ${2 + Math.random()}s ease-out`,
                    animationDelay: `${Math.random() * 1}s`,
                    opacity: showConfetti ? 0.8 : 0,
                }}
            >
                ✨
            </div>
        );
    });

    // Cheers emojis floating around
    const cheersEmojis = ['🎉', '🥳', '🎊', '🌟', '💫', '⭐'].map((emoji, i) => (
        <div
            key={i}
            className={`absolute text-2xl animate-bounce ${showConfetti ? 'opacity-100' : 'opacity-0'}`}
            style={{
                left: `${Math.random() * 80 + 10}%`,
                top: `${Math.random() * 80 + 10}%`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: `${2 + Math.random()}s`,
                transition: 'opacity 1s ease-in-out',
            }}
        >
            {emoji}
        </div>
    ));

    return (
        <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50 p-4">
            <div className="relative bg-white/10 rounded-2xl shadow-2xl max-w-sm w-full mx-4 overflow-hidden transform transition-all duration-500 scale-100 animate-pulse">
                {/* Celebration Background Elements */}
                {showConfetti && (
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        {celebrationSparkles}
                        {cheersEmojis}
                    </div>
                )}

                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 z-20 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-1 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-110"
                >
                    <X className="w-4 h-4 text-gray-600" />
                </button>

                {/* Header with Gradient and Animation */}
                <div className="bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 text-white text-center py-6 px-4 relative overflow-hidden">
                    <div className="absolute inset-0">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-10 transform -skew-y-2 animate-pulse"></div>
                        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-yellow-300 to-transparent opacity-20 transform skew-y-1"></div>
                    </div>

                    <div className="relative z-10">
                        <div
                            className={`inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mb-3 transition-all duration-1000 ${showSuccess ? 'animate-bounce' : ''
                                }`}
                        >
                            <Trophy className="w-8 h-8 text-yellow-300 animate-pulse" />
                        </div>

                        <h2 className="text-2xl font-bold mb-1 animate-pulse">🎉 Delivery Completed!</h2>
                        <p className="text-orange-100 text-xs flex items-center justify-center space-x-1">
                            <CheckCircle className="w-3 h-3" />
                            <span>Great job!</span>
                        </p>
                    </div>
                </div>

                {/* Main Content */}
                <div className="p-4 space-y-4">
                    <div className="text-center relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl transform rotate-1"></div>
                        <div className="relative bg-white rounded-xl p-4 shadow-md border border-orange-100">
                            <Sparkles className="w-5 h-5 text-orange-500 mx-auto mb-1 animate-spin" />
                            <p className="text-gray-600 text-xs mb-2">You Earned</p>
                            <div
                                className={`text-4xl font-bold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent transition-all duration-1000 ${animateEarnings ? 'scale-110 animate-pulse' : 'scale-100'
                                    }`}
                            >
                                ₹{earnings.toFixed(2)}
                            </div>
                            <div className="flex items-center justify-center mt-2 space-x-1">
                                <Zap className="w-4 h-4 text-yellow-500 animate-pulse" />
                                <span className="text-xs text-gray-600 font-medium">Added to wallet</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-orange-50 rounded-xl p-4 space-y-2 border border-orange-200">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 font-medium">Order ID</span>
                            <span className="font-bold text-orange-600">{orderDetails.orderId}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 font-medium">Customer</span>
                            <span className="font-bold text-gray-800">{orderDetails.customerName}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 font-medium">Delivery Time</span>
                            <span className="font-bold text-green-600">{orderDetails.deliveryTime}</span>
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-2">
                        <button
                            onClick={onClose}
                            className="w-full bg-gradient-to-r from-orange-500 via-orange-600 to-yellow-500 text-white font-bold py-3 rounded-2xl hover:from-orange-600 hover:to-yellow-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-orange-200 text-base relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 transform -skew-x-12 animate-pulse"></div>
                            <span className="relative z-10 flex items-center justify-center space-x-1">
                                <span>Continue Delivering</span>
                                <Zap className="w-4 h-4 animate-pulse" />
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};