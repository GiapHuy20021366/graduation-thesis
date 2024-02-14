import React from "react";
import { Stack, StackProps } from "@mui/material";

type LovedFoodProps = StackProps & {
  active?: boolean;
};

const LovedFood = React.forwardRef<HTMLDivElement, LovedFoodProps>(
  (props, ref) => {
    const { active, ...rest } = props;
    return (
      <Stack
        ref={ref}
        {...rest}
        sx={{
          width: "100%",
          ...(props.sx ?? {}),
        }}
        display={active ? "flex" : "none"}
      >
        Near Place
      </Stack>
    );
  }
);

export default LovedFood;
