import { Customer } from "./customer.interface";
import { Factory } from "./factory.interface";
import { Product } from "./product.interface";

export interface Order {
    id?: string;
    createAt?: Date;
    code: string;
    status: string;
    /// etc ...
    productsCart?: Array<ProductCart>;
    customer?: Customer;
    factory?: Factory;
    invoicedPercent?: InvoicedPercent;
    invoicedAmount?: number;
    remitAmount?: number;
    ivaAmount?: number;
    discounts?: Array<string>;
    cascadeDiscount?: number;
    total?: number;
}

export interface ProductCart {
    product: Product;
    price: number;
    quantity: number;
    bonus: number;
    subtotal: number;
}

export interface InvoicedPercent {
    percentString: string;
    percentNumber: number;
}