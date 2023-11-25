import React, {
  createContext,
  useState,
} from "react";

interface IAppContentContextProviderProps {
  children: React.ReactNode;
}

interface IMenuSide {
  active: boolean;
}

interface IAppContentContext {
  menuSide: IMenuSide;
  setMenuSideActive(active: boolean): void;
}

export const AppContentContext = createContext<IAppContentContext>({
  menuSide: {
    active: true,
  },
  setMenuSideActive: () => {},
});

export default function AppContentContextProvider({
  children,
}: IAppContentContextProviderProps) {
  const [menuSide, setMenuSide] = useState<IMenuSide>({
    active: false,
  });

  const setMenuSideActive = (active: boolean): void => {
    setMenuSide({
      ...menuSide,
      active: active,
    });
  };

  return (
    <AppContentContext.Provider
      value={{
        menuSide,
        setMenuSideActive,
      }}
    >
      {children}
    </AppContentContext.Provider>
  );
}
