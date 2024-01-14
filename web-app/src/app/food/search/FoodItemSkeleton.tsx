import { Box, Divider, Skeleton, Stack } from "@mui/material";

export default function FoodItemSkeleton() {
  return (
    <Stack
      sx={{
        border: "1px solid #bdbdbd",
        borderRadius: "4px",
        padding: "8px",
        width: "100%",
        boxSizing: "border-box",
        margin: "0.5rem 0",
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
            <Skeleton variant="text" width={45}/>
          </Stack>
          <Stack direction="row" alignItems={"center"}>
            <Skeleton variant="text" width={45} />
            <Skeleton variant="text" width={45} />
          </Stack>
        </Box>
      </Stack>
      <Divider />
      <Stack direction="row" gap={1}>
        <Stack
          direction="column"
          sx={{
            alignItems: "center",
          }}
        >
          <Skeleton variant="circular" width={45} height={45} />
          <Skeleton variant="text" width={45} />
        </Stack>
        <Divider orientation="vertical" flexItem />

        <Box flex={1}>
          <Skeleton variant="text" />
        </Box>
      </Stack>
    </Stack>
  );
}
