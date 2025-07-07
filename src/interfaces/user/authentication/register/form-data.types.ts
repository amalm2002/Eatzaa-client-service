export interface FormData {
    email: string;
    password: string;
    userToken: string;
    refreshToken: string;
    role: 'User' | 'Admin';
}
