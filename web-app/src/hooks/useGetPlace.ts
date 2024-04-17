import { useEffect, useState } from "react";
import {
  IAuthInfo,
  IHookFetchError,
  IHookFetchLike,
  IHookFetchState,
  IPlaceExposed,
  utilRetry,
} from "../data";
import { userFetcher } from "../api";

export interface IUseGetPlaceStates extends IHookFetchLike<IPlaceExposed> {
  retry: () => void;
}

export const useGetPlace = (
  placeId: string,
  auth?: IAuthInfo
): IUseGetPlaceStates => {
  const [data, setData] = useState<IPlaceExposed>();
  const [status, setStatus] = useState<IHookFetchState>("INITIAL");
  const [error, setError] = useState<IHookFetchError>();

  const fetchData = (placeId: string, auth: IAuthInfo) => {
    setStatus("INCHING");
    utilRetry(() => userFetcher.getPlace(placeId, auth), 5000)
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
      fetchData(placeId, auth);
    }
  }, [auth, status, placeId]);

  const retry = () => {
    if (status === "ERROR" && auth) {
      fetchData(placeId, auth);
    }
  };

  return {
    data,
    status,
    error,
    retry,
  };
};
