import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  IPlaceExposed,
  OrderState,
  PlaceType,
  saveToLocalStorage,
} from "../../../data";
import { IPlaceSearchOrder, IPlaceSearchParams } from "../../../api";
import {
  useAppContentContext,
  useAuthContext,
  useDistanceCalculation,
} from "../../../hooks";
import { placeSearchTabs } from "./place-search-tab";

interface IPlaceSearchContextSnapshotData {
  query?: string;
  maxDistance?: number;
  minRating?: number;
  order?: IPlaceSearchOrder;
  types?: PlaceType[];
  tab: number;
  scrollTop?: number;
  data: IPlaceExposed[];
}

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
  setMaxDistance: Dispatch<SetStateAction<number>>;
  setMinRating: Dispatch<SetStateAction<number | undefined>>;
  setOrder: Dispatch<SetStateAction<IPlaceSearchOrder | undefined>>;
  setTypes: Dispatch<SetStateAction<PlaceType[]>>;

  data: IPlaceExposed[];
  doSearchRelative: (options?: IFetchOptions) => void;
  doSearchDistance: (order?: OrderState, options?: IFetchOptions) => void;
  doSearchRating: (order?: OrderState, options?: IFetchOptions) => void;
  doSearchQuery: (query?: string, options?: IFetchOptions) => void;
  doSearchFilter: (filter: any, options?: IFetchOptions) => void;
  doSaveLocalStorage: () => void;

  isEnd: boolean;
  setIsEnd: Dispatch<SetStateAction<boolean>>;
  isFetching: boolean;
}

interface IFetchOptions {
  update?: boolean; // Push or clear
  refresh?: boolean; // refresh isEnd status
  force?: boolean; // Force fetch if there already a fetching
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

  doSaveLocalStorage: () => {},

  isEnd: false,
  setIsEnd: () => {},
  isFetching: false,
});

export default function PlaceSearchContextProvider({
  children,
}: IPlaceSearchContextProviderProps) {
  const [query, setQuery] = useState<string>();
  const [maxDistance, setMaxDistance] = useState<number>(-1);
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
  const authContext = useAuthContext();
  const auth = authContext.auth;
  const distances = useDistanceCalculation();

  const doSearchAll = useCallback(
    (params: IPlaceSearchParams, options?: IFetchOptions) => {
      if (auth == null) return;
      if (isFetching && !options?.force) return;

      if (isEnd && !options?.refresh) {
        return;
      } else {
        setIsEnd(false);
      }

      const pagination = {
        skip: 0,
        limit: 24,
      };

      if (!options?.update) {
        setData([]);
      } else {
        pagination.skip = data.length;
      }

      params.pagination = pagination;

      console.log(params);

      setTimeout(() => {
        const newData: IPlaceExposed[] = [
          {
            _id: "1",
            active: true,
            author: {
              _id: "0",
              email: "0",
              firstName: "H",
              lastName: "G",
            },
            categories: [],
            createdAt: new Date(),
            exposeName: "HUY",
            images: [],
            location: {
              name: "0",
              coordinates: {
                lat: 100,
                lng: 16,
              },
            },
            rating: {
              count: 0,
              mean: 0,
            },
            type: PlaceType.PERSONAL,
            updatedAt: new Date(),
          },
        ];
        if (newData.length < pagination.limit) {
          setIsEnd(true);
        }
        setData(newData);

        setIsFetching(false);
      }, 500);
    },
    [auth, data.length, isEnd, isFetching]
  );

  const doSearchRelative = useCallback(
    (options?: IFetchOptions) => {
      doSearchAll(
        {
          query: query,
          currentLocation: distances.currentLocation?.coordinates,
          maxDistance: maxDistance,
          types: types,
        },
        options
      );
    },
    [distances.currentLocation, doSearchAll, maxDistance, query, types]
  );

  const doSearchDistance = useCallback(
    (order?: OrderState, options?: IFetchOptions) => {
      doSearchAll(
        {
          query: query,
          currentLocation: distances.currentLocation?.coordinates,
          maxDistance: maxDistance,
          types: types,
          order: {
            distance: order,
          },
        },
        options
      );
    },
    [distances.currentLocation, doSearchAll, maxDistance, query, types]
  );

  const doSearchRating = useCallback(
    (order?: OrderState, options?: IFetchOptions) => {
      doSearchAll(
        {
          query: query,
          currentLocation: distances.currentLocation?.coordinates,
          maxDistance: maxDistance,
          types: types,
          order: {
            distance: order,
          },
        },
        options
      );
    },
    [distances.currentLocation, doSearchAll, maxDistance, query, types]
  );

  const doSearchMore = useCallback(() => {
    switch (tab) {
      case placeSearchTabs.RALATIVE: {
        return doSearchRelative({ update: true });
      }
      case placeSearchTabs.DISTANCE: {
        return doSearchDistance(order?.distance, { update: true });
      }
      case placeSearchTabs.RATING: {
        return doSearchRating(order?.rating, { update: true });
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

  const doSearchQuery = useCallback(
    (query?: string, options?: IFetchOptions) => {
      let _order: undefined | IPlaceSearchOrder = undefined;
      switch (tab) {
        case placeSearchTabs.RALATIVE: {
          break;
        }
        case placeSearchTabs.DISTANCE: {
          _order = {
            distance: order?.distance,
          };
          break;
        }
        case placeSearchTabs.RATING: {
          _order = {
            rating: order?.rating,
          };
          break;
        }
      }
      doSearchAll(
        {
          query: query,
          currentLocation: distances.currentLocation?.coordinates,
          maxDistance: maxDistance,
          types: types,
          order: _order,
        },
        options
      );
    },
    [distances.currentLocation, doSearchAll, maxDistance, order, tab, types]
  );

  const doSearchFilter = useCallback(
    (filter: any, options?: IFetchOptions) => {
      let _order: undefined | IPlaceSearchOrder = undefined;
      switch (tab) {
        case placeSearchTabs.RALATIVE: {
          break;
        }
        case placeSearchTabs.DISTANCE: {
          _order = {
            distance: order?.distance,
          };
          break;
        }
        case placeSearchTabs.RATING: {
          _order = {
            rating: order?.rating,
          };
          break;
        }
      }
      doSearchAll(
        {
          query: query,
          currentLocation: distances.currentLocation?.coordinates,
          maxDistance: maxDistance,
          types: types,
          order: _order,
          ...filter,
        },
        options
      );
    },
    [
      distances.currentLocation,
      doSearchAll,
      maxDistance,
      order,
      query,
      tab,
      types,
    ]
  );

  const doSaveLocalStorage = () => {
    const snapshot: IPlaceSearchContextSnapshotData = {
      data: data,
      tab: tab,
      maxDistance: maxDistance,
      minRating: minRating,
      order: order,
      query: query,
      scrollTop: appContentContext.mainRef?.current?.scrollTop,
      types: types,
    };
    saveToLocalStorage(
      "PLACE_SEARCH_STATE",
      authContext.account?.id_,
      snapshot
    );
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

        doSaveLocalStorage,
      }}
    >
      {children}
    </PlaceSearchContext.Provider>
  );
}
