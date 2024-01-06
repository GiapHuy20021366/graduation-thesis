import { Box, Button, Stack } from "@mui/material";
import ContentHeader from "../common/layout/ContentHeader";
import ContentBody from "../common/layout/ContentBody";
import ContentFooter from "../common/layout/ContentFooter";
import { useAuthContext } from "../../hooks";

export default function AccountPage() {
  const authContext = useAuthContext();
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
        <Button onClick={() => authContext.logout()}>
          Logout
        </Button>
      </ContentBody>
      <Box display={["block", "none", "none", "none"]}>
        <ContentFooter />
      </Box>
    </Stack>
  );
}
