import {
  HomeOutlined,
  ListAltOutlined,
  AddCircleOutlined,
  ForumOutlined,
  MessageOutlined,
} from "@mui/icons-material";
import { Box, Stack } from "@mui/material";
import { useI18nContext } from "../../../hooks";
import { useNavigate } from "react-router";

export default function ContentFooter() {
  const navigate = useNavigate();
  const languageContext = useI18nContext();
  const lang = languageContext.of(ContentFooter);
  const iconStyle = {
    width: "1.2em",
    height: "1.2em",
    cursor: "pointer",
  };
  const generalStyle = {
    alignItems: "center",
    cursor: "pointer",
    ":hover": {
      color: "gray",
    },
  };

  return (
    <Stack
      direction="row"
      sx={{
        justifyContent: "center",
        margin: 0,
      }}
      spacing={3}
    >
      <Stack direction="column" sx={generalStyle}>
        <HomeOutlined sx={iconStyle} />
        <Box component="span">{lang("home")}</Box>
      </Stack>
      <Stack direction="column" sx={generalStyle}>
        <ListAltOutlined sx={iconStyle} />
        <Box component="span">{lang("goals")}</Box>
      </Stack>
      <Stack
        direction="column"
        sx={generalStyle}
        onClick={() => navigate("/food/sharing")}
      >
        <AddCircleOutlined
          sx={{
            width: "1.5em",
            height: "1.5em",
            cursor: "pointer",
            color: "green",
          }}
        />
        <Box component="span">{lang("add")}</Box>
      </Stack>
      <Stack direction="column" sx={generalStyle}>
        <ForumOutlined sx={iconStyle} />
        <Box component="span">{lang("forum")}</Box>
      </Stack>
      <Stack direction="column" sx={generalStyle}>
        <MessageOutlined sx={iconStyle} />
        <Box component="span">{lang("message")}</Box>
      </Stack>
    </Stack>
  );
}
