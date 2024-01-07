import { Box, Divider, Stack } from "@mui/material";
import ContentHeader from "../../common/layout/ContentHeader";
import ContentBody from "../../common/layout/ContentBody";
import ContentFooter from "../../common/layout/ContentFooter";
import FoodPostInfo from "./FoodPostInfo";
import ResponsiveContainer from "../../common/layout/ResponsiveContainer";

export default function FoodPostPage() {
  return (
    <Stack
      sx={{
        height: "98vh",
        boxSizing: "border-box",
        justifyContent: "space-between",
      }}
    >
      <ContentHeader
        title="Post"
        extensions={["notification", "location", "search"]}
      />
      <Divider />
      <ContentBody
        sx={{
          backgroundColor: "#F5F5F5",
        }}
      >
        <ResponsiveContainer>
          <FoodPostInfo />
        </ResponsiveContainer>
      </ContentBody>
      <Box display={["block", "none", "none", "none"]}>
        <ContentFooter />
      </Box>
    </Stack>
  );
}
