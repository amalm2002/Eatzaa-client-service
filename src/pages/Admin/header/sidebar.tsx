import React, { useState } from 'react';
import { FiHome, FiShoppingBag, FiUsers, FiClipboard, FiSettings, FiHelpCircle, FiLogOut, FiTruck, FiDollarSign, FiTag, FiBarChart2, FiMenu, FiX } from 'react-icons/fi';

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage }) => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { icon: FiHome, text: 'Dashboard' },
    { icon: FiClipboard, text: 'Orders' },
    { icon: FiTruck, text: 'Deliveries' },
    { icon: FiUsers, text: 'Customers' },
    { icon: FiBarChart2, text: 'Restaurants' },
    { icon: FiDollarSign, text: 'Payments' },
    { icon: FiTag, text: 'Promotions' },
    { icon: FiSettings, text: 'Settings' },
    { icon: FiHelpCircle, text: 'Help Center' },
    { icon: FiLogOut, text: 'Logout' },
  ];

  return (
    <>
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-orange-500 text-white rounded-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
      </button>
      <div className={`
        fixed h-screen bg-gradient-to-b from-orange-500 to-orange-400 text-white shadow-lg transition-all duration-300 z-40
        ${isOpen ? 'w-64 left-0' : 'w-0 -left-64 md:left-0 md:w-64'}
      `}>
        <div className="p-6 flex items-center space-x-3">
          <FiShoppingBag className="h-8 w-8 text-orange-100" />
          <span className="text-xl font-bold">Eatzaa</span>
        </div>
        <nav className="mt-4">
          {menuItems.map((item, index) => (
            <button
              key={index}
              className={`flex items-center space-x-3 w-full px-6 py-3 text-left transition-all duration-200 ${
                activePage === item.text 
                  ? 'bg-orange-400 text-white border-l-4 border-orange-200' 
                  : 'text-orange-100 hover:bg-orange-400 hover:text-white'
              }`}
              onClick={() => {
                setActivePage(item.text);
                setIsOpen(false);
              }}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.text}</span>
            </button>
          ))}
        </nav>
      </div>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-white/10 bg-opacity-50 md:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};