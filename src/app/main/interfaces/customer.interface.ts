import { Delivery } from "./delivery.interface";
import { Factory } from "./factory.interface";

export interface Customer {
    id?: string;
    name: string;
    address: string;
    email: string;
    discountsByFactory?: Array<CustomerDiscount>;
}

export interface CustomerDiscount {
    factory: Factory;
    delivery: Delivery;
    discounts: Array<number>;
    cascadeDiscount: number;
}