import { Menu, LogOut, Package, DollarSign, Clock, MapPin } from 'lucide-react';
import { SidebarProps } from '../../interfaces/delivery-boy/layout/sidebar.types';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ sidebarOpen, toggleSidebar, partnerData, handleLogout }: SidebarProps) => {
    const navigate = useNavigate();

    const handleNavigation = (path?: string) => {
        if (path) {
            navigate(path);
        }
    }
    return (
        <div className={`bg-white shadow-lg transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'} flex flex-col border-r border-orange-100`}>
            <div className="p-4 flex items-center justify-between border-b border-orange-100">
                <div className="flex items-center">
                    {sidebarOpen ? (
                        <h1 className="text-xl font-bold text-orange-600">Eatzaa</h1>
                    ) : (
                        <span className="text-xl font-bold text-orange-600">EZ</span>
                    )}
                </div>
                <button onClick={toggleSidebar} className="text-orange-600 hover:text-orange-700">
                    <Menu size={20} />
                </button>
            </div>

            <div className="p-4 border-b border-orange-100">
                <div className="flex items-center">
                    <div className="bg-orange-100 text-orange-600 rounded-full w-10 h-10 flex items-center justify-center text-lg font-medium">
                        {partnerData.name.charAt(0)}
                    </div>
                    {sidebarOpen && (
                        <div className="ml-3 overflow-hidden">
                            <p className="font-medium text-gray-2025 truncate">{partnerData.name}</p>
                            <div className="flex items-center text-sm text-orange-600">
                                <span className="text-orange-600">★</span>
                                <span className="ml-1">{partnerData.rating}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <nav className="flex-1 overflow-y-auto py-4">
                <ul>
                    {[
                        { icon: <Package size={20} />, label: 'Dashboard', active: true ,path:'/deliveryBoy-Home'},
                        { icon: <DollarSign size={20} />, label: 'Earnings',  path: '/deliveryBoy-Earnings' },
                        { icon: <Clock size={20} />, label: 'My Activity' },
                        { icon: <MapPin size={20} />, label: 'Order History' },
                    ].map((item, index) => (
                        <li key={index}>
                            <button
                                onClick={() => handleNavigation(item.path)}
                                className={`flex items-center py-3 px-4 w-full text-left ${item.active ? 'bg-orange-100 text-orange-600' : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'}`}
                            >
                                <span className="flex-shrink-0">{item.icon}</span>
                                {sidebarOpen && <span className="ml-3">{item.label}</span>}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="p-4 border-t border-orange-100">
                <button
                    onClick={handleLogout}
                    className={`flex items-center text-gray-600 hover:bg-orange-50 hover:text-orange-600 rounded-lg py-2 ${sidebarOpen ? 'px-3' : 'justify-center px-0'}`}
                >
                    <LogOut size={20} />
                    {sidebarOpen && <span className="ml-2">Log Out</span>}
                </button>
            </div>
        </div>
    );
};

export default Sidebar;