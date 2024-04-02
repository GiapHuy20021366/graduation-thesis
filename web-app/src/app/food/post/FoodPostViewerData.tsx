import { useNavigate } from "react-router-dom";
import {
  IFoodPostExposedWithLike,
  toDistance,
  toQuantityType,
} from "../../../data";
import {
  useAppContentContext,
  useAuthContext,
  useConversationContext,
  useI18nContext,
} from "../../../hooks";
import { useState } from "react";
import Carousel from "react-material-ui-carousel";
import {
  Avatar,
  Badge,
  Box,
  Chip,
  Divider,
  IconButton,
  Rating,
  Stack,
  Typography,
} from "@mui/material";
import {
  Favorite,
  LocalOfferOutlined,
  LocationOnOutlined,
  MapsUgcOutlined,
  Share,
  TimelapseOutlined,
} from "@mui/icons-material";
import { deepOrange } from "@mui/material/colors";
import { foodFetcher } from "../../../api";
import CountDown from "../../common/util/CountDown";
import FoodPostButtonWithMenu from "./FoodPostButtonWithMenu";
import { RichTextReadOnly } from "mui-tiptap";
import StarterKit from "@tiptap/starter-kit";

interface IFoodPostInfoDataDisplayProps {
  data: IFoodPostExposedWithLike;
}

const toUserId = (post: IFoodPostExposedWithLike): string => {
  const user = post.user;
  return typeof user === "string" ? user : user._id;
};

const toLikeCount = (
  post: IFoodPostExposedWithLike,
  liked: boolean
): number => {
  if (!post.liked && liked) return post.likeCount + 1;
  if (post.liked && !liked) return post.likeCount - 1;
  return post.likeCount;
};

const toUserExposedName = (post: IFoodPostExposedWithLike): string => {
  const user = post.user;
  if (typeof user == "string") return "SYSTEM_USER";
  return user.firstName + " " + user.lastName;
};

export default function FoodPostViewerData({
  data,
}: IFoodPostInfoDataDisplayProps) {
  const i18n = useI18nContext();
  const lang = i18n.of(
    FoodPostViewerData,
    "Commons",
    "Categories",
    "Quantities"
  );
  const appContentContext = useAppContentContext();
  const navigate = useNavigate();
  const authContext = useAuthContext();
  const conversationContext = useConversationContext();

  const [liked, setLiked] = useState<boolean>(data.liked ?? false);
  const { user } = data;

  const handleLikeOrUnlike = () => {
    if (authContext.auth == null) return;
    foodFetcher
      .likeFood(data._id, liked ? "UNLIKE" : "LIKE", authContext.auth)
      .then(() => {
        setLiked(!liked);
      });
  };

  const userId = toUserId(data);
  const userExposedName = toUserExposedName(data);

  return (
    <Box width={"100%"}>
      <Carousel
        indicators
        swipe
        autoPlay
        animation="slide"
        cycleNavigation
        fullHeightHover
      >
        {data.images.map((url) => {
          return (
            <Box
              sx={{
                width: "100%",
                height: ["200px", "260px"],
              }}
              key={url}
            >
              <img src={url} loading="lazy" width={"100%"} />
            </Box>
          );
        })}
      </Carousel>
      <Stack
        sx={{
          backgroundColor: "background.default",
          my: 2,
          borderRadius: 2,
        }}
        gap={0.5}
        p={1}
      >
        <Box component={"h4"} textTransform={"capitalize"} sx={{ mb: 2 }}>
          {data.title || lang("no-title")}
        </Box>
        {/* <FoodPostMenu /> */}
        <FoodPostButtonWithMenu data={data} />

        <Stack direction="row">
          <Typography>
            {toDistance(
              data.location.coordinates,
              appContentContext.currentLocation
            )}{" "}
            kms
          </Typography>
          <LocalOfferOutlined color="secondary" sx={{ ml: 1 }} />
          <Stack direction="row" marginLeft={"auto"}>
            <IconButton color={liked ? "error" : "default"}>
              <Badge
                badgeContent={<span>{toLikeCount(data, liked)}</span>}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                color="secondary"
              >
                <Favorite onClick={() => handleLikeOrUnlike()} />
              </Badge>
            </IconButton>
            <IconButton color="info">
              <Share />
            </IconButton>
            <IconButton
              color="success"
              onClick={() => {
                console.log("Clicked");
                conversationContext.doBeginConversationWith(userId);
              }}
            >
              <MapsUgcOutlined />
            </IconButton>
          </Stack>
        </Stack>
        <Stack direction={"row"} alignItems={"center"}>
          <Typography>
            {data.price ? `đ ${data.price}` : lang("free")}
          </Typography>
          <TimelapseOutlined
            color="info"
            sx={{
              marginLeft: "auto",
            }}
          />
          <CountDown time={data.duration} sx={{ ml: 1 }} />
        </Stack>
        <Stack direction="row" alignItems={"center"}>
          <Typography>{lang("quantity")}: </Typography>
          <Rating
            value={data.quantity}
            sx={{
              width: "fit-content",
              ml: 1,
            }}
            size="small"
            readOnly
          />
          <Typography component="legend" sx={{ ml: 2 }}>
            {lang(toQuantityType(data.quantity))}
          </Typography>
        </Stack>
        <Stack direction={"row"} gap={1} mt={1}>
          <LocationOnOutlined color="info" />
          <Typography>{data.location.name}</Typography>
        </Stack>
      </Stack>
      <Stack
        sx={{ backgroundColor: "background.default", my: 2 }}
        minHeight={100}
        p={1}
        borderRadius={2}
      >
        <Box component={"h4"}>{lang("category")}</Box>
        <Divider />
        {data.categories.length === 0 && (
          <Typography>{lang("no-category")}</Typography>
        )}
        <Stack my={1} direction={"row"} gap={1}>
          {data.categories.map((category) => {
            return (
              <Chip
                label={lang(category)}
                sx={{ width: "fit-content", cursor: "pointer" }}
                key={category}
              />
            );
          })}
        </Stack>
      </Stack>

      <Stack
        sx={{ backgroundColor: "background.default" }}
        my={2}
        p={1}
        direction={"row"}
        borderRadius={2}
      >
        <Stack direction={"row"} alignItems={"center"} gap={2} width={"100%"}>
          <Avatar
            alt={userExposedName}
            sx={{ bgcolor: deepOrange[500], cursor: "pointer" }}
            onClick={() => {
              navigate(`/profile/${userId}`);
            }}
          >
            {userExposedName[0]}
          </Avatar>
          <Stack direction={"column"} flex={1}>
            <Typography>{userExposedName}</Typography>

            {typeof user === "object" && (
              <Typography>
                {user.location?.name
                  ? toDistance(
                      user.location?.coordinates,
                      appContentContext.currentLocation
                    ) + "km"
                  : lang("Không địa chỉ")}
              </Typography>
            )}
            <Stack direction={"row"} width={"100%"}>
              <LocationOnOutlined color="info" />
              {typeof user === "object" && (
                <Typography>
                  {user.location?.name ?? lang("Không địa chỉ")}
                </Typography>
              )}
            </Stack>
          </Stack>
        </Stack>
      </Stack>

      <Stack
        sx={{ backgroundColor: "background.default" }}
        minHeight={100}
        p={1}
        borderRadius={2}
      >
        <Box component={"h4"}>{lang("description")}</Box>
        <Divider />
        {data.description ? (
          <RichTextReadOnly
            extensions={[StarterKit]}
            spell-check={false}
            content={data.description}
          />
        ) : (
          <Typography>{lang("no-description")}</Typography>
        )}
      </Stack>
    </Box>
  );
}
