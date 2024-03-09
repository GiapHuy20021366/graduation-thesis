import {
  Avatar,
  IconButton,
  IconButtonProps,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import React from "react";
import { useAuthContext } from "../../../../../hooks";
import { deepOrange } from "@mui/material/colors";

type AvatarActionProps = IconButtonProps;

const AvatarButtonAction = React.forwardRef<
  HTMLButtonElement,
  AvatarActionProps
>((props, ref) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const authContext = useAuthContext();
  const { account } = authContext;

  const logout = () => {
    authContext.setAccount(undefined);
    authContext.setToken(undefined);
    sessionStorage.clear();
  };

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
        aria-controls={open ? "avartar-context-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleOpen}
      >
        <Avatar
          alt={account?.firstName}
          sx={{ bgcolor: deepOrange[500], cursor: "pointer" }}
          src={account?.avatar}
        >
          {account?.firstName[0]}
        </Avatar>
      </IconButton>
      <Menu
        sx={{ mt: "45px" }}
        id="avartar-context-menu"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>
          <Typography onClick={() => logout()} textAlign="center">
            Đăng xuất
          </Typography>
        </MenuItem>
      </Menu>
    </>
  );
});

export default AvatarButtonAction;
