import {
  ArrowBackIosNewOutlined,
  ArrowForwardIosOutlined,
} from "@mui/icons-material";
import { Button } from "@mui/material";
import { useI18nContext } from "../../../hooks";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";

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
    <Grid2 columnSpacing={1} container my={1}>
      <Grid2
        mobile
        tablet
        laptop
        desktop
        sx={{
          display: "flex",
          pl: [0, "2em", "4em", "6em"],
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
      </Grid2>
      <Grid2
        mobile
        tablet
        laptop
        desktop
        sx={{
          display: "flex",
          justifyItems: "end",
          pr: [0, "2em", "4em", "6em"],
        }}
      >
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
      </Grid2>
    </Grid2>
  );
}
