import { Calendar, Bell } from 'lucide-react';
import { HeaderProps } from '../../interfaces/delivery-boy/layout/header.types';

const Header = ({ currentTime, partnerData }: HeaderProps) => {
    return (
        <header className="bg-white shadow-sm z-10">
            <div className="flex items-center justify-between px-6 py-3">
                <div className="flex items-center">
                    <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
                    <span className="text-sm text-gray-500 ml-4">
                        <Calendar size={16} className="inline mr-1" />
                        {currentTime.toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </span>
                </div>

                <div className="flex items-center">
                    <div className="relative mr-4">
                        <Bell size={20} className="text-gray-500 hover:text-orange-600 cursor-pointer" />
                        <span className="absolute top-0 right-0 bg-orange-500 rounded-full w-2 h-2"></span>
                    </div>
                    <div className="flex items-center">
                        <div className="bg-orange-100 text-orange-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium">
                            {partnerData.name.charAt(0)}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;