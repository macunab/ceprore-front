import { Invoice } from "./invoice.interface";

export interface Paid {

    // id?: string;
    justifiedDebitNote: number;
    justifiedDebitNoteObservations: string;
    withholdings: number;
    withholdingsObservations: string;
    paymentOnAccount: number;
    total: number;
    commission: number;
    isAccountable: boolean; // listo para rendir?
    createAt: Date;
    renderedDate: Date; // fecha de rendido/cobrado a fabrica/cobro de comision...
}