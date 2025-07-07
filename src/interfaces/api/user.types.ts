export interface OtpRequest {
  email: string;
  otp: string;
  formData: any;
  token: string;
}

export interface ResendOtpRequest {
  email: string;
  formData: any;
}

export interface LoginRequest {
  email: string;
  password: string;
  userToken?: string;
  refreshToken?: string;
  role?: 'User' | 'Admin';
}

export interface GoogleLoginRequest {
  email: string;
}

export interface UserApiResponse {
  success: boolean;
  message: string;
  token?: string;
  refreshToken?: string;
  user?: any;
  userId?: string;
  role?: 'User' | 'Admin';
  isActive?: boolean;
  isAdmin?: boolean;
  data?: any;
}