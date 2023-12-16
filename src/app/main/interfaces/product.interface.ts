import { Factory } from "./factory.interface";
import { PriceList } from "./priceList.interface";

export interface Product {
    id?: string;
    name: string;
    code: string;
    description?: string;
    boxesPallet?: number;
    unitsBox?: number;
    factory: Factory;
    pricesByList: Array<ProductPrice>;
}

export interface ProductPrice {
    list: PriceList;
    price: number;
}