import React, { createContext, useCallback, useEffect, useState } from "react";
import {
  useAppContentContext,
  useAuthContext,
  useDirty,
  useLoader,
  useTabNavigate,
} from "../../hooks";
import { HomeTab, homeTabOptions, homeTabs } from "./home-tabs";
import { IFoodPostExposed, IPagination } from "../../data";
import { IUseLoaderStates } from "../../hooks/useLoader";
import { foodFetcher } from "../../api";

interface IHomeViewerContextProviderProps {
  children?: React.ReactNode;
}

export type FoodPostTag = "REGISTED" | "AROUND" | "SUGGESTED";
export interface IFoodPostTagged extends IFoodPostExposed {
  tags: FoodPostTag[];
}

interface IHomeViewerContext {
  tab: HomeTab;
  setTab: (tab: HomeTab) => void;

  allFoods: IFoodPostTagged[];
  registedFoods: IFoodPostTagged[];
  aroundFoods: IFoodPostTagged[];
  suggestedFoods: IFoodPostTagged[];
  displayedFoods: IFoodPostTagged[];

  load: (tab?: HomeTab) => void;
  aroundLoader: IUseLoaderStates;
  favoriteLoader: IUseLoaderStates;
  registeredLoader: IUseLoaderStates;
}

export const HomeViewerContext = createContext<IHomeViewerContext>({
  allFoods: [],
  aroundFoods: [],
  load: () => {},
  tab: 0,
  registedFoods: [],
  suggestedFoods: [],
  displayedFoods: [],
  setTab: () => {},

  aroundLoader: {} as IUseLoaderStates,
  favoriteLoader: {} as IUseLoaderStates,
  registeredLoader: {} as IUseLoaderStates,
});

export default function HomeViewerContextProvider({
  children,
}: IHomeViewerContextProviderProps) {
  const tabNavigate = useTabNavigate({ tabOptions: homeTabOptions });

  const registeredLoader = useLoader();
  const aroundLoader = useLoader();
  const favoriteLoader = useLoader();
  const authContext = useAuthContext();
  const { auth, account } = authContext;
  const appContentContext = useAppContentContext();
  const { currentLocation } = appContentContext;

  const [allFoods, setAllFoods] = useState<IFoodPostTagged[]>([]);
  const [aroundFoods, setAroundFoods] = useState<IFoodPostTagged[]>([]);
  const [registedFoods, setRegistedFoods] = useState<IFoodPostTagged[]>([]);
  const [suggestedFoods, setSuggestedFoods] = useState<IFoodPostTagged[]>([]);
  const [displayedFoods, setDisplayedFoods] = useState<IFoodPostTagged[]>([]);

  const updateFoods = useCallback(
    (allFoods: IFoodPostTagged[], tab?: number) => {
      const _registeds: IFoodPostTagged[] = [];
      const _suggesteds: IFoodPostTagged[] = [];
      const _arounds: IFoodPostTagged[] = [];
      allFoods.forEach((f) => {
        const tags = f.tags;
        if (tags.includes("AROUND")) {
          _arounds.push(f);
        }
        if (tags.includes("SUGGESTED")) {
          _suggesteds.push(f);
        }
        if (tags.includes("REGISTED")) {
          _registeds.push(f);
        }
      });
      setRegistedFoods(_registeds);
      setSuggestedFoods(_suggesteds);
      setAroundFoods(_arounds);
      switch (tab ?? tabNavigate.tab) {
        case homeTabs.ALL: {
          setDisplayedFoods(allFoods);
          break;
        }
        case homeTabs.AROUND: {
          setDisplayedFoods(_arounds);
          break;
        }
        case homeTabs.REGISTED: {
          setDisplayedFoods(_registeds);
          break;
        }
        case homeTabs.SUGGESTED: {
          setDisplayedFoods(_suggesteds);
          break;
        }
      }
    },
    [tabNavigate.tab]
  );

  const addFoods = useCallback(
    (tag: FoodPostTag, ...foods: IFoodPostExposed[]): number => {
      const _foods = allFoods.slice();
      let num = 0;
      foods.forEach((food) => {
        const _food = _foods.find((f) => f._id === food._id);
        if (_food == null) {
          _foods.push({
            ...food,
            tags: [tag],
          });
          ++num;
        } else {
          if (!_food.tags.includes(tag)) {
            _food.tags.push(tag);
          }
        }
      });
      setAllFoods(_foods);
      updateFoods(_foods);
      return num;
    },
    [allFoods, updateFoods]
  );

  const loadRegisteredFoods = useCallback(() => {
    if (auth == null || account == null) return null;

    const pagination: IPagination = {
      skip: registedFoods.length,
      limit: 24,
    };

    registeredLoader.setIsEnd(false);
    registeredLoader.setIsError(false);
    registeredLoader.setIsFetching(true);

    foodFetcher
      .getRegisteredFoods(account._id, auth, pagination)
      .then((res) => {
        const datas = res.data;
        if (datas != null) {
          const added = addFoods("REGISTED", ...datas);
          if (added < 24) {
            registeredLoader.setIsEnd(true);
          }
        }
      })
      .catch(() => {
        registeredLoader.setIsError(true);
      })
      .finally(() => {
        registeredLoader.setIsFetching(false);
      });
  }, [account, addFoods, auth, registedFoods.length, registeredLoader]);

  const loadSuggestedFoods = useCallback(() => {
    if (auth == null || account == null) return null;

    const pagination: IPagination = {
      skip: suggestedFoods.length,
      limit: 24,
    };

    favoriteLoader.setIsEnd(false);
    favoriteLoader.setIsError(false);
    favoriteLoader.setIsFetching(true);

    foodFetcher
      .getFavoriteFoods(account._id, auth, pagination)
      .then((res) => {
        const datas = res.data;
        if (datas != null) {
          const added = addFoods("SUGGESTED", ...datas);
          if (added < 24) {
            favoriteLoader.setIsEnd(true);
          }
        }
      })
      .catch(() => {
        favoriteLoader.setIsError(true);
      })
      .finally(() => {
        favoriteLoader.setIsFetching(false);
      });
  }, [account, addFoods, auth, favoriteLoader, suggestedFoods.length]);

  const loadAroundFoods = useCallback(() => {
    if (auth == null || account == null || currentLocation == null) return null;

    const pagination: IPagination = {
      skip: aroundFoods.length,
      limit: 24,
    };

    aroundLoader.setIsEnd(false);
    aroundLoader.setIsError(false);
    aroundLoader.setIsFetching(true);

    foodFetcher
      .searchFood(
        {
          user: {
            exclude: [account._id],
          },
          distance: {
            current: currentLocation,
            max: Number.MAX_SAFE_INTEGER,
          },
          active: true,
          pagination: pagination,
          available: "ALL",
        },
        auth
      )
      .then((res) => {
        const datas = res.data;
        if (datas != null) {
          const added = addFoods("AROUND", ...datas);
          if (added < 24) {
            aroundLoader.setIsEnd(true);
          }
        }
      })
      .catch(() => {
        aroundLoader.setIsError(true);
      })
      .finally(() => {
        aroundLoader.setIsFetching(false);
      });
  }, [
    account,
    addFoods,
    aroundFoods.length,
    aroundLoader,
    auth,
    currentLocation,
  ]);

  const load = useCallback(
    (tab?: HomeTab) => {
      switch (tab ?? tabNavigate.tab) {
        case homeTabs.ALL: {
          loadAroundFoods();
          loadSuggestedFoods();
          loadRegisteredFoods();
          break;
        }
        case homeTabs.AROUND: {
          loadAroundFoods();
          break;
        }
        case homeTabs.REGISTED: {
          loadRegisteredFoods();
          break;
        }
        case homeTabs.SUGGESTED: {
          loadSuggestedFoods();
          break;
        }
      }
    },
    [loadAroundFoods, loadRegisteredFoods, loadSuggestedFoods, tabNavigate.tab]
  );

  const setTab = (tab: HomeTab) => {
    tabNavigate.setTab(tab);
    updateFoods(allFoods, tab);
  };

  const dirty = useDirty();
  useEffect(() => {
    if (auth != null && currentLocation != null && account != null) {
      dirty.perform(() => {
        load(homeTabs.ALL);
      });
    }
  }, [account, auth, currentLocation, dirty, load]);

  return (
    <HomeViewerContext.Provider
      value={{
        tab: (tabNavigate.tab ?? 0) as HomeTab,
        setTab,
        allFoods,
        aroundFoods,
        registedFoods,
        suggestedFoods,
        displayedFoods,
        aroundLoader,
        favoriteLoader,
        load,
        registeredLoader,
      }}
    >
      {children}
    </HomeViewerContext.Provider>
  );
}
