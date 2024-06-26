import React, { useEffect } from "react";
import {
  Badge,
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardProps,
  IconButton,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { IFoodPostTagged } from "./HomeViewerContext";
import { Favorite, LocationOn, Send, Star } from "@mui/icons-material";
import TimeExposed from "../common/custom/TimeExposed";
// import Carousel from "react-material-ui-carousel";
import { toDistance } from "../../data";
import {
  useAppContentContext,
  useComponentLanguage,
  useConversationContext,
  useFoodPostViewerContext,
} from "../../hooks";
import CountDown from "../common/util/CountDown";
import FoodAvatars from "../common/viewer/data/FoodAvatars";
import FoodPostButtonWithMenu from "../food/post/FoodPostButtonWithMenu";
import ButtonShareAction from "../common/util/ButtonShareAction";

type HomeFoodItemDataProps = CardProps & {
  onExpandFood?: (id: string) => void;
  onExpandAuthor?: (id: string) => void;
  onExpandPlace?: (id: string) => void;
  item: IFoodPostTagged;
  isLoading: boolean;
};

const HomeFoodItemData = React.forwardRef<
  HTMLDivElement,
  HomeFoodItemDataProps
>((props, ref) => {
  const {
    onExpandFood,
    onExpandAuthor,
    onExpandPlace,
    item,
    isLoading,
    ...rest
  } = props;
  const appContentContext = useAppContentContext();

  useEffect(() => {
    console.log("rendered", item._id);
  });

  const distance = toDistance(
    item.location.coordinates,
    appContentContext.currentLocation
  );

  const context = useFoodPostViewerContext();
  const { food, likeFood } = context;
  const lang = useComponentLanguage();
  const conversationContext = useConversationContext();

  const authorId = typeof item.user === "string" ? item.user : item.user._id;
  const placeId = typeof item.place === "string" ? item.place : item.place?._id;

  return (
    <Card
      ref={ref}
      {...rest}
      sx={{
        width: "100%",
        ...(props.sx ?? {}),
      }}
    >
      <CardHeader
        avatar={
          isLoading ? (
            <Skeleton variant="circular" width={40} height={40} />
          ) : (
            <FoodAvatars
              food={food}
              onClick={() => onExpandAuthor && onExpandAuthor(authorId)}
              SecondaryAvatarProps={{
                onClick: () => {
                  onExpandPlace && onExpandPlace(placeId!);
                },
              }}
            />
          )
        }
        action={<FoodPostButtonWithMenu />}
        title={item.title}
        subheader={
          <Stack>
            <TimeExposed time={item.createdAt} />
            <Stack direction={"row"} gap={1}>
              <CountDown time={item.duration} enable={false} second={false} />{" "}
            </Stack>
          </Stack>
        }
      />

      <CardContent
        sx={{ py: 0, cursor: "pointer" }}
        onClick={() => {
          onExpandFood && onExpandFood(item._id);
        }}
      >
        {/* <Carousel
          cycleNavigation
          autoPlay={false}
          fullHeightHover
          sx={{
            backgroundColor: "background.default",
            width: "100%",
            height: "200px",
          }}
        >
          {item.images.map((url) => {
            return (
              <Box
                sx={{
                  width: "100%",
                  height: "200px",
                }}
                key={url}
              >
                <img src={url} loading="lazy" width={"100%"} />
              </Box>
            );
          })}
        </Carousel> */}
        <Box
          sx={{
            width: "100%",
            height: "200px",
          }}
          key={item.images[0]}
        >
          <img
            src={item.images[0]}
            loading="lazy"
            width={"100%"}
            height={"100%"}
          />
        </Box>
      </CardContent>
      <CardActions disableSpacing>
        <Stack direction={"row"}>
          <Tooltip
            arrow
            title={
              <Stack>
                <Typography>{lang("place-x", item.location.name)}</Typography>
                <Typography>{lang("distance-x", distance, "Km")}</Typography>
              </Stack>
            }
          >
            <IconButton color="success">
              <Badge badgeContent={distance.toFixed(1) + "Km"}>
                <LocationOn />
              </Badge>
            </IconButton>
          </Tooltip>
          <Tooltip arrow title={lang("quantity-x", item.quantity)}>
            <IconButton color="info">
              <Badge badgeContent={item.quantity + "*"}>
                <Star />
              </Badge>
            </IconButton>
          </Tooltip>
        </Stack>
        <Stack direction={"row"} ml={"auto"}>
          <Tooltip arrow title={lang("love")}>
            <IconButton
              color={food.liked ? "error" : "default"}
              onClick={likeFood}
            >
              <Badge badgeContent={food.likeCount}>
                <Favorite />
              </Badge>
            </IconButton>
          </Tooltip>
          <Tooltip arrow title={lang("share")}>
            <ButtonShareAction
              color="info"
              link={new URL(`/food/${item._id}`, window.location.href).href}
            />
          </Tooltip>
          <Tooltip
            arrow
            title={lang("send-message")}
            onClick={() =>
              conversationContext.doBeginConversationWith(authorId)
            }
          >
            <IconButton color="secondary">
              <Send sx={{ rotate: "-45deg" }} />
            </IconButton>
          </Tooltip>
        </Stack>
      </CardActions>
    </Card>
  );
});

export default HomeFoodItemData;
