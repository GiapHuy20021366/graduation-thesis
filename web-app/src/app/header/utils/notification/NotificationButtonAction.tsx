import { NotificationsOutlined } from "@mui/icons-material";
import { IconButton, IconButtonProps, Popover } from "@mui/material";
import React from "react";
import NotificationSystemExposed from "./NotificationSystemExposed";

type NotificationButtonActionProps = IconButtonProps;

const NotificationButtonAction = React.forwardRef<
  HTMLButtonElement,
  NotificationButtonActionProps
>((props, ref) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    props.onClick && props.onClick(event);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        ref={ref}
        {...props}
        sx={{
          ml: "auto",
          ...(props.sx ?? {}),
        }}
        aria-controls={open ? "place-viewer-context-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleOpen}
      >
        <NotificationsOutlined
          sx={{
            width: "1.3em",
            height: "1.3em",
            cursor: "pointer",
            ":hover": {
              color: "gray",
            },
            color: "black",
          }}
        />
      </IconButton>
      <Popover
        id={"place-viewer-context-menu"}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <NotificationSystemExposed />
      </Popover>
    </>
  );
});

export default NotificationButtonAction;