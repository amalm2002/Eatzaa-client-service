import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Save, X, HelpCircle } from 'lucide-react';
import { adminApi } from '../../../api/endpoints/adminApi';
import { useDispatch } from 'react-redux';

interface HelpOption {
    _id: string;
    title: string;
    description: string;
    category: string;
    isActive: boolean;
    createdAt?: string;
}

const DeliveryHelpAdmin: React.FC = () => {
    const [helpOptions, setHelpOptions] = useState<HelpOption[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [editingOption, setEditingOption] = useState<HelpOption | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        isActive: true
    });
    const dispatch = useDispatch();

    const categories = ['Order Management', 'Zone Changing', 'Delivery Issues', 'Payment', 'Technical Support', 'Account Issues'];

    useEffect(() => {
        fetchHelpOptions();
    }, []);

    const fetchHelpOptions = async () => {
        try {
            const response = await adminApi.getAllDeliveryBoyHelpOptions(dispatch);
            if (response.success) {
                const mappedOptions = response.data.map((option: any) => ({
                    ...option,
                    _id: option._id.toString()
                }));
                setHelpOptions(mappedOptions);
            }
        } catch (error) {
            console.error('Error fetching help options:', error);
        }
    };

    const filteredOptions = helpOptions.filter(option =>
        option.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        option.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAdd = () => {
        setEditingOption(null);
        setFormData({ title: '', description: '', category: '', isActive: true });
        setShowModal(true);
    };

    const handleEdit = (option: HelpOption) => {
        setEditingOption(option);
        setFormData({
            title: option.title,
            description: option.description,
            category: option.category,
            isActive: option.isActive
        });
        setShowModal(true);
    };

    const handleDelete = async (id: string) => {
        try {
            const response = await adminApi.deleteDeliveryBoyHelpOption(dispatch, id);
            // console.log('delete response:', response);
            if (response.success) {
                setHelpOptions(helpOptions.filter(option => option._id !== id));
            }
        } catch (error) {
            console.error('Error deleting help option:', error);
        }
    };

    const handleSave = async () => {
        try {
            if (editingOption && editingOption._id) {
                console.log('Editing ID:', editingOption._id);
                const response = await adminApi.updateDeliveryBoyHelpOption(dispatch, editingOption._id, formData);
                if (response.success) {
                    setHelpOptions(helpOptions.map(option =>
                        option._id === editingOption._id ? { ...option, ...formData } : option
                    ));
                }
            } else {
                const response = await adminApi.createDeliveryBoyHelpOption(dispatch, formData);
                if (response.success) {
                    setHelpOptions([...helpOptions, { ...response.data, createdAt: new Date().toISOString().split('T')[0], _id: response.data._id }]);
                }
            }
            setShowModal(false);
        } catch (error) {
            console.error('Error saving help option:', error);
        }
    };

    const toggleStatus = async (id: string) => {
        try {
            const option = helpOptions.find(opt => opt._id === id);
            if (!option) return;

            const updatedData = { ...option, isActive: !option.isActive };
            const response = await adminApi.updateDeliveryBoyHelpOption(dispatch, id, updatedData);
            if (response.success) {
                setHelpOptions(helpOptions.map(opt =>
                    opt._id === id ? { ...opt, isActive: !opt.isActive } : opt
                ));
            }
        } catch (error) {
            console.error('Error toggling status:', error);
        }
    };

    return (
        <div className="min-h-screen bg-white text-black pt-20">
            <div className="bg-black text-white p-6 shadow-lg">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <HelpCircle className="w-8 h-8" />
                            <div>
                                <h1 className="text-2xl font-bold">Delivery Boy Help Options</h1>
                                <p className="text-gray-300 text-sm">Manage help content for delivery personnel</p>
                            </div>
                        </div>
                        <button
                            onClick={handleAdd}
                            className="bg-white text-black px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center gap-2 w-fit"
                        >
                            <Plus className="w-4 h-4" />
                            Add Help Option
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-6">
                <div className="mb-6">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search help options..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    {filteredOptions.map((option) => (
                        <div key={option._id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="font-semibold text-lg">{option.title}</h3>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${option.isActive
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                            }`}>
                                            {option.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 mb-2">{option.description}</p>
                                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                        <span className="bg-gray-100 px-2 py-1 rounded">{option.category}</span>
                                        <span>Created:{option.createdAt?.replace('T', ' ').slice(0, 19)}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => toggleStatus(option._id)}
                                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${option.isActive
                                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                                            }`}
                                    >
                                        {option.isActive ? 'Deactivate' : 'Activate'}
                                    </button>
                                    <button
                                        onClick={() => handleEdit(option)}
                                        className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
                                        title="Edit"
                                    >
                                        <Edit2 className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(option._id)}
                                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {filteredOptions.length === 0 && (
                        <div className="text-center py-12">
                            <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No help options found</h3>
                            <p className="text-gray-500">Try adjusting your search or add a new help option.</p>
                        </div>
                    )}
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-white/20 bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b">
                            <h2 className="text-xl font-bold">
                                {editingOption ? 'Edit Help Option' : 'Add New Help Option'}
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-medium mb-2">Title *</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                    placeholder="Enter help option title"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Description *</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={4}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                                    placeholder="Enter detailed description of the help option"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Category *</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                >
                                    <option value="">Select a category</option>
                                    {categories.map(category => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                                />
                                <label htmlFor="isActive" className="text-sm font-medium">
                                    Make this help option active
                                </label>
                            </div>
                        </div>

                        <div className="flex gap-3 p-6 border-t">
                            <button
                                onClick={() => setShowModal(false)}
                                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={!formData.title || !formData.description || !formData.category}
                                className="flex-1 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                <Save className="w-4 h-4" />
                                {editingOption ? 'Update' : 'Create'} Help Option
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeliveryHelpAdmin;