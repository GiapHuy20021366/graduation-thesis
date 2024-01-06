import { Box, Stack } from "@mui/material";
import ContentHeader from "../common/layout/ContentHeader";
import ContentBody from "../common/layout/ContentBody";
import ContentFooter from "../common/layout/ContentFooter";

export default function LevelPage() {
  return (
    <Stack
      sx={{
        height: "98vh",
        boxSizing: "border-box",
        justifyContent: "space-between",
      }}
    >
      <ContentHeader
        title="Levels"
        extensions={["notification", "location", "search"]}
      />
      <ContentBody>
        <Box component="div">Levels Body</Box>
      </ContentBody>
      <Box display={["block", "none", "none", "none"]}>
        <ContentFooter />
      </Box>
    </Stack>
  );
}
