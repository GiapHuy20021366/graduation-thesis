import {
  HomeOutlined,
  ListAltOutlined,
  AddCircleOutlined,
  ForumOutlined,
  MessageOutlined,
} from "@mui/icons-material";
import { Box, Stack } from "@mui/material";

export default function ContentFooter() {
  const iconStyle = {
    width: "1.2em",
    height: "1.2em",
    cursor: "pointer",
  };
  return (
    <Stack
      direction="row"
      sx={{
        justifyContent: "center",
      }}
      spacing={3}
    >
      <Stack
        direction="column"
        sx={{
          alignItems: "center",
        }}
      >
        <HomeOutlined sx={iconStyle} />
        <Box component="span">Home</Box>
      </Stack>
      <Stack
        direction="column"
        sx={{
          alignItems: "center",
        }}
      >
        <ListAltOutlined sx={iconStyle} />
        <Box component="span">Goals</Box>
      </Stack>
      <Stack
        direction="column"
        sx={{
          alignItems: "center",
        }}
      >
        <AddCircleOutlined
          sx={{
            width: "1.5em",
            height: "1.5em",
            cursor: "pointer",
            color: "green"
          }}
        />
        <Box component="span">Add</Box>
      </Stack>
      <Stack
        direction="column"
        sx={{
          alignItems: "center",
        }}
      >
        <ForumOutlined sx={iconStyle} />
        <Box component="span">Forum</Box>
      </Stack>
      <Stack
        direction="column"
        sx={{
          alignItems: "center",
        }}
      >
        <MessageOutlined sx={iconStyle} />
        <Box component="span">Message</Box>
      </Stack>
    </Stack>
  );
}
