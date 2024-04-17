export type IHookFetchState = "INCHING" | "SUCCESS" | "ERROR" | "INITIAL";
export type IHookFetchError =
  | "NETWORK_ERR"
  | "NOT_FOUND"
  | "TIME_OUT"
  | "SERVER_ERROR"
  | "UNAUTHORIZATION"
  | "BAD_REQUEST"
  | "UNKNOWN";

export interface IHookFetchLike<Data> {
  data?: Data;
  status: IHookFetchState;
  error?: IHookFetchError;
}

export const parseError = (error: any): IHookFetchError => {
  if (typeof error === "object" && typeof error.code === "number") {
    const code = error.code as number;
    switch (code) {
      case 500:
        return "SERVER_ERROR";
      case 403:
        return "UNAUTHORIZATION";
      case 400:
        return "BAD_REQUEST";
      case 404:
        return "NOT_FOUND";
    }
  }

  return "UNKNOWN";
};

export const utilRetry = async <T>(
  promise: () => Promise<T>,
  timeOut: number
): Promise<T> => {
  const now = Date.now();
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      const data: T = await promise();
      return data;
    } catch (error) {
      if (Date.now() - now > timeOut) {
        return Promise.reject("TIME_OUT");
      }
      const type = parseError(error);
      if (type !== "SERVER_ERROR") {
        return Promise.reject(type);
      }
    }
  }
};
