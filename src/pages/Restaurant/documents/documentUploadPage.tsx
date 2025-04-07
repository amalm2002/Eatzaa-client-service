import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Upload, CreditCard, FileText, X } from "lucide-react";
import createAxios from "../../../service/axiousServices/restaurantAxious";
import { validateRestaurantDocument } from "../../../utils/validation";

interface DocumentData {
    idProof: File | null;
    fssaiLicense: File | null;
    businessCertificate: File | null;
    bankAccountNumber: string;
    ifscCode: string;
    idProofUrl?: string;
    fassiLicenseUrl?: string;
    businessCertificateUrl?: string;
    restaurant_id: string;
}

interface DocumentUploadPageProps {
    formData: {
        restaurantName: string;
        email: string;
        mobile: string;
    };
    navigate: (path: string) => void;
    setStep: (step: "credentials" | "otp" | "documents" | "location") => void;
}

interface ValidationErrors {
    [key: string]: string
}

// const DocumentUploadPage = ({ formData, navigate, setStep }: DocumentUploadPageProps) => {
const DocumentUploadPage = ({ formData,  setStep }: DocumentUploadPageProps) => {

    const [error, setError] = useState<string | null>(null);
    const [documentData, setDocumentData] = useState<DocumentData>({
        idProof: null,
        fssaiLicense: null,
        businessCertificate: null,
        bankAccountNumber: "",
        ifscCode: "",
        restaurant_id: ''
    });

    const [docFeildError, setDocFeildError] = useState<ValidationErrors>({})

    const axiosInstance = createAxios();

    const uploadToCloudinary = async (file: File): Promise<string> => {

        const formData = new FormData()
        formData.append('file', file)
        formData.append('upload_preset', 'restaurant_docs')
        formData.append('cloud_name', import.meta.env.VITE_CLOUDINARY_NAME);

        const response = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_NAME}/image/upload`, {
            method: 'post',
            body: formData
        })

        console.log(response);


        const data = await response.json();
        if (data.secure_url) {
            return data.secure_url;
        } else {
            throw new Error("Failed to upload to Cloudinary");
        }
    }

    const handleSubmitDocuments = async () => {
        const requiredFields = [!documentData.idProof, !documentData.fssaiLicense, !documentData.businessCertificate, !documentData.bankAccountNumber, !documentData.ifscCode];

        if (requiredFields.some((field) => field)) {
            setError("Please fill all required fields and upload all documents.");
            return;
        }

        const validationDocErrors = validateRestaurantDocument(documentData)
        setDocFeildError(validationDocErrors)

        if (Object.keys(validationDocErrors).length > 0) {
            return
        }

        try {

            //upload files to cloudinary return the URL
            const extractImageName = (url: string) => url ? url.split('/').pop() || '' : '';

            const idProofUrl = documentData.idProof ? await uploadToCloudinary(documentData.idProof) : ''
            const fssaiLicenseUrl = documentData.fssaiLicense ? await uploadToCloudinary(documentData.fssaiLicense) : ''
            const businessCertificateUrl = documentData.businessCertificate ? await uploadToCloudinary(documentData.businessCertificate) : ''

            const idProofUrlName = idProofUrl ? extractImageName(idProofUrl) : ''
            const fssaiLicenseUrlName = fssaiLicenseUrl ? extractImageName(fssaiLicenseUrl) : ''
            const businessCertificateUrlName = businessCertificateUrl ? extractImageName(businessCertificateUrl) : ''

            const restaurant_id = localStorage.getItem('restaurantId') || ''
            setDocumentData((prev) => ({
                ...prev,
                idProofUrlName,
                fssaiLicenseUrlName,
                businessCertificateUrlName,
                restaurant_id
            }));


            const formDataToSend = new FormData();

            formDataToSend.append("restaurantName", formData.restaurantName);
            formDataToSend.append("email", formData.email);
            formDataToSend.append("mobile", formData.mobile);
            formDataToSend.append("idProofUrl", idProofUrlName);
            formDataToSend.append("fssaiLicenseUrl", fssaiLicenseUrlName);
            formDataToSend.append("businessCertificateUrl", businessCertificateUrlName);
            formDataToSend.append("bankAccountNumber", documentData.bankAccountNumber);
            formDataToSend.append("ifscCode", documentData.ifscCode);
            formDataToSend.append("restaurant_id", restaurant_id);

            const response = await axiosInstance.post("/restaurant-documents",
                formDataToSend, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            // if (response.data.message === "Success") navigate("/restaurant-location");
            if (response.data.message === "Success") setStep("location")
            else setError(response.data.error || "Failed to submit documents.");

        } catch (error: any) {
            console.error("Error submitting documents:", error);
            setError("An error occurred while submitting documents.");
        }
    };

    const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, files } = e.target as any;

        if (files) {
            setDocumentData((prev) => ({ ...prev, [name]: files[0] }));
        } else {
            setDocumentData((prev) => ({ ...prev, [name]: value }));
        }

        if (error) setError(null);

        if (docFeildError[name]) {
            setDocFeildError(prev => ({
                ...prev,
                [name]: ''
            }))
        }
    };

    const idProofRef = useRef<HTMLInputElement>(null)
    const fssaiLicenseRef = useRef<HTMLInputElement>(null)
    const businessCertificateRef = useRef<HTMLInputElement>(null)

    const removeDocument = (field: keyof DocumentData) => {
        // console.log('removeeeeeeeeeee document :', field);

        setDocumentData((prev) =>
            ({ ...prev, [field]: null }));

        if (field === 'idProof' && idProofRef.current) {
            idProofRef.current.value = '';
        }
        if (field === 'fssaiLicense' && fssaiLicenseRef.current) {
            fssaiLicenseRef.current.value = '';
        }
        if (field === 'businessCertificate' && businessCertificateRef.current) {
            businessCertificateRef.current.value = '';
        }
    };

    return (
        <div className="md:w-1/2 flex flex-col justify-center items-center p-6 md:p-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-lg bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-blue-100/50"
            >
                <div className="text-center mb-8">
                    <div className="inline-block p-4 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-full mb-4 shadow-md">
                        <Upload className="w-12 h-12 text-indigo-600" />
                    </div>
                    <h2 className="text-3xl font-bold  bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-700">
                        Submit Your Documents
                    </h2>
                    <p className="text-gray-600 mt-2 text-lg">Complete your restaurant registration with elegance</p>
                </div>

                {error && <p className="text-red-500 mb-6 text-center font-medium bg-red-50 p-2 rounded-lg">{error}</p>}

                <div className="space-y-8">
                    {/* ID Proof */}
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                        <label className="block text-gray-700 font-semibold mb-2">ID Proof of Restaurant Owner</label>
                        <div className="relative flex items-center border-2 border-gray-200 rounded-xl p-4 bg-white transition-all duration-300 hover:border-indigo-400 hover:shadow-lg">
                            <FileText className="text-indigo-500 mr-3" />
                            <input
                                ref={idProofRef}
                                type="file"
                                name="idProof"
                                accept=".pdf,.jpg,.png"
                                onChange={handleDocumentChange}
                                className="w-full text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                            />
                            {documentData.idProof && (
                                <button
                                    onClick={() => removeDocument("idProof")}
                                    className="absolute right-4 text-red-500 hover:text-red-700 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            )}
                        </div>
                        {documentData.idProof && (
                            <div className="mt-4 flex justify-items-start ">
                                <img
                                    src={URL.createObjectURL(documentData.idProof)}
                                    alt="ID Proof Preview"
                                    className="w-32 h-22 object-cover rounded-lg border border-gray-300"
                                />
                            </div>
                        )}
                    </motion.div>

                    {/* FSSAI License */}
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                        <label className="block text-gray-700 font-semibold mb-2">FSSAI License</label>
                        <div className="relative flex items-center border-2 border-gray-200 rounded-xl p-4 bg-white transition-all duration-300 hover:border-indigo-400 hover:shadow-lg">
                            <FileText className="text-indigo-500 mr-3" />
                            <input
                                ref={fssaiLicenseRef}
                                type="file"
                                name="fssaiLicense"
                                accept=".pdf,.jpg,.png"
                                onChange={handleDocumentChange}
                                className="w-full text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                            />
                            {documentData.fssaiLicense && (
                                <button
                                    onClick={() => removeDocument("fssaiLicense")}
                                    className="absolute right-4 text-red-500 hover:text-red-700 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            )}
                        </div>
                        {documentData.fssaiLicense && (
                            <div className="mt-4 flex justify-items-start ">
                                <img
                                    src={URL.createObjectURL(documentData.fssaiLicense)}
                                    alt="ID Proof Preview"
                                    className="w-32 h-22 object-cover rounded-lg border border-gray-300"
                                />
                            </div>
                        )}
                    </motion.div>

                    {/* Business Registration Certificate */}
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                        <label className="block text-gray-700 font-semibold mb-2">Business Registration Certificate</label>
                        <div className="relative flex items-center border-2 border-gray-200 rounded-xl p-4 bg-white transition-all duration-300 hover:border-indigo-400 hover:shadow-lg">
                            <FileText className="text-indigo-500 mr-3" />
                            <input
                                ref={businessCertificateRef}
                                type="file"
                                name="businessCertificate"
                                accept=".pdf,.jpg,.png"
                                onChange={handleDocumentChange}
                                className="w-full text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                            />
                            {documentData.businessCertificate && (
                                <button
                                    onClick={() => removeDocument("businessCertificate")}
                                    className="absolute right-4 text-red-500 hover:text-red-700 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            )}
                        </div>
                        {documentData.businessCertificate && (
                            <div className="mt-4 flex justify-items-start ">
                                <img
                                    src={URL.createObjectURL(documentData.businessCertificate)}
                                    alt="ID Proof Preview"
                                    className="w-32 h-22 object-cover rounded-lg border border-gray-300"
                                />
                            </div>
                        )}
                    </motion.div>

                    {/* Bank Details */}
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                        <label className="block text-gray-700 font-semibold mb-2">Bank Details</label>

                        <div className="space-y-4">
                            <div className="flex items-center border-2 border-gray-200 rounded-xl p-4 bg-white transition-all duration-300 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-200">
                                <CreditCard className="text-indigo-500 mr-3" />
                                <input
                                    type="text"
                                    name="bankAccountNumber"
                                    value={documentData.bankAccountNumber}
                                    onChange={handleDocumentChange}
                                    placeholder="Bank Account Number"
                                    className="w-full focus:outline-none text-gray-700 placeholder-gray-400"
                                />
                            </div>
                            {docFeildError.bankAccountNumber && (
                                <p className="text-red-500 mb-6 text-center font-medium  bg-red-50 p-2 rounded-lg">{docFeildError.bankAccountNumber}</p>
                            )}
                            <div className="flex items-center border-2 border-gray-200 rounded-xl p-4 bg-white transition-all duration-300 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-200">
                                <CreditCard className="text-indigo-500 mr-3" />
                                <input
                                    type="text"
                                    name="ifscCode"
                                    value={documentData.ifscCode}
                                    onChange={handleDocumentChange}
                                    placeholder="IFSC Code"
                                    className="w-full focus:outline-none text-gray-700 placeholder-gray-400"
                                />
                            </div>
                            {docFeildError.ifscCode && (
                                <p className="text-red-500 mb-6 text-center font-medium  bg-red-50 p-2 rounded-lg">{docFeildError.ifscCode}</p>
                            )}
                        </div>

                    </motion.div>

                    {/* Submit Button */}
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                        <button
                            onClick={handleSubmitDocuments}
                            className="w-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white py-4 rounded-xl font-semibold text-lg hover:from-indigo-700 hover:to-blue-600 transition duration-300 shadow-lg transform hover:scale-105"
                        >
                            Complete Registration
                        </button>
                    </motion.div>

                </div>
            </motion.div>
        </div>
    );
};

export default DocumentUploadPage;