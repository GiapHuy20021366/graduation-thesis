import { Box, Stack } from "@mui/material";
import ContentHeader from "../common/layout/ContentHeader";
import ContentBody from "../common/layout/ContentBody";
import ContentFooter from "../common/layout/ContentFooter";
import { SimpleMap } from "../common/map/SimpleMap";
import "../../styles/LocationContent.scss"

export default function LocationPage() {
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
