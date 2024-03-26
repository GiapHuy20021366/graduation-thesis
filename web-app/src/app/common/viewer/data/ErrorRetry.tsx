import { Button, Stack, StackProps, Typography } from "@mui/material";
import React from "react";
import { useComponentLanguage } from "../../../../hooks";

type ErrorRetryProps = StackProps & {
  active: boolean;
  onRetry?: () => void;
};

const ErrorRetry = React.forwardRef<HTMLDivElement, ErrorRetryProps>(
  (props, ref) => {
    const { active, onRetry, ...rest } = props;
    const lang = useComponentLanguage("ViewerData");
    return (
      <Stack
        ref={ref}
        width={"100%"}
        boxSizing={"border-box"}
        gap={2}
        p={1}
        minHeight={"90vh"}
        alignContent={"center"}
        alignItems={"center"}
        justifyContent={"center"}
        {...rest}
        display={active ? "flex" : "none"}
      >
        <Typography>{lang("error-occured")}</Typography>
        <Button onClick={() => onRetry && onRetry()}>{lang("retry")}</Button>
      </Stack>
    );
  }
);

export default ErrorRetry;
