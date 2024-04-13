import { Skeleton } from "@mui/material";

export default function ContentHolder({ minHeight }: { minHeight?: number }) {
  return (
    <Skeleton
      width={"100%"}
      height={"100%"}
      sx={{ flex: 1, minHeight: minHeight ?? 10 }}
    />
  );
}
