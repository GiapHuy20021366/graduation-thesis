import { Stack, Typography } from "@mui/material";
import PlaceSearchContent from "./PlaceSearchContent";
import PlaceSearchHeader from "./PlaceSearchHeader";
import { usePlaceSearchContext } from "../../../hooks";

export default function PlaceSearch() {
  const searchContext = usePlaceSearchContext();
  const { isEnd, isFetching } = searchContext;
  return (
    <Stack>
      <PlaceSearchHeader
        position={"sticky"}
        top={0}
        zIndex={1000}
        sx={{
          backgroundColor: "white",
        }}
      />
      <PlaceSearchContent />
      {isEnd && <Typography>End</Typography>}
      {isFetching && <Typography>Fetching</Typography>}
    </Stack>
  );
}
