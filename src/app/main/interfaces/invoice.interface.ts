import { Order } from "./order.interface";

export interface Invoice {
    id?: string;
    invoiceCode: string;
    createAt: Date;
    order: Order;
    invoiceDate: Date;
    paymentDeadline: number;
    deliveryTerm: number;
    invoicedAmount: number;
    ivaAmount: number;
    remitAmount: number;
    total: number;
    isPaid: boolean;
}