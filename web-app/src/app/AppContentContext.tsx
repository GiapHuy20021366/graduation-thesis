import React, { createContext, useEffect, useRef, useState } from "react";
import { ICoordinates } from "../data";
import { getCurrentLocation } from "../data/location-util";
import { useToastContext } from "../hooks";

interface IAppContentContextProviderProps {
  children: React.ReactNode;
}

interface IMenuSide {
  active: boolean;
}

interface IMainContent {
  visibleLeft: boolean;
  visibleRight: boolean;
}

interface IAppContentContext {
  menuSide: IMenuSide;
  mainContent: IMainContent;
  setMenuSideActive(active: boolean): void;
  setMainLeftVisible(visible: boolean): void;
  setMainRightVisible(visible: boolean): void;
  mainRef?: React.RefObject<HTMLDivElement>;
  currentLocation?: ICoordinates;
}

export const AppContentContext = createContext<IAppContentContext>({
  menuSide: {
    active: true,
  },
  mainContent: {
    visibleLeft: true,
    visibleRight: true,
  },
  setMenuSideActive: () => {},
  setMainLeftVisible: () => {},
  setMainRightVisible: () => {},
});

export default function AppContentContextProvider({
  children,
}: IAppContentContextProviderProps) {
  const [menuSide, setMenuSide] = useState<IMenuSide>({
    active: false,
  });
  const [mainContent, setMainContent] = useState<IMainContent>({
    visibleLeft: true,
    visibleRight: true,
  });
  const mainRef = useRef<HTMLDivElement>(null);

  const setMenuSideActive = (active: boolean): void => {
    setMenuSide({
      ...menuSide,
      active: active,
    });
  };

  const setMainLeftVisible = (visible: boolean): void => {
    setMainContent({
      ...mainContent,
      visibleLeft: visible,
    });
  };

  const setMainRightVisible = (visible: boolean): void => {
    setMainContent({
      ...mainContent,
      visibleLeft: visible,
    });
  };

  const [currentLocation, setCurrentLocation] = useState<
    ICoordinates | undefined
  >();

  const toastContext = useToastContext();

  useEffect(() => {
    getCurrentLocation()
      .then((location) => setCurrentLocation(location))
      .catch(() => {
        toastContext.error("Can not get location now!");
      });
  }, [toastContext]);

  return (
    <AppContentContext.Provider
      value={{
        menuSide,
        setMenuSideActive,
        mainContent,
        setMainLeftVisible,
        setMainRightVisible,
        mainRef,
        currentLocation,
      }}
    >
      {children}
    </AppContentContext.Provider>
  );
}
