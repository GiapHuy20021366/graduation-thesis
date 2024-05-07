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
  IPlaceExposedCooked,
  IPlaceSearchOrder,
  IPlaceSearchParams,
  OrderState,
  PlaceType,
  loadFromLocalStorage,
  saveToSessionStorage,
  toPlaceExposedCooked,
} from "../../../data";
import { userFetcher } from "../../../api";
import {
  useAppContentContext,
  useAuthContext,
  useDistanceCalculation,
  useLoader,
} from "../../../hooks";
import { placeSearchTabs } from "./place-search-tab";
import { IUseLoaderStates } from "../../../hooks/useLoader";

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
  doSearch: () => void;
  doSaveStorage: () => void;

  loader: IUseLoaderStates;
}

interface IFetchOptions {
  update?: boolean; // Push or clear
  refresh?: boolean; // refresh loader.isEnd status
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
  doSearch: () => {},

  doSaveStorage: () => {},

  loader: {} as IUseLoaderStates,
});

const PLACE_SEARCH_KEY = "place.search.context.state";

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
  const loader = useLoader();

  const appContentContext = useAppContentContext();
  const authContext = useAuthContext();
  const auth = authContext.auth;
  const account = authContext.account;
  const distances = useDistanceCalculation();
  // const progessContext = usePageProgessContext();

  // Recover at begining or fetch at begining
  const dirtyRef = useRef<boolean>(false);

  const doSaveStorage = useCallback(() => {
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
    saveToSessionStorage(snapshot, {
      key: PLACE_SEARCH_KEY,
      account: authContext.account?._id,
    });
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
      if (loader.isFetching && !options?.force) return;

      if (loader.isEnd && !options?.refresh) {
        return;
      } else {
        loader.setIsEnd(false);
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

      loader.setIsFetching(true);
      loader.setIsError(false);

      // progessContext.start();
      userFetcher
        .searchPlace(params, auth)
        .then((res) => {
          const data = res.data;
          if (data) {
            setTimeout(() => {
              const cookedData = data.map((d) =>
                toPlaceExposedCooked(d, {
                  currentCoordinates: distances.currentLocation?.coordinates,
                  homeCoordinates: account?.location?.coordinates,
                })
              );
              setData(cookedData);
              if (data.length < pagination.limit) {
                loader.setIsEnd(true);
              }
              loader.setIsFetching(false);
            }, 500);
          }
        })
        .catch(() => {
          loader.setIsError(true);
        })
        .finally(() => {
          loader.setIsFetching(false);
          // progessContext.end();
        });
    },
    [account?.location, auth, data.length, distances.currentLocation, loader]
  );

  const doSearchRelative = useCallback(
    (options?: IFetchOptions) => {
      const current = distances.currentLocation?.coordinates;
      if (current == null) return;
      doSearchAll(
        {
          query: query,
          distance: {
            current: current,
            max: maxDistance,
          },
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
      const current = distances.currentLocation?.coordinates;
      if (current == null) return;
      doSearchAll(
        {
          query: query,
          distance: {
            current: current,
            max: maxDistance,
          },
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
      const current = distances.currentLocation?.coordinates;
      if (current == null) return;
      doSearchAll(
        {
          query: query,
          distance: {
            current: current,
            max: maxDistance,
          },
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
      const current = distances.currentLocation?.coordinates;
      if (current == null) return;
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
          distance: {
            current: current,
            max: maxDistance,
          },
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
      const current = distances.currentLocation?.coordinates;
      if (current == null) return;
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
          distance: {
            current: current,
            max: maxDistance,
          },
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

  const doSearch = () => {
    const options = {
      update: true,
      refresh: true,
    };
    switch (tab) {
      case placeSearchTabs.RALATIVE:
        doSearchRelative(options);
        break;
      case placeSearchTabs.DISTANCE:
        doSearchDistance(order?.distance, options);
        break;
      case placeSearchTabs.RATING:
        doSearchRating(order?.rating, options);
        break;
    }
  };

  useEffect(() => {
    const main = appContentContext.mainRef?.current;
    let listener: any;

    if (main != null) {
      listener = (event: Event) => {
        const element = event.target as HTMLDivElement;
        const isAtBottom =
          element.scrollHeight * 0.95 <=
          element.scrollTop + element.clientHeight;
        if (isAtBottom && !loader.isEnd && !loader.isFetching) {
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
  }, [
    appContentContext.mainRef,
    doSearchMore,
    loader.isEnd,
    loader.isFetching,
  ]);

  // Recover result
  useEffect(() => {
    if (account == null) return;
    if (!dirtyRef.current) {
      dirtyRef.current = true;
      // At begining
      const snapshot = loadFromLocalStorage<IPlaceSearchContextSnapshotData>({
        key: PLACE_SEARCH_KEY,
        account: account._id,
        maxDuration: 1 * 24 * 60 * 60 * 1000,
      });
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
        const current = distances.currentLocation?.coordinates;
        if (current == null) {
          dirtyRef.current = false;
        } else {
          doSearchAll({
            query: query,
            distance: {
              current: current,
              max: maxDistance,
            },
            types: types,
          });
        }
      }
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
        loader,

        doSearchDistance,
        doSearchRelative,
        doSearchRating,
        doSearchQuery,
        doSearchFilter,
        doSearch,

        doSaveStorage,
      }}
    >
      {children}
    </PlaceSearchContext.Provider>
  );
}
