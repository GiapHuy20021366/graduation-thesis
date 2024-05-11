import { Box, Chip, Divider, Rating, Stack, Typography } from "@mui/material";
import { IFoodPostExposed, toDistance, toQuantityType } from "../../../data";
import { useAppContentContext, useI18nContext } from "../../../hooks";
import {
  LocalOfferOutlined,
  LocationOnOutlined,
  ProductionQuantityLimitsOutlined,
  SocialDistanceOutlined,
  TimelapseOutlined,
} from "@mui/icons-material";
import FoodItemDuration from "./FoodItemDuration";
import FoodAvatars from "../../common/viewer/data/FoodAvatars";
import StyledLink from "../../common/navigate/StyledLink";

interface IFoodSearchItemProps {
  item: IFoodPostExposed;
  onBeforeNavigate?: () => void;
}

export default function FoodSearchItem({
  item,
  onBeforeNavigate,
}: IFoodSearchItemProps) {
  const i18n = useI18nContext();
  const lang = i18n.of("FoodSearchItem", "Categories", "Quantities");
  const quantityType = toQuantityType(item.quantity);
  const appContentContext = useAppContentContext();

  const exposedUser =
    typeof item.user === "string"
      ? "H"
      : item.user.firstName + " " + item.user.lastName;

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
      id={item._id}
    >
      <Stack direction="row" gap={[1, 2]}>
        <Box width={"30%"}>
          <StyledLink
            to={`/food/${item._id}`}
            onBeforeNavigate={onBeforeNavigate}
          >
            <img
              src={item.images[0]}
              style={{
                maxWidth: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </StyledLink>
        </Box>

        <Box flex={1}>
          <StyledLink
            to={`/food/${item._id}`}
            onBeforeNavigate={onBeforeNavigate}
          >
            <Box component="h3" textTransform={"capitalize"}>
              {item.title}
            </Box>
          </StyledLink>

          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            pr={[0, 1, 3, 5]}
            alignItems={"center"}
          >
            <Stack direction={"row"} alignItems={"center"} gap={1}>
              <TimelapseOutlined color="info" />{" "}
              <FoodItemDuration duration={item.duration} />
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
          </Stack>
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            pr={[0, 1, 3, 5]}
            alignItems={"center"}
          >
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
            <Stack direction={"row"} gap={1} mt={1}>
              <LocalOfferOutlined color="secondary" />
              <Typography>
                {item.price ? `${item.price} VNĐ` : lang("l-free")}
              </Typography>
            </Stack>
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
          <FoodAvatars
            food={item}
            navigate={true}
            onBeforeNavigate={onBeforeNavigate}
          />
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
          {item.categories.length === 0 && (
            <Chip
              label={lang("no-category")}
              sx={{
                my: 0.5,
                mx: 0.5,
                width: "fit-content",
              }}
            />
          )}
        </Box>
      </Stack>
    </Stack>
  );
}
