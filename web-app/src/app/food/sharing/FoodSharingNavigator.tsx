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

export default function FoodSharingNavigator({prev, next}:  IFoodSharingNavigator) {
  const i18n = useI18nContext();
  const lang = i18n.of(FoodSharingNavigator);
  return (
    <Stack
      direction="row"
      width="100%"
      sx={{
        margin: "1em 0",
        padding: "0 5em",
        boxSizing: "border-box",
        alignItems: "center",
      }}
    >
      <Button
        variant="text"
        startIcon={<ArrowBackIosNewOutlined />}
        onClick={prev.onClick}
        disabled={!prev.active}
      >
        {lang("back")}
      </Button>
      <Button
        variant="text"
        endIcon={<ArrowForwardIosOutlined />}
        sx={{
          marginLeft: "auto",
        }}
        onClick={next.onClick}
        disabled={!next.active}
      >
        {lang("next")}
      </Button>
    </Stack>
  );
}
