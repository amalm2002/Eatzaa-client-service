import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useDispatch, useSelector } from 'react-redux';
import Sidebar from '../navbar/sidebar';
import Header from '../navbar/header';
import useRestaurantStatus from '../../../hooks/useRestaurantStatus';
import FilterBar from '../../../components/restaurant/menu-management/FilterBar';
import MenuTable from '../../../components/restaurant/menu-management/MenuTable';
import MenuCard from '../../../components/restaurant/menu-management/MenuCard';
import PaginationControls from '../../../components/ui/PaginationControl';
import LoadingSpinner from '../../../components/restaurant/menu-management/LoadingSpinner';
import ConfirmationModal from '../../../components/restaurant/menu-management/ConfirmationModal';
import MobileMenuOverlay from '../../../components/restaurant/menu-management/MobileMenuOverlay';
import { MenuItem } from '../../../interfaces/restaurant/menu/menu.types';
import { restaurantApi } from '../../../api/endpoints/restaurantApi';

const MySwal = withReactContent(Swal);

const MenuList: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('Menu Items');
  const { isOnline, handleToggleOnline } = useRestaurantStatus();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<keyof MenuItem>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [showConfirmation, setShowConfirmation] = useState<{ id: string; isActive: boolean } | null>(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const restaurantId = useSelector(
    (store: { restaurantAuth: { restaurant_id: string } }) => store.restaurantAuth.restaurant_id
  );

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await restaurantApi.fetchMenuItems(dispatch, restaurantId, searchTerm, categoryFilter);
        setMenuItems(response);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching menu items:', error);
        MySwal.fire({
          icon: 'error',
          title: 'Oops!',
          text: 'Failed to fetch menu items.',
          confirmButtonColor: '#6589f6',
          background: '#fefefe',
          customClass: {
            confirmButton: 'swal-confirm-button',
            title: 'swal-title',
            htmlContainer: 'swal-text',
            popup: 'swal-popup',
          },
        });
        setLoading(false);
      }
    };
    fetchMenuItems();
  }, [restaurantId, searchTerm, categoryFilter]); 

  const handleSort = (field: keyof MenuItem) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/restaurant/menus/edit/${id}`);
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    const action = isActive ? 'block' : 'unblock';
    try {
      await restaurantApi.toggleMenuItemActive(dispatch, id);
      setMenuItems((prevItems) =>
        prevItems.map((item) =>
          item._id === id ? { ...item, isActive: !isActive } : item
        )
      );
      MySwal.fire({
        icon: 'success',
        title: 'Success!',
        text: `Menu item ${action}ed successfully.`,
        confirmButtonColor: '#6589f6',
        background: '#fefefe',
        customClass: {
          confirmButton: 'swal-confirm-button',
          title: 'swal-title',
          htmlContainer: 'swal-text',
          popup: 'swal-popup',
        },
        timer: 2000,
        timerProgressBar: true,
      });
    } catch (error) {
      console.error(`Error ${action}ing menu item:`, error);
      MySwal.fire({
        icon: 'error',
        title: 'Oops!',
        text: `Failed to ${action} menu item.`,
        confirmButtonColor: '#6589f6',
        background: '#fefefe',
        customClass: {
          confirmButton: 'swal-confirm-button',
          title: 'swal-title',
          htmlContainer: 'swal-text',
          popup: 'swal-popup',
        },
      });
    }
  };

  const filteredItems = menuItems
    .filter(
      (item) =>
        (categoryFilter === 'all' || item.category === categoryFilter) &&
        (item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (sortField === 'price' || sortField === 'quantity') {
        return sortDirection === 'asc'
          ? (aValue as number) - (bValue as number)
          : (bValue as number) - (aValue as number);
      } else if (sortField === 'isActive') {
        return sortDirection === 'asc'
          ? Number(aValue) - Number(bValue)
          : Number(bValue) - Number(aValue);
      } else {
        const aString = String(aValue).toLowerCase();
        const bString = String(bValue).toLowerCase();
        return sortDirection === 'asc'
          ? aString.localeCompare(bString)
          : bString.localeCompare(aString);
      }
    });

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <style>
        {`
          .swal-confirm-button {
            padding: 10px 24px;
            border-radius: 8px;
            font-weight: 500;
            transition: all 0.3s ease;
          }
          .swal-confirm-button:hover {
            filter: brightness(90%);
          }
          .swal-cancel-button {
            padding: 10px 24px;
            border-radius: 8px;
            font-weight: 500;
            transition: all 0.3s ease;
          }
          .swal-cancel-button:hover {
            filter: brightness(90%);
          }
          .swal-title {
            font-size: 1.5rem;
            font-weight: 600;
            color: #1a202c;
          }
          .swal-text {
            font-size: 1rem;
            color: #4a5568;
          }
          .swal-popup {
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          }
        `}
      </style>
      <Header
        isOnline={isOnline}
        handleToggleOnline={handleToggleOnline}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      <Sidebar
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        isOnline={isOnline}
      />
      <main className="md:ml-64 p-6 max-w-[90rem] mx-auto">
        <FilterBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
        />
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <MenuTable
            paginatedItems={paginatedItems}
            sortField={sortField}
            sortDirection={sortDirection}
            handleSort={handleSort}
            handleEdit={handleEdit}
            handleToggleActive={(id: string, isActive: boolean) => setShowConfirmation({ id, isActive })}
          />
          <div className="md:hidden divide-y divide-gray-200">
            {paginatedItems.map((item) => (
              <MenuCard
                key={item._id}
                item={item}
                handleEdit={handleEdit}
                handleToggleActive={(id: string, isActive: boolean) => setShowConfirmation({ id, isActive })}
              />
            ))}
          </div>
          <PaginationControls
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
          />
        </div>
        {showConfirmation && (
          <ConfirmationModal
            id={showConfirmation.id}
            isActive={showConfirmation.isActive}
            onConfirm={async (id: string, isActive: boolean) => {
              await handleToggleActive(id, isActive);
              setShowConfirmation(null);
            }}
          />
        )}
      </main>
      <LoadingSpinner isLoading={loading} />
      <MobileMenuOverlay isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
    </div>
  );
};

export default MenuList;