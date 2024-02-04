import {
  Box,
  Button,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import PlaceAvartarAndImages from "./PlaceAvartarAndImages";
import {
  useI18nContext,
  usePlaceEditContext,
  useToastContext,
} from "../../../hooks";
import ExtendedEditor from "../../common/custom/ExtendedEditor";
import { PlaceType } from "../../../data";
import PlaceLocation from "./PlaceLocation";
import PlaceCategories from "./PlaceCategories";

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

  const handleCreatePlace = () => {
    if (exposeName === "") {
      toastContext.error("Vui lòng nhập tên");
      return;
    }
    if (location == null) {
      toastContext.error("Vui lòng chọn địa điểm");
      return;
    }
    // const datas = {};
  };

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
        {isEditable ? "Cập nhật" : "Tạo trang ngay bây giờ"}
      </Button>
    </Stack>
  );
}
