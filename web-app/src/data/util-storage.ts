import { isNumber } from "@tiptap/core";

export interface IStorageMeta {
  account?: string | null;
  time: number;
  identifier?: string | string[];
}

export interface IStorageSaveOptions {
  key: string;
  account?: string;
  identifier?: string | string[];
}

export interface IStorageLoadOptions {
  key: string;
  account?: string;
  identifier?: string | string[];
  maxDuration?: number;
}

export interface IStorage<DataLike> {
  meta: IStorageMeta;
  data: DataLike;
}

const loadFromStorage = <DataLike>(
  options: IStorageLoadOptions,
  target: "LOCAL" | "SESSION"
): DataLike | undefined => {
  const { key, account, identifier: identifier, maxDuration } = options;
  let dataStr: string | null = null;
  switch (target) {
    case "LOCAL":
      dataStr = localStorage.getItem(key);
      break;
    case "SESSION":
      dataStr = sessionStorage.getItem(key);
      break;
  }
  if (dataStr) {
    try {
      const datas = JSON.parse(dataStr) as IStorage<DataLike>;

      const meta = datas.meta;
      if (typeof meta !== "object") return;

      const time = meta.time;

      if (maxDuration != null) {
        if (!isNumber(time) || isNaN(time) || Date.now() - time > maxDuration) {
          return;
        }
      }

      if (account != null && meta.account !== account) {
        return;
      }

      if (identifier != null) {
        if (meta.identifier == null) return;

        const idx = Array.isArray(identifier)
          ? identifier.join(".")
          : identifier;
        if (idx !== meta.identifier) return;
      }
      return datas.data;
    } catch (err) {
      // DO Nothing
    }
  }

  return;
};

export const loadFromLocalStorage = <DataLike>(
  options: IStorageLoadOptions
): DataLike | undefined => {
  return loadFromStorage<DataLike>(options, "LOCAL");
};

export const loadFromSessionStorage = <DataLike>(
  options: IStorageLoadOptions
): DataLike | undefined => {
  return loadFromStorage<DataLike>(options, "SESSION");
};

const saveToStorage = (
  data: any,
  options: IStorageSaveOptions,
  target: "LOCAL" | "SESSION"
) => {
  const { key, account, identifier } = options;
  const idx = Array.isArray(identifier) ? identifier.join(".") : identifier;
  const localData: IStorage<any> = {
    meta: {
      account: account,
      time: Date.now(),
      identifier: idx,
    },
    data: data,
  };
  switch (target) {
    case "LOCAL":
      localStorage.setItem(key, JSON.stringify(localData));
      break;
    case "SESSION":
      sessionStorage.setItem(key, JSON.stringify(localData));
      break;
  }
};

export const saveToLocalStorage = (data: any, options: IStorageSaveOptions) => {
  saveToStorage(data, options, "LOCAL");
};

export const saveToSessionStorage = (
  data: any,
  options: IStorageSaveOptions
) => {
  saveToStorage(data, options, "SESSION");
};
