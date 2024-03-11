import React from "react";
import { Skeleton, Stack, StackProps } from "@mui/material";

type SharedFoodHolderProps = StackProps;

const SharedFoodHolder = React.forwardRef<HTMLDivElement, SharedFoodHolderProps>(
  (props, ref) => {
    return (
      <Stack
        ref={ref}
        direction={"row"}
        gap={1}
        {...props}
        sx={{
          width: "100%",
          ...(props.sx ?? {}),
        }}
      >
        <Skeleton variant="circular" sx={{ width: 85, height: 85 }} />
        <Stack>
          <Skeleton variant="text" width={"80%"} />
          <Skeleton variant="text" width={"60%"} />
          <Skeleton variant="text" width={"90%"} />
          <Skeleton variant="text" width={"75%"} />
        </Stack>
      </Stack>
    );
  }
);

export default SharedFoodHolder;
