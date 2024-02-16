import { isNumber } from "@tiptap/core";

export interface ILocalStorageMeta {
  account?: string | null;
  time: number;
}

export interface ILocalStorage<DataLike> {
  meta: ILocalStorageMeta;
  data: DataLike;
}

export const loadFromLocalStorage = <DataLike>(
  key: string,
  maxDuration: number = Number.MAX_SAFE_INTEGER,
  account?: string
): DataLike | undefined => {
  const localStr = localStorage.getItem(key);
  if (localStr) {
    try {
      const datas = JSON.parse(localStr) as ILocalStorage<DataLike>;

      const meta = datas.meta;
      if (typeof meta !== "object") return;

      const time = meta.time;
      if (!isNumber(time) || isNaN(time) || Date.now() - time > maxDuration) {
        return;
      }

      if (account == null || meta.account === account) {
        return datas.data;
      }
    } catch (err) {
      // DO Nothing
    }
  }

  return;
};

export const saveToLocalStorage = (
  key: string,
  account: string | null | undefined,
  data: any
) => {
  const localData: ILocalStorage<any> = {
    meta: {
      account: account,
      time: Date.now(),
    },
    data: data,
  };
  localStorage.setItem(key, JSON.stringify(localData));
};
