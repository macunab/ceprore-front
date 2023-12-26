import { Order } from "./order.interface";

export interface Invoice {
    id?: string;
    invoiceCode: string;
    createAt: Date;
    order: Order;
    invoiceDate: Date;
    paymentDeadline: number;
    deliveryTerm: number;
    invoiceAmount: number;
    ivaAmount: number;
    remitAmount: number;
    total: number;
}