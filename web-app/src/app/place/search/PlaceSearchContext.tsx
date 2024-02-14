import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useState,
} from "react";
import {
  PlaceType,
} from "../../../data";
import { IPlaceSearchOrder } from "../../../api";

interface IPlaceSearchContextProviderProps {
  children?: React.ReactNode;
}

export interface IPlaceSearchContext {
  query?: string;
  maxDistance?: number;
  minRating?: number;
  order?: IPlaceSearchOrder;
  types?: PlaceType[];

  setQuery: Dispatch<SetStateAction<string | undefined>>;
  setMaxDistance: Dispatch<SetStateAction<number | undefined>>;
  setMinRating: Dispatch<SetStateAction<number | undefined>>;
  setOrder: Dispatch<SetStateAction<IPlaceSearchOrder | undefined>>;
  setTypes: Dispatch<SetStateAction<PlaceType[] | undefined>>;
}

export const PlaceSearchContext = createContext<IPlaceSearchContext>({
  setMaxDistance: () => {},
  setMinRating: () => {},
  setOrder: () => {},
  setQuery: () => {},
  setTypes: () => {},
});

export default function PlaceSearchContextProvider({
  children,
}: IPlaceSearchContextProviderProps) {
  const [query, setQuery] = useState<string>();
  const [maxDistance, setMaxDistance] = useState<number>();
  const [minRating, setMinRating] = useState<number>();
  const [order, setOrder] = useState<IPlaceSearchOrder>();
  const [types, setTypes] = useState<PlaceType[]>();

  return (
    <PlaceSearchContext.Provider
      value={{
        maxDistance,
        query,
        setMaxDistance,
        setMinRating,
        setOrder,
        setQuery,
        setTypes,
        minRating,
        order,
        types,
      }}
    >
      {children}
    </PlaceSearchContext.Provider>
  );
}
