import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { FiSearch, FiFilter, FiEye, FiLock, FiUnlock, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { createAxios } from '../../../service/axiousServices/adminAxious';
import { useDispatch } from 'react-redux';
import { Header } from '../header/header';
import { toast } from 'sonner';

interface DeliveryBoy {
    id: string;
    name: string;
    mobile: string;
    email: string;
    location: string;
    status: 'active' | 'blocked';
    totalDeliveries: number;
    image?: string;
    isActive: boolean;
}

const DeliveryBoyListPage: React.FC = () => {
    const [deliveryBoys, setDeliveryBoys] = useState<DeliveryBoy[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [sortField, setSortField] = useState<keyof DeliveryBoy>('name');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'blocked'>('all');
    const [itemsPerPage, setItemsPerPage] = useState<number>(10);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(true);

    const dispatch = useDispatch();
    const axiosInstance = createAxios(dispatch);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDeliveryBoys = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get('/getAllDeliveryBoys');
                // console.log('fetchinggg responseeeeee :', response);

                if (response.data.message === 'success') {
                    const mappedDeliveryBoys: DeliveryBoy[] = response.data.fetchDeliveryBoys.map((item: any) => ({
                        id: item._id,
                        name: item.name,
                        mobile: item.mobile || 'N/A',
                        email: item.email || 'N/A',
                        location: item.location.coordinates ? `${item.location.coordinates[0]}, ${item.location.coordinates[1]}` : 'N/A',
                        status: item.status || 'active',
                        isActive: item.isActive,
                        totalDeliveries: item.totalDeliveries || 0,
                        image: item.image || undefined,
                    }));
                    setDeliveryBoys(mappedDeliveryBoys);
                } else {
                    toast.error('Failed to load delivery boys');
                }
            } catch (error: any) {
                toast.error('Internal error');
                console.log('Error on delivery boy list page side', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDeliveryBoys();
    }, []);

    const handleView = (id: string) => {
        navigate(`/admin/delivery-boys/${id}`);
    };

    const handleBlockUnblock = async (id: string, isCurrentlyActive: boolean) => {
        try {
            const updatedIsActive = !isCurrentlyActive;
            const response = await axiosInstance.patch(`/updateDeliveryBoyStatus/${id}`, { isActive: updatedIsActive });
            // console.log('responsssssssssss :', response);

            if (response.data.message === 'success') {
                setDeliveryBoys((prev: any) =>
                    prev.map((boy: any) =>
                        boy.id === id ? { ...boy, isActive: response.data.response.isActive } : boy
                    )
                );
                toast.success(`Delivery boy ${updatedIsActive ? 'unblocked' : 'blocked'} successfully`);
            } else {
                toast.error('Failed to update status');
            }
        } catch (error: any) {
            toast.error('Internal error');
            console.error('Error updating delivery boy status', error);
        }
    };


    const handleSort = (field: keyof DeliveryBoy) => {
        if (field === sortField) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const filteredDeliveryBoys = deliveryBoys
        .filter((boy) =>
            (statusFilter === 'all' || boy.status === statusFilter) &&
            (boy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                boy.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                boy.location.toLowerCase().includes(searchTerm.toLowerCase()))
        )
        .sort((a, b) => {
            if (sortField === 'totalDeliveries') {
                return sortDirection === 'asc'
                    ? a[sortField] - b[sortField]
                    : b[sortField] - a[sortField];
            } else {
                const aValue = String(a[sortField]).toLowerCase();
                const bValue = String(b[sortField]).toLowerCase();
                return sortDirection === 'asc'
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            }
        });

    const totalPages = Math.ceil(filteredDeliveryBoys.length / itemsPerPage);
    const paginatedDeliveryBoys = filteredDeliveryBoys.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 to-gray-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
                    <p className="mt-4 text-gray-700 font-medium">Loading delivery boys...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-gray-100">
                <div className="flex-1 flex flex-col w-full">
                    <Header />
                    <main className="flex-1 p-6 mt-16 max-w-[90rem] mx-auto">
                        {/* Header Section */}
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 animate-in fade-in duration-300">
                                    Delivery Boys
                                </h1>
                                <p className="text-sm md:text-base text-gray-600 mt-2">
                                    Manage your delivery team efficiently
                                </p>
                            </div>
                        </div>

                        {/* Filters Section */}
                        <div className="bg-white rounded-2xl shadow-md p-6 mb-8 border border-gray-100 hover:shadow-lg transition-all duration-300">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="relative">
                                    <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="text"
                                        placeholder="Search by name, email, or location..."
                                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-700"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <div className="relative">
                                    <FiFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                    <select
                                        className="w-full pl-12 pr-8 py-3 borderAst border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none text-gray-700"
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'blocked')}
                                    >
                                        <option value="all">All Status</option>
                                        <option value="active">Active Only</option>
                                        <option value="blocked">Blocked Only</option>
                                    </select>
                                    <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                </div>
                                <div className="flex gap-3">
                                    <button className="flex-1 px-4 py-3 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800 font-medium rounded-lg shadow-sm transform hover:scale-105 transition-all">
                                        Export CSV
                                    </button>
                                    <button className="flex-1 px-4 py-3 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800 font-medium rounded-lg shadow-sm transform hover:scale-105 transition-all">
                                        Print List
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Delivery Boy List */}
                        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                            {/* Desktop View */}
                            <div className="hidden md:block">
                                <table className="w-full">
                                    <thead className="bg-gradient-to-r from-orange-50 to-gray-50 border-b border-gray-200">
                                        <tr>
                                            {[
                                                { field: 'name', label: 'Delivery Boy' },
                                                { field: 'email', label: 'Email' },
                                                { field: 'mobile', label: 'Contact' },
                                                { field: 'location', label: 'Location' },
                                                { field: 'status', label: 'Status' },
                                            ].map((header) => (
                                                <th
                                                    key={header.field}
                                                    className="px-8 py-4 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:text-orange-600 transition-colors"
                                                    onClick={() => handleSort(header.field as keyof DeliveryBoy)}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <span>{header.label}</span>
                                                        {sortField === header.field && (
                                                            sortDirection === 'asc' ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />
                                                        )}
                                                    </div>
                                                </th>
                                            ))}
                                            <th className="px-8 py-4 text-right text-sm font-semibold text-gray-700">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {paginatedDeliveryBoys.map((boy) => (
                                            <tr
                                                key={boy.id}
                                                className="hover:bg-orange-50/50 transition-all duration-200 transform hover:scale-[1.01]"
                                            >
                                                <td className="px-8 py-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-14 w-14 rounded-xl overflow-hidden bg-orange-100 flex items-center justify-center shadow-sm">
                                                            {boy.image ? (
                                                                <img src={boy.image} alt="" className="h-full w-full object-cover" />
                                                            ) : (
                                                                <span className="text-orange-700 text-xl font-bold">{boy.name.charAt(0)}</span>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div className="font-semibold text-gray-900 text-lg">{boy.name}</div>
                                                            <div className="text-sm text-gray-600">
                                                                {boy.totalDeliveries.toLocaleString()} Deliveries
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-4 text-gray-700 font-medium">{boy.email}</td>
                                                <td className="px-8 py-4 text-gray-700">{boy.mobile}</td>
                                                <td className="px-8 py-4 text-gray-700">{boy.location}</td>
                                                <td className="px-8 py-4">
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-sm font-medium shadow-sm ${boy.status === 'active'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-red-100 text-red-800'
                                                            }`}
                                                    >
                                                        {boy.status.charAt(0).toUpperCase() + boy.status.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-4">
                                                    <div className="flex justify-end gap-3">
                                                        <button
                                                            onClick={() => handleView(boy.id)}
                                                            className="p-2 text-orange-600 hover:bg-orange-100 rounded-full shadow-sm transform hover:scale-110 transition-all"
                                                        >
                                                            <FiEye size={20} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleBlockUnblock(boy.id, boy.isActive)}
                                                            className={`p-2 ${boy.isActive ? 'text-red-600 hover:bg-red-100' : 'text-green-600 hover:bg-green-100'} rounded-full shadow-sm transform hover:scale-110 transition-all`}
                                                        >
                                                            {boy.isActive ? <FiLock size={20} /> : <FiUnlock size={20} />}
                                                        </button>

                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile View */}
                            <div className="md:hidden divide-y divide-gray-100">
                                {paginatedDeliveryBoys.map((boy) => (
                                    <div
                                        key={boy.id}
                                        className="p-5 bg-white rounded-xl shadow-md mb-4 transform hover:scale-[1.02] hover:shadow-lg transition-all duration-300"
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-xl overflow-hidden bg-orange-100 flex items-center justify-center shadow-sm">
                                                    {boy.image ? (
                                                        <img src={boy.image} alt="" className="h-full w-full object-cover" />
                                                    ) : (
                                                        <span className="text-orange-700 text-lg font-bold">{boy.name.charAt(0)}</span>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-gray-900 text-lg">{boy.name}</div>
                                                    <div className="text-xs text-gray-600">{boy.totalDeliveries} Deliveries</div>
                                                </div>
                                            </div>
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-medium shadow-sm ${boy.status === 'active'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                    }`}
                                            >
                                                {boy.status.charAt(0).toUpperCase() + boy.status.slice(1)}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3 text-sm text-gray-700 mb-4">
                                            <div>
                                                <div className="text-gray-500 text-xs font-medium">Email</div>
                                                <div className="font-medium">{boy.email}</div>
                                            </div>
                                            <div>
                                                <div className="text-gray-500 text-xs font-medium">Contact</div>
                                                <div className="font-medium">{boy.mobile}</div>
                                            </div>
                                            <div className="col-span-2">
                                                <div className="text-gray-500 text-xs font-medium">Location</div>
                                                <div className="font-medium">{boy.location}</div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleView(boy.id)}
                                                className="flex-1 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg shadow-md transform hover:scale-105 transition-all"
                                            >
                                                View
                                            </button>
                                            {/* <button
                                                onClick={() => handleBlockUnblock(boy.id, boy.status)}
                                                className={`p-2 ${boy.status === 'active' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white rounded-lg shadow-md transform hover:scale-105 transition-all`}
                                            >
                                                {boy.status === 'active' ? <FiLock size={16} /> : <FiUnlock size={16} />}
                                            </button> */}
                                            <button
                                                onClick={() => handleBlockUnblock(boy.id, boy.isActive)}
                                                className={`p-2 ${boy.isActive ? 'text-red-600 hover:bg-red-100' : 'text-green-600 hover:bg-green-100'} rounded-full shadow-sm transform hover:scale-110 transition-all`}
                                            >
                                                {boy.isActive ? <FiLock size={20} /> : <FiUnlock size={20} />}
                                            </button>

                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            <div className="p-4 border-t border-gray-100 bg-gradient-to-r from-orange-50 to-gray-50">
                                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                    <select
                                        className="w-full md:w-auto px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-700 shadow-sm"
                                        value={itemsPerPage}
                                        onChange={(e) => setItemsPerPage(Number(e.target.value))}
                                    >
                                        <option value={5}>5 per page</option>
                                        <option value={10}>10 per page</option>
                                        <option value={20}>20 per page</option>
                                    </select>
                                    <div className="flex items-center gap-3">
                                        <button
                                            disabled={currentPage === 1}
                                            onClick={() => setCurrentPage((prev) => prev - 1)}
                                            className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800 rounded-lg shadow-md disabled:opacity-50 transform hover:scale-105 transition-all"
                                        >
                                            Previous
                                        </button>
                                        <span className="text-sm text-gray-700 font-medium">
                                            Page {currentPage} of {totalPages}
                                        </span>
                                        <button
                                            disabled={currentPage === totalPages}
                                            onClick={() => setCurrentPage((prev) => prev + 1)}
                                            className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800 rounded-lg shadow-md disabled:opacity-50 transform hover:scale-105 transition-all"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
};

export default DeliveryBoyListPage;