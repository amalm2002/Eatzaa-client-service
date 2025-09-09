import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Area } from 'react-easy-crop';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Header from '../navbar/header';
import Sidebar from '../navbar/sidebar';
import useRestaurantStatus from '../../../hooks/useRestaurantStatus';
import BasicInfoForm from '../../../components/restaurant/menu-management/BasicInfoForm';
import PricingQuantityForm from '../../../components/restaurant/menu-management/PricingQuantityForm';
import ImagesTimingForm from '../../../components/restaurant/menu-management/ImagesTimingForm';
import VariantsForm from '../../../components/restaurant/menu-management/VariantsForm';
import FormActions from '../../../components/restaurant/menu-management/FormActions';
import CropModal from '../../../components/restaurant/menu-management/CropModal';
import LoadingOverlay from '../../../components/restaurant/menu-management/LoadingOverlay';
import MobileMenuOverlay from '../../../components/restaurant/menu-management/MobileMenuOverlay';
import VariantModal from '../../../components/restaurant/menu-management/VariantModal';
import { MenuItem } from '../../../interfaces/restaurant/menu/menu-item-form.types';
import { Variant } from '../../../interfaces/restaurant/menu/variant.types';
import { restaurantApi } from '../../../api/endpoints/restaurantApi';

export const AddMenuItems = () => {
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [variantModalMode, setVariantModalMode] = useState<'new' | 'existing'>('new');
  const [newVariant, setNewVariant] = useState<Variant>({ id: Date.now().toString(), name: '', price: 0 });
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
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fileInputRefs = useRef<Array<HTMLInputElement | null>>([]);
  useEffect(() => {
    fileInputRefs.current = Array(3).fill(null);
  }, []);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const restaurantId = useSelector(
    (store: { restaurantAuth: { restaurant_id: string } }) => store.restaurantAuth.restaurant_id
  );

  const validationSchema = Yup.object({
    name: Yup.string()
      .required('Item name is required')
      .test('not-only-spaces', 'Item name cannot be empty or just spaces', (value) => !!value && value.trim().length > 0),
    category: Yup.string().required('Category is required'),
    price: Yup.number().required('Price is required').min(0, 'Price must be positive'),
    quantity: Yup.number()
      .required('Quantity is required')
      .min(0, 'Quantity must be positive')
      .test('max-quantity', 'You can add the quantity below 100', (value) => value !== undefined && value < 100),
    images: Yup.array()
      .of(Yup.string().required('Image is required').test('not-empty', 'Image cannot be empty', (value) => !!value && value.trim().length > 0))
      .length(3, 'Exactly three images are required')
      .required('Images are required'),
    description: Yup.string().test('not-only-spaces', 'Description cannot be empty or just spaces', (value) => {
      if (!value) return true;
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

    ctx.drawImage(image, crop.x * scaleX, crop.y * scaleY, crop.width * scaleX, crop.height * scaleY, 0, 0, crop.width, crop.height);

    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob!), 'image/jpeg', 0.9);
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
      newFiles[currentImageIndex] = new File([croppedBlob], `cropped-${Date.now()}.jpg`, { type: 'image/jpeg' });
      setSelectedFiles(newFiles);

      setShowCropModal(false);
      setImageSrc(null);
      setCurrentImageIndex(null);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setRotation(0);
    }
  };

  const handleSubmit = async (values: MenuItem) => {
    try {
      setIsLoading(true);
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
        if (file) formData.append(`images[${index}]`, file);
      });

      await restaurantApi.submitMenuItem(dispatch, formData);

      toast.success('Menu item saved successfully!');
      navigate('/restaurant/menus');
    } catch (error: any) {
      console.error('Error saving menu item:', error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };


  const removeVariant = (id: string, setFieldValue: (field: string, value: any) => void, values: MenuItem) => {
    setFieldValue('variants', values.variants.filter((v) => v.id !== id));
  };

  const openVariantModal = (mode: 'new' | 'existing') => {
    setVariantModalMode(mode);
    setShowVariantModal(true);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header isOnline={isOnline} handleToggleOnline={handleToggleOnline} setIsMobileMenuOpen={setIsMobileMenuOpen} />
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
                <BasicInfoForm values={values} errors={errors} touched={touched} setFieldValue={setFieldValue} />
                <PricingQuantityForm values={values} errors={errors} touched={touched} />
                <ImagesTimingForm
                  values={values}
                  errors={errors}
                  touched={touched}
                  setFieldValue={setFieldValue}
                  handleFileChange={handleFileChange}
                  fileInputRefs={fileInputRefs}
                />
                <VariantsForm values={values} setFieldValue={setFieldValue} openVariantModal={openVariantModal} removeVariant={removeVariant} />
                <FormActions />
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
                  <CropModal
                    imageSrc={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    rotation={rotation}
                    cropShape={cropShape}
                    setCrop={setCrop}
                    setZoom={setZoom}
                    setRotation={setRotation}
                    setCropShape={setCropShape}
                    onCropComplete={onCropComplete}
                    handleCrop={handleCrop}
                    setShowCropModal={setShowCropModal}
                    setFieldValue={setFieldValue}
                  />
                )}
              </Form>
            )}
          </Formik>
        </div>
      </main>
      <LoadingOverlay isLoading={isLoading} />
      <MobileMenuOverlay isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
    </div>
  );
};

export default AddMenuItems;