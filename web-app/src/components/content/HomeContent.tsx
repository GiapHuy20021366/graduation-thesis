import { Box, Stack } from "@mui/material";
import ContentHeader from "./layout/ContentHeader";
import ContentBody from "./layout/ContentBody";
import ContentFooter from "./layout/ContentFooter";

export default function HomeContent() {
  return (
    <Stack
      sx={{
        height: "98vh",
        boxSizing: "border-box",
        justifyContent: "space-between",
      }}
    >
      <ContentHeader
        title="Home"
        extensions={["notification", "location", "search"]}
      />
      <ContentBody>
        <Box component="div">Home Body</Box>
      </ContentBody>
      <Box display={["block", "none", "none", "none"]}>
        <ContentFooter />
      </Box>
    </Stack>
  );
}
