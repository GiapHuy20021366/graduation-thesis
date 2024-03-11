import { Button, Stack, StackProps, Typography } from "@mui/material";
import React from "react";

type ErrorRetryProps = StackProps & {
  active: boolean;
  onRetry?: () => void;
};

const ErrorRetry = React.forwardRef<HTMLDivElement, ErrorRetryProps>(
  (props, ref) => {
    const { active, onRetry, ...rest } = props;
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
        <Typography> Có lỗi xảy ra</Typography>
        <Button onClick={() => onRetry && onRetry()}>Thử lại</Button>
      </Stack>
    );
  }
);

export default ErrorRetry;
