export const OrderState = {
  INCREASE: 1,
  DECREASE: -1,
  NONE: 0,
} as const;

export type OrderState = (typeof OrderState)[keyof typeof OrderState];

export const toNextOrderState = (state: OrderState): OrderState => {
  switch (state) {
    case OrderState.INCREASE:
      return OrderState.DECREASE;
    case OrderState.DECREASE:
      return OrderState.NONE;
    case OrderState.NONE:
      return OrderState.INCREASE;
  }
};
