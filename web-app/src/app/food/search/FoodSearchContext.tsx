import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useState,
} from "react";
import { FoodCategory, OrderState } from "../../../data";
import { IFoodSeachOrder, IFoodSearchPrice } from "../../../api";

interface IFoodSearchContextProviderProps {
  children?: React.ReactNode;
}

interface IFoodSearchContext {
  maxDistance: number;
  query: string;
  categories: FoodCategory[];
  maxDuration: number;
  price: IFoodSearchPrice;
  minQuantity: number;

  order: IFoodSeachOrder;

  setMaxDistance: Dispatch<SetStateAction<number>>;
  setQuery: Dispatch<SetStateAction<string>>;
  setCategories: Dispatch<SetStateAction<FoodCategory[]>>;
  setMaxDuration: Dispatch<SetStateAction<number>>;
  setPrice: Dispatch<SetStateAction<IFoodSearchPrice>>;
  setMinQuantity: Dispatch<SetStateAction<number>>;

  setOrderDistance: Dispatch<SetStateAction<OrderState>>;
  setOrderNew: Dispatch<SetStateAction<OrderState>>;
  setOrderPrice: Dispatch<SetStateAction<OrderState>>;
  setOrderQuantity: Dispatch<SetStateAction<OrderState>>;
}

export const FoodSearchContext = createContext<IFoodSearchContext>({
  maxDistance: -1,
  categories: [],
  maxDuration: -1,
  minQuantity: 0,
  price: {
    min: 0,
    max: 0,
    active: false,
  },
  query: "",

  order: {
    orderDistance: OrderState.NONE,
    orderNew: OrderState.NONE,
    orderQuantity: OrderState.NONE,
    orderPrice: OrderState.NONE,
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
});

export default function FoodSearchContextProvider({
  children,
}: IFoodSearchContextProviderProps) {
  const [maxDistance, setMaxDistance] = useState<number>(-1);
  const [categories, setCategories] = useState<FoodCategory[]>([]);
  const [maxDuration, setMaxDuration] = useState<number>(-1);
  const [query, setQuery] = useState<string>("");
  const [minQuantity, setMinQuantity] = useState<number>(0);
  const [price, setPrice] = useState<IFoodSearchPrice>({
    active: false,
    min: 0,
    max: 0,
  });
  const [orderDistance, setOrderDistance] = useState<OrderState>(
    OrderState.NONE
  );
  const [orderNew, setOrderNew] = useState<OrderState>(OrderState.NONE);
  const [orderPrice, setOrderPrice] = useState<OrderState>(OrderState.NONE);
  const [orderQuantity, setOrderQuantity] = useState<OrderState>(
    OrderState.NONE
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
        setCategories,
        setMaxDistance,
        setMaxDuration,
        setMinQuantity,
        setPrice,
        setQuery,
        order: {
          orderDistance,
          orderNew,
          orderPrice,
          orderQuantity,
        },
        setOrderDistance,
        setOrderNew,
        setOrderPrice,
        setOrderQuantity,
      }}
    >
      {children}
    </FoodSearchContext.Provider>
  );
}
