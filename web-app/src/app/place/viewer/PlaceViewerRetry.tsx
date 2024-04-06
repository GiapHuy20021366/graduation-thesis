import { Button, Stack, Typography } from "@mui/material";
import { useComponentLanguage } from "../../../hooks";

interface IPlaceViewerRetryProps {
  onRetry?: () => void;
}

export default function PlaceViewerRetry({ onRetry }: IPlaceViewerRetryProps) {
  const lang = useComponentLanguage();
  return (
    <Stack
      width={"100%"}
      boxSizing={"border-box"}
      gap={2}
      p={1}
      alignContent={"center"}
      alignItems={"center"}
      justifyContent={"center"}
    >
      <Typography>{lang("error-occured")}</Typography>
      <Button onClick={() => onRetry && onRetry()}>{lang("retry")}</Button>
    </Stack>
  );
}
