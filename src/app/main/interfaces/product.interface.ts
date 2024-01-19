import { Factory } from "./factory.interface";
import { PriceList } from "./priceList.interface";

export interface Product {
    _id?: string;
    name: string;
    code: string;
    description?: string;
    boxesPerPallet?: number;
    unitsPerBox?: number;
    factory: Factory;
    pricesByList: Array<ProductPrice>;
}

export interface ProductPrice {
    priceList: PriceList;
    price: number;
}