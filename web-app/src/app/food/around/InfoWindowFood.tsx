import { Box, Chip, Divider, Rating, Stack, Typography } from "@mui/material";
import { IGroupFoodPostExposed } from "./FoodAroundBody";
import { IFoodPostExposed } from "../../../data";
import {
  TimelapseOutlined,
  ProductionQuantityLimitsOutlined,
  LocalOfferOutlined,
  LocationOnOutlined,
} from "@mui/icons-material";
import FoodItemDuration from "../search/FoodItemDuration";
import { useComponentLanguage } from "../../../hooks";

interface IInfoWindowFoodProps {
  group: IGroupFoodPostExposed;
  onOpen?: (food: string) => void;
}

interface IInfoWindowFoodDataProps {
  item: IFoodPostExposed;
  onOpen?: (food: string) => void;
}

function InfoWindowFoodData({ item, onOpen }: IInfoWindowFoodDataProps) {
  const lang = useComponentLanguage();
  return (
    <Stack
      sx={{
        border: "1px solid #bdbdbd",
        borderRadius: "4px",
        padding: "8px",
        width: "100%",
        boxSizing: "border-box",
        margin: "0.5rem 0",
        color: "black",
      }}
      gap={1}
    >
      <Stack direction="row" gap={[1, 2]}>
        <Box width={"30%"}>
          <img
            src={item.images[0]}
            style={{
              maxWidth: "100%",
              height: "100%",
              objectFit: "cover",
              cursor: "pointer",
            }}
            onClick={() => {
              onOpen && onOpen(item._id);
            }}
          />
        </Box>

        <Box flex={1}>
          <Box
            component="h3"
            textTransform={"capitalize"}
            onClick={() => {
              onOpen && onOpen(item._id);
            }}
            sx={{ cursor: "pointer" }}
          >
            {item.title}
          </Box>

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
                color="info"
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
              color="info"
            />
          )}
        </Box>
      </Stack>
    </Stack>
  );
}

export default function InfoWindowFood({
  group,
  onOpen,
}: IInfoWindowFoodProps) {
  const lang = useComponentLanguage();
  return (
    <Stack sx={{ maxHeight: "80svh" }} gap={1} zIndex={1002}>
      <Typography sx={{ position: "sticky", top: 0, backgroundColor: "white" }}>
        {lang("near")} {group.foods[0].location.name}
      </Typography>
      <Stack flex={1} gap={1}>
        {group.foods.map((m) => {
          return <InfoWindowFoodData item={m} key={m._id} onOpen={onOpen} />;
        })}
      </Stack>
    </Stack>
  );
}
