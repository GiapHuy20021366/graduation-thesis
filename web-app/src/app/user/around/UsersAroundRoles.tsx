import {
  Person,
  Restaurant,
  Storefront,
  LocalConvenienceStore,
  LocalGroceryStore,
  VolunteerActivism,
} from "@mui/icons-material";
import { Box } from "@mui/material";
import { PlaceType } from "../../../data";
import ToggleChipGroup from "../../common/custom/ToggleChipGroup";
import TogglePurpleChip from "../../common/custom/TogglePurpleChip";
import { useComponentLanguage } from "../../../hooks";

interface IUsersAroundRolesProps {
  roles: PlaceType[];
  onRolesChange: (newRoles: PlaceType[]) => void;
}

export default function UsersAroundRoles({
  roles,
  onRolesChange,
}: IUsersAroundRolesProps) {
  const lang = useComponentLanguage();
  return (
    <Box
      sx={{
        width: "fit-content",
        position: "absolute",
        top: 5,
        left: 1,
        zIndex: 1000,
        maxWidth: "90%",
      }}
    >
      <ToggleChipGroup
        value={roles}
        onValueChange={onRolesChange}
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 1,
          maxWidth: "100%",
          overflowY: "auto",
          "::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        <TogglePurpleChip
          label={lang("people")}
          value={PlaceType.PERSONAL}
          icon={<Person color="inherit" />}
        />
        <TogglePurpleChip
          label={lang("restaurants")}
          value={PlaceType.RESTAURANT}
          icon={<Restaurant color="inherit" />}
        />
        <TogglePurpleChip
          label={lang("eateries")}
          value={PlaceType.EATERY}
          icon={<Storefront color="inherit" />}
        />
        <TogglePurpleChip
          label={lang("groceries")}
          value={PlaceType.GROCERY}
          icon={<LocalConvenienceStore color="inherit" />}
        />
        <TogglePurpleChip
          label={lang("markets")}
          value={PlaceType.SUPERMARKET}
          icon={<LocalGroceryStore color="inherit" />}
        />
        <TogglePurpleChip
          label={lang("volunteers")}
          value={PlaceType.VOLUNTEER}
          icon={<VolunteerActivism color="inherit" />}
        />
      </ToggleChipGroup>
    </Box>
  );
}
