import React, { createContext, useRef } from "react";

interface IAppCacheContextProviderProps {
  children?: React.ReactNode;
}

interface IAppCacheContext {
  get: <T>(key: string) => T | undefined;
  getOrCreate: <T>(key: string, initer: T) => T;
  save: (key: string, data: any, target?: "SESSION" | "LOCAL" | "HEAP") => void;
  remove: (key: string) => void;
  removeIf: (fn: (key: string, data: unknown) => boolean) => void;
  querySelector: <T>(
    fn: (key: string, data: unknown) => boolean
  ) => T | undefined;
  querySelectorAll: <T>(fn: (key: string, data: unknown) => boolean) => T[];
  clear: () => void;
}

export const AppCacheContext = createContext<IAppCacheContext>({
  get: () => ({} as any),
  getOrCreate: () => ({} as any),
  save: () => {},
  remove: () => {},
  removeIf: () => {},
  querySelector: () => ({} as any),
  querySelectorAll: () => [],
  clear: () => {},
});

const getDefault = (): Record<string, unknown> => {
  const result: Record<string, unknown> = {};
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith("lapp")) {
      try {
        const data = JSON.parse(localStorage.getItem(key)!);
        result[key] = data;
      } catch (error) {
        // DO NOTHING
      }
    }
  });
  Object.keys(sessionStorage).forEach((key) => {
    if (key.startsWith("sapp")) {
      try {
        const data = JSON.parse(localStorage.getItem(key)!);
        result[key] = data;
      } catch (error) {
        // DO NOTHING
      }
    }
  });
  return result;
};

export default function AppCacheContextProvider({
  children,
}: IAppCacheContextProviderProps) {
  const cacheRef = useRef<Record<string, unknown>>(getDefault());

  const get = function <T>(key: string) {
    const data = cacheRef.current[key];
    return data as T;
  };

  const getOrCreate = function <T>(key: string, initer: T) {
    const data = cacheRef.current[key];
    if (data == null) {
      cacheRef.current[key] = initer;
    }
    return cacheRef.current[key] as T;
  };

  const save = (
    key: string,
    data: any,
    target?: "SESSION" | "LOCAL" | "HEAP"
  ) => {
    target ??= "HEAP";
    cacheRef.current[key] = data;
    switch (target) {
      case "SESSION":
        sessionStorage.setItem(`sapp:${key}`, JSON.stringify(data));
        break;
      case "LOCAL":
        localStorage.setItem(`lapp:${key}`, JSON.stringify(data));
        break;
    }
  };

  const remove = (key: string) => {
    if (cacheRef.current[key]) {
      delete cacheRef.current[key];
    }
  };

  const removeIf = (fn: (key: string, data: unknown) => boolean) => {
    const entries = Object.entries(cacheRef.current);
    entries.forEach(([key, val]) => {
      if (fn(key, val)) {
        delete cacheRef.current[key];
      }
    });
  };

  const querySelector = function <T>(
    fn: (key: string, data: unknown) => boolean
  ) {
    const entries = Object.entries(cacheRef.current);
    for (let i = 0; i < entries.length; ++i) {
      const [key, val] = entries[i];
      if (fn(key, val)) {
        return val as T;
      }
    }
  };

  const querySelectorAll = function <T>(
    fn: (key: string, data: unknown) => boolean
  ) {
    const result: T[] = [];
    const entries = Object.entries(cacheRef.current);
    for (let i = 0; i < entries.length; ++i) {
      const [key, val] = entries[i];
      if (fn(key, val)) {
        result.push(val as T);
      }
    }
    return result;
  };

  const clear = () => {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("lapp")) {
        localStorage.removeItem(key);
      }
    });
    Object.keys(sessionStorage).forEach((key) => {
      if (key.startsWith("sapp")) {
        sessionStorage.removeItem(key);
      }
    });
  };

  return (
    <AppCacheContext.Provider
      value={{
        get,
        remove,
        removeIf,
        save,
        querySelector,
        querySelectorAll,
        getOrCreate,
        clear,
      }}
    >
      {children}
    </AppCacheContext.Provider>
  );
}
