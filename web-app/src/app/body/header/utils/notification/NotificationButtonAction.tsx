import { NotificationsOutlined } from "@mui/icons-material";
import {
  Badge,
  IconButton,
  IconButtonProps,
  Popover,
  SxProps,
  Theme,
} from "@mui/material";
import React from "react";
import NotificationSystemExposed from "./NotificationSystemExposed";
import { useNotificationContext } from "../../../../../hooks";

type NotificationButtonActionProps = IconButtonProps & {
  IconPropsSx?: SxProps<Theme>;
};

const NotificationButtonAction = React.forwardRef<
  HTMLButtonElement,
  NotificationButtonActionProps
>((props, ref) => {
  const { IconPropsSx, ...rest } = props;

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const notificationContext = useNotificationContext();
  const unreadCount = notificationContext.groups.reduce((cur, group) => {
    if (!group.read) cur += 1;
    return cur;
  }, 0);

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
        {...rest}
        sx={{
          ml: "auto",
          ...(props.sx ?? {}),
        }}
        aria-controls={open ? "notification-action-context-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleOpen}
      >
        <Badge badgeContent={unreadCount} color="secondary" max={9}>
          <NotificationsOutlined sx={{ ...IconPropsSx }} />
        </Badge>
      </IconButton>
      <Popover
        id={"notification-action-context-menu"}
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
