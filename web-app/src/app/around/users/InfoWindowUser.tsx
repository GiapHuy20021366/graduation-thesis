import { Avatar, Button, Divider, Stack, Typography } from "@mui/material";
import { IUserInfo, toDistance } from "../../../data";
import { deepOrange } from "@mui/material/colors";
import { useNavigate } from "react-router";
import { useAppContentContext } from "../../../hooks";
import { LocalOfferOutlined, LocationOnOutlined } from "@mui/icons-material";

interface IInfoWindowUser {
  user: IUserInfo;
}

export default function InfoWindowUser({ user }: IInfoWindowUser) {
  const navigate = useNavigate();
  const appContentContext = useAppContentContext();
  return (
    <Stack gap={1}>
      <Stack direction={"row"} gap={1} alignItems={"center"}>
        <Avatar
          alt={user.firstName + " " + user.lastName}
          sx={{ bgcolor: deepOrange[500], cursor: "pointer" }}
          src={user.avartar}
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
              )
            : 0}{" "}
          kms
        </Typography>
      </Stack>
      <Stack direction={"row"} gap={1} mt={1}>
        <LocationOnOutlined color="info" />
        <Typography>{user.location?.name}</Typography>
      </Stack>
      <Divider />
      <Button
        variant="outlined"
        sx={{ textTransform: "initial" }}
        onClick={() => navigate(`/profile/${user.id_}`)}
      >
        Go to view this user
      </Button>
    </Stack>
  );
}
