import { Button, Stack, StackProps, Typography } from "@mui/material";
import React from "react";

type ListEndProps = StackProps & {
  active: boolean;
  onRetry?: () => void;
};

const ListEnd = React.forwardRef<HTMLDivElement, ListEndProps>((props, ref) => {
  const { active, onRetry, ...rest } = props;
  return (
    <Stack
      ref={ref}
      width={"100%"}
      boxSizing={"border-box"}
      textAlign={"center"}
      {...rest}
      display={active ? "flex" : "none"}
    >
      <Typography>Đã hết</Typography>
      {onRetry && <Button onClick={() => onRetry()}>Thử lại</Button>}
    </Stack>
  );
});

export default ListEnd;
