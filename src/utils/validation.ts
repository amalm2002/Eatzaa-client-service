interface FormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

interface SigninFormData {
    email: string;
    password: string;
}

interface RestaurantRegisterFormData {
    restaurantName: string;
    email: string;
    mobile: string;
}

interface RestaurantDocumentFormData {
    idProof: File | null;
    fssaiLicense: File | null;
    businessCertificate: File | null;
    bankAccountNumber: string;
    ifscCode: string;
}

interface ValidationErrors {
    [key: string]: string;
}

export const validateSignup = (formData: FormData): ValidationErrors => {
    const errors: ValidationErrors = {};

    if (!formData.name || formData.name.trim() === '') {
        errors.name = 'Full Name is required and cannot be empty.';
    } else if (formData.name.length < 2) {
        errors.name = 'Full Name must be at least 2 characters long.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
        errors.email = 'Please enter a valid email address.';
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!formData.password) {
        errors.password = 'Password is required.';
    } else if (!passwordRegex.test(formData.password)) {
        errors.password = 'Password must be at least 8 characters long and include uppercase, lowercase, and a number.';
    }

    if (!formData.confirmPassword) {
        errors.confirmPassword = 'Please confirm your password.';
    } else if (formData.confirmPassword !== formData.password) {
        errors.confirmPassword = 'Passwords do not match.';
    }

    return errors;
};


export const validateSignin = (formData: SigninFormData): ValidationErrors => {
    const errors: ValidationErrors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
        errors.email = 'Email address is required.';
    } else if (!emailRegex.test(formData.email)) {
        errors.email = 'Please enter a valid email address.';
    }

    if (!formData.password) {
        errors.password = 'Password is required.';
    }

    return errors;
};


export const validateRestaurantRegister = (formData: RestaurantRegisterFormData): ValidationErrors => {
    const errors: ValidationErrors = {};

    if (!formData.restaurantName || formData.restaurantName.trim() === '') {
        errors.restaurantName = 'Restaurant Name is required and cannot be empty.';
    } else if (formData.restaurantName.length < 2) {
        errors.restaurantName = 'Restaurant Name must be at least 2 characters long.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
        errors.email = 'Please enter a valid email address.';
    }

    const mobileRegex = /^[1-9]\d{9}$/;

    if (!mobileRegex.test(formData.mobile)) {
        errors.mobile = 'Mobile number must be exactly 10 digits, cannot start with 0, and should not contain spaces.';
    } else if (/^([0])\1*$/.test(formData.mobile)) {
        errors.mobile = 'Mobile number cannot be all zeros.';
    }

    return errors;
};


export const validateRestaurantDocument = (formData: RestaurantDocumentFormData): ValidationErrors => {
    const errors: ValidationErrors = {}

    if (/[^\d]/.test(formData.bankAccountNumber)) {
        errors.bankAccountNumber = "Bank Account Number should contain only digits (no letters or symbols)";
    } else if (formData.bankAccountNumber.length < 9 || formData.bankAccountNumber.length > 18) {
        errors.bankAccountNumber = "Bank Account Number must be between 9 to 18 digits";
    }
    if (!formData.ifscCode) {
        errors.ifscCode = "IFSC Code is required";
    } else if (!/^[A-Z]{4}0\d{6}$/.test(formData.ifscCode.toUpperCase())) {
        errors.ifscCode = "Enter a valid IFSC code (e.g., HDFC0001234)";
    }

    return errors
}