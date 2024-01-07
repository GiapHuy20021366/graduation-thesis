import { Box, Stack } from "@mui/material";
import SideBarOpener from "../menu-side/SideBarOpener";
import {
  SearchOutlined,
  NotificationsOutlined,
  RoomOutlined,
} from "@mui/icons-material";
import ContentFooter from "./ContentFooter";
import { useNavigate } from "react-router";

type HeaderExtension = "notification" | "search" | "location";

interface IContentHeader {
  children?: React.ReactNode;
  title?: string;
  extensions?: HeaderExtension[];
}

export default function ContentHeader({
  children,
  title,
  extensions,
}: IContentHeader) {
  const navigate = useNavigate();
  const iconStyle = {
    width: "1.3em",
    height: "1.3em",
    cursor: "pointer",
    ":hover": {
      color: "gray",
    },
  };
  return (
    <Box
      sx={{
        margin: 0,
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center">
        <SideBarOpener />
        {extensions &&
          extensions.map((extension, index) => {
            switch (extension) {
              case "notification":
                return <NotificationsOutlined sx={iconStyle} key={index} />;
              case "search":
                return (
                  <SearchOutlined
                    sx={iconStyle}
                    key={index}
                    onClick={() => navigate("/food/search")}
                  />
                );
              case "location":
                return <RoomOutlined sx={iconStyle} key={index} />;
            }
          })}

        {/* Custom content*/}
        {children}

        <Box
          sx={{
            flex: 1,
            display: ["none", "block", "block", "block"],
          }}
        >
          <ContentFooter />
        </Box>

        {title && (
          <Box
            component="h1"
            sx={{
              flex: [1, 0, 0, 0],
              textAlign: "end",
            }}
          >
            {title}
          </Box>
        )}
      </Stack>
    </Box>
  );
}
