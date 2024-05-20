import { ICoordinates } from "./coordinates";
import { IFoodPostExposed } from "./food-post-exposed";
import { IFoodSeachOrder } from "./food-search-params";
import { toDistance } from "./location-util";
import { OrderState } from "./order-state";

export const toOrderedDistance = (
  foods: IFoodPostExposed[],
  current: ICoordinates,
  order: OrderState
): IFoodPostExposed[] => {
  return foods.sort((f1, f2) => {
    const delta =
      toDistance(f1.location.coordinates, current) -
      toDistance(f2.location.coordinates, current);
    return order === OrderState.INCREASE ? delta : -delta;
  });
};

interface IOrderedFoodMeta {
  current?: ICoordinates;
  order?: IFoodSeachOrder;
}

const isOrder = (target?: OrderState): target is OrderState =>
  target === OrderState.INCREASE || target === OrderState.DECREASE;

export const toOrderedFood = (
  foods: IFoodPostExposed[],
  meta?: IOrderedFoodMeta
): IFoodPostExposed[] => {
  if (meta == null) return foods;
  const { order, current } = meta;
  const { distance, price, quantity, time } = order ?? {};

  if (current && isOrder(distance)) {
    return toOrderedDistance(foods, current, distance);
  }

  if (isOrder(price)) {
    return foods.sort((f1, f2) => {
      const delta = f1.price - f2.price;
      return price === OrderState.INCREASE ? delta : -delta;
    });
  }

  if (isOrder(quantity)) {
    return foods.sort((f1, f2) => {
      const delta = f1.quantity - f2.quantity;
      return quantity === OrderState.INCREASE ? delta : -delta;
    });
  }

  if (isOrder(time)) {
    return foods.sort((f1, f2) => {
      const delta =
        new Date(f1.createdAt).getTime() - new Date(f2.createdAt).getTime();
      return time === OrderState.INCREASE ? delta : -delta;
    });
  }

  return foods;
};
