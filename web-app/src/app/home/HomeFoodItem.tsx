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
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { IFoodPostTagged } from "./HomeViewerContext";
import {
  Favorite,
  LocationOn,
  MoreVert,
  Send,
  Share,
  Star,
} from "@mui/icons-material";
import TimeExposed from "../common/custom/TimeExposed";
import Carousel from "react-material-ui-carousel";
import { toDistance } from "../../data";
import { useAppContentContext } from "../../hooks";
import CountDown from "../common/util/CountDown";
import FoodAvatars from "../common/viewer/data/FoodAvatars";

type HomeFoodItemProps = CardProps & {
  onExpandFood?: () => void;
  onExpandAuthor?: () => void;
  onExpandPlace?: () => void;
  item: IFoodPostTagged;
};

const HomeFoodItem = React.forwardRef<HTMLDivElement, HomeFoodItemProps>(
  (props, ref) => {
    const { onExpandFood, onExpandAuthor, onExpandPlace, item, ...rest } =
      props;
    const appContentContext = useAppContentContext();

    useEffect(() => {
      console.log("rendered", item._id);
    });

    const distance = toDistance(
      item.location.coordinates,
      appContentContext.currentLocation
    );

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
            <FoodAvatars
              food={item}
              onClick={() => onExpandAuthor && onExpandAuthor()}
              SecondaryAvatarProps={{
                onClick: () => {
                  onExpandPlace && onExpandPlace();
                },
              }}
            />
          }
          action={
            <IconButton>
              <MoreVert />
            </IconButton>
          }
          title={item.title}
          subheader={
            <Stack>
              <TimeExposed time={item.createdAt} />
              <Stack direction={"row"} gap={1}>
                {/* <TimelapseOutlined color="info" /> */}
                <CountDown
                  time={item.duration}
                  enable={false}
                  second={false}
                />{" "}
              </Stack>
            </Stack>
          }
        />

        <CardContent
          sx={{ py: 0, cursor: "pointer" }}
          onClick={() => {
            onExpandFood && onExpandFood();
          }}
        >
          <Carousel
            indicators
            swipe
            autoPlay
            animation="slide"
            cycleNavigation
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
          </Carousel>
        </CardContent>
        <CardActions disableSpacing>
          <Stack direction={"row"}>
            <Tooltip
              arrow
              title={
                <Stack>
                  <Typography>Địa điểm: {" " + item.location.name}</Typography>
                  <Typography>
                    Khoảng cách:
                    {" " + distance}Km
                  </Typography>
                </Stack>
              }
            >
              <IconButton color="success">
                <Badge badgeContent={distance.toFixed(1) + "Km"}>
                  <LocationOn />
                </Badge>
              </IconButton>
            </Tooltip>
            <Tooltip arrow title={`Chất lượng: ${item.quantity} sao`}>
              <IconButton color="info">
                <Badge badgeContent={item.quantity + "*"}>
                  <Star />
                </Badge>
              </IconButton>
            </Tooltip>
          </Stack>
          <Stack direction={"row"} ml={"auto"}>
            <Tooltip arrow title="Yêu thích">
              <IconButton color="error">
                <Badge badgeContent={item.likeCount}>
                  <Favorite />
                </Badge>
              </IconButton>
            </Tooltip>
            <IconButton>
              <Tooltip arrow title="Chia sẻ">
                <IconButton color="info">
                  <Share />
                </IconButton>
              </Tooltip>
            </IconButton>
            <Tooltip arrow title="Gửi tin nhắn">
              <IconButton color="secondary">
                <Send sx={{ rotate: "-45deg" }} />
              </IconButton>
            </Tooltip>
          </Stack>
        </CardActions>
      </Card>
    );
  }
);

export default HomeFoodItem;
