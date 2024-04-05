import { Box, Chip, Divider, Rating, Stack, Typography } from "@mui/material";
import { IFoodPostExposed, toQuantityType } from "../../../data";
import { useI18nContext } from "../../../hooks";
import {
  LocalOfferOutlined,
  LocationOnOutlined,
  ProductionQuantityLimitsOutlined,
  TimelapseOutlined,
} from "@mui/icons-material";
import FoodItemDuration from "../search/FoodItemDuration";
import StyledLink from "../../common/navigate/StyledLink";

interface IFoodSearchItemProps {
  item: IFoodPostExposed;
  onBeforeNavigate?: () => void;
}

export default function MyFoodItem({
  item,
  onBeforeNavigate,
}: IFoodSearchItemProps) {
  const i18n = useI18nContext();
  const lang = i18n.of(MyFoodItem, "Categories", "Quantities");
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
        <Box sx={{ width: "30%" }}>
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
          <Stack direction={"row"} gap={1} mt={1}>
            <LocationOnOutlined color="info" />
            <Typography>{item.location.name}</Typography>
          </Stack>
        </Box>
      </Stack>
      <Divider />
      <Box width={"100%"}>
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
          <Typography>{lang("no-category")}</Typography>
        )}
      </Box>
    </Stack>
  );
}
