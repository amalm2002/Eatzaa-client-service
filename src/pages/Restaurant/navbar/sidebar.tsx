import { Link } from 'react-router-dom';
import {
    LayoutGrid,
    BarChart2,
    ShoppingCart,
    MessageSquare,
    Settings,
    Utensils,
    Users,
    X,
    LogOut
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { restaurantLogout } from '../../../service/redux/slices/restaurantSlice';

interface SidebarProps {
    activeMenu: string;
    setActiveMenu: (menu: string) => void;
    isMobileMenuOpen: boolean;
    setIsMobileMenuOpen: (isOpen: boolean) => void;
    isOnline:boolean
}

const Sidebar = ({ activeMenu, setActiveMenu, isMobileMenuOpen, setIsMobileMenuOpen, isOnline }: SidebarProps) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const menuItems = [
        { icon: <LayoutGrid size={20} />, label: 'Dashboard' },
        { icon: <BarChart2 size={20} />, label: 'Analytics' },
        { icon: <ShoppingCart size={20} />, label: 'Orders' },
        { icon: <Utensils size={20} />, label: 'Menu Items' },
        { icon: <Users size={20} />, label: 'Customers' },
        { icon: <MessageSquare size={20} />, label: 'Messages' },
        { icon: <Settings size={20} />, label: 'Settings' },
    ];

    const handleLogout = () => {
        if (isOnline) {
            Swal.fire({
                title: 'Turn Off Online Status',
                text: 'Please turn off your online status before logging out.',
                icon: 'warning',
                confirmButtonText: 'OK',
                confirmButtonColor: '#f39c12',
            });
        } else {
            Swal.fire({
                title: 'Logging Out',
                text: 'You have been logged out successfully.',
                icon: 'success',
                confirmButtonText: 'OK',
                confirmButtonColor: '#28a745',
            }).then(() => {
                dispatch(restaurantLogout());
                localStorage.removeItem('restaurantToken');
                localStorage.removeItem('restaurantRefreshToken');
                navigate('/restaurant-login');
            });
        }
    };

    return (
        <aside
            className={`fixed inset-y-0 left-0 w-64 bg-white shadow-md transform md:translate-x-0 transition-transform duration-300 ease-in-out z-50
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
            <div className="p-4 flex justify-between items-center border-b border-gray-100">
                <Link to="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#6589f6] rounded-full flex items-center justify-center">
                        <Utensils className="text-white" size={20} />
                    </div>
                    <span className="text-lg font-semibold text-gray-800">Dainty Food</span>
                </Link>
                <button className="md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
                    <X size={24} className="text-gray-600" />
                </button>
            </div>

            <nav className="p-4 space-y-2">
                {menuItems.map((item) => (
                    <button
                        key={item.label}
                        onClick={() => {
                            setActiveMenu(item.label);
                            setIsMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200
              ${activeMenu === item.label
                                ? 'bg-[#6589f6] text-white'
                                : 'text-gray-600 hover:bg-gray-100 hover:text-[#6589f6]'}`}
                    >
                        {item.icon}
                        {item.label}
                    </button>
                ))}
            </nav>

            <div className="absolute bottom-4 left-4 right-4">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-red-500 rounded-lg transition-colors duration-200"
                >
                    <LogOut size={20} />
                    Logout
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;