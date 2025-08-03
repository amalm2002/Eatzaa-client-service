import React, { useState } from 'react';
import {
  FiHome,
  FiShoppingBag,
  FiUsers,
  FiClipboard,
  FiSettings,
  FiHelpCircle,
  FiLogOut,
  FiTruck,
  FiDollarSign,
  FiTag,
  FiBarChart2,
  FiMenu,
  FiX,
  FiPackage,
  FiUser,
  FiMapPin,
  FiList,
  FiCreditCard,
  FiUserCheck,
} from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { adminLogout } from '../../../service/redux/slices/adminSlice';
import { SidebarProps } from '../../../interfaces/admin/layout/sidebar.types';

export const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const menuItems = [
    { icon: FiHome, text: 'Dashboard' },
    { icon: FiClipboard, text: 'Orders' },
    { icon: FiPackage, text: 'Deliveries' },
    { icon: FiUsers, text: 'Customers' },
    { icon: FiBarChart2, text: 'Restaurants' },
    { icon: FiUser, text: 'DeliveryBoy' },
    { icon: FiCreditCard, text: 'Subscription-Plan' },
    { icon: FiMapPin, text: 'Zone-Creation' },
    { icon: FiList, text: 'Zone-List' },
    { icon: FiDollarSign, text: 'Payments' },
    { icon: FiTruck, text: 'RidePayment' },
    { icon: FiUserCheck, text: 'PartnerPayment' },
    { icon: FiHelpCircle, text: 'Help Center' },
    { icon: FiLogOut, text: 'Logout' },
  ];

  const handleMenuClick = (text: string) => {
    if (text === 'Logout') {
      dispatch(adminLogout());
      navigate('/admin-login');
    } else {
      setActivePage(text);
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-black text-white rounded-lg shadow-lg hover:bg-gray-800 transition-colors duration-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
      </button>

      {/* Sidebar */}
      <div
        className={`
          fixed h-screen bg-black text-white shadow-2xl transition-all duration-300 z-40 border-r border-gray-800
          ${isOpen ? 'w-64 left-0' : 'w-0 -left-64 lg:left-0 lg:w-64'}
        `}
      >
        {/* Logo Section */}
        <div className="p-6 flex items-center space-x-3 border-b border-gray-800">
          <FiShoppingBag className="h-8 w-8 text-white" />
          <span className="text-xl font-bold text-white">Eatzaa</span>
        </div>

        {/* Navigation Menu */}
        <nav className="mt-4 h-full overflow-y-auto pb-20" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <style >{`
            nav::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          <div className="px-3">
            {menuItems.map((item, index) => (
              <button
                key={index}
                className={`
                  flex items-center space-x-3 w-full px-4 py-3 mb-1 text-left transition-all duration-200 rounded-lg
                  ${activePage === item.text
                    ? 'bg-white text-black font-medium shadow-sm'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }
                `}
                onClick={() => handleMenuClick(item.text)}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                <span className="truncate">{item.text}</span>
              </button>
            ))}
          </div>
        </nav>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-white/5 bg-opacity-50 lg:hidden z-30 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};