import { Box, Divider, Stack } from "@mui/material";
import ContentHeader from "./layout/ContentHeader";
import ContentBody from "./layout/ContentBody";
import ContentFooter from "./layout/ContentFooter";
import FoodSearchBody from "./search/FoodSearchBody";

export default function FoodSearchContent() {
  return (
    <Stack
      sx={{
        height: "98vh",
        boxSizing: "border-box",
        justifyContent: "space-between",
      }}
    >
      <ContentHeader
        title="Food"
        extensions={["notification", "location"]}
      />
      <Divider/>
      <ContentBody>
        <FoodSearchBody/>
      </ContentBody>
      <Box display={["block", "none", "none", "none"]}>
        <ContentFooter />
      </Box>
    </Stack>
  );
}
