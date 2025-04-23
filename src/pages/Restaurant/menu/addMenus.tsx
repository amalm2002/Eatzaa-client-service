import React, { useState, useRef, useCallback, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import { Area } from 'react-easy-crop';
import { X, Plus, Camera, Save, Check, Crop } from 'lucide-react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Header from '../navbar/header';
import Sidebar from '../navbar/sidebar';
import useRestaurantStatus from '../../../hooks/useRestaurantStatus';
import createAxios from '../../../service/axiousServices/restaurantAxious';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { toast } from 'sonner';

interface Variant {
  id: string;
  name: string;
  price: number;
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: 'veg' | 'non-veg' | 'drinks';
  price: number;
  quantity: number;
  images: string[];
  hasVariants: boolean;
  variants: Variant[];
  timing?: 'daily' | 'afternoon' | 'evening';
}

interface VariantModalProps {
  mode: 'new' | 'existing';
  newVariant: Variant;
  setNewVariant: (variant: Variant) => void;
  setShowVariantModal: (show: boolean) => void;
  setFieldValue: (field: string, value: any) => void;
  values: MenuItem;
  selectedExistingVariant: string;
  setSelectedExistingVariant: (id: string) => void;
}

const VariantModal: React.FC<VariantModalProps> = ({
  mode,
  newVariant,
  setNewVariant,
  setShowVariantModal,
  setFieldValue,
  values,
  selectedExistingVariant,
  setSelectedExistingVariant,
}) => {
  const [fetchedVariants, setFetchedVariants] = useState<Variant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dispatch=useDispatch()

  const axiosInstance = createAxios(dispatch);
  const restaurantId = useSelector(
    (store: { restaurantAuth: { restaurant_id: string } }) => store.restaurantAuth.restaurant_id
  );

  useEffect(() => {
    if (mode === 'existing') {
      const fetchVariants = async () => {
        try {
          setIsLoading(true);
          setError(null);
          const response = await axiosInstance.get(`/variant/${restaurantId}`);
          console.log(response);
          setFetchedVariants(response.data);
        } catch (err) {
          console.error('Error fetching variants:', err);
          setError('Failed to load variants. Please try again.');
        } finally {
          setIsLoading(false);
        }
      };

      fetchVariants();
    }
  }, [mode, restaurantId]);

  const addCustomVariant = () => {
    if (newVariant.name && newVariant.price > 0) {
      setFieldValue('variants', [
        ...values.variants,
        { ...newVariant, id: Date.now().toString() },
      ]);
      setNewVariant({ id: Date.now().toString(), name: '', price: 0 });
      setShowVariantModal(false);
    }
  };

  const addExistingVariant = () => {
    
    const variantToAdd = fetchedVariants.find((v) => v.id === selectedExistingVariant);
    if (variantToAdd && !values.variants.some((v) => v.id === variantToAdd.id)) {
      setFieldValue('variants', [...values.variants, variantToAdd]);
      setSelectedExistingVariant('');
      setShowVariantModal(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md border border-gray-100">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-xl font-bold text-gray-800">
            {mode === 'new' ? 'Add Custom Variant' : 'Add Existing Variant'}
          </h3>
          <button
            onClick={() => setShowVariantModal(false)}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        {mode === 'new' ? (
          <>
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">Variant Name*</label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6589f6] transition-all bg-gray-50"
                placeholder="e.g. Small, Medium, Large"
                value={newVariant.name}
                onChange={(e) => setNewVariant({ ...newVariant, name: e.target.value })}
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹)*</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500">₹</span>
                <input
                  type="number"
                  className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6589f6] transition-all bg-gray-50"
                  placeholder="0.00"
                  value={newVariant.price}
                  onChange={(e) =>
                    setNewVariant({ ...newVariant, price: parseFloat(e.target.value) || 0 })
                  }
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowVariantModal(false)}
                className="px-5 py-2.5 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-100 transition-all font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={addCustomVariant}
                className={`px-5 py-2.5 bg-[#6589f6] text-white rounded-lg hover:bg-[#5578e5] transition-all font-medium ${!newVariant.name || newVariant.price <= 0 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                disabled={!newVariant.name || newVariant.price <= 0}
              >
                Add Variant
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Variant*</label>
              {isLoading ? (
                <p className="text-gray-500">Loading variants...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : (
                <select
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6589f6] transition-all bg-gray-50"
                  value={selectedExistingVariant}
                  onChange={(e) => setSelectedExistingVariant(e.target.value)}
                >
                  <option value="">-- Select Variant --</option>
                  {fetchedVariants.map((variant) => (
                    <option
                      key={variant.id}
                      value={variant.id}
                      disabled={values.variants.some((v) => v.id === variant.id)}
                    >
                      {variant.name} (₹{variant.price})
                    </option>
                  ))}
                </select>
              )}
              <p className="text-xs text-gray-500 mt-1.5">
                Variants already added to this item are disabled
              </p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowVariantModal(false)}
                className="px-5 py-2.5 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-100 transition-all font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={addExistingVariant}
                className={`px-5 py-2.5 bg-[#6589f6] text-white rounded-lg hover:bg-[#5578e5] transition-all font-medium ${!selectedExistingVariant || isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                disabled={!selectedExistingVariant || isLoading}
              >
                Add Variant
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export const AddMenuItems = () => {
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [variantModalMode, setVariantModalMode] = useState<'new' | 'existing'>('new');
  const [newVariant, setNewVariant] = useState<Variant>({
    id: Date.now().toString(),
    name: '',
    price: 0,
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('Menu Items');
  const { isOnline, handleToggleOnline } = useRestaurantStatus();
  const [selectedExistingVariant, setSelectedExistingVariant] = useState<string>('');
  const [selectedFiles, setSelectedFiles] = useState<(File | null)[]>([null, null, null]);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [cropShape, setCropShape] = useState<'rect' | 'round'>('rect');
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const fileInputRefs = useRef<Array<HTMLInputElement | null>>([]);
  useEffect(() => {
    fileInputRefs.current = Array(3).fill(null);
  }, []);

  const dispatch=useDispatch()
  const navigate = useNavigate();
  const axiosInstance = createAxios(dispatch);

  const validationSchema = Yup.object({
    name: Yup.string().required('Item name is required')
      .test('not-only-spaces', 'Item name cannot be empty or just spaces', value => !!value && value.trim().length > 0),
    category: Yup.string().required('Category is required'),
    price: Yup.number().required('Price is required').min(0, 'Price must be positive'),
    quantity: Yup.number().required('Quantity is required').min(0, 'Quantity must be positive')
      .test(
        'max-quantity',
        'You can add the quantity below 100',
        value => value !== undefined && value < 100
      ),
      images: Yup.array()
      .of(
        Yup.string()
          .required('Image is required')
          .test('not-empty', 'Image cannot be empty', (value) => !!value && value.trim().length > 0)
      )
      .length(3, 'Exactly three images are required')
      .required('Images are required'),
    description: Yup.string()
      .test('not-only-spaces', 'Description cannot be empty or just spaces', value => {
        if (!value) {
          return true;
        }
        return value.trim().length > 0;
      }),
    hasVariants: Yup.boolean(),
    variants: Yup.array(),
    timing: Yup.string(),
  });

  const getCroppedImg = async (imageSrc: string, crop: Area, rotation: number): Promise<Blob> => {
    const image = new Image();
    image.src = imageSrc;
    await new Promise((resolve) => (image.onload = resolve));

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;

    ctx.translate(crop.width / 2, crop.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-crop.width / 2, -crop.height / 2);

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob!);
      }, 'image/jpeg', 0.9);
    });
  };

  const handleFileChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: any) => void
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImageSrc(imageUrl);
      setCurrentImageIndex(index);
      setShowCropModal(true);
      const newFiles = [...selectedFiles];
      newFiles[index] = file;
      setSelectedFiles(newFiles);
    }
  };

  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCrop = async (setFieldValue: (field: string, value: any) => void) => {
    if (imageSrc && croppedAreaPixels && currentImageIndex !== null) {
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels, rotation);
      const croppedUrl = URL.createObjectURL(croppedBlob);
      setFieldValue(`images[${currentImageIndex}]`, croppedUrl);

      const newFiles = [...selectedFiles];
      newFiles[currentImageIndex] = new File([croppedBlob], `cropped-${Date.now()}.jpg`, {
        type: 'image/jpeg',
      });
      setSelectedFiles(newFiles);

      setShowCropModal(false);
      setImageSrc(null);
      setCurrentImageIndex(null);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setRotation(0);
    }
  };

  const restaurantId = useSelector(
    (store: { restaurantAuth: { restaurant_id: string } }) => store.restaurantAuth.restaurant_id
  );

  const handleSubmit = async (values: MenuItem) => {
    try {
      setIsLoading(true)
      const formData = new FormData();

      formData.append('name', values.name);
      formData.append('description', values.description);
      formData.append('category', values.category);
      formData.append('price', values.price.toString());
      formData.append('quantity', values.quantity.toString());
      formData.append('hasVariants', values.hasVariants.toString());
      formData.append('timing', values.timing || 'daily');
      formData.append('restaurantId', restaurantId || '');
      formData.append('variants', JSON.stringify(values.variants));

      selectedFiles.forEach((file, index) => {
        if (file) {
          formData.append(`images[${index}]`, file);
        }
      });

      const response = await axiosInstance.post('/menu-items', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response);
      if (response.data === 'Menu item already exists') {
        toast.error('Menu item already exists')
        return
      } else {
        toast.success('Menu item saved successfully!');
        navigate('/restaurant-menu-list');
      }

    } catch (error: any) {
      console.error('Error saving menu item:', error);
      alert('Failed to save menu item.')
    } finally {
      setIsLoading(false)
    }
  };

  const toggleVariants = (
    setFieldValue: (field: string, value: any) => void,
    values: MenuItem
  ) => {
    setFieldValue('hasVariants', !values.hasVariants);
    if (!values.hasVariants) setFieldValue('variants', []);
  };

  const removeVariant = (
    id: string,
    setFieldValue: (field: string, value: any) => void,
    values: MenuItem
  ) => {
    setFieldValue('variants', values.variants.filter((v) => v.id !== id));
  };

  const openVariantModal = (mode: 'new' | 'existing') => {
    setVariantModalMode(mode);
    setShowVariantModal(true);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
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

      <main className="md:ml-64 max-w-3x2 mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <Formik
            initialValues={{
              id: '',
              name: '',
              description: '',
              category: 'veg' as const,
              price: 0,
              quantity: 0,
              images: ['', '', ''],
              hasVariants: false,
              variants: [] as Variant[],
              timing: 'daily' as const,
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue, errors, touched }) => (
              <Form>
                <div className="mb-10">
                  <h2 className="text-2xl font-bold text-gray-800 mb-5 flex items-center">
                    <span className="w-1.5 h-8 bg-[#6589f6] rounded mr-3"></span>
                    Basic Information
                  </h2>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Item Name*</label>
                    <Field
                      name="name"
                      type="text"
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6589f6] transition-all bg-gray-50"
                      placeholder="e.g. Paneer Tikka Masala"
                    />
                    {errors.name && touched.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <Field
                      name="description"
                      as="textarea"
                      rows={4}
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6589f6] transition-all bg-gray-50"
                      placeholder="Describe your dish in detail"
                    />
                    {errors.description && touched.description && (
                      <div className="text-red-500 text-sm mt-1">{errors.description}</div>
                    )}
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category*</label>
                    <div className="grid grid-cols-3 gap-4">
                      {(['veg', 'non-veg', 'drinks'] as const).map((category) => (
                        <button
                          key={category}
                          type="button"
                          onClick={() => setFieldValue('category', category)}
                          className={`py-3 px-4 rounded-lg border transition-all duration-300 ${values.category === category
                            ? 'bg-[#6589f6] text-white border-[#6589f6] shadow-lg'
                            : 'bg-white text-gray-800 border-gray-200 hover:bg-gray-50'
                            } font-medium`}
                        >
                          {category === 'veg' && '🥬 '}
                          {category === 'non-veg' && '🍗 '}
                          {category === 'drinks' && '🥤 '}
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </button>
                      ))}
                    </div>
                    {errors.category && touched.category && (
                      <div className="text-red-500 text-sm mt-1">{errors.category}</div>
                    )}
                  </div>
                </div>

                <div className="mb-10">
                  <h2 className="text-2xl font-bold text-gray-800 mb-5 flex items-center">
                    <span className="w-1.5 h-8 bg-[#6589f6] rounded mr-3"></span>
                    Pricing & Quantity
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹)*</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500">₹</span>
                        <Field
                          name="price"
                          type="number"
                          min="0"
                          className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6589f6] transition-all bg-gray-50"
                          placeholder="0.00"
                        />
                      </div>
                      {errors.price && touched.price && <div className="text-red-500 text-sm mt-1">{errors.price}</div>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Quantity Available</label>
                      <Field
                        name="quantity"
                        type="number"
                        min="0"
                        className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6589f6] transition-all bg-gray-50"
                        placeholder="0"
                      />
                      {errors.quantity && touched.quantity && (
                        <div className="text-red-500 text-sm mt-1">{errors.quantity}</div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mb-10">
                  <h2 className="text-2xl font-bold text-gray-800 mb-5 flex items-center">
                    <span className="w-1.5 h-8 bg-[#6589f6] rounded mr-3"></span>
                    Images & Timing
                  </h2>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Availability Timing</label>
                    <div className="grid grid-cols-3 gap-4">
                      {(['daily', 'afternoon', 'evening'] as const).map((timing) => (
                        <button
                          key={timing}
                          type="button"
                          onClick={() => setFieldValue('timing', timing)}
                          className={`py-3 px-4 rounded-lg border transition-all duration-300 ${values.timing === timing
                            ? 'bg-[#6589f6] text-white border-[#6589f6] shadow-lg'
                            : 'bg-white text-gray-800 border-gray-200 hover:bg-gray-50'
                            } font-medium`}
                        >
                          {timing.charAt(0).toUpperCase() + timing.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {values.images.map((image, index) => (
                      <div
                        key={index}
                        className={`border-2 ${image ? 'border-gray-200' : 'border-dashed border-gray-300'
                          } rounded-xl p-4 flex flex-col items-center justify-center h-56 transition-all duration-300 hover:border-[#6589f6] hover:shadow-md bg-gray-50`}
                      >
                        {image ? (
                          <div className="relative w-full h-full">
                            <img
                              src={image}
                              alt="Food item"
                              className="w-full h-full object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => setFieldValue(`images[${index}]`, '')}
                              className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-md hover:bg-gray-100 transition-all"
                            >
                              <X size={18} className="text-gray-600" />
                            </button>
                            {index === 0 && (
                              <div className="absolute bottom-0 left-0 right-0 bg-[#6589f6] text-white text-xs py-1.5 text-center rounded-b-lg">
                                Primary Image
                              </div>
                            )}
                            
                          </div>
                          
                        ) : (
                          <div className="flex flex-col items-center text-gray-500 hover:text-[#6589f6] w-full h-full justify-center transition-all">
                            <input
                              type="file"
                              accept="image/*"
                              ref={(el: HTMLInputElement | null) => {
                                fileInputRefs.current[index] = el;
                              }}
                              onChange={(e) => handleFileChange(index, e, setFieldValue)}
                              className="hidden"
                            />
                            <button
                              type="button"
                              onClick={() => fileInputRefs.current[index]?.click()}
                              className="flex flex-col items-center cursor-pointer"
                            >
                              <div className="bg-gray-100 rounded-full p-4 mb-2">
                                <Camera size={28} />
                              </div>
                              <span className="text-sm font-medium">
                                {index === 0 ? 'Primary Image*' : `Additional Image ${index}`}
                              </span>
                              <span className="text-xs text-gray-400 mt-1">Click to upload</span>
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  {errors.images && touched.images && (
                      <div className="text-red-500 text-sm mt-1">{errors.images}</div>
                    )}
                </div>
                

                <div className="mb-10">
                  <div className="flex justify-between items-center mb-5">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                      <span className="w-1.5 h-8 bg-[#6589f6] rounded mr-3"></span>
                      Variants
                    </h2>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-600 mr-3">Enable Variants</span>
                      <button
                        type="button"
                        onClick={() => toggleVariants(setFieldValue, values)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none ${values.hasVariants ? 'bg-[#6589f6]' : 'bg-gray-200'
                          }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${values.hasVariants ? 'translate-x-6' : 'translate-x-1'
                            }`}
                        />
                      </button>
                    </div>
                  </div>

                  {values.hasVariants && (
                    <>
                      <div className="bg-[#6589f6]/5 rounded-xl p-5 mb-5 border border-[#6589f6]/10 flex items-start">
                        <div className="text-[#6589f6] mr-3 mt-1">
                          <Check size={18} />
                        </div>
                        <div className="text-sm text-[#6589f6]">
                          <p className="font-medium">Variants enabled</p>
                          <p className="mt-1">
                            Add different size options, add-ons, or customizations for this menu item.
                          </p>
                        </div>
                      </div>
                      <div className="mb-5 flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() => openVariantModal('new')}
                          className="bg-white border border-[#6589f6] text-[#6589f6] px-5 py-2.5 rounded-lg flex items-center hover:bg-[#6589f6]/5 transition-all font-medium"
                        >
                          <Plus size={18} className="mr-1" /> Add Custom Variant
                        </button>
                        <button
                          type="button"
                          onClick={() => openVariantModal('existing')}
                          className="bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-lg flex items-center hover:bg-gray-50 transition-all font-medium"
                        >
                          <Plus size={18} className="mr-1" /> Add Existing Variant
                        </button>
                      </div>
                      {values.variants.length > 0 ? (
                        <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Name
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Price (₹)
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Action
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {values.variants.map((variant) => (
                                <tr key={variant.id} className="hover:bg-gray-50 transition-all">
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium">
                                    {variant.name}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                    ₹{variant.price.toFixed(2)}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                      type="button"
                                      onClick={() => removeVariant(variant.id, setFieldValue, values)}
                                      className="text-red-500 hover:text-red-700 transition-all"
                                    >
                                      Remove
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-gray-500">
                          <div className="flex justify-center mb-3">
                            <div className="p-3 bg-gray-100 rounded-full">
                              <Plus size={28} className="text-gray-400" />
                            </div>
                          </div>
                          <p className="font-medium">No variants added yet</p>
                          <p className="text-sm mt-1">Add variants for different sizes, options, etc.</p>
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-[#6589f6] text-white px-8 py-3 rounded-lg flex items-center hover:bg-[#5578e5] transition-all duration-300 shadow-lg font-medium"
                  >
                    <Save size={20} className="mr-2" /> Save Menu Item
                  </button>
                </div>

                {showVariantModal && (
                  <VariantModal
                    mode={variantModalMode}
                    newVariant={newVariant}
                    setNewVariant={setNewVariant}
                    setShowVariantModal={setShowVariantModal}
                    setFieldValue={setFieldValue}
                    values={values}
                    selectedExistingVariant={selectedExistingVariant}
                    setSelectedExistingVariant={setSelectedExistingVariant}
                  />
                )}

                {showCropModal && imageSrc && (
                  <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl">
                      <div className="flex justify-between items-center mb-5">
                        <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                          <Crop size={24} className="mr-2 text-[#6589f6]" /> Crop Image
                        </h3>
                        <button
                          onClick={() => setShowCropModal(false)}
                          className="text-gray-500 hover:text-gray-700 transition-all"
                        >
                          <X size={24} />
                        </button>
                      </div>
                      <div className="relative h-96 bg-gray-50 rounded-lg overflow-hidden shadow-inner">
                        <Cropper
                          image={imageSrc}
                          crop={crop}
                          zoom={zoom}
                          rotation={rotation}
                          aspect={1}
                          cropShape={cropShape}
                          showGrid={true}
                          onCropChange={setCrop}
                          onZoomChange={setZoom}
                          onRotationChange={setRotation}
                          onCropComplete={onCropComplete}
                          classes={{
                            containerClassName: 'rounded-lg',
                            cropAreaClassName: cropShape === 'round' ? 'rounded-full' : 'rounded-lg',
                          }}
                        />
                      </div>
                      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Zoom</label>
                          <input
                            type="range"
                            min="1"
                            max="3"
                            step="0.1"
                            value={zoom}
                            onChange={(e) => setZoom(parseFloat(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#6589f6]"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Rotation</label>
                          <input
                            type="range"
                            min="0"
                            max="360"
                            step="1"
                            value={rotation}
                            onChange={(e) => setRotation(parseFloat(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#6589f6]"
                          />
                        </div>
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Crop Shape</label>
                        <div className="flex space-x-3">
                          <button
                            type="button"
                            onClick={() => setCropShape('rect')}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${cropShape === 'rect'
                              ? 'bg-[#6589f6] text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                          >
                            Square
                          </button>
                          <button
                            type="button"
                            onClick={() => setCropShape('round')}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${cropShape === 'round'
                              ? 'bg-[#6589f6] text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                          >
                            Circle
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-end space-x-3 mt-6">
                        <button
                          type="button"
                          onClick={() => setShowCropModal(false)}
                          className="px-5 py-2.5 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-100 transition-all font-medium"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCrop(setFieldValue)}
                          className="px-5 py-2.5 bg-[#6589f6] text-white rounded-lg hover:bg-[#5578e5] transition-all flex items-center font-medium"
                        >
                          <Crop size={18} className="mr-1" /> Crop & Save
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </Form>
            )}
          </Formik>
        </div>
      </main>

      {isLoading && (
        <div className="fixed inset-0 bg-white/10 bg-opacity-70 z-50 flex justify-center items-center">
          <DotLottieReact
            src="https://lottie.host/bd840cf1-cbc4-4994-8017-ea078a96d274/ZsjzEesMkf.lottie"
            loop
            autoplay
          />
        </div>
      )}

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};


