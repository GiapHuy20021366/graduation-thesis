import { Skeleton, Stack } from "@mui/material";
import Carousel from "react-material-ui-carousel";

export default function FoodPostInfoReplacer() {
  return (
    <Stack>
      <Carousel autoPlay indicators swipe>
        <Skeleton variant="rectangular" width={"100%"} height={200} />
        <Skeleton variant="rectangular" width={"100%"} height={200} />
        <Skeleton variant="rectangular" width={"100%"} height={200} />
        <Skeleton variant="rectangular" width={"100%"} height={200} />
      </Carousel>
      <Skeleton variant="text" width={"100%"} height={50} />
      <Skeleton variant="text" width={"100%"} height={200} />
      <Skeleton variant="text" width={"100%"} height={50} />
      <Skeleton variant="text" width={"100%"} height={50} />
      <Skeleton variant="text" width={"100%"} height={50} />
    </Stack>
  );
}
