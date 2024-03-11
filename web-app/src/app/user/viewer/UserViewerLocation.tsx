import React, { useEffect, useState } from "react";
import {
  Box,
  BoxProps,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { IUserExposedWithFollower } from "../../../data";
import { useAuthContext, useDistanceCalculation } from "../../../hooks";
import {
  LocationOnOutlined,
  NearMeOutlined,
  SocialDistanceOutlined,
} from "@mui/icons-material";
import UserViewerLocationExposedDialog from "./UserViewerLocationExposedDialog";

type UserViewerLocationProps = BoxProps & {
  data: IUserExposedWithFollower;
};

const UserViewerLocation = React.forwardRef<
  HTMLDivElement,
  UserViewerLocationProps
>((props, ref) => {
  const { data, ...rest } = props;

  const authContext = useAuthContext();
  const account = authContext.account;
  const distances = useDistanceCalculation({ targetLocation: data.location });

  const [openMap, setOpenMap] = useState<boolean>(false);

  useEffect(() => {
    if (account?.location != null && distances.homeLocation == null) {
      distances.setHomeLocation(account.location);
    }
  }, [account, distances]);

  const { homeToTartgetDistance, currentToTargetDistance } = distances;

  const isLocated = data.location?.name != null;

  return (
    <Box
      ref={ref}
      {...rest}
      sx={{
        width: "100%",
        ...(props.sx ?? {}),
      }}
    >
      <Stack direction={"row"} gap={1} alignItems={"center"}>
        <h4>Vị trí</h4>
        {isLocated && (
          <Tooltip
            children={
              <IconButton color="secondary" onClick={() => setOpenMap(true)}>
                <NearMeOutlined />
              </IconButton>
            }
            title={"Xem vị trí"}
          />
        )}
      </Stack>
      <Stack direction={"row"} gap={1}>
        <LocationOnOutlined color="info" />
        <Typography>
          {isLocated ? data.location!.name : "Người dùng ẩn vị trí"}
        </Typography>
      </Stack>
      {homeToTartgetDistance != null && (
        <Stack direction={"row"} gap={1}>
          <SocialDistanceOutlined color="info" />
          <Typography>{homeToTartgetDistance + " km (Nhà của bạn)"}</Typography>
        </Stack>
      )}
      {currentToTargetDistance != null && (
        <Stack direction={"row"} gap={1}>
          <SocialDistanceOutlined color="info" />
          <Typography>
            {currentToTargetDistance + " km (Vị trí hiện tại)"}
          </Typography>
        </Stack>
      )}

      {/* Dialog */}
      <UserViewerLocationExposedDialog
        currentLocation={distances.currentLocation}
        targetLocation={distances.targetLocation}
        homeLocation={distances.homeLocation}
        data={data}
        onCloseClick={() => setOpenMap(false)}
        open={openMap}
      />
    </Box>
  );
});

export default UserViewerLocation;
