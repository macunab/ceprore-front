import { Factory } from "./factory.interface";
import { Order } from "./order.interface";

export interface ReportedCommission {

    _id?: string;

    from?: Date;

    until?: Date;

    factory: Factory;

    orders: Array<Order>;

    totalCommission: number;

    updatedAt?: Date;

    __v?: number;
}