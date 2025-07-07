import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import RestaurantListHeader from '../../../components/admin/restaurant/list/RestaurantListHeader';
import RestaurantListFilters from '../../../components/admin/restaurant/list/RestaurantListFilters';
import RestaurantListTable from '../../../components/admin/restaurant/list/RestaurantListTable';
import RestaurantListPagination from '../../../components/admin/restaurant/list/RestaurantListPagination';
import { Restaurant } from '../../../interfaces/admin/restaurants/restaurant.types';
import { adminApi } from '../../../api/endpoints/adminApi';
import { toast } from 'react-toastify';

const RestaurantListPage: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortField, setSortField] = useState<keyof Restaurant>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const data = await adminApi.fetchRestaurants(dispatch);
        const mappedRestaurants: Restaurant[] = data.response.map((item: any) => ({
          id: item._id,
          name: item.restaurantName,
          owner: item.owner || 'Unknown',
          mobile: item.mobile || 'N/A',
          location: item.location.coordinates ? `${item.location.coordinates[0]}, ${item.location.coordinates[1]}` : 'N/A',
          status: item.status || 'active',
          rating: item.rating || 0,
          totalOrders: item.totalOrders || 0,
          image: item.image || undefined,
          isRejected: item.rejectionReason ? true : false,
        }));
        setRestaurants(mappedRestaurants);
      } catch (error: any) {
        toast.error('Internal error');
        console.log('Error on restaurant list page side', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  const handleView = (id: string) => {
    navigate(`/admin/restaurants/${id}`);
  };

  const handleSort = (field: keyof Restaurant) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredRestaurants = restaurants
    .filter(
      (restaurant) =>
        (statusFilter === 'all' || restaurant.status === statusFilter) &&
        (restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          restaurant.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
          restaurant.location.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortField === 'rating' || sortField === 'totalOrders') {
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

  const paginatedRestaurants = filteredRestaurants.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-700 font-medium">Loading restaurants...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-gray-100">
      <div className="flex-1 flex flex-col w-full">
        <RestaurantListHeader />
        <main className="flex-1 p-6 mt-16 max-w-[90rem] mx-auto">
          <RestaurantListFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />
          <RestaurantListTable
            restaurants={paginatedRestaurants}
            sortField={sortField}
            sortDirection={sortDirection}
            handleSort={handleSort}
            handleView={handleView}
          />
          <RestaurantListPagination
            filteredRestaurants={filteredRestaurants}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </main>
      </div>
    </div>
  );
};

export default RestaurantListPage;