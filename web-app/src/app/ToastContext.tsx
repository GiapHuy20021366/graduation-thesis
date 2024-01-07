import React, { createContext, useCallback, useEffect, useState } from "react";
import {
  ToastContainer,
  ToastOptions,
  ToastPosition,
  toast,
} from "react-toastify";
import { useMediaQuery, useTheme } from "@mui/material";
import { breakPoints } from "../themes";

interface IToastContextProviderProps {
  children?: React.ReactNode;
}

interface IToastContext {
  invork: (msg: string, options?: ToastOptions) => void;
  info: (msg: string, options?: ToastOptions) => void;
  warn: (msg: string, options?: ToastOptions) => void;
  success: (msg: string, options?: ToastOptions) => void;
  error: (msg: string, options?: ToastOptions) => void;
}

export const ToastContext = createContext<IToastContext>({
  invork: () => {},
  info: () => {},
  warn: () => {},
  success: () => {},
  error: () => {},
});

const preSetup = {
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light",
} as const;

export default function ToastContextProvider({
  children,
}: IToastContextProviderProps) {
  const [pos, setPos] = useState<ToastPosition>("bottom-right");
  const theme = useTheme();
  const isNotMobile = useMediaQuery(theme.breakpoints.up(breakPoints.tablet));
  useEffect(() => {
    if (isNotMobile) {
      setPos("top-right");
    } else {
      setPos("bottom-right");
    }
  }, [isNotMobile]);

  const invork = useCallback(
    (msg: string, options?: ToastOptions) => {
      const rightOptions: ToastOptions = {
        ...preSetup,
        position: pos,
        ...(options ?? {}),
      };
      toast(msg, rightOptions);
    },
    [pos]
  );

  const error = useCallback(
    (msg: string, options?: ToastOptions) => {
      const rightOptions: ToastOptions = {
        ...preSetup,
        position: pos,
        ...(options ?? {}),
      };
      toast.error(msg, rightOptions);
    },
    [pos]
  );

  const warn = useCallback(
    (msg: string, options?: ToastOptions) => {
      const rightOptions: ToastOptions = {
        ...preSetup,
        position: pos,
        ...(options ?? {}),
      };
      toast.warn(msg, rightOptions);
    },
    [pos]
  );

  const info = useCallback(
    (msg: string, options?: ToastOptions) => {
      const rightOptions: ToastOptions = {
        ...preSetup,
        position: pos,
        ...(options ?? {}),
      };
      toast.info(msg, rightOptions);
    },
    [pos]
  );

  const success = useCallback(
    (msg: string, options?: ToastOptions) => {
      const rightOptions: ToastOptions = {
        ...preSetup,
        position: pos,
        ...(options ?? {}),
      };
      toast.success(msg, rightOptions);
    },
    [pos]
  );

  return (
    <ToastContext.Provider
      value={{
        invork,
        error,
        info,
        success,
        warn
      }}
    >
      <ToastContainer
        position={pos}
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {children}
    </ToastContext.Provider>
  );
}
