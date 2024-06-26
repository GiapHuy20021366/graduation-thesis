import { Avatar, Button, Divider, Stack, Typography } from "@mui/material";
import { IPlaceExposed, toDistance } from "../../../data";
import { deepOrange } from "@mui/material/colors";
import { useAppContentContext, useComponentLanguage } from "../../../hooks";
import { LocalOfferOutlined, LocationOnOutlined } from "@mui/icons-material";
import StyledLink from "../../common/navigate/StyledLink";

interface IInfoWindowPlaceProps {
  place: IPlaceExposed;
  onBeforeNavigate?: () => void;
}

export default function InfoWindowPlace({
  place,
  onBeforeNavigate,
}: IInfoWindowPlaceProps) {
  const appContentContext = useAppContentContext();
  const lang = useComponentLanguage();

  return (
    <Stack gap={1} color={"black"}>
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
      <StyledLink
        to={`/place/${place._id}`}
        onBeforeNavigate={onBeforeNavigate}
      >
        <Button variant="outlined" sx={{ textTransform: "initial" }} fullWidth>
          {lang("go-to-view-this-place")}
        </Button>
      </StyledLink>
    </Stack>
  );
}
