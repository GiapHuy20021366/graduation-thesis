import { AppBar, AppBarProps, Divider, Stack, Toolbar } from "@mui/material";
import AppHeaderUtil from "./AppHeaderUtil";
import AppTabs from "../footer/AppTabs";
import AvatarButtonAction from "./utils/avatar-menu/AvavarButtonAction";
import React from "react";

type AppHeaderProps = AppBarProps;

const AppHeader = React.forwardRef<HTMLDivElement, AppHeaderProps>(
  (props, ref) => {
    return (
      <AppBar
        ref={ref}
        {...props}
        sx={{
          position: "relative",
          boxSizing: "border-box",
          width: "100%",
          ...props.sx,
        }}
        color="primary"
      >
        <Toolbar sx={{ pl: 2, pr: 0 }}>
          <Stack direction={"row"} width={"auto"}>
            <AppHeaderUtil />
            <Divider
              orientation="vertical"
              flexItem
              sx={{ borderColor: "inherit" }}
            />
          </Stack>
          <Stack
            flex={1}
            alignItems={"center"}
            display={["none", "flex"]}
          >
            <AppTabs />
          </Stack>
          <Stack direction={"row"} width={"auto"} ml={"auto"}>
            <AvatarButtonAction />
          </Stack>
        </Toolbar>
      </AppBar>
    );
  }
);

export default AppHeader;
