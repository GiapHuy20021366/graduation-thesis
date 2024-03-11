import { Skeleton, Stack } from "@mui/material";

export default function UserViewerHolder() {
  return (
    <Stack
      width={"100%"}
      boxSizing={"border-box"}
      gap={2}
      p={1}
      minHeight={"90vh"}
    >
      <Skeleton variant="rectangular" width={"100%"} height={235} />
      <Stack direction={"row"} gap={1}>
        <Skeleton variant="rectangular" sx={{ flex: 1 }} height={25} />
        <Skeleton variant="rectangular" sx={{ flex: 1 }} height={25} />
        <Skeleton variant="rectangular" sx={{ flex: 1 }} height={25} />
        <Skeleton variant="rectangular" sx={{ flex: 1 }} height={25} />
      </Stack>
      <Skeleton variant="rectangular" width={"100%"} sx={{ flex: 1 }} />
    </Stack>
  );
}
