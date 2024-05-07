import {
  ContentCopyOutlined,
  DoneOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  IconButtonProps,
  Stack,
  SxProps,
  Theme,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useComponentLanguage } from "../../../hooks";

type ButtonShareActionProps = IconButtonProps & {
  IconPropsSx?: SxProps<Theme>;
  link: string;
};

const ButtonShareAction = React.forwardRef<
  HTMLButtonElement,
  ButtonShareActionProps
>((props, ref) => {
  const { IconPropsSx, link, ...rest } = props;
  const [open, setOpen] = useState<boolean>(false);
  const lang = useComponentLanguage();
  const [copied, setCopied] = useState<boolean>(false);

  return (
    <>
      <IconButton
        ref={ref}
        {...rest}
        sx={{
          ml: "auto",
          ...(props.sx ?? {}),
        }}
        onClick={() => setOpen(true)}
      >
        <ShareOutlined sx={{ ...IconPropsSx }} />
      </IconButton>
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
          setCopied(false);
        }}
      >
        <DialogTitle>{lang("share")}</DialogTitle>
        <DialogContent>
          <Stack
            direction="row"
            sx={{
              backgroundColor: "background.paper",
              overflowX: "hidden",
              width: "100%",
            }}
            onClick={() => {
              navigator.clipboard.writeText(link);
              setCopied(true);
            }}
          >
            <Typography
              sx={{
                p: 1,
                cursor: "pointer",
                width: "calc(100% - 60px)",
              }}
            >
              {link}
            </Typography>
            <Tooltip
              arrow
              title={lang(copied ? "copied" : "copy")}
              open={copied}
              placement="top"
            >
              <IconButton color="info">
                {copied ? <DoneOutlined /> : <ContentCopyOutlined />}
              </IconButton>
            </Tooltip>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpen(false);
              setCopied(false);
            }}
          >
            {lang("close")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
});

export default ButtonShareAction;
