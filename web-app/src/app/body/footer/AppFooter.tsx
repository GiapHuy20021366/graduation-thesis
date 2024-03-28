import { AppBar, AppBarProps, Toolbar } from "@mui/material";
import AppTabs from "../footer/AppTabs";
import React from "react";

type AppFooterProps = AppBarProps;

const AppFooter = React.forwardRef<HTMLDivElement, AppFooterProps>(
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
        color="default"
      >
        <Toolbar sx={{ justifyContent: "center" }}>
          <AppTabs />
        </Toolbar>
      </AppBar>
    );
  }
);

export default AppFooter;
