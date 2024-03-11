import {
  Box,
  Button,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import PlaceAvatarAndImages from "./PlaceAvatarAndImages";
import {
  useAuthContext,
  useI18nContext,
  usePageProgessContext,
  usePlaceEditContext,
  useToastContext,
} from "../../../hooks";
import ExtendedEditor from "../../common/custom/ExtendedEditor";
import { PlaceType } from "../../../data";
import PlaceLocation from "./PlaceLocation";
import PlaceCategories from "./PlaceCategories";
import { IPlaceData, userFetcher } from "../../../api";
import { useNavigate } from "react-router-dom";

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
    isEditable,
    location,
  } = editContext;

  const toastContext = useToastContext();
  const authContext = useAuthContext();
  const auth = authContext.auth;
  const progressContext = usePageProgessContext();

  const navigate = useNavigate();

  const handleCreatePlace = () => {
    if (auth == null) return;

    if (exposeName === "") {
      toastContext.error("Vui lòng nhập tên");
      return;
    }
    if (location == null) {
      toastContext.error("Vui lòng chọn địa điểm");
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
      .catch((err) => {
        console.log(err);
        toastContext.error(
          `Không thể ${isEditable ? "cập nhật" : "tạo"} trang vào lúc này`
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

      <ExtendedEditor
        sumaryElement={<Typography>Description</Typography>}
        defaultHTML={description}
        onHTMLChange={(html) => setDescription(html)}
      />

      <Box>
        <Typography>Trang của bạn là</Typography>
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
          <MenuItem value={PlaceType.SUPERMARKET}>
            {lang("SUPERMARKET")}
          </MenuItem>
        </Select>
      </Box>

      <PlaceLocation />
      <PlaceCategories />
      <Button onClick={handleCreatePlace}>
        {isEditable ? "Cập nhật ngay bây giờ" : "Tạo trang ngay bây giờ"}
      </Button>
    </Stack>
  );
}
