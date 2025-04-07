import React from 'react';
import { FiSearch, FiBell } from 'react-icons/fi';

export const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-64 right-0 bg-white p-4 shadow-md flex justify-between items-center z-10 md:left-0">
      <h1 className="text-xl font-semibold text-gray-800 hidden md:block">Welcome, Admin</h1>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <input
            type="search"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 w-64 bg-gray-50"
          />
          <FiSearch className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <button className="p-2 rounded-full hover:bg-gray-100 relative">
          <FiBell className="w-6 h-6 text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold shadow">
            A
          </div>
          <span className="text-gray-800 font-medium hidden md:block">Admin</span>
        </div>
      </div>
    </header>
  );
};