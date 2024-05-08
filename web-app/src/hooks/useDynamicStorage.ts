import { useCallback, useRef } from "react";
import { useAppCacheContext } from "./useAppCacheContext";

export interface IUseDynamicStorageStates<T> {
  update: (d: () => T) => void;
  get: () => T | null;
  save: () => void;
  isNew: boolean;
}

export const useDynamicStorage = <T>(
  key: string,
  target?: "LOCAL" | "SESSION"
) => {
  const cacher = useAppCacheContext();
  const dataRef = useRef<T | null>(cacher.get<T>(key) ?? null);
  const isNew = useRef<boolean>(cacher.get<T>(key) == null);

  const update = useCallback((d: () => T) => {
    dataRef.current = d();
  }, []);

  const get = useCallback(() => {
    return dataRef.current;
  }, []);

  const save = useCallback(() => {
    cacher.save(key, dataRef.current, target ?? "HEAP");
  }, [cacher, key, target]);

  return {
    update,
    get,
    save,
    isNew: isNew.current,
  };
};
