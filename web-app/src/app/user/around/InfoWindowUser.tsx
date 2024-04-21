import { Avatar, Button, Divider, Stack, Typography } from "@mui/material";
import { toDistance } from "../../../data";
import { deepOrange } from "@mui/material/colors";
import { useAppContentContext, useComponentLanguage } from "../../../hooks";
import { LocalOfferOutlined, LocationOnOutlined } from "@mui/icons-material";
import { IUserExposedSimple } from "../../../data/user-exposed";
import StyledLink from "../../common/navigate/StyledLink";

interface IInfoWindowUser {
  user: IUserExposedSimple;
  onBeforeNavigate?: () => void;
}

export default function InfoWindowUser({
  user,
  onBeforeNavigate,
}: IInfoWindowUser) {
  const appContentContext = useAppContentContext();
  const lang = useComponentLanguage();

  return (
    <Stack gap={1} color={"black"}>
      <Stack direction={"row"} gap={1} alignItems={"center"}>
        <Avatar
          alt={user.firstName + " " + user.lastName}
          sx={{ bgcolor: deepOrange[500], cursor: "pointer" }}
          src={user.avatar}
        >
          {user.firstName ? user.firstName[0] : "U"}
        </Avatar>
        <Typography>{user.firstName + " " + user.lastName}</Typography>
      </Stack>
      <Divider />
      <Stack gap={1} direction={"row"}>
        <LocalOfferOutlined color="secondary" />
        <Typography>
          {user.location?.coordinates
            ? toDistance(
                user.location.coordinates,
                appContentContext.currentLocation
              ).toFixed(1)
            : 0}{" "}
          kms
        </Typography>
      </Stack>
      <Stack direction={"row"} gap={1} mt={1}>
        <LocationOnOutlined color="info" />
        <Typography>{user.location?.name}</Typography>
      </Stack>
      <Divider />
      <StyledLink
        to={`/profile/${user._id}`}
        onBeforeNavigate={onBeforeNavigate}
      >
        <Button variant="outlined" sx={{ textTransform: "initial" }} fullWidth>
          {lang("go-to-view-this-user")}
        </Button>
      </StyledLink>
    </Stack>
  );
}
