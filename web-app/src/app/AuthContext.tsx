import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { userFetcher } from "../api";
import { IAccountExposed, IAuthInfo, ILocation } from "../data";

interface IAuthContextProviderProps {
  children: React.ReactNode;
}

interface IAuthContext {
  account?: IAccountExposed;
  auth?: IAuthInfo;
  token?: string;
  setAccount: Dispatch<SetStateAction<IAccountExposed | undefined>>;
  setToken(token?: string, time?: number): void;
  logout(): void;
  updateLocation(location: ILocation): void;
}

const loadFromLocal = (): {
  auth: IAuthInfo;
  account: IAccountExposed;
} | null => {
  try {
    const authValue = localStorage.getItem("auth");
    const accountValue = localStorage.getItem("account");
    if (!authValue || !accountValue) return null;
    const auth = JSON.parse(authValue) as IAuthInfo | undefined;
    const account = JSON.parse(accountValue) as IAccountExposed | undefined;
    if (!auth || !account) {
      return null;
    }
    return {
      auth,
      account,
    };
  } catch (error) {
    // DO NOTHING
  }
  return null;
};

export const AuthenticationContext = createContext<IAuthContext>({
  setAccount: () => {},
  logout: () => {},
  setToken: () => {},
  updateLocation: () => {},
});

export default function AuthContextProvider({
  children,
}: IAuthContextProviderProps) {
  const local = loadFromLocal();
  const [account, setAccount] = useState<IAccountExposed | undefined>(
    local?.account
  );
  const [auth, setAuth] = useState<IAuthInfo | undefined>(local?.auth);
  const timeOutRef = useRef<NodeJS.Timeout | undefined>();

  const logout = () => {
    localStorage.removeItem("auth");
    localStorage.removeItem("account");
    sessionStorage.clear();
    setAccount(undefined);
    setAuth(undefined);
  };

  const setToken = useCallback((token?: string, updatedAt?: number): void => {
    updatedAt ??= Date.now();
    if (token == null) {
      setAuth(undefined);
    } else {
      setAuth({
        token,
        updatedAt,
      });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("auth", JSON.stringify(auth));
    localStorage.setItem("account", JSON.stringify(account));
  }, [account, auth]);

  const refreshToken = useCallback(() => {
    if (auth?.token == null) {
      logout();
      return;
    }
    userFetcher
      .refreshToken(auth.token, true)
      .then((result) => {
        const account = result.data;
        if (account && account?.location) {
          const location = account.location;
          if (
            location.name == null ||
            location.coordinates == null ||
            location.coordinates.lat == null ||
            location.coordinates.lng == null
          ) {
            account.location = undefined;
          }
        }
        setAccount(account);
        setToken(account?.token);
        localStorage.setItem("account", JSON.stringify(account));
        localStorage.setAuth("auth", JSON.stringify(auth));
      })
      .catch((error) => {
        console.error(error);
      });
  }, [auth, setToken]);

  useEffect(() => {
    const timeOut = timeOutRef.current;
    if (timeOut != null) {
      clearTimeout(timeOut);
    }
    if (auth && account) {
      const delta = Date.now() - auth.updatedAt;
      if (delta >= 40 * 60 * 1000 && delta <= 59 * 60 * 1000) {
        refreshToken();
        timeOutRef.current = setTimeout(() => {
          refreshToken();
        }, 40 * 60 * 1000 - auth.updatedAt);
      } else if (delta > 59 * 60 * 1000) {
        logout();
      }
    }
  }, [account, auth, refreshToken]);

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
        updateLocation,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
}
