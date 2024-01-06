import { Box, Divider, Stack } from "@mui/material";
import ContentHeader from "../../common/layout/ContentHeader";
import ContentBody from "../../common/layout/ContentBody";
import ContentFooter from "../../common/layout/ContentFooter";
import FoodSearchBody from "./FoodSearchBody";

export default function FoodSearchPage() {
  return (
    <Stack
      sx={{
        height: "100vh",
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
