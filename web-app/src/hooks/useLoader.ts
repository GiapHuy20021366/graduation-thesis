import { useState } from "react";

export interface IUseLoaderStates {
  isFetching: boolean;
  setIsFetching: React.Dispatch<React.SetStateAction<boolean>>;
  isEnd: boolean;
  setIsEnd: React.Dispatch<React.SetStateAction<boolean>>;
  isError: boolean;
  setIsError: React.Dispatch<React.SetStateAction<boolean>>;
}

interface IUseLoaderProps {
  isFetching?: boolean;
  isError?: boolean;
  isEnd?: boolean;
}

export const useLoader = (props?: IUseLoaderProps): IUseLoaderStates => {
  const [isFetching, setIsFetching] = useState<boolean>(
    props?.isFetching ?? false
  );
  const [isEnd, setIsEnd] = useState<boolean>(props?.isEnd ?? false);
  const [isError, setIsError] = useState<boolean>(props?.isError ?? false);

  return {
    isEnd,
    isError,
    isFetching,
    setIsEnd,
    setIsError,
    setIsFetching,
  };
};
