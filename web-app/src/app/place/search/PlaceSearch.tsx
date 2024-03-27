import { Box, Stack } from "@mui/material";
import PlaceSearchContent from "./PlaceSearchContent";
import PlaceSearchHeader from "./PlaceSearchHeader";
import { usePlaceSearchContext } from "../../../hooks";
import PlaceSearchItemHolder from "./PlaceSearchItemHolder";

export default function PlaceSearch() {
  const searchContext = usePlaceSearchContext();
  const { isEnd, isFetching } = searchContext;
  return (
    <Stack>
      <PlaceSearchHeader
        position={"sticky"}
        top={0}
        zIndex={1000}
        boxShadow={1}
      />
      <PlaceSearchContent />
      {isFetching && <PlaceSearchItemHolder />}
      {isEnd && (
        <Box textAlign={"center"} mt={2}>
          Đã hết
        </Box>
      )}
    </Stack>
  );
}
