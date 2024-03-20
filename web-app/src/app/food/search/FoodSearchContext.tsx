import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  FoodCategory,
  IFoodSearchPrice,
  ItemAvailable,
  OrderState,
  PlaceType,
  loadFromSessionStorage,
  saveToSessionStorage,
} from "../../../data";
import { useAuthContext } from "../../../hooks";

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
  const [maxDistance, setMaxDistance] = useState<number | undefined>();
  const [categories, setCategories] = useState<FoodCategory[] | undefined>(
    targetCategories
  );
  const [maxDuration, setMaxDuration] = useState<number | undefined>();
  const [query, setQuery] = useState<string>("");
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

  const authContext = useAuthContext();
  const { account } = authContext;
  const dirtyRef = useRef<boolean>(true);

  useEffect(() => {
    if (account == null) return;
    if (!dirtyRef.current) {
      dirtyRef.current = false;
      const snapshot = loadFromSessionStorage<IFoodSearchContextSnapshotData>({
        key: FOOD_SEARCH_CONTEXT_STORAGE_KEY,
        maxDuration: 1 * 24 * 60 * 60 * 1000,
        account: account._id,
      });
      if (snapshot) {
        setMaxDistance(snapshot.maxDistance);
        setCategories(snapshot.categories);
        setPrice(snapshot.price);
        setOrderDistance(snapshot.order.distance);
        setOrderNew(snapshot.order.time);
        setOrderPrice(snapshot.order.price);
        setOrderQuantity(snapshot.order.quantity);
        setMaxDuration(snapshot.maxDuration);
        setAddedBy(snapshot.addedBy);
        setAvailable(snapshot.available);
        setMinQuantity(snapshot.minQuantity);
        setPrice(snapshot.price);
      }
    }
  }, [account]);

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
    saveToSessionStorage(snapshot, {
      key: FOOD_SEARCH_CONTEXT_STORAGE_KEY,
      account: authContext.account?._id,
    });
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
