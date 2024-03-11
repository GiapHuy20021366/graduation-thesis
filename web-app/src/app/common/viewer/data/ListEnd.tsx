import { Stack, StackProps } from "@mui/material";
import React from "react";

type ListEndProps = StackProps & {
  active: boolean;
};

const ListEnd = React.forwardRef<HTMLDivElement, ListEndProps>((props, ref) => {
  const { active, ...rest } = props;
  return (
    <Stack
      ref={ref}
      width={"100%"}
      boxSizing={"border-box"}
      textAlign={"center"}
      {...rest}
      display={active ? "flex" : "none"}
    >
      Đã hết
    </Stack>
  );
});

export default ListEnd;
