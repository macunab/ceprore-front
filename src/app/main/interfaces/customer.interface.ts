import { Delivery } from "./delivery.interface";
import { Factory } from "./factory.interface";
import { PriceList } from "./priceList.interface";

export interface Customer {
    _id?: string;
    name: string;
    address: string;
    email: string;
    ivaCondition?: string;
    discountsByFactory?: Array<CustomerFactory>;
    priceList?: PriceList;
}

export interface CustomerFactory {
    factory: Factory;
    delivery: Delivery;
    discounts: Array<number>;
    cascadeDiscount: number;
}