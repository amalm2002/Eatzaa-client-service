export interface Message {
    id: string;
    text: string;
    isBot: boolean;
    timestamp: string;
    options?: string[];
    showForm?: boolean;
    showZoneSelection?: boolean;
}

export interface Zone {
    _id: string;
    name: string;
}

export interface ConcernForm {
    reason: string;
    description: string;
}

export interface Concern {
    id: string;
    title: string;
    description: string;
    status: 'pending' | 'approved' | 'rejected';
    submittedBy: string;
    submittedDate: string;
    category: string;
}