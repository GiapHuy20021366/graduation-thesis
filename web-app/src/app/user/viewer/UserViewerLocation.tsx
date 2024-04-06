import React, { useEffect, useState } from "react";
import {
  Box,
  BoxProps,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  useAuthContext,
  useComponentLanguage,
  useDistanceCalculation,
  useUserViewerContext,
} from "../../../hooks";
import {
  EditOutlined,
  LocationOnOutlined,
  NearMeOutlined,
  SocialDistanceOutlined,
} from "@mui/icons-material";
import UserViewerLocationExposedDialog from "./UserViewerLocationExposedDialog";
import UserViewerLocationEditor from "./UserViewerLocationEditor";

type UserViewerLocationProps = BoxProps;

const UserViewerLocation = React.forwardRef<
  HTMLDivElement,
  UserViewerLocationProps
>((props, ref) => {
  const { ...rest } = props;

  const authContext = useAuthContext();
  const account = authContext.account;
  const viewerContext = useUserViewerContext();
  const { location, isEditable } = viewerContext;
  const distances = useDistanceCalculation();

  const [openMap, setOpenMap] = useState<boolean>(false);
  const [openEditor, setOpenEditor] = useState<boolean>(false);
  const lang = useComponentLanguage();

  useEffect(() => {
    distances.setTargetLocation(location);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  useEffect(() => {
    if (account?.location != null && distances.homeLocation == null) {
      distances.setHomeLocation(account.location);
    }
  }, [account, distances]);

  const { homeToTartgetDistance, currentToTargetDistance } = distances;

  const isLocated = location?.name != null;

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
        <h4>{lang("location")}</h4>
        {isEditable && (
          <Tooltip
            arrow
            children={
              <IconButton color="info" onClick={() => setOpenEditor(true)}>
                <EditOutlined />
              </IconButton>
            }
            title={lang("edit")}
          />
        )}
        {isLocated && (
          <Tooltip
            arrow
            children={
              <IconButton
                color="secondary"
                onClick={() => setOpenMap(true)}
                sx={{ ml: -2 }}
              >
                <NearMeOutlined />
              </IconButton>
            }
            title={lang("see-location")}
          />
        )}
        <UserViewerLocationEditor
          open={openEditor}
          onClose={() => setOpenEditor(false)}
          onCancel={() => setOpenEditor(false)}
          onSuccess={() => setOpenEditor(false)}
        />
      </Stack>
      <Stack direction={"row"} gap={1}>
        <LocationOnOutlined color="info" />
        <Typography>
          {isLocated ? location!.name : lang("user-hide-location")}
        </Typography>
      </Stack>
      {homeToTartgetDistance != null && (
        <Stack direction={"row"} gap={1}>
          <SocialDistanceOutlined color="info" />
          <Typography>
            {lang("from-home", homeToTartgetDistance, "Km")}
          </Typography>
        </Stack>
      )}
      {currentToTargetDistance != null && (
        <Stack direction={"row"} gap={1}>
          <SocialDistanceOutlined color="info" />
          <Typography>
            {lang("from-current", currentToTargetDistance, "km")}
          </Typography>
        </Stack>
      )}

      {/* Dialog */}
      <UserViewerLocationExposedDialog
        currentLocation={distances.currentLocation}
        targetLocation={distances.targetLocation}
        homeLocation={distances.homeLocation}
        onCloseClick={() => setOpenMap(false)}
        open={openMap}
      />
    </Box>
  );
});

export default UserViewerLocation;
