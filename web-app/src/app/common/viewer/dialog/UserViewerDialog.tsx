import React from "react";
import {
  Box,
  Dialog,
  DialogProps,
  IconButton,
  Stack,
  Tooltip,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import UserViewerId from "../../../user/viewer/UserViewerId";

type UserViewerDialogProps = DialogProps & {
  id: string;
  onCloseClick?: () => void;
};

const UserViewerDialog = React.forwardRef<
  HTMLDivElement,
  UserViewerDialogProps
>((props, ref) => {
  const { id, onCloseClick, ...rest } = props;
  return (
    <Dialog ref={ref} {...rest}>
      <Box
        sx={{ width: ["100vw", "85vw", "70vw", "50vw"] }}
        position={"relative"}
      >
        <Stack
          width={"100%"}
          sx={{ zIndex: 1000, position: "sticky", top: 0, height: 0 }}
        >
          <Tooltip arrow title="Đóng">
            <IconButton
              color="primary"
              sx={{
                backgroundColor: "background.default",
                ml: "auto",
                mr: 0.5,
                mt: 0.5,
              }}
              size="large"
              onClick={() => onCloseClick && onCloseClick()}
            >
              <Close />
            </IconButton>
          </Tooltip>
        </Stack>
        <Box p={1}>
          <UserViewerId id={id} />
        </Box>
      </Box>
    </Dialog>
  );
});

export default UserViewerDialog;
