// A component for display message content and other actions

import { Box, Divider, Stack } from "@mui/material";

export default function NotifocationSystemExposed() {
  return (
    <Stack
      width={["90vw", "60vw", "40vw"]}
      height={["80vh", "60vh", "50vh"]}
      boxSizing={"border-box"}
    >
      <Box component={"h4"} textAlign={"center"}>
        Thông báo
      </Box>
      <Divider />
      <Box
        sx={{ overflowY: "auto", flex: 1 }}
        width={"100%"}
        p={1}
        boxSizing={"border-box"}
      >
        <Box minHeight={"100vh"}>Notification system</Box>
      </Box>
    </Stack>
  );
}
