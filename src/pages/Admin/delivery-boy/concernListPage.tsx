import React, { useState, useEffect } from 'react';
import { Search, Eye, Check, X, User, Phone, MapPin, AlertCircle, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { adminApi } from '../../../api/endpoints/adminApi';
import { useDispatch } from 'react-redux';

interface DeliveryBoy {
    id: string;
    name: string;
    phone: string;
    email: string;
    location: string;
    concernType: 'payment' | 'route' | 'vehicle' | 'support' | 'other' | 'Zone Changing';
    concern: string;
    status: 'pending' | 'approved' | 'rejected'; 
    submittedAt: string;
    lastActive: string;
    completedDeliveries: number;
    rating: number;
    zoneId?: string;
    zoneName?: string;
    deliveryBoyId?: string;
}

const DeliveryCincernPanel: React.FC = () => {
    const [deliveryBoys, setDeliveryBoys] = useState<DeliveryBoy[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [priorityFilter, setPriorityRank] = useState<string>('all');
    const [selectedConcern, setSelectedConcern] = useState<DeliveryBoy | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectReason, setRejectReason] = useState('');

    const dispatch = useDispatch();

    useEffect(() => {
        const fetchTheAllConcerns = async () => {
            try {
                const response = await adminApi.fetchAllConcerns(dispatch);
                if (response.success && Array.isArray(response.data)) {
                    const transformedData: DeliveryBoy[] = response.data.map((item: any) => ({
                        id: item._id,
                        name: item.deliveryBoyId?.name || 'Unknown',
                        phone: item.deliveryBoyId?.mobile || 'N/A',
                        email: item.deliveryBoyId?.email || 'N/A',
                        location: item.deliveryBoyId?.zone.name || item.deliveryBoyId?.location?.address || 'Unknown',
                        concernType: (item.selectedOption?.category || 'other') as DeliveryBoy['concernType'],
                        concern: item.description || item.reason || 'No description provided',
                        status: item.status as DeliveryBoy['status'],
                        submittedAt: item.createdAt,
                        lastActive: item.updatedAt || item.createdAt,
                        completedDeliveries: item.deliveryBoyId?.ordersCompleted || 0,
                        rating: item.deliveryBoyId?.rating || 0,
                        zoneId: item.zoneId,
                        zoneName: item.zoneName,
                        deliveryBoyId: item.deliveryBoyId?._id,
                    }));
                    setDeliveryBoys(transformedData);
                } else {
                    toast.error('Invalid response format');
                }
            } catch (error) {
                console.log('Error fetching concerns:', error);
                toast.error((error as Error).message || 'Something went wrong');
            }
        };
        fetchTheAllConcerns();
    }, [dispatch]);

    const filteredDeliveryBoys = deliveryBoys.filter(boy => {
        const matchesSearch = boy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            boy.phone.includes(searchTerm) ||
            boy.concern.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || boy.status === statusFilter;
        const matchesPriority = priorityFilter === 'all';

        return matchesSearch && matchesStatus && matchesPriority;
    });

    const handleStatusUpdate = async (id: string, newStatus: 'verified' | 'rejected', reason?: string) => {
        try {
            const concern = deliveryBoys.find(boy => boy.id === id);
            if (!concern) {
                toast.error('Concern not found');
                return;
            }
            console.log('resonssssssss :', reason);

            const payload: any = { id, newStatus: newStatus === 'verified' ? 'approved' : 'rejected' };
            if (newStatus === 'rejected' && reason) {
                payload.rejectionReason = reason;
            }
            if (newStatus === 'verified' && concern.zoneId && concern.zoneName && concern.deliveryBoyId) {
                payload.zoneId = concern.zoneId;
                payload.zoneName = concern.zoneName;
                payload.deliveryBoyId = concern.deliveryBoyId;
            }
            console.log('payloaddddddddd :', payload);

            const response = await adminApi.verifyTheConcern(dispatch, payload);

            if (response.success) {
                setDeliveryBoys(prev => prev.map(boy =>
                    boy.id === id ? { ...boy, status: newStatus === 'verified' ? 'approved' : 'rejected' } : boy
                ));
                toast.success(`Concern ${newStatus === 'verified' ? 'approved' : 'rejected'} successfully`);
            } else {
                toast.error(response.message || 'Failed to update concern status');
            }
        } catch (error) {
            console.log('Error updating concern status:', error);
            toast.error((error as Error).message || 'Something went wrong');
        }
        setShowModal(false);
        setShowRejectModal(false);
        setRejectReason('');
        setSelectedConcern(null);
    };

    const handleRejectClick = (concern: DeliveryBoy) => {
        setSelectedConcern(concern);
        setShowRejectModal(true);
    };

    const getPriorityColor = (priority: string) => {
        switch (priority.toLowerCase()) {
            case 'approved': return 'bg-green-600 text-white';
            case 'rejected': return 'bg-red-600 text-white';
            case 'pending': return 'bg-gray-600 text-white';
            default: return 'bg-gray-200 text-gray-800';
        }
    };

    const getConcernTypeIcon = (type: string) => {
        switch (type.toLowerCase()) {
            case 'payment': return '💰';
            case 'vehicle': return '🚗';
            case 'route': return '🗺️';
            case 'support': return '🎧';
            case 'zone changing': return '🌍';
            default: return '📋';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="min-h-screen bg-white text-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Delivery Boys Admin Panel</h1>
                    <p className="text-gray-600">Manage delivery personnel concerns and requirements</p>
                </div>

                {/* Filters and Search */}
                <div className="bg-gray-50 rounded-lg p-6 mb-6 border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search by name, phone, or concern..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <select
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>
                        <div className="flex items-center justify-end">
                            <span className="text-sm text-gray-600">
                                {filteredDeliveryBoys.length} of {deliveryBoys.length} concerns
                            </span>
                        </div>
                    </div>
                </div>

                {/* Concerns Table */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-900 text-white">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Delivery Person</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Concern</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Submitted</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredDeliveryBoys.map((boy) => (
                                    <tr key={boy.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                                    <User className="w-5 h-5 text-gray-600" />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">{boy.name}</div>
                                                    <div className="text-sm text-gray-500 flex items-center">
                                                        <Phone className="w-3 h-3 mr-1" />
                                                        {boy.phone}
                                                    </div>
                                                    <div className="text-sm text-gray-500 flex items-center">
                                                        <MapPin className="w-3 h-3 mr-1" />
                                                        {boy.location}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-start space-x-2">
                                                <span className="text-lg">{getConcernTypeIcon(boy.concernType)}</span>
                                                <div>
                                                    <div className="font-medium text-gray-900 capitalize">{boy.concernType}</div>
                                                    <div className="text-sm text-gray-600 max-w-xs truncate">
                                                        {boy.concern}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(boy.status)}`}>
                                                {boy.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            <div className="flex items-center">
                                                <Calendar className="w-4 h-4 mr-1" />
                                                {formatDate(boy.submittedAt)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedConcern(boy);
                                                        setShowModal(true);
                                                    }}
                                                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                                                    title="View Details"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                {boy.status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleStatusUpdate(boy.id, 'verified')}
                                                            className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
                                                            title="Approve"
                                                        >
                                                            <Check className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleRejectClick(boy)}
                                                            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Reject"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {filteredDeliveryBoys.length === 0 && (
                    <div className="text-center py-12">
                        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No concerns found matching your criteria.</p>
                    </div>
                )}

                {/* Detail Modal */}
                {showModal && selectedConcern && (
                    <div className="fixed inset-0 bg-white/5 bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold text-gray-900">Concern Details</h2>
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2">Personal Information</h3>
                                        <div className="space-y-2 text-sm">
                                            <p><span className="font-medium">Name:</span> {selectedConcern.name}</p>
                                            <p><span className="font-medium">Phone:</span> {selectedConcern.phone}</p>
                                            <p><span className="font-medium">Email:</span> {selectedConcern.email}</p>
                                            <p><span className="font-medium">Location:</span> {selectedConcern.location}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2">Performance Stats</h3>
                                        <div className="space-y-2 text-sm">
                                            <p><span className="font-medium">Completed Deliveries:</span> {selectedConcern.completedDeliveries}</p>
                                            <p><span className="font-medium">Rating:</span> {selectedConcern.rating}/5.0</p>
                                            <p><span className="font-medium">Last Active:</span> {formatDate(selectedConcern.lastActive)}</p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Concern Details</h3>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <span className="text-2xl">{getConcernTypeIcon(selectedConcern.concernType)}</span>
                                            <span className="font-medium capitalize">{selectedConcern.concernType} Issue</span>
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(selectedConcern.status)}`}>
                                                {selectedConcern.status.toUpperCase()}
                                            </span>
                                        </div>
                                        <p className="text-gray-700">{selectedConcern.concern}</p>
                                        <p className="text-sm text-gray-500 mt-2">
                                            Submitted on {formatDate(selectedConcern.submittedAt)}
                                        </p>
                                    </div>
                                </div>
                                {selectedConcern.status === 'pending' && (
                                    <div className="flex space-x-4 pt-4 border-t border-gray-200">
                                        <button
                                            onClick={() => handleStatusUpdate(selectedConcern.id, 'verified')}
                                            className="flex-1 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2"
                                        >
                                            <Check className="w-4 h-4" />
                                            <span>Approve</span>
                                        </button>
                                        <button
                                            onClick={() => handleRejectClick(selectedConcern)}
                                            className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2"
                                        >
                                            <X className="w-4 h-4" />
                                            <span>Reject</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Rejection Reason Modal */}
                {showRejectModal && selectedConcern && (
                    <div className="fixed inset-0 bg-white/5 bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg max-w-md w-full">
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold text-gray-900">Reason for Rejection</h2>
                                    <button
                                        onClick={() => {
                                            setShowRejectModal(false);
                                            setRejectReason('');
                                        }}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-6">
                                <textarea
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                                    rows={4}
                                    placeholder="Enter reason for rejection..."
                                    value={rejectReason}
                                    onChange={(e) => setRejectReason(e.target.value)}
                                />
                                <div className="flex space-x-4 pt-4">
                                    <button
                                        onClick={() => handleStatusUpdate(selectedConcern.id, 'rejected', rejectReason)}
                                        className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                                        disabled={!rejectReason.trim()}
                                    >
                                        <X className="w-4 h-4" />
                                        <span>Submit Rejection</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowRejectModal(false);
                                            setRejectReason('');
                                        }}
                                        className="flex-1 bg-gray-200 text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DeliveryCincernPanel;