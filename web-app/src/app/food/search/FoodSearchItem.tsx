import {
  Avatar,
  Box,
  Chip,
  Divider,
  Rating,
  Stack,
  Typography,
} from "@mui/material";
import {
  IFoodPostExposed,
  toDistance,
  toQuantityType,
  toTimeInfo,
} from "../../../data";
import { useAppContentContext, useI18nContext } from "../../../hooks";
import { deepOrange } from "@mui/material/colors";
import { useNavigate } from "react-router";
import {
  LocalOfferOutlined,
  LocationOnOutlined,
  ProductionQuantityLimitsOutlined,
  SocialDistanceOutlined,
  TimelapseOutlined,
} from "@mui/icons-material";

interface IFoodSearchItemProps {
  item: IFoodPostExposed;
  onBeforeNavigate?: () => void;
}

interface IFoodItemDurationProps {
  duration?: number;
}

const toPad = (num: number): string => {
  return num < 10 ? "0" + num : String(num);
};

function FoodItemDuration({ duration }: IFoodItemDurationProps) {
  const timeInfo = toTimeInfo(duration ?? new Date());
  return (
    <>
      {toPad(timeInfo.day)}/{toPad(timeInfo.month)}/{toPad(timeInfo.year)}{" "}
      {toPad(timeInfo.hours)}:{toPad(timeInfo.minutes)}:
      {toPad(timeInfo.seconds)}
    </>
  );
}

export default function FoodSearchItem({
  item,
  onBeforeNavigate,
}: IFoodSearchItemProps) {
  const navigate = useNavigate();
  const i18n = useI18nContext();
  const lang = i18n.of(FoodSearchItem, "Categories", "Quantities");
  const quantityType = toQuantityType(item.quantity);
  const appContentContext = useAppContentContext();

  const handleNavigate = () => {
    if (onBeforeNavigate != null) {
      onBeforeNavigate();
    }
    navigate(`/food/${item._id}`);
  };

  console.log(item);

  const exposedUser =
    typeof item.user === "string"
      ? "H"
      : item.user.firstName + " " + item.user.lastName;

  const userId = typeof item.user === "string" ? item.user : item.user._id;

  return (
    <Stack
      sx={{
        border: "1px solid #bdbdbd",
        borderRadius: "4px",
        padding: "8px",
        width: "100%",
        boxSizing: "border-box",
        margin: "0.5rem 0",
      }}
      gap={1}
    >
      <Stack direction="row" gap={3}>
        <img
          src={item.images[0]}
          style={{
            maxWidth: "20%",
            height: "auto",
            objectFit: "cover",
            cursor: "pointer",
          }}
          onClick={handleNavigate}
        />
        <Box flex={1}>
          <Box
            component="h3"
            textTransform={"capitalize"}
            sx={{
              cursor: "pointer",
            }}
            onClick={handleNavigate}
          >
            {item.title}
          </Box>
          <Stack direction={"row"} alignItems={"center"} gap={1}>
            <TimelapseOutlined color="info" />{" "}
            <FoodItemDuration duration={item.duration} />
          </Stack>
          <Stack direction={"row"} gap={1} mt={1}>
            <LocalOfferOutlined color="secondary" />
            <Typography>
              {item.price ? `${item.price} VNĐ` : lang("l-free")}
            </Typography>
          </Stack>
          <Stack direction="row" alignItems={"center"} gap={1}>
            <ProductionQuantityLimitsOutlined color="info" />
            <Rating
              value={item.quantity}
              sx={{
                width: "fit-content",
              }}
              size="small"
              readOnly
            />
            <Typography component="legend">{lang(quantityType)}</Typography>
          </Stack>
          <Stack mt={1} direction={"row"} gap={1}>
            <SocialDistanceOutlined color="info" />
            <Typography>
              {toDistance(
                item.location.coordinates,
                appContentContext.currentLocation
              ) * 1000}{" "}
              m
            </Typography>
          </Stack>
          <Stack direction={"row"} gap={1} mt={1}>
            <LocationOnOutlined color="info" />
            <Typography>{item.location.name}</Typography>
          </Stack>
        </Box>
      </Stack>
      <Divider />
      <Stack direction="row" gap={1}>
        <Stack
          direction="column"
          sx={{
            alignItems: "center",
          }}
        >
          <Avatar
            alt={exposedUser}
            sx={{ bgcolor: deepOrange[500], cursor: "pointer" }}
            onClick={() => {
              navigate(`/profile/${userId}`);
            }}
          >
            {exposedUser[0]}
          </Avatar>
          <Box component="h5" width={"fit-content"} mt={1} mb={0}>
            {exposedUser}
          </Box>
        </Stack>
        <Divider orientation="vertical" flexItem />

        <Box flex={1}>
          {item.categories.map((category) => {
            return (
              <Chip
                label={lang(category)}
                key={category}
                sx={{
                  my: 0.5,
                  mx: 0.5,
                  width: "fit-content",
                  cursor: "pointer",
                }}
              />
            );
          })}
        </Box>
      </Stack>
    </Stack>
  );
}
