import {
  ArrowBackIosNewOutlined,
  ArrowForwardIosOutlined,
} from "@mui/icons-material";
import { Button, Stack } from "@mui/material";
import { useI18nContext } from "../../../hooks";

interface IFoodSharingNavigator {
  prev: {
    active: boolean;
    onClick: () => void;
  };
  next: {
    active: boolean;
    onClick: () => void;
  };
}

export default function FoodSharingNavigator({
  prev,
  next,
}: IFoodSharingNavigator) {
  const i18n = useI18nContext();
  const lang = i18n.of(FoodSharingNavigator);
  return (
    <Stack
      direction="row"
      gap={1}
      sx={{
        backgroundColor: "background.paper",
      }}
    >
      <Button
        variant="text"
        startIcon={<ArrowBackIosNewOutlined />}
        onClick={prev.onClick}
        disabled={!prev.active}
        sx={{ flex: 1 }}
      >
        {lang("back")}
      </Button>
      <Button
        variant="text"
        endIcon={<ArrowForwardIosOutlined />}
        sx={{ flex: 1 }}
        onClick={next.onClick}
        disabled={!next.active}
      >
        {lang("next")}
      </Button>
    </Stack>
  );
}
