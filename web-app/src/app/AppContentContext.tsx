import React, { createContext, useState } from "react";

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

  return (
    <AppContentContext.Provider
      value={{
        menuSide,
        setMenuSideActive,
        mainContent,
        setMainLeftVisible,
        setMainRightVisible,
      }}
    >
      {children}
    </AppContentContext.Provider>
  );
}
