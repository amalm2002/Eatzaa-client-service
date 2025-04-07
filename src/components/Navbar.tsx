import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ShoppingBag, User } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { userLogout } from "../service/redux/slices/userAuthSlice";
import { RootState } from "../service/redux/store";


const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useDispatch();

    const { user, isLogin } = useSelector((state: RootState) => state.userAuth);
   
    const handleLogout = () => {
        dispatch(userLogout());
    };

    return (
        <nav className="bg-gradient-to-r from-gray-200 to-gray-300 shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="text-2xl font-bold text-gray-800">Eatzaa</div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex space-x-8 text-gray-900">
                        <Link to="/" className="hover:text-gray-700">Home</Link>
                        <Link to="/restaurants" className="hover:text-gray-700">Restaurants</Link>
                        <Link to="/orders" className="hover:text-gray-700">Orders</Link>
                        <Link to="/about" className="hover:text-gray-700">About</Link>
                    </div>

                    {/* User Authentication & Icons */}
                    <div className="hidden md:flex items-center space-x-4">
                        <ShoppingBag className="w-6 h-6 text-gray-700 cursor-pointer hover:text-gray-900" />
                        {isLogin ? (
                            <div className="relative group">
                                <User className="w-6 h-6 text-gray-700 cursor-pointer hover:text-gray-900" />
                                <div className="absolute right-0 mt-2 w-40 bg-white z-50 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <p className="px-4 py-2 text-gray-800">{user}</p>
                                    <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-200">Profile</Link>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <Link to="/login" className="border border-gray-700 text-gray-700 px-4 py-1.5 rounded-md hover:bg-gray-100 transition">Login</Link>
                                <Link to="/signup" className="bg-orange-300 text-gray-900 px-4 py-1.5 rounded-md hover:bg-orange-400 transition">Sign Up</Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="md:hidden space-y-2 pt-2 ">
                        <Link to="/" className="block py-2 px-4 text-gray-900 hover:bg-gray-200">Home</Link>
                        <Link to="/restaurants" className="block py-2 px-4 text-gray-900 hover:bg-gray-200">Restaurants</Link>
                        <Link to="/orders" className="block py-2 px-4 text-gray-900 hover:bg-gray-200">Orders</Link>
                        <Link to="/about" className="block py-2 px-4 text-gray-900 hover:bg-gray-200">About</Link>

                        <div className="flex space-x-4 px-4">
                            <ShoppingBag className="w-6 h-6 text-gray-700 hover:text-gray-900" />
                            <User className="w-6 h-6 text-gray-700 hover:text-gray-900" />
                        </div>

                        <div className="flex flex-colspace-y-2 px-4 absolute top-[50%] z-40">
                            {isLogin ? (
                                <>
                                    <p className="text-center text-gray-800">{user}</p>
                                    
                                    <Link to="/profile" className="text-center border border-gray-700 text-gray-700 px-4 py-1.5 rounded-md hover:bg-gray-100 transition">Profile</Link>
                                    <button
                                        onClick={handleLogout}
                                        className="text-center border border-red-600 text-red-600 px-4 py-1.5 rounded-md hover:bg-red-100 transition"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="border border-gray-700 text-gray-700 px-4 py-1.5 rounded-md hover:bg-gray-100 transition text-center">Login</Link>
                                    <Link to="/signup" className="bg-orange-300 text-gray-900 px-4 py-1.5 rounded-md hover:bg-orange-400 transition text-center">Sign Up</Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
