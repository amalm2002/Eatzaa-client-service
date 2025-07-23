import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import DeliveryBoyListHeader from '../../../components/admin/delivery-boy/list/DeliveryBoyListHeader';
// import DeliveryBoyListFilters from '../../../components/admin/delivery-boy/list/DeliveryBoyListFilters';
import DeliveryBoyListTable from '../../../components/admin/delivery-boy/list/DeliveryBoyListTable';
import DeliveryBoyListCard from '../../../components/admin/delivery-boy/list/DeliveryBoyListCard';
import DeliveryBoyListPagination from '../../../components/admin/delivery-boy/list/DeliveryBoyListPagination';
import { DeliveryBoy } from '../../../interfaces/admin/delivery-boys/delivery-boy.types';
import { adminApi } from '../../../api/endpoints/adminApi';

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
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDeliveryBoys = async () => {
            try {
                setLoading(true);
                const data = await adminApi.fetchDeliveryBoys(dispatch);
                const mappedDeliveryBoys: DeliveryBoy[] = data.fetchDeliveryBoys.map((item: any) => ({
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
            const response = await adminApi.updateDeliveryBoyStatus(dispatch, id, updatedIsActive);
            setDeliveryBoys((prev: any) =>
                prev.map((boy: any) =>
                    boy.id === id ? { ...boy, isActive: response.response.isActive } : boy
                )
            );
            toast.success(`Delivery boy ${updatedIsActive ? 'unblocked' : 'blocked'} successfully`);
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
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-gray-100">
            <div className="flex-1 flex flex-col w-full">
                <DeliveryBoyListHeader />
                <main className="flex-1 p-6 mt-16 max-w-[90rem] mx-auto">
                    {/* <DeliveryBoyListFilters searchTerm={searchTerm} setSearchTerm={setSearchTerm} statusFilter={statusFilter} setStatusFilter={setStatusFilter} /> */}
                    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                        <DeliveryBoyListTable
                            paginatedDeliveryBoys={paginatedDeliveryBoys}
                            handleView={handleView}
                            handleBlockUnblock={handleBlockUnblock}
                            sortField={sortField}
                            sortDirection={sortDirection}
                            handleSort={handleSort}
                        />
                        <div className="md:hidden divide-y divide-gray-100">
                            {paginatedDeliveryBoys.map((boy) => (
                                <DeliveryBoyListCard key={boy.id} boy={boy} handleView={handleView} handleBlockUnblock={handleBlockUnblock} />
                            ))}
                        </div>
                        <DeliveryBoyListPagination
                            itemsPerPage={itemsPerPage}
                            setItemsPerPage={setItemsPerPage}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            totalPages={totalPages}
                        />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DeliveryBoyListPage;