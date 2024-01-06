import { Box, Stack } from "@mui/material";
import ContentHeader from "../common/layout/ContentHeader";
import ContentBody from "../common/layout/ContentBody";
import ContentFooter from "../common/layout/ContentFooter";

export default function ProfilePage() {
  return (
    <Stack
      sx={{
        height: "98vh",
        boxSizing: "border-box",
        justifyContent: "space-between",
      }}
    >
      <ContentHeader
        title="Profile"
        extensions={["notification", "location", "search"]}
      />
      <ContentBody>
        <Box component="div">Profile Body</Box>
      </ContentBody>
      <Box display={["block", "none", "none", "none"]}>
        <ContentFooter />
      </Box>
    </Stack>
  );
}
