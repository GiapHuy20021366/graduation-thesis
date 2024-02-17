import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  IPlaceExposed,
  IPlaceExposedCooked,
  OrderState,
  PlaceType,
  loadFromLocalStorage,
  saveToLocalStorage,
  toPlaceExposedCooked,
} from "../../../data";
import { IPlaceSearchOrder, IPlaceSearchParams } from "../../../api";
import {
  useAppContentContext,
  useAuthContext,
  useDistanceCalculation,
  usePageProgessContext,
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
  data: IPlaceExposedCooked[];
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

  data: IPlaceExposedCooked[];
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

  const [data, setData] = useState<IPlaceExposedCooked[]>([]);
  const [isEnd, setIsEnd] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const appContentContext = useAppContentContext();
  const authContext = useAuthContext();
  const auth = authContext.auth;
  const account = authContext.account;
  const distances = useDistanceCalculation();
  const progessContext = usePageProgessContext();

  // Recover at begining or fetch at begining
  const dirtyRef = useRef<boolean>(false);

  const doSaveLocalStorage = useCallback(() => {
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
      "place.search.state",
      authContext.account?.id_,
      snapshot
    );
  }, [
    appContentContext.mainRef,
    authContext.account,
    data,
    maxDistance,
    minRating,
    order,
    query,
    tab,
    types,
  ]);

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

      setIsFetching(true);
      progessContext.start();
      setTimeout(() => {
        const newData: IPlaceExposed[] = [];
        for (let i = 0; i < 24; ++i) {
          newData.push(
            toPlaceExposedCooked(
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
              {
                currentCoordinates: distances.currentLocation?.coordinates,
                homeCoordinates: account?.location?.coordinates,
              }
            )
          );
        }
        if (newData.length < pagination.limit) {
          setIsEnd(true);
        }
        setData(newData);

        setIsFetching(false);
        progessContext.end();
      }, 1000);
    },
    [
      account?.location,
      auth,
      data.length,
      distances.currentLocation,
      isEnd,
      isFetching,
      progessContext,
    ]
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
    [
      distances.currentLocation?.coordinates,
      doSearchAll,
      maxDistance,
      query,
      types,
    ]
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

  // Recover result
  useEffect(() => {
    if (account == null) return;
    if (!dirtyRef.current) {
      // At begining
      const snapshot = loadFromLocalStorage<IPlaceSearchContextSnapshotData>(
        "place.search.state",
        1 * 24 * 60 * 60 * 1000,
        account.id_
      );
      if (snapshot) {
        setQuery(snapshot.query);
        setMaxDistance(snapshot.maxDistance ?? -1);
        setMinRating(snapshot.minRating);
        setOrder(snapshot.order);
        setTypes(snapshot.types ?? []);
        setTab(snapshot.tab);
        setData(snapshot.data);
        const mainRef = appContentContext.mainRef?.current;
        if (mainRef) {
          setTimeout(() => {
            mainRef.scrollTop = snapshot.scrollTop ?? 0;
          }, 300);
        }
      } else {
        doSearchAll({
          query: query,
          currentLocation: distances.currentLocation?.coordinates,
          maxDistance: maxDistance,
          types: types,
        });
      }
      dirtyRef.current = true;
    }
  }, [
    account,
    appContentContext.mainRef,
    distances.currentLocation?.coordinates,
    doSearchAll,
    maxDistance,
    query,
    types,
  ]);

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
