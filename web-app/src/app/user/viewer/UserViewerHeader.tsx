import React, { useState } from "react";
import {
  Avatar,
  Box,
  BoxProps,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";

import {
  AccessTimeOutlined,
  EditOutlined,
  MapsUgcOutlined,
  NotificationsActiveOutlined,
} from "@mui/icons-material";
import UserSubcribeChipAction from "./SubcribedChipAction";
import UserContextMenu from "./UserButtonContextMenu";
import TimeExposed from "../../common/custom/TimeExposed";
import {
  useComponentLanguage,
  useConversationContext,
  useUserViewerContext,
} from "../../../hooks";
import UserViewerAvatarEditor from "./UserViewerAvatarEditor";
import UserViewerNameEditor from "./UserViewerNameEditor";
import ButtonShareAction from "../../common/util/ButtonShareAction";

type UserViewerHeaderProps = BoxProps;

const UserViewerHeader = React.forwardRef<
  HTMLDivElement,
  UserViewerHeaderProps
>((props, ref) => {
  const { ...rest } = props;

  const viewerContext = useUserViewerContext();
  const {
    _id,
    subcribers,
    avatar,
    firstName,
    lastName,
    createdAt,
    setSubcribers,
    isEditable,
  } = viewerContext;

  const [openAvatarEditor, setOpenAvatarEditor] = useState<boolean>(false);
  const [openNameEditor, setOpenNameEditor] = useState<boolean>(false);
  const lang = useComponentLanguage();

  const conversationContext = useConversationContext();

  const handleAvatarClick = () => {
    if (isEditable) {
      setOpenAvatarEditor(true);
    }
  };

  return (
    <Box
      ref={ref}
      {...rest}
      sx={{
        width: "100%",
        position: "relative",
        mt: 1,
        ...(props.sx ?? {}),
      }}
    >
      <Stack direction={["column", "row"]} gap={1}>
        <Avatar
          sx={{
            width: [90, 100, 110, 120],
            height: [90, 100, 110, 120],
            zIndex: 1000,
            boxShadow: 5,
            cursor: isEditable ? "pointer" : "unset",
          }}
          src={avatar}
          onClick={handleAvatarClick}
        >
          {firstName.charAt(0)}
        </Avatar>
        <UserViewerAvatarEditor
          open={openAvatarEditor}
          onClose={() => setOpenAvatarEditor(false)}
          onCancel={() => setOpenAvatarEditor(false)}
          onSuccess={() => setOpenAvatarEditor(false)}
        />

        <Stack gap={1} flex={1}>
          <Stack direction={"row"} gap={1} sx={{ alignItems: "center" }}>
            <Typography
              sx={{ fontWeight: 500, fontSize: "1.3rem", mt: 2, ml: 2 }}
            >
              {firstName + " " + lastName}
            </Typography>
            {isEditable && (
              <Tooltip
                arrow
                children={
                  <IconButton
                    color="info"
                    onClick={() => setOpenNameEditor(true)}
                  >
                    <EditOutlined />
                  </IconButton>
                }
                title={lang("edit")}
              />
            )}
            <UserViewerNameEditor
              open={openNameEditor}
              onClose={() => setOpenNameEditor(false)}
              onCancel={() => setOpenNameEditor(false)}
              onSuccess={() => setOpenNameEditor(false)}
            />
          </Stack>

          <Stack direction={"row"} sx={{ alignItems: "center" }} ml={1} gap={1}>
            <IconButton color="success">
              <NotificationsActiveOutlined />
            </IconButton>
            <Typography>{lang("n-subcribed", subcribers ?? 0)}</Typography>
            <UserSubcribeChipAction
              onFollowed={() => setSubcribers((subcribers ?? 0) + 1)}
              onUnFollowed={() => setSubcribers((subcribers ?? 1) - 1)}
              sx={{ ml: 2 }}
            />
            <Box ml={"auto"}>
              <Tooltip arrow title={lang("see-more")}>
                <UserContextMenu sx={{ flex: 1 }} color="primary" />
              </Tooltip>
            </Box>
          </Stack>
          <Stack gap={1} direction={"row"} alignItems={"center"} ml={1}>
            <IconButton>
              <AccessTimeOutlined />
            </IconButton>
            <Typography>
              {lang("join-at")}
              <TimeExposed time={createdAt} hour={false} />
            </Typography>
            <Tooltip title={lang("share-label")}>
              <ButtonShareAction
                color="info"
                link={new URL(`/user/${_id}`, window.location.href).href}
              />
            </Tooltip>
            <IconButton
              color="success"
              onClick={() => {
                conversationContext.doBeginConversationWith(_id);
              }}
              sx={{ ml: -1 }}
            >
              <MapsUgcOutlined />
            </IconButton>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
});

export default UserViewerHeader;
