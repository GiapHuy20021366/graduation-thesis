import { Box, Stack } from "@mui/material";
import ContentHeader from "./layout/ContentHeader";
import ContentBody from "./layout/ContentBody";
import ContentFooter from "./layout/ContentFooter";

export default function AccountContent() {
  return (
    <Stack
      sx={{
        height: "98vh",
        boxSizing: "border-box",
        justifyContent: "space-between",
      }}
    >
      <ContentHeader
        title="Account"
        extensions={["notification", "location", "search"]}
      />
      <ContentBody>
        <Box component="div">
            Account Body
        </Box>
      </ContentBody>
      <Box display={["block", "none", "none", "none"]}>
        <ContentFooter />
      </Box>
    </Stack>
  );
}
