export interface Factory {
    _id?: string;
    name: string;
    address: string;
    email: string;
    province?: string;
    locality?: string;
    retainCommission?: boolean;
    limitDays?: number;
    commission?: number; // Definir como va a estar expresada la comision... entero o decimal (%);
}