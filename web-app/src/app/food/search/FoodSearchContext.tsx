import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useState,
} from "react";
import {
  FoodCategory,
  IFoodSearchPrice,
  ItemAvailable,
  OrderState,
  PlaceType,
} from "../../../data";

interface IFoodSearchContextProviderProps {
  children?: React.ReactNode;
}

export interface IFoodSearchContext {
  addedBy?: PlaceType[];
  available: ItemAvailable;
  query?: string;
  maxDistance?: number;
  categories?: FoodCategory[];
  maxDuration?: number;
  minQuantity?: number;
  price?: IFoodSearchPrice;
  order: {
    distance: OrderState;
    time: OrderState;
    price: OrderState;
    quantity: OrderState;
  };

  setMaxDistance: Dispatch<SetStateAction<number | undefined>>;
  setQuery: Dispatch<SetStateAction<string | undefined>>;
  setCategories: Dispatch<SetStateAction<FoodCategory[] | undefined>>;
  setMaxDuration: Dispatch<SetStateAction<number | undefined>>;
  setPrice: Dispatch<SetStateAction<IFoodSearchPrice | undefined>>;
  setMinQuantity: Dispatch<SetStateAction<number | undefined>>;

  setOrderDistance: Dispatch<SetStateAction<OrderState>>;
  setOrderNew: Dispatch<SetStateAction<OrderState>>;
  setOrderPrice: Dispatch<SetStateAction<OrderState>>;
  setOrderQuantity: Dispatch<SetStateAction<OrderState>>;

  setAddedBy: Dispatch<SetStateAction<PlaceType[] | undefined>>;
  setAvailable: Dispatch<SetStateAction<ItemAvailable>>;
}

export const FoodSearchContext = createContext<IFoodSearchContext>({
  available: ItemAvailable.AVAILABLE_ONLY,
  order: {
    distance: OrderState.NONE,
    time: OrderState.NONE,
    price: OrderState.NONE,
    quantity: OrderState.NONE,
  },
  setMaxDistance: () => {},
  setCategories: () => {},
  setMaxDuration: () => {},
  setMinQuantity: () => {},
  setPrice: () => {},
  setQuery: () => {},

  setOrderDistance: () => {},
  setOrderNew: () => {},
  setOrderPrice: () => {},
  setOrderQuantity: () => {},

  setAddedBy: () => {},
  setAvailable: () => {},
});

export default function FoodSearchContextProvider({
  children,
}: IFoodSearchContextProviderProps) {
  const [maxDistance, setMaxDistance] = useState<number | undefined>();
  const [categories, setCategories] = useState<FoodCategory[] | undefined>();
  const [maxDuration, setMaxDuration] = useState<number | undefined>();
  const [query, setQuery] = useState<string>();
  const [minQuantity, setMinQuantity] = useState<number>();
  const [price, setPrice] = useState<IFoodSearchPrice>();
  const [orderDistance, setOrderDistance] = useState<OrderState>(
    OrderState.NONE
  );
  const [orderNew, setOrderNew] = useState<OrderState>(OrderState.NONE);
  const [orderPrice, setOrderPrice] = useState<OrderState>(OrderState.NONE);
  const [orderQuantity, setOrderQuantity] = useState<OrderState>(
    OrderState.NONE
  );
  const [addedBy, setAddedBy] = useState<PlaceType[] | undefined>();
  const [available, setAvailable] = useState<ItemAvailable>(
    ItemAvailable.AVAILABLE_ONLY
  );
  return (
    <FoodSearchContext.Provider
      value={{
        categories,
        maxDistance,
        maxDuration,
        minQuantity,
        price,
        query,
        addedBy,
        available,
        setCategories,
        setMaxDistance,
        setMaxDuration,
        setMinQuantity,
        setPrice,
        setQuery,
        order: {
          distance: orderDistance,
          time: orderNew,
          price: orderPrice,
          quantity: orderQuantity,
        },
        setOrderDistance,
        setOrderNew,
        setOrderPrice,
        setOrderQuantity,
        setAddedBy,
        setAvailable,
      }}
    >
      {children}
    </FoodSearchContext.Provider>
  );
}
