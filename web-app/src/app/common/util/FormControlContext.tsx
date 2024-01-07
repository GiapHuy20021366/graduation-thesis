import { Box, SxProps, Theme } from "@mui/material";
import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useState,
} from "react";

interface IFormControlContextProviderProps {
  children?: React.ReactNode;
  sx?: SxProps<Theme>;
  error?: boolean;
  focused?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  required?: boolean;
}

interface IFormControlContext {
  error: boolean;
  focused: boolean;
  disabled: boolean;
  fullWidth: boolean;
  required: boolean;
  setDisabled: Dispatch<SetStateAction<boolean>>;
  setError: Dispatch<SetStateAction<boolean>>;
  setFullWidth: Dispatch<SetStateAction<boolean>>;
  setRequired: Dispatch<SetStateAction<boolean>>;
  setFocused: Dispatch<SetStateAction<boolean>>;
}

export const FormControlContext = createContext<IFormControlContext>({
  disabled: false,
  error: false,
  focused: false,
  fullWidth: false,
  required: false,

  setDisabled: () => {},
  setError: () => {},
  setFocused: () => {},
  setFullWidth: () => {},
  setRequired: () => {},
});

export default function FormControlContextProvider({
  children,
  sx,
  disabled,
  error,
  focused,
  fullWidth,
  required,
}: IFormControlContextProviderProps) {
  const [_disabled, setDisabled] = useState<boolean>(disabled ?? false);
  const [_error, setError] = useState<boolean>(error ?? false);
  const [_focused, setFocused] = useState<boolean>(focused ?? false);
  const [_fullWidth, setFullWidth] = useState<boolean>(fullWidth ?? false);
  const [_required, setRequired] = useState<boolean>(required ?? false);

  return (
    <FormControlContext.Provider
      value={{
        disabled: _disabled,
        error: _error,
        focused: _focused,
        fullWidth: _fullWidth,
        required: _required,
        setDisabled,
        setError,
        setFocused,
        setFullWidth,
        setRequired,
      }}
    >
      <Box
        sx={{
          ...sx,
        }}
        width={_fullWidth ? "100%" : "fit-content"}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      >
        {children}
      </Box>
    </FormControlContext.Provider>
  );
}
