import { Box, Stack } from "@mui/material";
import ContentHeader from "./layout/ContentHeader";
import ContentBody from "./layout/ContentBody";
import ContentFooter from "./layout/ContentFooter";
import { SimpleMap } from "../map/SimpleMap";
import "../../styles/LocationContent.scss"

export default function LocationContent() {
  return (
    <Stack
      sx={{
        height: "98vh",
        boxSizing: "border-box",
        justifyContent: "space-between",
      }}
    >
      <ContentHeader
        title="Location"
        extensions={["notification", "location", "search"]}
      />
      <ContentBody>
        <Box component="div">Location Body</Box>
        <SimpleMap containerClassName="google-map-container" />
      </ContentBody>
      <Box display={["block", "none", "none", "none"]}>
        <ContentFooter />
      </Box>
    </Stack>
  );
}
