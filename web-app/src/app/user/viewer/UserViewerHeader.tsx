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
import { IUserExposedWithFollower } from "../../../data";
import {
  AccessTimeOutlined,
  NotificationsActiveOutlined,
} from "@mui/icons-material";
import UserSubcribeChipAction from "./SubcribedChipAction";
import UserContextMenu from "./UserButtonContextMenu";
import TimeExposed from "../../common/custom/TimeExposed";

type UserViewerHeaderProps = BoxProps & {
  user: IUserExposedWithFollower;
};

const UserViewerHeader = React.forwardRef<
  HTMLDivElement,
  UserViewerHeaderProps
>((props, ref) => {
  const { user, ...rest } = props;

  const [subribedCount, setSubcribedCount] = useState<number>(
    user.subcribers ?? 0
  );

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
      <Stack direction={"row"} gap={1}>
        <Avatar
          sx={{
            width: [90, 100, 110, 120],
            height: [90, 100, 110, 120],
            zIndex: 1000,
            boxShadow: 5,
          }}
          src={user.avatar}
        >
          {user.firstName.charAt(0)}
        </Avatar>
        <Stack gap={1} flex={1}>
          <Typography
            sx={{ fontWeight: 500, fontSize: "1.3rem", mt: 2, ml: 2 }}
          >
            {user.firstName + " " + user.lastName}
          </Typography>

          <Stack direction={"row"} sx={{ alignItems: "center" }} ml={1} gap={1}>
            <IconButton color="success">
              <NotificationsActiveOutlined />
            </IconButton>
            <Typography>{subribedCount} đang theo dõi</Typography>
            <UserSubcribeChipAction
              onFollowed={() => setSubcribedCount(subribedCount + 1)}
              onUnFollowed={() =>
                setSubcribedCount(Math.max(subribedCount - 1, 0))
              }
              data={user}
              sx={{ ml: 2 }}
            />
            <Box ml={"auto"}>
              <Tooltip title="Xem thêm">
                <UserContextMenu data={user} sx={{ flex: 1 }} color="primary" />
              </Tooltip>
            </Box>
          </Stack>
          <Stack gap={1} direction={"row"} alignItems={"center"} ml={1}>
            <IconButton>
              <AccessTimeOutlined />
            </IconButton>
            <Typography>
              Tham gia vào <TimeExposed time={user.createdAt} hour={false} />
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
});

export default UserViewerHeader;
