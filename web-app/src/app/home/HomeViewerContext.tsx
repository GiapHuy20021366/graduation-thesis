import React, { createContext, useState } from "react";
import { useLoader, useTabNavigate } from "../../hooks";
import { HomeTab, homeTabOptions } from "./home-tabs";
import { IFoodPostExposed } from "../../data";
import { IUseLoaderStates } from "../../hooks/useLoader";

interface IHomeViewerContextProviderProps {
  children?: React.ReactNode;
}

export interface IFoodPostTagged extends IFoodPostExposed {
  tags: ("REGISTED" | "AROUND" | "SUGGESTED")[];
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
  loader: IUseLoaderStates;
}

export const HomeViewerContext = createContext<IHomeViewerContext>({
  allFoods: [],
  aroundFoods: [],
  load: () => {},
  tab: 0,
  registedFoods: [],
  suggestedFoods: [],
  displayedFoods: [],
  loader: {} as IUseLoaderStates,
  setTab: () => {},
});

export default function HomeViewerContextProvider({
  children,
}: IHomeViewerContextProviderProps) {
  const tabNavigate = useTabNavigate({ tabOptions: homeTabOptions });
  const loader = useLoader();

  const [allFoods, setAllFoods] = useState<IFoodPostTagged[]>([]);
  const [aroundFoods, setAroundFoods] = useState<IFoodPostTagged[]>([]);
  const [registedFoods, setRegistedFoods] = useState<IFoodPostTagged[]>([]);
  const [suggestedFoods, setSuggestedFoods] = useState<IFoodPostTagged[]>([]);
  const [displayedFoods, setDisplayedFoods] = useState<IFoodPostTagged[]>([]);

  const load = (tab?: HomeTab) => {};

  const setTab = (tab: HomeTab) => {
    tabNavigate.setTab(tab);
  };

  return (
    <HomeViewerContext.Provider
      value={{
        tab: (tabNavigate.tab ?? 0) as HomeTab,
        setTab,
        allFoods,
        aroundFoods,
        load,
        loader,
        registedFoods,
        suggestedFoods,
        displayedFoods,
      }}
    >
      {children}
    </HomeViewerContext.Provider>
  );
}
