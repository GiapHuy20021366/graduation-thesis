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
import { useAppCacheContext } from "../../../hooks";

interface IFoodSearchContextProviderProps {
  children?: React.ReactNode;
  categories?: FoodCategory[];
}

interface IFoodSearchContextSnapshotData {
  addedBy?: PlaceType[];
  available: ItemAvailable;
  query: string;
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
}

const FOOD_SEARCH_CONTEXT_STORAGE_KEY = "food.search.context";

export interface IFoodSearchContext {
  addedBy?: PlaceType[];
  available: ItemAvailable;
  query: string;
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

  doSaveStorage: () => void;

  setMaxDistance: Dispatch<SetStateAction<number | undefined>>;
  setQuery: Dispatch<SetStateAction<string>>;
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
  query: "",

  order: {
    distance: OrderState.NONE,
    time: OrderState.NONE,
    price: OrderState.NONE,
    quantity: OrderState.NONE,
  },

  doSaveStorage: () => {},

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
  categories: targetCategories,
}: IFoodSearchContextProviderProps) {
  const cacher = useAppCacheContext();
  const cached = cacher.get<IFoodSearchContextSnapshotData>(
    FOOD_SEARCH_CONTEXT_STORAGE_KEY
  );

  const [maxDistance, setMaxDistance] = useState<number | undefined>(
    cached?.maxDistance
  );
  const [categories, setCategories] = useState<FoodCategory[] | undefined>(
    targetCategories ?? cached?.categories
  );
  const [maxDuration, setMaxDuration] = useState<number | undefined>(
    cached?.maxDuration
  );
  const [query, setQuery] = useState<string>(cached?.query ?? "");
  const [minQuantity, setMinQuantity] = useState<number | undefined>(
    cached?.minQuantity ?? 4
  );
  const [price, setPrice] = useState<IFoodSearchPrice | undefined>(
    cached?.price
  );
  const [orderDistance, setOrderDistance] = useState<OrderState>(
    cached?.order.distance ?? OrderState.NONE
  );
  const [orderNew, setOrderNew] = useState<OrderState>(
    cached?.order.time ?? OrderState.NONE
  );
  const [orderPrice, setOrderPrice] = useState<OrderState>(
    cached?.order.price ?? OrderState.NONE
  );
  const [orderQuantity, setOrderQuantity] = useState<OrderState>(
    cached?.order.quantity ?? OrderState.NONE
  );
  const [addedBy, setAddedBy] = useState<PlaceType[] | undefined>(
    cached?.addedBy
  );
  const [available, setAvailable] = useState<ItemAvailable>(
    cached?.available ?? "AVAILABLE_ONLY"
  );

  const doSaveStorage = () => {
    const snapshot: IFoodSearchContextSnapshotData = {
      available,
      order: {
        distance: orderDistance,
        time: orderNew,
        price: orderPrice,
        quantity: orderQuantity,
      },
      query,
      addedBy,
      categories,
      maxDistance,
      maxDuration,
      minQuantity,
      price,
    };
    cacher.save(FOOD_SEARCH_CONTEXT_STORAGE_KEY, snapshot);
  };

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
        doSaveStorage,
      }}
    >
      {children}
    </FoodSearchContext.Provider>
  );
}
