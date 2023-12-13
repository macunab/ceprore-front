export interface Factory {
    id?: string;
    name: string;
    address: string;
    email: string;
    province?: string;
    provincialTown?: string;
    retainCommission?: boolean;
    limitDays?: number;
}