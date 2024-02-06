import React from "react";
import {
  IconButton,
  IconButtonProps,
  ListItemIcon,
  Menu,
  MenuItem,
} from "@mui/material";
import { FollowType, IAccount, IPlaceExposed } from "../../../data";
import { Edit, MoreVert, ReportGmailerrorred } from "@mui/icons-material";
import { useNavigate } from "react-router";
import { useAuthContext } from "../../../hooks";

type PlaceButtonContextMenuProps = IconButtonProps & {
  data: IPlaceExposed;
};

const isPermitEdit = (place: IPlaceExposed, account?: IAccount): boolean => {
  if (account == null) return false;
  if (place.userFollow == null) return false;
  if (
    place.userFollow.type !== FollowType.ADMIN ||
    place.userFollow.subcriber !== account.id_
  )
    return false;
  return true;
};

const PlaceContextMenu = React.forwardRef<
  HTMLButtonElement,
  PlaceButtonContextMenuProps
>((props, ref) => {
  const { data, ...rest } = props;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const authContext = useAuthContext();
  const account = authContext.account;
  const canEdit = isPermitEdit(data, account);

  const open = Boolean(anchorEl);

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    props.onClick && props.onClick(event);
    setAnchorEl(event.currentTarget);
  };

  const navigate = useNavigate();

  const handleClose = () => {
    setAnchorEl(null);
  };

  const navigateToEdit = () => {
    // Close menu
    handleClose();

    if (data?._id != null) {
      navigate("/place/update", { state: data });
    }
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
        onClick={handleClick}
        aria-controls={open ? "place-viewer-context-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
      >
        <MoreVert />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        id="place-viewer-context-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {canEdit && (
          <MenuItem onClick={navigateToEdit}>
            <ListItemIcon>
              <Edit fontSize="small" />
            </ListItemIcon>
            Edit
          </MenuItem>
        )}
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <ReportGmailerrorred fontSize="small" />
          </ListItemIcon>
          Report
        </MenuItem>
      </Menu>
    </>
  );
});

export default PlaceContextMenu;
