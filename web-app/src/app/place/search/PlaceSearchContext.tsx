import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  IPagination,
  IPlaceExposed,
  OrderState,
  PlaceType,
} from "../../../data";
import { IPlaceSearchOrder } from "../../../api";
import { useAppContentContext } from "../../../hooks";
import { placeSearchTabs } from "./place-search-tab";

interface IPlaceSearchContextProviderProps {
  children?: React.ReactNode;
}

export interface IPlaceSearchContext {
  query?: string;
  maxDistance?: number;
  minRating?: number;
  order?: IPlaceSearchOrder;
  types?: PlaceType[];

  tab: number;
  setTab: Dispatch<SetStateAction<number>>;

  setQuery: Dispatch<SetStateAction<string | undefined>>;
  setMaxDistance: Dispatch<SetStateAction<number | undefined>>;
  setMinRating: Dispatch<SetStateAction<number | undefined>>;
  setOrder: Dispatch<SetStateAction<IPlaceSearchOrder | undefined>>;
  setTypes: Dispatch<SetStateAction<PlaceType[]>>;

  data: IPlaceExposed[];
  doSearchRelative: (update?: boolean) => void;
  doSearchDistance: (update?: boolean, order?: OrderState) => void;
  doSearchRating: (update?: boolean, order?: OrderState) => void;
  doSearchQuery: (query?: string) => void;
  doSearchFilter: (filter: any) => void;

  isEnd: boolean;
  setIsEnd: Dispatch<SetStateAction<boolean>>;
  isFetching: boolean;
}

export const PlaceSearchContext = createContext<IPlaceSearchContext>({
  setMaxDistance: () => {},
  setMinRating: () => {},
  setOrder: () => {},
  setQuery: () => {},
  setTypes: () => {},

  types: [
    PlaceType.EATERY,
    PlaceType.GROCERY,
    PlaceType.PERSONAL,
    PlaceType.RESTAURANT,
    PlaceType.SUPERMARKET,
    PlaceType.VOLUNTEER,
  ],
  maxDistance: -1,

  tab: 0,
  setTab: () => {},

  data: [],
  doSearchDistance: () => {},
  doSearchRelative: () => {},
  doSearchRating: () => {},
  doSearchFilter: () => {},
  doSearchQuery: () => {},

  isEnd: false,
  setIsEnd: () => {},
  isFetching: false,
});

export default function PlaceSearchContextProvider({
  children,
}: IPlaceSearchContextProviderProps) {
  const [query, setQuery] = useState<string>();
  const [maxDistance, setMaxDistance] = useState<number>();
  const [minRating, setMinRating] = useState<number>();
  const [order, setOrder] = useState<IPlaceSearchOrder>();
  const [types, setTypes] = useState<PlaceType[]>([
    PlaceType.EATERY,
    PlaceType.GROCERY,
    PlaceType.PERSONAL,
    PlaceType.RESTAURANT,
    PlaceType.SUPERMARKET,
    PlaceType.VOLUNTEER,
  ]);
  const [tab, setTab] = useState<number>(0);

  const [data, setData] = useState<IPlaceExposed[]>([]);
  const [isEnd, setIsEnd] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const appContentContext = useAppContentContext();

  const doSearchRelative = useCallback(
    (update?: boolean) => {
      if (!update) {
        setData([]);
      }
      const pagination: IPagination = {
        skip: update ? data.length : 0,
        limit: 24,
      };
      const orderToSearch = null;
      console.log(pagination, orderToSearch);
    },
    [data.length]
  );

  const doSearchDistance = useCallback(
    (update?: boolean, order?: OrderState) => {
      if (!update) {
        setData([]);
      }
      const pagination: IPagination = {
        skip: update ? data.length : 0,
        limit: 24,
      };
      const orderToSearch = { distance: order };
      console.log(pagination, orderToSearch);
    },
    [data.length]
  );

  const doSearchRating = useCallback(
    (update?: boolean, order?: OrderState) => {
      if (!update) {
        setData([]);
      }
      const pagination: IPagination = {
        skip: update ? data.length : 0,
        limit: 24,
      };
      const orderToSearch = { rating: order };
      console.log(pagination, orderToSearch);
    },
    [data.length]
  );

  const doSearchMore = useCallback(() => {
    switch (tab) {
      case placeSearchTabs.RALATIVE: {
        return doSearchRelative(true);
      }
      case placeSearchTabs.DISTANCE: {
        return doSearchDistance(true, order?.distance);
      }
      case placeSearchTabs.RATING: {
        return doSearchRating(true, order?.rating);
      }
    }
  }, [doSearchDistance, doSearchRating, doSearchRelative, order, tab]);

  useEffect(() => {
    const main = appContentContext.mainRef?.current;
    let listener: any;

    if (main != null) {
      listener = (event: Event) => {
        const element = event.target as HTMLDivElement;
        const isAtBottom =
          element.scrollTop + element.clientHeight === element.scrollHeight;

        if (isAtBottom && !isEnd) {
          doSearchMore();
        }
      };
      main.addEventListener("scroll", listener);
    }
    return () => {
      if (main != null && listener != null) {
        main.removeEventListener("scroll", listener);
      }
    };
  }, [appContentContext.mainRef, doSearchMore, isEnd]);

  const doSearchQuery = (query?: string) => {
    //
    console.log(query);
  };

  const doSearchFilter = (filter: any) => {
    //
    console.log(filter);
  };

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

        tab,
        setTab,

        data,
        isEnd,
        setIsEnd,
        isFetching,

        doSearchDistance,
        doSearchRelative,
        doSearchRating,
        doSearchQuery,
        doSearchFilter,
      }}
    >
      {children}
    </PlaceSearchContext.Provider>
  );
}
