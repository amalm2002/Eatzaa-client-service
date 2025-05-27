import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiTrash2 } from 'react-icons/fi';
import { createAxios } from '../../../service/axiousServices/adminAxious';
import { useDispatch } from 'react-redux';
import { Header } from '../header/header';
import { toast } from 'sonner';

interface Zone {
    id: string;
    name: string;
    coordinates: [number, number][];
}

const ZoneListPage: React.FC = () => {
    const [zones, setZones] = useState<Zone[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [itemsPerPage, setItemsPerPage] = useState<number>(10);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(true);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [zoneToDelete, setZoneToDelete] = useState<string | null>(null);

    const dispatch = useDispatch();
    const axiosInstance = createAxios(dispatch);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchZones = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get('/fetch-zone');
                if (response.data.message === 'Fetch data success') {
                    const mappedZones: Zone[] = response.data.fetchZones.map((item: any) => ({
                        id: item._id,
                        name: item.name,
                        coordinates: item.coordinates || [],
                    }));
                    setZones(mappedZones);
                } else {
                    toast.error('Failed to load zones');
                }
            } catch (error: any) {
                toast.error('Internal error');
                console.error('Error fetching zones', error);
            } finally {
                setLoading(false);
            }
        };
        fetchZones();
    }, []);

    const openDeleteModal = (id: string) => {
        setZoneToDelete(id);
        setIsModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsModalOpen(false);
        setZoneToDelete(null);
    };

    const handleDelete = async () => {
        if (!zoneToDelete) return;
        try {
            const response = await axiosInstance.delete(`/deleteZone/${zoneToDelete}`);
            if (response.data.message === 'success') {
                setZones((prev) => prev.filter((zone) => zone.id !== zoneToDelete));
                toast.success('Zone deleted successfully');
            } else {
                toast.error('Failed to delete zone');
            }
        } catch (error: any) {
            toast.error('Internal error');
            console.error('Error deleting zone', error);
        } finally {
            closeDeleteModal();
        }
    };

    const filteredZones = zones.filter((zone) =>
        zone.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredZones.length / itemsPerPage);
    const paginatedZones = filteredZones.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 to-gray-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
                    <p className="mt-4 text-gray-700 font-medium">Loading zones...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-gray-100">
            <div className="flex-1 flex flex-col w-full">
                <Header />
                <main className="flex-1 p-6 mt-16 max-w-[90rem] mx-auto">
                    {/* Header Section */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 animate-in fade-in duration-300">
                                Zones
                            </h1>
                            <p className="text-sm md:text-base text-gray-600 mt-2">
                                Manage your delivery zones efficiently
                            </p>
                        </div>
                    </div>

                    {/* Search Section */}
                    <div className="bg-white rounded-2xl shadow-md p-6 mb-8 border border-gray-100 hover:shadow-lg transition-all duration-300">
                        <div className="relative">
                            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search zones by name..."
                                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-700"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Zone List */}
                    <div className="space-y-4">
                        {paginatedZones.map((zone) => (
                            <div
                                key={zone.id}
                                className="p-5 bg-white rounded-xl shadow-md transform hover:scale-[1.02] hover:shadow-lg transition-all duration-300 border border-gray-100"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="font-semibold text-gray-900 text-lg">{zone.name}</div>
                                        <div className="text-sm text-gray-600">
                                            {zone.coordinates.length} Coordinates
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => openDeleteModal(zone.id)}
                                        className="p-2 text-red-600 hover:bg-red-100 rounded-full shadow-sm transform hover:scale-110 transition-all"
                                    >
                                        <FiTrash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {paginatedZones.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                No zones found
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    <div className="p-4 mt-6 bg-white rounded-2xl shadow-md border border-gray-100">
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

                    {/* Delete Confirmation Modal */}
                    {isModalOpen && (
                        <div className="fixed inset-0 bg-white/10 bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
                            <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4 border border-gray-100 animate-in zoom-in-95 duration-300">
                                {/* Header with icon */}
                                <div className="flex items-center mb-4">
                                    <div className="bg-red-100 rounded-full p-2 mr-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800">Confirm Deletion</h3>
                                </div>

                                {/* Content with separator */}
                                <div className="border-t border-b border-gray-100 py-4 mb-4">
                                    <p className="text-gray-600">
                                        Are you sure you want to delete this zone? This action cannot be undone.
                                    </p>
                                </div>

                                {/* Action buttons with improved styling */}
                                <div className="flex justify-end gap-3">
                                    <button
                                        onClick={closeDeleteModal}
                                        className="px-5 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg shadow-sm transform hover:scale-102 transition-all duration-200 font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="px-5 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg shadow-md transform hover:scale-102 transition-all duration-200 relative overflow-hidden group font-medium"
                                    >
                                        <span className="relative z-10">Delete Zone</span>
                                        <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-200"></span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default ZoneListPage;