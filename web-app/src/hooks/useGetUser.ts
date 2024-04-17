import { useEffect, useState } from "react";
import {
  IAuthInfo,
  IHookFetchError,
  IHookFetchLike,
  IHookFetchState,
  IUserExposedSimple,
  utilRetry,
} from "../data";
import { userFetcher } from "../api";

export interface IUseGetUserStates extends IHookFetchLike<IUserExposedSimple> {
  retry: () => void;
}

export const useGetUser = (
  userId: string,
  auth?: IAuthInfo
): IUseGetUserStates => {
  const [data, setData] = useState<IUserExposedSimple>();
  const [status, setStatus] = useState<IHookFetchState>("INITIAL");
  const [error, setError] = useState<IHookFetchError>();

  const fetchData = (userId: string, auth: IAuthInfo) => {
    setStatus("INCHING");
    utilRetry(() => userFetcher.getSimpleUser(userId, auth), 5000)
      .then((res) => {
        const data = res.data;
        if (data == null) {
          setStatus("ERROR");
          setError("NOT_FOUND");
        } else {
          setStatus("SUCCESS");
          setData(data);
        }
      })
      .catch((err: IHookFetchError) => {
        setStatus("ERROR");
        setError(err);
      });
  };

  useEffect(() => {
    if (status === "INITIAL" && auth) {
      fetchData(userId, auth);
    }
  }, [auth, status, userId]);

  const retry = () => {
    if (status === "ERROR" && auth) {
      fetchData(userId, auth);
    }
  };

  return {
    data,
    status,
    error,
    retry,
  };
};
