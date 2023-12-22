import { Customer } from "./customer.interface";
import { Delivery } from "./delivery.interface";
import { Factory } from "./factory.interface";
import { PriceList } from "./priceList.interface";
import { Product } from "./product.interface";

export interface Order {
    id?: string;
    createAt?: Date;
    code?: string;
    status?: string;
    /// etc ...
    productsCart?: Array<ProductCart>;
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
    netTotalWithDiscount?: number;
    netTotal?: number;
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