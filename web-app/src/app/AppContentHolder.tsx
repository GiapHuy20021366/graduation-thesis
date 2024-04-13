import { Skeleton, Stack } from "@mui/material";

export default function AppContentHolder() {
  return (
    <Stack
      direction={"column"}
      m={0}
      p={0}
      height={"100svh"}
      boxSizing={"border-box"}
      gap={0.1}
    >
      <Stack direction={"row"} gap={0.1} height={"55px"}>
        <Skeleton variant="rectangular" width={"186px"} height={"100%"} />
        <Skeleton variant="rectangular" sx={{ flex: 1 }} height={"100%"} />
        <Skeleton variant="rectangular" width={"55px"} height={"100%"} />
      </Stack>
      <Stack gap={0.2} flex={1} my={0.2}>
        <Skeleton variant="rectangular" sx={{ flex: 1 }} width={"100%"} />
        <Skeleton variant="rectangular" width={"100%"} sx={{ flex: 1 }} />
      </Stack>
      <Skeleton variant="rectangular" sx={{ width: "100%", height: "55px" }} />
    </Stack>
  );
}
