import { useRef, useState } from "react";
import { IAuthInfo, IImageExposed, RequestStatus, getAuth } from "../data";
import { foodFetcher } from "../api";

export interface IFetchCallbackFn {
  onBefore?: () => any;
  onReject?: () => any;
  onError?: () => any;
  onSuccess?: (image: IImageExposed) => any;
}

export interface ISaveImageStates {
  refreshStatus: () => void;
  doSave: (
    base64: string,
    callbacks?: IFetchCallbackFn,
    auth?: IAuthInfo
  ) => Promise<IImageExposed | undefined>;
  status: RequestStatus;
}

export function useSaveImage(auth?: IAuthInfo): ISaveImageStates {
  const authRef = useRef<IAuthInfo | undefined>(auth);
  const [status, setStatus] = useState<RequestStatus>(RequestStatus.INITIAL);

  const doSave = (
    base64: string,
    callbacks?: IFetchCallbackFn,
    auth?: IAuthInfo
  ): Promise<IImageExposed | undefined> => {
    const { onBefore, onError, onReject, onSuccess } = callbacks ?? {};

    if (status === RequestStatus.INCHING) {
      onReject && onReject();
      return Promise.resolve(undefined);
    }

    const authInfo = auth ?? authRef.current ?? getAuth();
    if (authInfo == null) {
      setStatus(RequestStatus.REJECT);
      onReject && onReject();
      return Promise.resolve(undefined);
    }

    setStatus(RequestStatus.INITIAL);

    // Before
    onBefore && onBefore();

    setStatus(RequestStatus.INCHING);

    return foodFetcher
      .uploadImage("", base64, authInfo)
      .then((result) => {
        const _images = result.data;
        if (_images) {
          const image = _images[0];
          if (image) {
            setStatus(RequestStatus.SUCCESS);
            onSuccess && onSuccess(image);
            return Promise.resolve(image);
          } else {
            setStatus(RequestStatus.ERROR);
            onError && onError();
            return Promise.resolve(undefined);
          }
        }
      })
      .catch(() => {
        setStatus(RequestStatus.ERROR);
        onError && onError();
        return Promise.resolve(undefined);
      });
  };

  const refreshStatus = () => {
    setStatus(RequestStatus.INITIAL);
  };

  return {
    refreshStatus,
    doSave,
    status,
  };
}
