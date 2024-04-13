import { Skeleton, Stack } from "@mui/material";

export default function AppFooterHolder() {
  return (
    <Stack direction={"row"} gap={0.1} height={"55px"}>
      <Skeleton variant="rectangular" width={"186px"} height={"100%"} />
      <Skeleton variant="rectangular" sx={{ flex: 1 }} height={"100%"} />
      <Skeleton variant="rectangular" width={"55px"} height={"100%"} />
    </Stack>
  );
}
