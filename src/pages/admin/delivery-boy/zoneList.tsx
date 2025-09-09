import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import ZoneListHeader from '../../../components/admin/delivery-boy/zones/ZoneListHeader';
// import ZoneListSearch from '../../../components/admin/delivery-boy/zones/ZoneListSearch';
import ZoneList from '../../../components/admin/delivery-boy/zones/ZoneList';
import ZoneListPagination from '../../../components/admin/delivery-boy/zones/ZoneListPagination';
import ZoneListDeleteModal from '../../../components/admin/delivery-boy/zones/ZoneListDeleteModal';
import { Zone } from '../../../interfaces/admin/delivery-boys/zone.types';
import { adminApi } from '../../../api/endpoints/adminApi';

const ZoneListPage: React.FC = () => {
    const [zones, setZones] = useState<Zone[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [itemsPerPage, setItemsPerPage] = useState<number>(10);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(true);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [zoneToDelete, setZoneToDelete] = useState<string | null>(null);

    const dispatch = useDispatch();

    useEffect(() => {
        const fetchZones = async () => {
            try {
                setLoading(true);
                const data = await adminApi.fetchZones(dispatch);
                const mappedZones: Zone[] = data.fetchZones.map((item: any) => ({
                    id: item._id,
                    name: item.name,
                    coordinates: item.coordinates || [],
                }));
                setZones(mappedZones);
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
            await adminApi.deleteZone(dispatch, zoneToDelete);
            setZones((prev) => prev.filter((zone) => zone.id !== zoneToDelete));
            toast.success('Zone deleted successfully');
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
                <main className="flex-1 p-6 mt-16 max-w-[90rem] mx-auto">
                    <ZoneListHeader />
                    {/* <ZoneListSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} /> */}
                    <ZoneList paginatedZones={paginatedZones} openDeleteModal={openDeleteModal} />
                    <ZoneListPagination
                        itemsPerPage={itemsPerPage}
                        setItemsPerPage={setItemsPerPage}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        totalPages={totalPages}
                    />
                    <ZoneListDeleteModal
                        isModalOpen={isModalOpen}
                        closeDeleteModal={closeDeleteModal}
                        handleDelete={handleDelete}
                    />
                </main>
            </div>
        </div>
    );
};

export default ZoneListPage;