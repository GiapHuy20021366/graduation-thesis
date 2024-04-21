import { Avatar, Button, Divider, Stack, Typography } from "@mui/material";
import { IPlaceExposed, toDistance } from "../../../data";
import { deepOrange } from "@mui/material/colors";
import { useNavigate } from "react-router";
import { useAppContentContext } from "../../../hooks";
import { LocalOfferOutlined, LocationOnOutlined } from "@mui/icons-material";

interface IInfoWindowPlaceProps {
  place: IPlaceExposed;
  onBeforeNavigate?: () => void;
}

export default function InfoWindowPlace({
  place,
  onBeforeNavigate,
}: IInfoWindowPlaceProps) {
  const navigate = useNavigate();
  const appContentContext = useAppContentContext();
  const onNavigate = () => {
    onBeforeNavigate && onBeforeNavigate();
    navigate(`/place/${place._id}`);
  };
  return (
    <Stack gap={1}>
      <Stack direction={"row"} gap={1} alignItems={"center"}>
        <Avatar
          alt={place.exposedName}
          sx={{ bgcolor: deepOrange[500], cursor: "pointer" }}
          src={place.avatar}
        >
          {place.exposedName[0]}
        </Avatar>
        <Typography>{place.exposedName}</Typography>
      </Stack>
      <Divider />
      <Stack gap={1} direction={"row"}>
        <LocalOfferOutlined color="secondary" />
        <Typography>
          {place.location?.coordinates
            ? toDistance(
                place.location.coordinates,
                appContentContext.currentLocation
              )
            : 0}{" "}
          kms
        </Typography>
      </Stack>
      <Stack direction={"row"} gap={1} mt={1}>
        <LocationOnOutlined color="info" />
        <Typography>{place.location?.name}</Typography>
      </Stack>
      <Divider />
      <Button
        variant="outlined"
        sx={{ textTransform: "initial" }}
        onClick={() => onNavigate()}
      >
        Go to view this place
      </Button>
    </Stack>
  );
}
