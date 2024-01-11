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
  IFoodSearchInfo,
  toDistance,
  toQuantityType,
  toTimeInfo,
} from "../../../data";
import { useI18nContext } from "../../../hooks";
import { deepOrange } from "@mui/material/colors";
import { useNavigate } from "react-router";
import {
  LocalOfferOutlined,
  LocationOnOutlined,
  TimelapseOutlined,
} from "@mui/icons-material";

interface IFoodSearchItemProps {
  item: IFoodSearchInfo;
}

interface IFoodItemDurationProps {
  duration: number;
}

const toPad = (num: number): string => {
  return num < 10 ? "0" + num : String(num);
};

function FoodItemDuration({ duration }: IFoodItemDurationProps) {
  const timeInfo = toTimeInfo(duration);
  return (
    <>
      {toPad(timeInfo.day)}/{toPad(timeInfo.month)}/{toPad(timeInfo.year)}{" "}
      {toPad(timeInfo.hours)}:{toPad(timeInfo.minutes)}:
      {toPad(timeInfo.seconds)}
    </>
  );
}

export default function FoodSearchItem({ item }: IFoodSearchItemProps) {
  const navigate = useNavigate();
  const i18n = useI18nContext();
  const lang = i18n.of("Categories", "Quantities");
  const quantityType = toQuantityType(item.quantity);

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
          onClick={() => navigate(`/food/${item._id}`)}
        />
        <Box flex={1}>
          <Box
            component="h3"
            textTransform={"capitalize"}
            sx={{
              cursor: "pointer",
            }}
            onClick={() => navigate(`/food/${item._id}`)}
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
              {item.price ? `${item.price} "VNĐ"}` : "Free"}
            </Typography>
          </Stack>
          <Stack direction={"row"} gap={1} mt={1}>
            <LocationOnOutlined color="info" />
            <Typography>{item.location.name}</Typography>
          </Stack>
          <Stack mt={1}>
            <Typography>{toDistance(item.location.coordinates)} kms</Typography>
          </Stack>
          <Stack direction="row" alignItems={"center"}>
            <Typography component="legend">{lang(quantityType)}</Typography>
            <Rating
              value={item.quantity}
              sx={{
                width: "fit-content",
                ml: 1,
              }}
              size="small"
              readOnly
            />
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
            alt={item.user.exposeName}
            sx={{ bgcolor: deepOrange[500], cursor: "pointer" }}
            onClick={() => {
              navigate(`/profile/${item.user._id}`);
            }}
          >
            {item.user.exposeName ? item.user.exposeName[0] : "U"}
          </Avatar>
          <Box component="h5" width={"fit-content"} mt={1} mb={0}>
            {item.user.exposeName}
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
