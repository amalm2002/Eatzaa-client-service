import { Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FormActionsProps {
  isEditMode?: boolean;
}

const FormActions: React.FC<FormActionsProps> = ({ isEditMode = false }) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-end space-x-4">
      <button
        type="button"
        onClick={() => navigate('/restaurant-menu-list')}
        className="px-5 py-3 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-100 transition-all font-medium"
      >
        Cancel
      </button>
      <button
        type="submit"
        className="bg-[#6589f6] text-white px-8 py-3 rounded-lg flex items-center hover:bg-[#5578e5] transition-all duration-300 shadow-lg font-medium"
      >
        <Save size={20} className="mr-2" /> {isEditMode ? 'Update Menu Item' : 'Save Menu Item'}
      </button>
    </div>
  );
};

export default FormActions;