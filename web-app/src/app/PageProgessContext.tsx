import React, { createContext, useCallback, useRef, useState } from "react";
import { Box, LinearProgress } from "@mui/material";

interface IToastContextProviderProps {
  children?: React.ReactNode;
}

interface IPageProgessContext {
  start: () => void;
  end: () => void;
  isLoading: boolean;
}

export const PageProgessContext = createContext<IPageProgessContext>({
  start: () => {},
  end: () => {},
  isLoading: false,
});

export default function PageProgessContextProvider({
  children,
}: IToastContextProviderProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const timeOut = useRef<NodeJS.Timeout | null>(null);

  const start = useCallback(() => {
    if (timeOut.current != null) {
      clearTimeout(timeOut.current);
    }
    setLoading(true);
    timeOut.current = setTimeout(() => {
      setLoading(false);
    }, 5000);
  }, []);

  const end = useCallback(() => {
    if (timeOut.current != null) {
      clearTimeout(timeOut.current);
    }
    setLoading(false);
  }, []);

  return (
    <PageProgessContext.Provider
      value={{
        start,
        end,
        isLoading: loading,
      }}
    >
      <Box sx={{ width: "100vw", position: "fixed", top: 0, left: 0 }}>
        <LinearProgress
          sx={{
            visibility: loading ? "visible" : "hidden",
          }}
        />
      </Box>
      {children}
    </PageProgessContext.Provider>
  );
}
