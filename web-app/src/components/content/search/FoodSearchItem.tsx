import { Box, Divider, ImageListItem, Skeleton, Stack } from "@mui/material";
import { IFoodSearchInfo, toQuantityType } from "../../../data";
import { useAuthContext } from "../../../contexts";
import CategoryPiece from "../food/CategoryPiece";

interface IFoodSearchItem {
  item: IFoodSearchInfo;
}

export default function FoodSearchItem({ item }: IFoodSearchItem) {
  const authContext = useAuthContext();
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
            width: "20%",
            height: "auto",
          }}
        />
        <Box flex={1}>
          <Box component="h3">{item.title}</Box>
          <Box>
            <b>Còn lại: </b> {item.count.value} {item.count.unit}
          </Box>
          <Box>
            <b>Thời hạn: </b>Còn lại {item.duration.value} {item.duration.unit}
          </Box>
          <Box>
            <b>Giá cả: </b>{" "}
            {item.cost.value
              ? `${item.cost.value} ${item.cost.unit ?? "VNĐ"}`
              : "Free"}
          </Box>
          <Box>
            <b>Chất lượng: </b> {toQuantityType(item.quantity)}
          </Box>
          <Box>
            <Stack direction="row">
              <b>Địa chỉ: </b>
              <Skeleton variant="text" sx={{flex: 1, marginLeft: "0.5rem"}}/>
            </Stack>
          </Box>
        </Box>
      </Stack>
      <Divider />
      <Stack direction="row" gap={1}>
        <Box
          component="img"
          src={authContext.account?.avatar}
          sx={{
            width: "10%",
            height: "auto",
            borderRadius: "50%",
            margin: "1rem 0 0 0",
          }}
        />
        <Stack
          direction="column"
          sx={{
            justifyContent: "center",
          }}
        >
          <Box component="h5" width={"fit-content"}>
            {item.userId}
          </Box>
        </Stack>
        <Divider orientation="horizontal" />

        <Box flex={1}>
          {item.categories.map((category, index) => {
            return <CategoryPiece text={category} key={index} />;
          })}
        </Box>
      </Stack>
    </Stack>
  );
}
