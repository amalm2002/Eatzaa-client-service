// import { useState, useRef, useEffect } from 'react';
// import { X, Plus, Camera, Save, Check } from 'lucide-react';
// import { Formik, Form, Field } from 'formik';
// import * as Yup from 'yup';
// import Header from '../navbar/header';
// import Sidebar from '../navbar/sidebar';
// import useRestaurantStatus from '../../../hooks/useRestaurantStatus';
// import createAxios from '../../../service/axiousServices/restaurantAxious';
// import { useSelector } from 'react-redux';

// interface Variant {
//   id: string;
//   name: string;
//   price: number;
// }

// interface MenuItem {
//   id: string;
//   name: string;
//   description: string;
//   category: 'veg' | 'non-veg' | 'drinks';
//   price: number;
//   quantity: number;
//   images: string[];
//   hasVariants: boolean;
//   variants: Variant[];
//   timing?: 'daily' | 'afternoon' | 'evening';
// }

// interface VariantModalProps {
//   mode: 'new' | 'existing';
//   newVariant: Variant;
//   setNewVariant: (variant: Variant) => void;
//   setShowVariantModal: (show: boolean) => void;
//   setFieldValue: (field: string, value: any) => void;
//   values: MenuItem;
//   existingVariants: Variant[];
//   selectedExistingVariant: string;
//   setSelectedExistingVariant: (id: string) => void;
// }

// const existingVariants = [
//   { id: 'var1', name: 'Small', price: 99 },
//   { id: 'var2', name: 'Medium', price: 149 },
//   { id: 'var3', name: 'Large', price: 199 },
//   { id: 'var4', name: 'Extra Spicy', price: 20 },
//   { id: 'var5', name: 'Extra Cheese', price: 30 },
// ];

// const validationSchema = Yup.object({
//   name: Yup.string().required('Item name is required'),
//   category: Yup.string().required('Category is required'),
//   price: Yup.number().required('Price is required').min(0, 'Price must be positive'),
//   quantity: Yup.number().required('Quantity is required').min(0, 'Quantity must be positive'),
//   images: Yup.array().of(Yup.string()),
// });

// const VariantModal: React.FC<VariantModalProps> = ({
//   mode,
//   newVariant,
//   setNewVariant,
//   setShowVariantModal,
//   setFieldValue,
//   values,
//   existingVariants,
//   selectedExistingVariant,
//   setSelectedExistingVariant,
// }) => {
//   const addCustomVariant = () => {
//     if (newVariant.name && newVariant.price > 0) {
//       setFieldValue('variants', [...values.variants, { ...newVariant, id: Date.now().toString() }]);
//       setNewVariant({ id: Date.now().toString(), name: '', price: 0 });
//       setShowVariantModal(false);
//     }
//   };

//   const axiosInstance = createAxios();

//   const addExistingVariant = () => {
//     // const variantToAdd = existingVariants.find((v) => v.id === selectedExistingVariant);
//     // if (variantToAdd && !values.variants.some((v) => v.id === variantToAdd.id)) {
//     //   setFieldValue('variants', [...values.variants, variantToAdd]);
//     //   setSelectedExistingVariant('');
//     //   setShowVariantModal(false);
//     // }
//     useEffect(() => {
//       const restaurantId = useSelector((store: { restaurantAuth: { restaurant_id: string } }) => store.restaurantAuth.restaurant_id);
//       const fetchVariants = async () => {
//         const response = await axiosInstance.get(`/variant/${restaurantId}`)

//         console.log('variant response', response);


//       }

//       fetchVariants()

//     },[])
//   };

//   return (
//     <div className="fixed inset-0 bg-white/10 bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="text-lg font-semibold text-gray-800">
//             {mode === 'new' ? 'Add Custom Variant' : 'Add Existing Variant'}
//           </h3>
//           <button onClick={() => setShowVariantModal(false)} className="text-gray-500 hover:text-gray-700">
//             <X size={20} />
//           </button>
//         </div>
//         {mode === 'new' ? (
//           <>
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-1">Variant Name*</label>
//               <input
//                 type="text"
//                 className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6589f6]"
//                 placeholder="e.g. Small, Medium, Large"
//                 value={newVariant.name}
//                 onChange={(e) => setNewVariant({ ...newVariant, name: e.target.value })}
//               />
//             </div>
//             <div className="mb-6">
//               <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)*</label>
//               <div className="relative">
//                 <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
//                 <input
//                   type="number"
//                   min="0"
//                   step="0.01"
//                   className="w-full border border-gray-300 rounded-md pl-8 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6589f6]"
//                   placeholder="0.00"
//                   value={newVariant.price}
//                   onChange={(e) => setNewVariant({ ...newVariant, price: parseFloat(e.target.value) || 0 })}
//                 />
//               </div>
//             </div>
//             <div className="flex justify-end space-x-3">
//               <button
//                 type="button"
//                 onClick={() => setShowVariantModal(false)}
//                 className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="button"
//                 onClick={addCustomVariant}
//                 className={`px-4 py-2 bg-[#6589f6] text-white rounded-md hover:bg-[#5578e5] transition-colors ${!newVariant.name || newVariant.price <= 0 ? 'opacity-50 cursor-not-allowed' : ''
//                   }`}
//                 disabled={!newVariant.name || newVariant.price <= 0}
//               >
//                 Add Variant
//               </button>
//             </div>
//           </>
//         ) : (
//           <>
//             <div className="mb-6">
//               <label className="block text-sm font-medium text-gray-700 mb-1">Select Variant*</label>
//               <select
//                 className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6589f6]"
//                 value={selectedExistingVariant}
//                 onChange={(e) => setSelectedExistingVariant(e.target.value)}
//               >
//                 <option value="">-- Select Variant --</option>
//                 {existingVariants.map((variant) => (
//                   <option
//                     key={variant.id}
//                     value={variant.id}
//                     disabled={values.variants.some((v) => v.id === variant.id)}
//                   >
//                     {variant.name} (₹{variant.price})
//                   </option>
//                 ))}
//               </select>
//               <p className="text-xs text-gray-500 mt-1">Variants already added to this item are disabled</p>
//             </div>
//             <div className="flex justify-end space-x-3">
//               <button
//                 type="button"
//                 onClick={() => setShowVariantModal(false)}
//                 className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="button"
//                 onClick={addExistingVariant}
//                 className={`px-4 py-2 bg-[#6589f6] text-white rounded-md hover:bg-[#5578e5] transition-colors ${!selectedExistingVariant ? 'opacity-50 cursor-not-allowed' : ''
//                   }`}
//                 disabled={!selectedExistingVariant}
//               >
//                 Add Variant
//               </button>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export const AddMenuItems = () => {
//   const [showVariantModal, setShowVariantModal] = useState(false);
//   const [variantModalMode, setVariantModalMode] = useState<'new' | 'existing'>('new');
//   const [newVariant, setNewVariant] = useState<Variant>({
//     id: Date.now().toString(),
//     name: '',
//     price: 0,
//   });
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [activeMenu, setActiveMenu] = useState('Menu Items');
//   const { isOnline, handleToggleOnline } = useRestaurantStatus();
//   const [selectedExistingVariant, setSelectedExistingVariant] = useState<string>('');
//   const [selectedFiles, setSelectedFiles] = useState<(File | null)[]>([null, null, null]);

//   const fileInputRefs = useRef<Array<HTMLInputElement | null>>([]);
//   useEffect(() => {
//     fileInputRefs.current = Array(3).fill(null);
//   }, []);

//   const axiosInstance = createAxios();

//   const handleFileChange = (
//     index: number,
//     event: React.ChangeEvent<HTMLInputElement>,
//     setFieldValue: (field: string, value: any) => void
//   ) => {
//     const file = event.target.files?.[0];
//     console.log(`File selected at index ${index}:`, file);
//     if (file) {
//       const imageUrl = URL.createObjectURL(file);
//       setFieldValue(`images[${index}]`, imageUrl);
//       const newFiles = [...selectedFiles];
//       newFiles[index] = file;
//       setSelectedFiles(newFiles);
//     }
//   };

//   const restaurantId = useSelector((store: { restaurantAuth: { restaurant_id: string } }) => store.restaurantAuth.restaurant_id);

//   const handleSubmit = async (values: MenuItem) => {
//     try {
//       // const restaurantId = localStorage.getItem('restaurantId');
//       const formData = new FormData();

//       formData.append('name', values.name);
//       formData.append('description', values.description);
//       formData.append('category', values.category);
//       formData.append('price', values.price.toString());
//       formData.append('quantity', values.quantity.toString());
//       formData.append('hasVariants', values.hasVariants.toString());
//       formData.append('timing', values.timing || 'daily');
//       formData.append('restaurantId', restaurantId || '');
//       formData.append('variants', JSON.stringify(values.variants));

//       // console.log('Selected files:', selectedFiles);
//       selectedFiles.forEach((file, index) => {
//         if (file) {
//           formData.append(`images[${index}]`, file);
//         }
//       });

//       const response = await axiosInstance.post('/menu-items', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       console.log('Menu item saved:', response.data);
//       alert('Menu item saved successfully!');
//     } catch (error) {
//       console.error('Error saving menu item:', error);
//       alert('Failed to save menu item.');
//     }
//   };

//   const toggleVariants = (
//     setFieldValue: (field: string, value: any) => void,
//     values: MenuItem
//   ) => {
//     setFieldValue('hasVariants', !values.hasVariants);
//     if (!values.hasVariants) setFieldValue('variants', []);
//   };

//   const removeVariant = (
//     id: string,
//     setFieldValue: (field: string, value: any) => void,
//     values: MenuItem
//   ) => {
//     setFieldValue('variants', values.variants.filter((v) => v.id !== id));
//   };

//   const openVariantModal = (mode: 'new' | 'existing') => {
//     setVariantModalMode(mode);
//     setShowVariantModal(true);
//   };


//   return (
//     <div className="bg-gray-50 min-h-screen">
//       <Header isOnline={isOnline} handleToggleOnline={handleToggleOnline} setIsMobileMenuOpen={setIsMobileMenuOpen} />
//       <Sidebar
//         activeMenu={activeMenu}
//         setActiveMenu={setActiveMenu}
//         isMobileMenuOpen={isMobileMenuOpen}
//         setIsMobileMenuOpen={setIsMobileMenuOpen}
//         isOnline={isOnline}
//       />

//       <main className="md:ml-64 max-w-3x2 mx-auto p-6">
//         <div className="bg-white rounded-lg shadow-md p-6">
//           <Formik
//             initialValues={{
//               id: '',
//               name: '',
//               description: '',
//               category: 'veg' as const,
//               price: 0,
//               quantity: 0,
//               images: ['', '', ''],
//               hasVariants: false,
//               variants: [] as Variant[],
//               timing: 'daily' as const,
//             }}
//             validationSchema={validationSchema}
//             onSubmit={handleSubmit}
//           >
//             {({ values, setFieldValue, errors, touched }) => (
//               <Form>
//                 {/* Basic Information */}
//                 <div className="mb-8">
//                   <h2 className="text-lg font-semibold mb-4 text-gray-700 flex items-center">
//                     <span className="w-1 h-6 bg-[#6589f6] rounded mr-2"></span>
//                     Basic Information
//                   </h2>
//                   <div className="mb-5">
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Item Name*</label>
//                     <Field
//                       name="name"
//                       type="text"
//                       className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6589f6]"
//                       placeholder="e.g. Paneer Tikka Masala"
//                     />
//                     {errors.name && touched.name && <div className="text-red-500 text-sm">{errors.name}</div>}
//                   </div>
//                   <div className="mb-5">
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//                     <Field
//                       name="description"
//                       as="textarea"
//                       rows={3}
//                       className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6589f6]"
//                       placeholder="Describe your dish in detail"
//                     />
//                   </div>
//                   <div className="mb-4">
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Category*</label>
//                     <div className="grid grid-cols-3 gap-4">
//                       {(['veg', 'non-veg', 'drinks'] as const).map((category) => (
//                         <button
//                           key={category}
//                           type="button"
//                           onClick={() => setFieldValue('category', category)}
//                           className={`py-2 px-4 rounded-md border transition-all duration-200 ${values.category === category
//                             ? 'bg-[#6589f6] text-white border-[#6589f6] shadow-md'
//                             : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50'
//                             }`}
//                         >
//                           {category === 'veg' && '🥬 '}
//                           {category === 'non-veg' && '🍗 '}
//                           {category === 'drinks' && '🥤 '}
//                           {category.charAt(0).toUpperCase() + category.slice(1)}
//                         </button>
//                       ))}
//                     </div>
//                     {errors.category && touched.category && <div className="text-red-500 text-sm">{errors.category}</div>}
//                   </div>
//                 </div>

//                 {/* Pricing & Quantity */}
//                 <div className="mb-8">
//                   <h2 className="text-lg font-semibold mb-4 text-gray-700 flex items-center">
//                     <span className="w-1 h-6 bg-[#6589f6] rounded mr-2"></span>
//                     Pricing & Quantity
//                   </h2>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)*</label>
//                       <div className="relative">
//                         <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
//                         <Field
//                           name="price"
//                           type="number"
//                           min="0"
//                           className="w-full border border-gray-300 rounded-md pl-8 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6589f6]"
//                           placeholder="0.00"
//                         />
//                       </div>
//                       {errors.price && touched.price && <div className="text-red-500 text-sm">{errors.price}</div>}
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">Quantity Available</label>
//                       <Field
//                         name="quantity"
//                         type="number"
//                         min="0"
//                         className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6589f6]"
//                         placeholder="0"
//                       />
//                       {errors.quantity && touched.quantity && <div className="text-red-500 text-sm">{errors.quantity}</div>}
//                     </div>
//                   </div>
//                 </div>

//                 {/* Images & Timing */}
//                 <div className="mb-8">
//                   <h2 className="text-lg font-semibold mb-4 text-gray-700 flex items-center">
//                     <span className="w-1 h-6 bg-[#6589f6] rounded mr-2"></span>
//                     Images & Timing
//                   </h2>
//                   <div className="mb-6">
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Availability Timing</label>
//                     <div className="grid grid-cols-3 gap-4">
//                       {(['daily', 'afternoon', 'evening'] as const).map((timing) => (
//                         <button
//                           key={timing}
//                           type="button"
//                           onClick={() => setFieldValue('timing', timing)}
//                           className={`py-2 px-4 rounded-md border transition-all duration-200 ${values.timing === timing
//                             ? 'bg-[#6589f6] text-white border-[#6589f6] shadow-md'
//                             : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50'
//                             }`}
//                         >
//                           {timing.charAt(0).toUpperCase() + timing.slice(1)}
//                         </button>
//                       ))}
//                     </div>
//                   </div>
//                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                     {values.images.map((image, index) => (
//                       <div
//                         key={index}
//                         className={`border-2 ${image ? 'border-gray-200' : 'border-dashed border-gray-300'
//                           } rounded-lg p-4 flex flex-col items-center justify-center h-48 transition-all duration-200 hover:border-[#6589f6]`}
//                       >
//                         {image ? (
//                           <div className="relative w-full h-full">
//                             <img src={image} alt="Food item" className="w-full h-full object-cover rounded" />
//                             <button
//                               type="button"
//                               onClick={() => setFieldValue(`images[${index}]`, '')}
//                               className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-gray-100"
//                             >
//                               <X size={16} />
//                             </button>
//                             {index === 0 && (
//                               <div className="absolute bottom-0 left-0 right-0 bg-[#6589f6] text-white text-xs py-1 text-center">
//                                 Primary Image
//                               </div>
//                             )}
//                           </div>
//                         ) : (
//                           <div className="flex flex-col items-center text-gray-500 hover:text-[#6589f6] w-full h-full justify-center">
//                             <input
//                               type="file"
//                               accept="image/*"
//                               ref={(el: HTMLInputElement | null) => {
//                                 fileInputRefs.current[index] = el;
//                               }}
//                               onChange={(e) => handleFileChange(index, e, setFieldValue)}
//                               className="hidden"
//                             />
//                             <button
//                               type="button"
//                               onClick={() => fileInputRefs.current[index]?.click()}
//                               className="flex flex-col items-center cursor-pointer"
//                             >
//                               <div className="bg-gray-100 rounded-full p-3">
//                                 <Camera size={24} />
//                               </div>
//                               <span className="mt-2 text-sm font-medium">
//                                 {index === 0 ? 'Primary Image*' : `Additional Image ${index}`}
//                               </span>
//                               <span className="text-xs text-gray-400 mt-1">Click to upload</span>
//                             </button>
//                           </div>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Variants */}
//                 <div className="mb-8">
//                   <div className="flex justify-between items-center mb-4">
//                     <h2 className="text-lg font-semibold text-gray-700 flex items-center">
//                       <span className="w-1 h-6 bg-[#6589f6] rounded mr-2"></span>
//                       Variants
//                     </h2>
//                     <div className="flex items-center">
//                       <span className="text-sm text-gray-600 mr-3">Enable Variants</span>
//                       <button
//                         type="button"
//                         onClick={() => toggleVariants(setFieldValue, values)}
//                         className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${values.hasVariants ? 'bg-[#6589f6]' : 'bg-gray-200'
//                           }`}
//                       >
//                         <span
//                           className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${values.hasVariants ? 'translate-x-6' : 'translate-x-1'
//                             }`}
//                         />
//                       </button>
//                     </div>
//                   </div>

//                   {values.hasVariants && (
//                     <>
//                       <div className="bg-[#6589f6]/10 rounded-md p-4 mb-4 border border-[#6589f6]/20 flex items-start">
//                         <div className="text-[#6589f6] mr-3 mt-1">
//                           <Check size={16} />
//                         </div>
//                         <div className="text-sm text-[#6589f6]">
//                           <p className="font-medium">Variants enabled</p>
//                           <p className="mt-1">
//                             Add different size options, add-ons, or customizations for this menu item.
//                           </p>
//                         </div>
//                       </div>
//                       <div className="mb-4 flex flex-wrap gap-2">
//                         <button
//                           type="button"
//                           onClick={() => openVariantModal('new')}
//                           className="bg-white border border-[#6589f6] text-[#6589f6] px-4 py-2 rounded-md flex items-center hover:bg-[#6589f6]/10"
//                         >
//                           <Plus size={16} className="mr-1" /> Add Custom Variant
//                         </button>
//                         <button
//                           type="button"
//                           onClick={() => openVariantModal('existing')}
//                           className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md flex items-center hover:bg-gray-50"
//                         >
//                           <Plus size={16} className="mr-1" /> Add Existing Variant
//                         </button>
//                       </div>
//                       {values.variants.length > 0 ? (
//                         <div className="border rounded-lg overflow-hidden shadow-sm">
//                           <table className="min-w-full divide-y divide-gray-200">
//                             <thead className="bg-gray-50">
//                               <tr>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                   Name
//                                 </th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                   Price (₹)
//                                 </th>
//                                 <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                   Action
//                                 </th>
//                               </tr>
//                             </thead>
//                             <tbody className="bg-white divide-y divide-gray-200">
//                               {values.variants.map((variant) => (
//                                 <tr key={variant.id} className="hover:bg-gray-50">
//                                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{variant.name}</td>
//                                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">₹{variant.price.toFixed(2)}</td>
//                                   <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                                     <button
//                                       type="button"
//                                       onClick={() => removeVariant(variant.id, setFieldValue, values)}
//                                       className="text-red-600 hover:text-red-900"
//                                     >
//                                       Remove
//                                     </button>
//                                   </td>
//                                 </tr>
//                               ))}
//                             </tbody>
//                           </table>
//                         </div>
//                       ) : (
//                         <div className="text-center py-10 bg-gray-50 rounded-md border border-dashed border-gray-300 text-gray-500">
//                           <div className="flex justify-center mb-2">
//                             <div className="p-2 bg-gray-100 rounded-full">
//                               <Plus size={24} className="text-gray-400" />
//                             </div>
//                           </div>
//                           <p className="font-medium">No variants added yet</p>
//                           <p className="text-sm mt-1">Add variants for different sizes, options, etc.</p>
//                         </div>
//                       )}
//                     </>
//                   )}
//                 </div>

//                 {/* Save Button */}
//                 <div className="flex justify-end">
//                   <button
//                     type="submit"
//                     className="bg-[#6589f6] text-white px-8 py-3 rounded-md flex items-center hover:bg-[#5578e5] transition-colors duration-200 shadow-md"
//                   >
//                     <Save size={20} className="mr-2" /> Save Menu Item
//                   </button>
//                 </div>

//                 {/* Variant Modal */}
//                 {showVariantModal && (
//                   <VariantModal
//                     mode={variantModalMode}
//                     newVariant={newVariant}
//                     setNewVariant={setNewVariant}
//                     setShowVariantModal={setShowVariantModal}
//                     setFieldValue={setFieldValue}
//                     values={values}
//                     existingVariants={existingVariants}
//                     selectedExistingVariant={selectedExistingVariant}
//                     setSelectedExistingVariant={setSelectedExistingVariant}
//                   />
//                 )}
//               </Form>
//             )}
//           </Formik>
//         </div>
//       </main>

//       {isMobileMenuOpen && (
//         <div
//           className="fixed inset-0 bg-black/50 z-40 md:hidden"
//           onClick={() => setIsMobileMenuOpen(false)}
//         />
//       )}
//     </div>
//   );
// };



import { useState, useRef, useEffect } from 'react';
import { X, Plus, Camera, Save, Check } from 'lucide-react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Header from '../navbar/header';
import Sidebar from '../navbar/sidebar';
import useRestaurantStatus from '../../../hooks/useRestaurantStatus';
import createAxios from '../../../service/axiousServices/restaurantAxious';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

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

  const axiosInstance = createAxios();
  const restaurantId = useSelector(
    (store: { restaurantAuth: { restaurant_id: string } }) => store.restaurantAuth.restaurant_id
  );

  // Fetch variants when modal opens in "existing" mode
  useEffect(() => {
    if (mode === 'existing') {
      const fetchVariants = async () => {
        try {
          setIsLoading(true);
          setError(null);
          const response = await axiosInstance.get(`/variant/${restaurantId}`);
          console.log('Fetched variants:', response.data);

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
  }, [mode, restaurantId,]);

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
    <div className="fixed inset-0 bg-white/10 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            {mode === 'new' ? 'Add Custom Variant' : 'Add Existing Variant'}
          </h3>
          <button
            onClick={() => setShowVariantModal(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        {mode === 'new' ? (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Variant Name*</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6589f6]"
                placeholder="e.g. Small, Medium, Large"
                value={newVariant.name}
                onChange={(e) => setNewVariant({ ...newVariant, name: e.target.value })}
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)*</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-md pl-8 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6589f6]"
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
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={addCustomVariant}
                className={`px-4 py-2 bg-[#6589f6] text-white rounded-md hover:bg-[#5578e5] transition-colors ${!newVariant.name || newVariant.price <= 0 ? 'opacity-50 cursor-not-allowed' : ''
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Variant*</label>
              {isLoading ? (
                <p className="text-gray-500">Loading variants...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : (
                <select
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6589f6]"
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
              <p className="text-xs text-gray-500 mt-1">
                Variants already added to this item are disabled
              </p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowVariantModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={addExistingVariant}
                className={`px-4 py-2 bg-[#6589f6] text-white rounded-md hover:bg-[#5578e5] transition-colors ${!selectedExistingVariant || isLoading ? 'opacity-50 cursor-not-allowed' : ''
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

  const fileInputRefs = useRef<Array<HTMLInputElement | null>>([]);
  useEffect(() => {
    fileInputRefs.current = Array(3).fill(null);
  }, []);

  const navigate = useNavigate()
  const axiosInstance = createAxios();

  const validationSchema = Yup.object({
    name: Yup.string().required('Item name is required'),
    category: Yup.string().required('Category is required'),
    price: Yup.number().required('Price is required').min(0, 'Price must be positive'),
    quantity: Yup.number().required('Quantity is required').min(0, 'Quantity must be positive'),
    images: Yup.array().of(Yup.string()),
  });

  const handleFileChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: any) => void
  ) => {
    const file = event.target.files?.[0];
    console.log(`File selected at index ${index}:`, file);
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFieldValue(`images[${index}]`, imageUrl);
      const newFiles = [...selectedFiles];
      newFiles[index] = file;
      setSelectedFiles(newFiles);
    }
  };

  const restaurantId = useSelector(
    (store: { restaurantAuth: { restaurant_id: string } }) => store.restaurantAuth.restaurant_id
  );

  const handleSubmit = async (values: MenuItem) => {
    try {
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

      console.log('Menu item saved:', response.data);
      alert('Menu item saved successfully!');
      navigate('/restaurant-dashboard')
    } catch (error) {
      console.error('Error saving menu item:', error);
      alert('Failed to save menu item.');
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
    <div className="bg-gray-50 min-h-screen">
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
        <div className="bg-white rounded-lg shadow-md p-6">
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
                {/* Basic Information */}
                <div className="mb-8">
                  <h2 className="text-lg font-semibold mb-4 text-gray-700 flex items-center">
                    <span className="w-1 h-6 bg-[#6589f6] rounded mr-2"></span>
                    Basic Information
                  </h2>
                  <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Item Name*</label>
                    <Field
                      name="name"
                      type="text"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6589f6]"
                      placeholder="e.g. Paneer Tikka Masala"
                    />
                    {errors.name && touched.name && <div className="text-red-500 text-sm">{errors.name}</div>}
                  </div>
                  <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <Field
                      name="description"
                      as="textarea"
                      rows={3}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6589f6]"
                      placeholder="Describe your dish in detail"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category*</label>
                    <div className="grid grid-cols-3 gap-4">
                      {(['veg', 'non-veg', 'drinks'] as const).map((category) => (
                        <button
                          key={category}
                          type="button"
                          onClick={() => setFieldValue('category', category)}
                          className={`py-2 px-4 rounded-md border transition-all duration-200 ${values.category === category
                              ? 'bg-[#6589f6] text-white border-[#6589f6] shadow-md'
                              : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                          {category === 'veg' && '🥬 '}
                          {category === 'non-veg' && '🍗 '}
                          {category === 'drinks' && '🥤 '}
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </button>
                      ))}
                    </div>
                    {errors.category && touched.category && (
                      <div className="text-red-500 text-sm">{errors.category}</div>
                    )}
                  </div>
                </div>

                {/* Pricing & Quantity */}
                <div className="mb-8">
                  <h2 className="text-lg font-semibold mb-4 text-gray-700 flex items-center">
                    <span className="w-1 h-6 bg-[#6589f6] rounded mr-2"></span>
                    Pricing & Quantity
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)*</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                        <Field
                          name="price"
                          type="number"
                          min="0"
                          className="w-full border border-gray-300 rounded-md pl-8 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6589f6]"
                          placeholder="0.00"
                        />
                      </div>
                      {errors.price && touched.price && <div className="text-red-500 text-sm">{errors.price}</div>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Quantity Available</label>
                      <Field
                        name="quantity"
                        type="number"
                        min="0"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6589f6]"
                        placeholder="0"
                      />
                      {errors.quantity && touched.quantity && (
                        <div className="text-red-500 text-sm">{errors.quantity}</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Images & Timing */}
                <div className="mb-8">
                  <h2 className="text-lg font-semibold mb-4 text-gray-700 flex items-center">
                    <span className="w-1 h-6 bg-[#6589f6] rounded mr-2"></span>
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
                          className={`py-2 px-4 rounded-md border transition-all duration-200 ${values.timing === timing
                              ? 'bg-[#6589f6] text-white border-[#6589f6] shadow-md'
                              : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50'
                            }`}
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
                          } rounded-lg p-4 flex flex-col items-center justify-center h-48 transition-all duration-200 hover:border-[#6589f6]`}
                      >
                        {image ? (
                          <div className="relative w-full h-full">
                            <img src={image} alt="Food item" className="w-full h-full object-cover rounded" />
                            <button
                              type="button"
                              onClick={() => setFieldValue(`images[${index}]`, '')}
                              className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-gray-100"
                            >
                              <X size={16} />
                            </button>
                            {index === 0 && (
                              <div className="absolute bottom-0 left-0 right-0 bg-[#6589f6] text-white text-xs py-1 text-center">
                                Primary Image
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center text-gray-500 hover:text-[#6589f6] w-full h-full justify-center">
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
                              <div className="bg-gray-100 rounded-full p-3">
                                <Camera size={24} />
                              </div>
                              <span className="mt-2 text-sm font-medium">
                                {index === 0 ? 'Primary Image*' : `Additional Image ${index}`}
                              </span>
                              <span className="text-xs text-gray-400 mt-1">Click to upload</span>
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Variants */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-700 flex items-center">
                      <span className="w-1 h-6 bg-[#6589f6] rounded mr-2"></span>
                      Variants
                    </h2>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600 mr-3">Enable Variants</span>
                      <button
                        type="button"
                        onClick={() => toggleVariants(setFieldValue, values)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${values.hasVariants ? 'bg-[#6589f6]' : 'bg-gray-200'
                          }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${values.hasVariants ? 'translate-x-6' : 'translate-x-1'
                            }`}
                        />
                      </button>
                    </div>
                  </div>

                  {values.hasVariants && (
                    <>
                      <div className="bg-[#6589f6]/10 rounded-md p-4 mb-4 border border-[#6589f6]/20 flex items-start">
                        <div className="text-[#6589f6] mr-3 mt-1">
                          <Check size={16} />
                        </div>
                        <div className="text-sm text-[#6589f6]">
                          <p className="font-medium">Variants enabled</p>
                          <p className="mt-1">
                            Add different size options, add-ons, or customizations for this menu item.
                          </p>
                        </div>
                      </div>
                      <div className="mb-4 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => openVariantModal('new')}
                          className="bg-white border border-[#6589f6] text-[#6589f6] px-4 py-2 rounded-md flex items-center hover:bg-[#6589f6]/10"
                        >
                          <Plus size={16} className="mr-1" /> Add Custom Variant
                        </button>
                        <button
                          type="button"
                          onClick={() => openVariantModal('existing')}
                          className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md flex items-center hover:bg-gray-50"
                        >
                          <Plus size={16} className="mr-1" /> Add Existing Variant
                        </button>
                      </div>
                      {values.variants.length > 0 ? (
                        <div className="border rounded-lg overflow-hidden shadow-sm">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Price (₹)
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Action
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {values.variants.map((variant) => (
                                <tr key={variant.id} className="hover:bg-gray-50">
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                    {variant.name}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                    ₹{variant.price.toFixed(2)}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                      type="button"
                                      onClick={() => removeVariant(variant.id, setFieldValue, values)}
                                      className="text-red-600 hover:text-red-900"
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
                        <div className="text-center py-10 bg-gray-50 rounded-md border border-dashed border-gray-300 text-gray-500">
                          <div className="flex justify-center mb-2">
                            <div className="p-2 bg-gray-100 rounded-full">
                              <Plus size={24} className="text-gray-400" />
                            </div>
                          </div>
                          <p className="font-medium">No variants added yet</p>
                          <p className="text-sm mt-1">Add variants for different sizes, options, etc.</p>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-[#6589f6] text-white px-8 py-3 rounded-md flex items-center hover:bg-[#5578e5] transition-colors duration-200 shadow-md"
                  >
                    <Save size={20} className="mr-2" /> Save Menu Item
                  </button>
                </div>

                {/* Variant Modal */}
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
              </Form>
            )}
          </Formik>
        </div>
      </main>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};