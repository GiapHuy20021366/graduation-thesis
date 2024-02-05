import { Button, Stack, Typography } from "@mui/material";

interface IPlaceViewerRetryProps {
  onRetry?: () => void;
}

export default function PlaceViewerRetry({ onRetry }: IPlaceViewerRetryProps) {
  return (
    <Stack
      width={"100%"}
      boxSizing={"border-box"}
      gap={2}
      p={1}
      minHeight={"90vh"}
      alignContent={"center"}
      alignItems={"center"}
      justifyContent={"center"}
    >
      <Typography> Có lỗi xảy ra</Typography>
      <Button onClick={() => onRetry && onRetry()}>Thử lại</Button>
    </Stack>
  );
}
