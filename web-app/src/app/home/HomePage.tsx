import { Box } from "@mui/material";
import HomeHeader from "./HomeHeader";
import HomeContent from "./HomeContent";

export default function HomePage() {
  return (
    <Box>
      <HomeHeader
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          pt: 2,
          pl: 1,
          backgroundColor: "background.default",
        }}
      />
      <HomeContent />
    </Box>
  );
}
