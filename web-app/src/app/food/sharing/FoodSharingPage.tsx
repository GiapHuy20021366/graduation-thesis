import { Box, Stack } from "@mui/material";
import ContentHeader from "../../common/layout/ContentHeader";
import ContentBody from "../../common/layout/ContentBody";
import ContentFooter from "../../common/layout/ContentFooter";
import FoodSharingForm from "./FoodSharingForm";
import FoodSharingFormContextProvider from "./FoodSharingFormContext";

export default function FoodSharingPage() {
  return (
    <Stack
      sx={{
        height: "98vh",
        boxSizing: "border-box",
        justifyContent: "space-between",
      }}
    >
      <ContentHeader
        title="Sharing"
        extensions={["notification", "location", "search"]}
      />
      <ContentBody>
        <FoodSharingFormContextProvider>
          <FoodSharingForm />
        </FoodSharingFormContextProvider>
      </ContentBody>
      <Box display={["block", "none", "none", "none"]}>
        <ContentFooter />
      </Box>
    </Stack>
  );
}
