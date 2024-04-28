import * as React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import {
  Edit,
  MoreVert,
  ReportGmailerrorred,
  SentimentVeryDissatisfiedOutlined,
  SentimentVerySatisfiedOutlined,
  VisibilityOffOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  ListItemIcon,
} from "@mui/material";
import {
  applicationPages,
  useComponentLanguage,
  useFoodPostViewerContext,
} from "../../../hooks";
import { useState } from "react";
import StyledLink from "../../common/navigate/StyledLink";

export default function FoodPostButtonWithMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const viewerContext = useFoodPostViewerContext();
  const { food, activeFood, resolveFood, editable } = viewerContext;
  const { active, resolved } = food;
  const lang = useComponentLanguage("FoodPostButtonWithMenu");
  const [openConfirmHide, setOpenConfirmHide] = useState<boolean>(false);
  const [openConfirmResolve, setOpenConfirmResolve] = useState<boolean>(false);

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Tooltip arrow title={lang("setting-label")}>
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ ml: "auto" }}
          aria-controls={open ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          <MoreVert />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
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
        {editable && (
          <StyledLink to={applicationPages.FOOD_SHARING} state={food}>
            <MenuItem>
              <ListItemIcon>
                <Edit fontSize="small" />
              </ListItemIcon>
              {lang("edit")}
            </MenuItem>
          </StyledLink>
        )}
        {editable && (
          <MenuItem
            onClick={() => {
              handleClose();
              if (active) {
                setOpenConfirmHide(true);
              } else {
                activeFood();
              }
            }}
          >
            <ListItemIcon>
              {active ? <VisibilityOffOutlined /> : <VisibilityOutlined />}
            </ListItemIcon>
            {lang(active ? "hide" : "unhide")}
          </MenuItem>
        )}
        {editable && (
          <MenuItem
            onClick={() => {
              handleClose();
              if (resolved) {
                setOpenConfirmResolve(true);
              } else {
                resolveFood();
              }
            }}
          >
            <ListItemIcon>
              {resolved ? (
                <SentimentVeryDissatisfiedOutlined />
              ) : (
                <SentimentVerySatisfiedOutlined />
              )}
            </ListItemIcon>
            {lang(resolved ? "unresolve" : "resolve")}
          </MenuItem>
        )}
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <ReportGmailerrorred fontSize="small" />
          </ListItemIcon>
          {lang("report")}
        </MenuItem>
      </Menu>

      {/* Dialog confirm hide/unhide */}
      <Dialog
        open={openConfirmHide}
        keepMounted
        onClose={() => setOpenConfirmHide(false)}
        aria-describedby="dialog-confirm-hide-food"
      >
        <DialogTitle>{lang("confirm-hide-title")}</DialogTitle>
        <DialogContent sx={{ minWidth: "300px" }}>
          <DialogContentText id="dialog-confirm-hide-food">
            {lang("confirm-hide-content")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmHide(false)}>
            {lang("cancel")}
          </Button>
          <Button
            onClick={() => {
              setOpenConfirmHide(false);
              activeFood();
            }}
          >
            {lang("agree")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog confirm resolve/unresolve */}
      <Dialog
        open={openConfirmResolve}
        keepMounted
        onClose={() => setOpenConfirmResolve(false)}
        aria-describedby="dialog-confirm-resolve-food"
      >
        <DialogTitle>{lang("confirm-resolve-title")}</DialogTitle>
        <DialogContent sx={{ minWidth: "300px" }}>
          <DialogContentText id="dialog-confirm-resolve-food">
            {lang("confirm-resolve-content")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmResolve(false)}>
            {lang("cancel")}
          </Button>
          <Button
            onClick={() => {
              setOpenConfirmResolve(false);
              resolveFood();
            }}
          >
            {lang("agree")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
