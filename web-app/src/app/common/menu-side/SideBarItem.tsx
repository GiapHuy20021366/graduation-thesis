import { Stack } from "@mui/material";
import SideBarItemText from "./SideBarItemText";
import React from "react";
import { useLocation, useNavigate } from "react-router";
import { useAppContentContext } from "../../../hooks";

interface ISideBarItemProps {
  muiIcon: React.ReactElement;
  text: string;
  activeUrl?: string;
}

export default function SideBarItem({
  muiIcon,
  text,
  activeUrl,
}: ISideBarItemProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const appContentContext = useAppContentContext();

  const navigateToUrl = (url?: string): void => {
    if (url != null) {
      appContentContext.setMenuSideActive(false);
      navigate(url);
    }
  };

  return (
    <Stack
      direction="row"
      sx={{
        cursor: "pointer",
        ":hover": {
          color: "GrayText",
        },
        color: `${
          activeUrl != null && location.pathname.startsWith(activeUrl)
            ? "red"
            : "black"
        }`,
      }}
      onClick={() => navigateToUrl(activeUrl)}
    >
      {React.cloneElement(muiIcon, {
        sx: {
          height: "2rem",
          width: "2rem",
        },
      })}
      <SideBarItemText text={text} />
    </Stack>
  );
}
