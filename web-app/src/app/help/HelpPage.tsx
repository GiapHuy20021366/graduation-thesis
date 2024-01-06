import { Box, Stack } from "@mui/material";
import ContentHeader from "../common/layout/ContentHeader";
import ContentBody from "../common/layout/ContentBody";
import ContentFooter from "../common/layout/ContentFooter";

export default function HelpPage() {
  return (
    <Stack
      sx={{
        height: "98vh",
        boxSizing: "border-box",
        justifyContent: "space-between",
      }}
    >
      <ContentHeader
        title="Help"
        extensions={["notification", "location", "search"]}
      />
      <ContentBody>
        <Box component="div">Help Body</Box>
      </ContentBody>
      <Box display={["block", "none", "none", "none"]}>
        <ContentFooter />
      </Box>
    </Stack>
  );
}
