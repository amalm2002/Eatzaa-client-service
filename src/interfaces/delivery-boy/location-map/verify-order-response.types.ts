export interface VerifyOrderResponse {
    success: boolean;
    message: string;
    userId?: string;
    location?: { latitude: number; longitude: number };
}