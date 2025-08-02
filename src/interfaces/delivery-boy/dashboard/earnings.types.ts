export interface Earnings {
    today: number;
    week: number;
    history?: Array<{
        amount: number;
        date: string;
        orderId: string;
        paid: boolean;
        _id: string;
    }>
}
