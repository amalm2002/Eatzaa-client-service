export interface UserApiResponse {
    response: {
        user: {
            name: string;
            phone?: string;
            address: { street: string; city: string; state: string; pinCode: string }[];
            email: string;
            isActive: boolean;
            isAdmin: boolean;
        };
    };
}