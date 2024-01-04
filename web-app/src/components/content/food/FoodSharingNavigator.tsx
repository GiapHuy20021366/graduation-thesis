import {
  ArrowBackIosNewOutlined,
  ArrowForwardIosOutlined,
} from "@mui/icons-material";
import { Button, Stack } from "@mui/material";

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
        Back
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
        Next
      </Button>
    </Stack>
  );
}
