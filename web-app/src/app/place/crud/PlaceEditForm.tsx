import { Box, Button, MenuItem, Select, Stack, TextField } from "@mui/material";
import PlaceAvatarAndImages from "./PlaceAvatarAndImages";
import {
  useAuthContext,
  useI18nContext,
  usePageProgessContext,
  usePlaceEditContext,
  useToastContext,
} from "../../../hooks";
import { PlaceType } from "../../../data";
import PlaceLocation from "./PlaceLocation";
import PlaceCategories from "./PlaceCategories";
import { IPlaceData, userFetcher } from "../../../api";
import { useNavigate } from "react-router-dom";
import PlaceDescriptionEditor from "./PlaceDescriptionEditor";

export default function PlaceEditForm() {
  const i18nContext = useI18nContext();
  const lang = i18nContext.of("PlaceEditForm");
  const editContext = usePlaceEditContext();
  const { exposeName, setExposeName, type, setType, isEditable, location } =
    editContext;

  const toastContext = useToastContext();
  const authContext = useAuthContext();
  const auth = authContext.auth;
  const progressContext = usePageProgessContext();

  const navigate = useNavigate();

  const handleCreatePlace = () => {
    if (auth == null) return;

    if (exposeName === "") {
      toastContext.error(lang("please-input-place-name"));
      return;
    }
    if (location == null) {
      toastContext.error(lang("please-choose-location"));
      return;
    }
    const datas: IPlaceData = {
      categories: editContext.categories,
      exposeName: editContext.exposeName,
      images: editContext.images,
      location: location,
      type: editContext.type,
      avatar: editContext.avatar,
      description: editContext.description,
    };

    progressContext.start();
    const meta = editContext.meta;
    if (isEditable && (!meta || !meta._id)) {
      return;
    }
    const promise = isEditable
      ? userFetcher.updatePlace(meta!._id, datas, auth)
      : userFetcher.createPlace(datas, auth);
    promise
      .then((datas) => {
        const place = datas.data;
        if (place != null) {
          navigate(`/place/${place._id}`);
        }
      })
      .catch(() => {
        toastContext.error(
          lang(isEditable ? "cannot-update-place" : "cannot-create-place")
        );
      })
      .finally(() => {
        progressContext.end();
      });
  };

  return (
    <Stack width={"100%"} boxSizing={"border-box"} boxShadow={1} gap={2} p={1}>
      <PlaceAvatarAndImages />
      <TextField
        label={lang("l-expose-name")}
        type="text"
        variant="standard"
        value={exposeName}
        placeholder={lang("expose-name-placeholder")}
        onChange={(event) => setExposeName(event.target.value)}
        spellCheck={"false"}
      />

      <PlaceDescriptionEditor />

      <Box boxShadow={1}>
        <h4>{lang("your-place-are")}</h4>
        <Select
          variant="standard"
          disableUnderline={true}
          displayEmpty={true}
          fullWidth
          value={type}
          label={lang("l-place-type")}
          onChange={(event) => setType(+event.target.value as PlaceType)}
        >
          {/* <MenuItem value={PlaceType.PERSONAL}>{lang("PERSONAL")}</MenuItem> */}
          <MenuItem value={PlaceType.VOLUNTEER}>{lang("VOLUNTEER")}</MenuItem>
          <MenuItem value={PlaceType.EATERY}>{lang("EATERY")}</MenuItem>
          <MenuItem value={PlaceType.GROCERY}>{lang("GROCERY")}</MenuItem>
          <MenuItem value={PlaceType.RESTAURANT}>{lang("RESTAURANT")}</MenuItem>
          <MenuItem value={PlaceType.SUPERMARKET}>
            {lang("SUPERMARKET")}
          </MenuItem>
        </Select>
      </Box>

      <PlaceLocation />
      <PlaceCategories />
      <Button onClick={handleCreatePlace} variant="contained">
        {lang(isEditable ? "update-now" : "create-now")}
      </Button>
    </Stack>
  );
}
