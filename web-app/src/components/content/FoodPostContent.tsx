import { Box, Divider, Skeleton, Stack } from "@mui/material";
import ContentHeader from "./layout/ContentHeader";
import ContentBody from "./layout/ContentBody";
import ContentFooter from "./layout/ContentFooter";
import { useParams } from "react-router";
import PageNotFound from "../PageNotFound";
import Carousel from "react-material-ui-carousel";

export default function FoodPostContent() {
  const { foodPostId } = useParams();
  return (
    <Stack
      sx={{
        height: "98vh",
        boxSizing: "border-box",
        justifyContent: "space-between",
      }}
    >
      <ContentHeader
        title="Post"
        extensions={["notification", "location", "search"]}
      />
      <Divider />
      <ContentBody>
        <Stack>
          <Carousel autoPlay indicators swipe>
            <Skeleton variant="rectangular" width={"100%"} height={200} />
            <Skeleton variant="rectangular" width={"100%"} height={200} />
            <Skeleton variant="rectangular" width={"100%"} height={200} />
            <Skeleton variant="rectangular" width={"100%"} height={200} />
          </Carousel>
          <Skeleton variant="text" width={"100%"} height={50}/>
          <Skeleton variant="text" width={"100%"} height={200}/>
          <Skeleton variant="text" width={"100%"} height={50}/>
          <Skeleton variant="text" width={"100%"} height={50}/>
          <Skeleton variant="text" width={"100%"} height={50}/>
        </Stack>
        {foodPostId ? (
          <Box component="div">{foodPostId}</Box>
        ) : (
          <PageNotFound />
        )}
      </ContentBody>
      <Box display={["block", "none", "none", "none"]}>
        <ContentFooter />
      </Box>
    </Stack>
  );
}
