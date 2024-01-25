
export interface Invoice {
    
    invoiceCode: string;
    createdAt: Date;
    invoiceDate: Date;
    paymentDeadline: number;
    deliveryTerm: number;
    invoicedAmount: number;
    ivaAmount: number;
    remitAmount: number;
    total: number;
}