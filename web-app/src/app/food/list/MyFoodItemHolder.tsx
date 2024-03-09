import React from "react";
import { Box, Divider, Skeleton, Stack, StackProps } from "@mui/material";

type MyFoodItemHolderProps = StackProps;

const MyFoodItemHolder = React.forwardRef<
  HTMLDivElement,
  MyFoodItemHolderProps
>((props, ref) => {
  return (
    <Stack
      ref={ref}
      {...props}
      direction={"row"}
      sx={{
        border: "1px solid #bdbdbd",
        borderRadius: "4px",
        padding: "8px",
        width: "100%",
        boxSizing: "border-box",
        margin: "0.5rem 0",
        ...props.sx,
      }}
      gap={1}
    >
      <Stack direction="row" gap={3}>
        <Skeleton variant="rectangular" width={"20%"} height={"auto"} />
        <Box flex={1}>
          <Skeleton variant="text" />
          <Stack direction={"row"} alignItems={"center"} gap={1}>
            <Skeleton variant="text" width={45} />
            <Skeleton variant="text" width={45} />
          </Stack>
          <Stack direction={"row"} gap={1} mt={1}>
            <Skeleton variant="circular" width={24} height={24} />
            <Skeleton variant="text" width={45} />
          </Stack>
          <Stack direction={"row"} gap={1} mt={1}>
            <Skeleton variant="circular" width={24} height={24} />
            <Skeleton variant="text" width={45} />
          </Stack>
          <Stack mt={1}>
            <Skeleton variant="text" width={45} />
          </Stack>
          <Stack direction="row" alignItems={"center"}>
            <Skeleton variant="text" width={45} />
            <Skeleton variant="text" width={45} />
          </Stack>
        </Box>
      </Stack>
      <Divider />
      <Skeleton variant="text" width={"80%"} />
    </Stack>
  );
});

export default MyFoodItemHolder;
