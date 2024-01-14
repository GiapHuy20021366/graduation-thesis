import { ICoordinates } from "./coordinates";
import { isAllNotEmptyString, isNumber } from "./data-validate";
import { ItemAddedBy } from "./item-added-by";
import { ItemAvailable } from "./item-available";
import { OrderState } from "./order-state";
import { IPagination } from "./pagination";

export interface IFoodSearchPrice {
    min: number;
    max: number;
    active: boolean;
}

export interface IFoodSeachOrder {
    orderDistance: OrderState;
    orderNew: OrderState;
    orderPrice: OrderState;
    orderQuantity: OrderState;
}

export interface IFoodSearchParams {
    order?: IFoodSeachOrder;
    maxDistance?: number;
    query: string;
    categories?: string[];
    maxDuration?: number;
    price?: IFoodSearchPrice;
    minQuantity?: number;
    addedBy?: ItemAddedBy;
    available?: ItemAvailable;
    pagination?: IPagination;
    currentLocation?: ICoordinates;
}

export const toAddedBy = (value: any): ItemAddedBy | undefined => {
    if (value == null || typeof value !== "string") return undefined;
    if (!Object.keys(ItemAddedBy).includes(value)) return undefined;
    return value as ItemAddedBy;
}

export const toAvailable = (value: any): ItemAvailable | undefined => {
    if (value == null || typeof value !== "string") return undefined;
    if (!Object.keys(ItemAvailable).includes(value)) return undefined;
    return value as ItemAvailable;
}

export const toValidSearchNumber = (value: any): number | undefined => {
    if (value == null || typeof value !== "number") return undefined;
    if (isNaN(value)) return undefined;
    if (value < 0) return undefined;
    return value as number;
}

export const toValidOrder = (value: any): IFoodSeachOrder | undefined => {
    if (value == null || typeof value !== "object") return undefined;
    const order: IFoodSeachOrder = {
        orderDistance: OrderState.NONE,
        orderNew: OrderState.NONE,
        orderPrice: OrderState.NONE,
        orderQuantity: OrderState.NONE
    };
    const values = Object.values(OrderState) as number[];
    if (values.includes(value.orderDistance)) {
        order.orderDistance = value.orderDistance;
    }
    if (values.includes(value.orderNew)) {
        order.orderNew = value.orderNew;
    }
    if (values.includes(value.orderPrice)) {
        order.orderPrice = value.orderPrice;
    }
    if (values.includes(value.orderQuantity)) {
        order.orderQuantity = value.orderQuantity;
    }
    return order;
}

export const toPagination = (value: any): IPagination => {
    if (value == null || typeof value !== "object") return {
        skip: 0,
        limit: 24
    };
    return {
        skip: toValidSearchNumber(value.skip) || 0,
        limit: toValidSearchNumber(value.limit) || 24
    }
}

export const toValidPrice = (value: any): IFoodSearchPrice | undefined => {
    if (value == null || typeof value !== "object") return undefined;
    if (!value.active) return undefined;
    const price: IFoodSearchPrice = {
        active: true,
        min: toValidSearchNumber(value.min) ?? 0,
        max: toValidSearchNumber(value.max) ?? Number.MAX_SAFE_INTEGER
    }
    return price;
}

export const toValidCategories = (value: any): string[] | undefined => {
    if (!Array.isArray(value)) return undefined;
    if (value.length === 0) return undefined;
    if (!isAllNotEmptyString(value)) return undefined;
    return value as string[];
}

export const toValidLocation = (value: any): ICoordinates | undefined => {
    if (value == null || typeof value !== "object") return undefined;
    if (!isNumber(value.lat)) return undefined;
    if (!isNumber(value.lng)) return undefined;
    return {
        lat: value.lat as number,
        lng: value.lng as number
    }
}

export const toFoodSearchParams = (value: any): IFoodSearchParams => {
    const pagination: IPagination = { skip: 0, limit: 24 }
    if (value == null || typeof value !== "object" || typeof value.query !== "string") {
        return { query: "", pagination: pagination }
    }
    return {
        query: value.query,
        addedBy: toAddedBy(value.addedBy),
        available: toAvailable(value.available),
        categories: toValidCategories(value.categories),
        maxDistance: toValidSearchNumber(value.maxDistance),
        maxDuration: toValidSearchNumber(value.maxDuration),
        minQuantity: toValidSearchNumber(value.minQuantity),
        order: toValidOrder(value.order),
        pagination: toPagination(value.pagination),
        price: toValidPrice(value.price),
        currentLocation: toValidLocation(value.currentLocation)
    }
}