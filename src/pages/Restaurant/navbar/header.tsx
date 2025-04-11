import { Bell, User, Menu } from 'lucide-react';

interface HeaderProps {
  isOnline: boolean;
  handleToggleOnline: () => void;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
}

const Header = ({ isOnline, handleToggleOnline, setIsMobileMenuOpen }: HeaderProps) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
      <div className="flex items-center justify-between p-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <button className="md:hidden" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu size={24} className="text-gray-600" />
          </button>
          <h1 className="text-xl font-semibold text-gray-800 md:block hidden">Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">{isOnline ? 'Online' : 'Offline'}</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isOnline}
                onChange={handleToggleOnline}
                className="sr-only"
              />
              <div className={`w-10 h-5 rounded-full transition-colors duration-200
                ${isOnline ? 'bg-[#6589f6]' : 'bg-gray-200'}`}></div>
              <div className={`absolute w-4 h-4 bg-white rounded-full transition-all duration-200
                ${isOnline ? 'left-5' : 'left-1'} top-0.5 shadow-sm`}></div>
            </label>
          </div>
          <button className="relative p-2 hover:bg-gray-100 rounded-full">
            <Bell size={20} className="text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#6589f6] rounded-full flex items-center justify-center">
              <User size={18} className="text-white" />
            </div>
            <span className="hidden md:block text-sm font-medium text-gray-800">Mr. Jo</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;