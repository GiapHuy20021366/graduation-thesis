import {
  Avatar,
  IconButton,
  IconButtonProps,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import React from "react";
import {
  useAuthContext,
  useComponentLanguage,
  useThemeContext,
} from "../../../../../hooks";
import { deepOrange } from "@mui/material/colors";
import ThemeSwitch from "../../../../common/custom/ThemeSwitch";
import { LogoutOutlined } from "@mui/icons-material";

type AvatarActionProps = IconButtonProps;

const AvatarButtonAction = React.forwardRef<
  HTMLButtonElement,
  AvatarActionProps
>((props, ref) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const authContext = useAuthContext();
  const { account } = authContext;
  const theme = useThemeContext();
  const lang = useComponentLanguage("AvatarButtonAction");

  const logout = () => {
    sessionStorage.clear();
    authContext.logout();
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
        aria-controls={open ? "avatar-context-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleOpen}
      >
        <Avatar
          alt={account?.firstName}
          sx={{ bgcolor: deepOrange[500], cursor: "pointer" }}
          src={account?.avatar}
        >
          {account?.firstName && account.firstName[0]}
        </Avatar>
      </IconButton>
      <Menu
        sx={{ mt: "45px" }}
        id="avatar-context-menu"
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
        <MenuItem>
          <ThemeSwitch
            checked={theme.mode === "dark"}
            onChange={(_event, checked) => {
              theme.setMode(checked ? "dark" : "light");
            }}
            sx={{ mr: 1, ml: -1 }}
          />
          <Typography textAlign="center">
            {theme.mode === "dark" ? lang("dark") : lang("light")}
          </Typography>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <LogoutOutlined
            sx={{ marginRight: 1, width: "1.3em", height: "1.3em" }}
            color="secondary"
          />
          <Typography onClick={() => logout()} textAlign="center">
            {lang("logout")}
          </Typography>
        </MenuItem>
      </Menu>
    </>
  );
});

export default AvatarButtonAction;
