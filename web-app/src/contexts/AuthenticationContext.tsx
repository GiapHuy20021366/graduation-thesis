import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useState,
} from "react";

interface IAccount {
  firstName?: string;
  lastName?: string;
  token?: string;
  email?: string;
  avatar?: string;
  isAuthenticated: boolean;
}

interface IAuthenticationContextProviderProps {
  children: React.ReactNode;
}

interface IAuthenticationContext {
  account: IAccount;
  setAccount: Dispatch<SetStateAction<IAccount>>;
  logout(): void;
  fakeLogin(): void;
}

export const AuthenticationContext = createContext<IAuthenticationContext>({
  account: {
    isAuthenticated: false,
  },
  setAccount: () => {},
  logout: () => {},
  fakeLogin: () => {},
});

export default function AuthenticationContextProvider({
  children,
}: IAuthenticationContextProviderProps) {
  const [account, setAccount] = useState<IAccount>({ isAuthenticated: false });
  const logout = () => {
    setAccount({
      isAuthenticated: false,
    });
  };
  
  const fakeLogin = () => {
    setAccount({
      isAuthenticated: true,
      email: "test",
      firstName: "fake",
      lastName: "fake",
    });
  };

  return (
    <AuthenticationContext.Provider
      value={{
        account,
        setAccount,
        logout,
        fakeLogin,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
}
