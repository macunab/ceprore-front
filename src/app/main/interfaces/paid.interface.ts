import { Invoice } from "./invoice.interface";

export interface Paid {
    id?: string;
    justifiedDebitNote: number;
    justifiedDebitNoteObservations: string;
    withholdings: number;
    withholdingsObservations: string;
    paymentOnAccount: number;
    total: number;
    commission: number;
    invoice: Invoice;
}