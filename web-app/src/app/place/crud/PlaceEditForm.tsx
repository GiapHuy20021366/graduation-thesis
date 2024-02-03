import { MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import PlaceAvartarAndImages from "./PlaceAvartarAndImages";
import { useI18nContext, usePlaceEditContext } from "../../../hooks";
import ExtendedEditor from "../../common/custom/ExtendedEditor";
import { PlaceType } from "../../../data";
import ExtendedLocationPicker from "../../common/custom/ExtendedLocationPicker";

export default function PlaceEditForm() {
  const i18nContext = useI18nContext();
  const lang = i18nContext.of(PlaceEditForm);
  const editContext = usePlaceEditContext();
  const {
    exposeName,
    setExposeName,
    description,
    setDescription,
    type,
    setType,
    location,
    setLocation,
  } = editContext;

  return (
    <Stack width={"100%"} boxSizing={"border-box"} boxShadow={1} gap={2} p={1}>
      <PlaceAvartarAndImages />
      <TextField
        label={lang("l-expose-name")}
        type="text"
        variant="standard"
        value={exposeName}
        placeholder={lang("expose-name-placeholder")}
        onChange={(event) => setExposeName(event.target.value)}
        spellCheck={"false"}
      />

      <ExtendedEditor
        sumaryElement={<Typography>Description</Typography>}
        defaultHTML={description}
        onHTMLChange={(html) => setDescription(html)}
      />

      <Select
        variant="standard"
        disableUnderline={true}
        displayEmpty={true}
        fullWidth
        value={type}
        label={lang("l-place-type")}
        onChange={(event) => setType(+event.target.value as PlaceType)}
      >
        <MenuItem value={PlaceType.PERSONAL}>{lang("PERSONAL")}</MenuItem>
        <MenuItem value={PlaceType.VOLUNTEER}>{lang("VOLUNTEER")}</MenuItem>
        <MenuItem value={PlaceType.EATERY}>{lang("EATERY")}</MenuItem>
        <MenuItem value={PlaceType.GROCERY}>{lang("GROCERY")}</MenuItem>
        <MenuItem value={PlaceType.RESTAURANT}>{lang("RESTAURANT")}</MenuItem>
        <MenuItem value={PlaceType.SUPERMARKET}>{lang("SUPERMARKET")}</MenuItem>
      </Select>

      <ExtendedLocationPicker
        height={500}
        defaultLocation={location}
        onSetLocation={(location) => setLocation(location)}
      />
    </Stack>
  );
}
