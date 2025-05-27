
import React from 'react';

// Types
type TabType = 'profile' | 'orders' | 'favorites' | 'addresses';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  name: string;
  email: string;
  tealColor: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isSidebarOpen,
  setIsSidebarOpen,
  name,
  email,
  tealColor,
}) => {
  return (
    <aside
      className={`lg:w-64 bg-white border-r border-gray-200 lg:block ${
        isSidebarOpen ? 'block' : 'hidden'
      } transition-all duration-300`}
    >
      <div className="p-4">
        <div className="flex items-center mb-6">
          <div className="h-12 w-12 bg-teal-100 rounded-full flex items-center justify-center">
            <span className="text-xl font-bold" style={{ color: tealColor }}>
              {name.charAt(0)}
            </span>
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
            <p className="text-sm text-gray-500">{email}</p>
          </div>
        </div>
        <nav className="space-y-2">
          {['profile', 'orders', 'favorites', 'addresses'].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab as TabType);
                setIsSidebarOpen(false);
              }}
              className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                activeTab === tab ? 'bg-teal-50 text-teal-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
              style={activeTab === tab ? { color: tealColor } : {}}
            >
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {tab === 'profile' && (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  )}
                  {tab === 'orders' && (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  )}
                  {tab === 'favorites' && (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  )}
                  {tab === 'addresses' && (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                  )}
                </svg>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </div>
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;