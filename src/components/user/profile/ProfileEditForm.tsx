import { ProfileEditFormProps } from "../../../interfaces/user/profile/profile-edit-form.types";

const ProfileEditForm = ({
  editForm,
  errors,
  setEditForm,
  handleEditSubmit,
  setIsEditing,
  setErrors,
  tealColor,
}: ProfileEditFormProps) => {
  return (
    <form onSubmit={handleEditSubmit} className="space-y-6 max-w-lg">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Full Name
        </label>
        <input
          type="text"
          id="name"
          value={editForm.name}
          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
          className={`mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-teal-500 ${
            errors.name ? 'border-red-500' : ''
          }`}
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
          Phone
        </label>
        <input
          type="tel"
          id="phone"
          value={editForm.phone}
          onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
          className={`mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-teal-500 ${
            errors.phone ? 'border-red-500' : ''
          }`}
        />
        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
      </div>
      <div className="flex space-x-4">
        <button
          type="submit"
          className="text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          style={{ backgroundColor: tealColor }}
        >
          Save Changes
        </button>
        <button
          type="button"
          onClick={() => {
            setIsEditing(false);
            setErrors({});
          }}
          className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ProfileEditForm;