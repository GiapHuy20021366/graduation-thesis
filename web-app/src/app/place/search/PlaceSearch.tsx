import { Stack } from "@mui/material";
import PlaceSearchContent from "./PlaceSearchContent";
import PlaceSearchHeader from "./PlaceSearchHeader";

export default function PlaceSearch() {
  return (
    <Stack>
      <PlaceSearchHeader
        position={"sticky"}
        top={0}
        zIndex={1000}
        boxShadow={1}
        sx={{
          backgroundColor: "background.default",
        }}
      />
      <PlaceSearchContent />
    </Stack>
  );
}
