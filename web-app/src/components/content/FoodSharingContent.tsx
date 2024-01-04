import { Box, Stack } from "@mui/material";
import ContentHeader from "./layout/ContentHeader";
import ContentBody from "./layout/ContentBody";
import ContentFooter from "./layout/ContentFooter";
import FoodSharingForm from "./food/FoodSharingForm";
import FoodSharingFormContextProvider from "../../contexts/FoodSharingFormContext";

export default function FoodSharingContent() {
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
