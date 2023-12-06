import { Box, Button, Stack } from "@mui/material";
import ContentHeader from "./layout/ContentHeader";
import ContentBody from "./layout/ContentBody";
import ContentFooter from "./layout/ContentFooter";
import { useAuthContext } from "../../contexts";

export default function AccountContent() {
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
