import { Customer } from "./customer.interface";
import { Delivery } from "./delivery.interface";
import { Factory } from "./factory.interface";
import { Invoice } from "./invoice.interface";
import { PriceList } from "./priceList.interface";
import { Product } from "./product.interface";

export interface Order {
    
    _id?: string;
    createdAt?: Date;
    updatedAt?: Date;
    code?: string;
    status?: string;
    productsCart?: Array<Cart>;
    customer?: Customer;
    factory?: Factory;
    priceList?: PriceList;
    delivery?: Delivery;
    invoicedPercent?: InvoicedPercent;
    observations?: string;
    invoicedAmount?: number;
    remitAmount?: number;
    ivaAmount?: number;
    discounts?: Array<number>;
    cascadeDiscount?: number;
    customerDiscount?: number; // 
    netTotalWithDiscount?: number;
    netTotal?: number;
    total?: number;
    invoice?: Invoice;
    payment?: Payment;
    __v?: number;
}

export interface Cart {

    product: Product;
    price: number;
    quantity: number;
    bonus: number;
    subtotal: number;
}

export interface InvoicedPercent {

    _id?: string;
    percentString: string;
    percentNumber: number;
}

export interface Payment {

    justifiedDebitNote: number;
    justifiedDebitNoteObservations: string;
    withholdings: number;
    withholdingsObservations: string;
    paymentOnAccount: number;
    total: number;
    commission: number;
    // isAccountable: boolean; // listo para rendir?
    createdAt: Date;
    surrenderDate?: Date; // fecha de rendido/cobrado a fabrica/cobro de comision...
}