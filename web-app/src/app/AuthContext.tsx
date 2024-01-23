import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";
import { userFetcher } from "../api";
import { IAuthInfo, ILocation } from "../data";

interface IAccount {
  id_: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  titles?: string[];
  location?: ILocation;
}

interface IAuthContextProviderProps {
  children: React.ReactNode;
}

interface IAuthContext {
  account?: IAccount;
  auth?: IAuthInfo;
  token?: string;
  setAccount: Dispatch<SetStateAction<IAccount | undefined>>;
  setToken(token?: string, time?: number): void;
  logout(): void;
  updateLocation(location: ILocation): void;
}

export const AuthenticationContext = createContext<IAuthContext>({
  setAccount: () => {},
  logout: () => {},
  setToken: () => {},
  updateLocation: () => {},
});

export default function AuthContextProvider({
  children,
}: IAuthContextProviderProps) {
  const [account, setAccount] = useState<IAccount | undefined>();
  const [auth, setAuth] = useState<IAuthInfo | undefined>();

  const logout = () => {
    localStorage.removeItem("auth");
    localStorage.removeItem("account");
    setAccount(undefined);
    setAuth(undefined);
  };

  const setToken = (token?: string, updatedAt?: number): void => {
    updatedAt ??= Date.now();
    if (token == null) {
      setAuth(undefined);
    } else {
      setAuth({
        token,
        updatedAt,
      });
    }
    localStorage.setItem(
      "auth",
      JSON.stringify({
        token,
        updatedAt,
      })
    );
  };

  useEffect(() => {
    const authValue = localStorage.getItem("auth");
    const accountValue = localStorage.getItem("account");
    let account: IAccount | undefined;
    if (accountValue != null) {
      try {
        account = JSON.parse(accountValue) as IAccount | undefined;
      } catch (error) {
        // Do nothing
      }
    }
    if (authValue != null) {
      try {
        const auth = JSON.parse(authValue) as IAuthInfo;
        if (auth.updatedAt <= Date.now() - 55 * 60 * 1000) {
          setAuth(undefined);
        } else if (
          auth.updatedAt < Date.now() - 30 * 60 * 1000 ||
          account == null
        ) {
          // RefreshToken
          userFetcher
            .refreshToken(auth.token, true)
            .then((result) => {
              const account = result.data;
              setAccount(account);
              setToken(account?.token);
            })
            .catch(() => {
              setAuth(undefined);
            });
        } else {
          setAuth(auth);
          setAccount(account);
        }
      } catch (error) {
        setAuth(undefined);
      }
    } else {
      setAuth(undefined);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("account", JSON.stringify(account));
  }, [account]);

  const updateLocation = useCallback(
    (location: ILocation) => {
      if (account != null) {
        setAccount({
          ...account,
          location: location,
        });
      }
    },
    [account]
  );

  return (
    <AuthenticationContext.Provider
      value={{
        account,
        setAccount,
        logout,
        setToken,
        auth,
        updateLocation
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
}
