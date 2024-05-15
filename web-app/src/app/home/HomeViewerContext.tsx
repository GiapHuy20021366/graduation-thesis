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
    (allFoods: IFoodPostTagged[], tab?: number, target?: FoodPostTag) => {
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
      if (target == null || target === "REGISTED") {
        setRegistedFoods(_registeds);
      }
      if (target == null || target === "AROUND") {
        setAroundFoods(_arounds);
      }

      if (target == null || target === "SUGGESTED") {
        setSuggestedFoods(_suggesteds);
      }

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

  const loadFoods = useCallback(
    (tags?: FoodPostTag[]) => {
      if (auth == null || account == null) return;

      tags ??= ["AROUND", "REGISTED", "SUGGESTED"];
      const promises: (() => Promise<IFoodPostTagged[]>)[] = [];
      if (tags.includes("AROUND")) {
        if (currentLocation != null) {
          promises.push(async () => {
            const pagination: IPagination = {
              skip: aroundFoods.length,
              limit: 24,
            };

            aroundLoader.setIsEnd(false);
            aroundLoader.setIsError(false);
            aroundLoader.setIsFetching(true);

            let result: IFoodPostTagged[] = [];
            await foodFetcher
              .searchFood(
                {
                  user: {
                    // exclude: [account._id],
                  },
                  distance: {
                    current: currentLocation,
                    max: Number.MAX_SAFE_INTEGER,
                  },
                  // active: true,
                  pagination: pagination,
                  populate: {
                    place: false,
                    user: false,
                  },
                },
                auth
              )
              .then((res) => {
                const datas = res.data;
                if (datas != null) {
                  // const added = addFoods("AROUND", ...datas);
                  if (datas.length < 24) {
                    aroundLoader.setIsEnd(true);
                  }
                  result = datas.map((d): IFoodPostTagged => {
                    return {
                      ...d,
                      tags: ["AROUND"],
                    };
                  });
                }
              })
              .catch(() => {
                aroundLoader.setIsError(true);
              })
              .finally(() => {
                aroundLoader.setIsFetching(false);
              });
            return result;
          });
        }
      }
      if (tags.includes("SUGGESTED")) {
        promises.push(async () => {
          const pagination: IPagination = {
            skip: suggestedFoods.length,
            limit: 24,
          };

          favoriteLoader.setIsEnd(false);
          favoriteLoader.setIsError(false);
          favoriteLoader.setIsFetching(true);

          let result: IFoodPostTagged[] = [];
          await foodFetcher
            .getFavoriteFoods(account._id, auth, pagination)
            .then((res) => {
              const datas = res.data;
              if (datas != null) {
                if (datas.length < 24) {
                  favoriteLoader.setIsEnd(true);
                }
                result = datas.map((d): IFoodPostTagged => {
                  return {
                    ...d,
                    tags: ["SUGGESTED"],
                  };
                });
              }
            })
            .catch(() => {
              favoriteLoader.setIsError(true);
            })
            .finally(() => {
              favoriteLoader.setIsFetching(false);
            });
          return result;
        });
      }
      if (tags.includes("REGISTED")) {
        promises.push(async () => {
          const pagination: IPagination = {
            skip: registedFoods.length,
            limit: 24,
          };

          registeredLoader.setIsEnd(false);
          registeredLoader.setIsError(false);
          registeredLoader.setIsFetching(true);

          let result: IFoodPostTagged[] = [];
          await foodFetcher
            .getRegisteredFoods(account._id, auth, pagination)
            .then((res) => {
              const datas = res.data;
              if (datas != null) {
                if (datas.length < 24) {
                  registeredLoader.setIsEnd(true);
                }
                result = datas.map((d): IFoodPostTagged => {
                  return {
                    ...d,
                    tags: ["REGISTED"],
                  };
                });
              }
            })
            .catch(() => {
              registeredLoader.setIsError(true);
            })
            .finally(() => {
              registeredLoader.setIsFetching(false);
            });
          return result;
        });
      }

      Promise.all(promises.map((d) => d())).then((meta) => {
        const _all = allFoods.slice();
        meta.forEach((m) => {
          m.forEach((d) => {
            if (_all.findIndex((a) => a._id === d._id) === -1) {
              _all.push(d);
            }
          });
        });
        updateFoods(_all);
        setAllFoods(_all);
      });
    },
    [
      account,
      allFoods,
      aroundFoods.length,
      aroundLoader,
      auth,
      currentLocation,
      favoriteLoader,
      registedFoods.length,
      registeredLoader,
      suggestedFoods.length,
      updateFoods,
    ]
  );

  const loadRegisteredFoods = useCallback(() => {
    loadFoods(["SUGGESTED"]);
  }, [loadFoods]);

  const loadSuggestedFoods = useCallback(() => {
    loadFoods(["SUGGESTED"]);
  }, [loadFoods]);

  const loadAroundFoods = useCallback(() => {
    loadFoods(["AROUND"]);
  }, [loadFoods]);

  const load = useCallback(
    (tab?: HomeTab) => {
      switch (tab ?? tabNavigate.tab) {
        case homeTabs.ALL: {
          loadFoods();
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
    [
      loadAroundFoods,
      loadFoods,
      loadRegisteredFoods,
      loadSuggestedFoods,
      tabNavigate.tab,
    ]
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
