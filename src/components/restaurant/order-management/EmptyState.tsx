import React from 'react';
import { FiPackage } from 'react-icons/fi';

const EmptyState: React.FC = () => {
    return (
        <div className="text-center py-20">
            <div className="w-24 h-24 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <FiPackage size={40} className="text-indigo-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Orders Found</h3>
            <p className="text-gray-600 text-sm max-w-md mx-auto">
                It looks like there are no orders matching your criteria. Try adjusting your search or filters.
            </p>
        </div>
    );
};

export default EmptyState;