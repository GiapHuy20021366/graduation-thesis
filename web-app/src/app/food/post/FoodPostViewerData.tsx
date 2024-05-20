import {
  IFoodPostExposedWithLike,
  toDistance,
  toQuantityType,
} from "../../../data";
import {
  useAppContentContext,
  useConversationContext,
  useFoodPostViewerContext,
  useI18nContext,
} from "../../../hooks";
import Carousel from "react-material-ui-carousel";
import {
  Badge,
  Box,
  Chip,
  Divider,
  IconButton,
  Rating,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  Favorite,
  LocalOfferOutlined,
  LocationOnOutlined,
  MapsUgcOutlined,
  ProductionQuantityLimitsOutlined,
  SentimentVerySatisfiedOutlined,
  SocialDistanceOutlined,
  TimelapseOutlined,
  VisibilityOffOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";
import CountDown from "../../common/util/CountDown";
import FoodPostButtonWithMenu from "./FoodPostButtonWithMenu";
import { RichTextReadOnly } from "mui-tiptap";
import StarterKit from "@tiptap/starter-kit";
import FoodAvatars from "../../common/viewer/data/FoodAvatars";
import TimeExposed from "../../common/custom/TimeExposed";
import ButtonShareAction from "../../common/util/ButtonShareAction";

const toUserId = (post: IFoodPostExposedWithLike): string => {
  const user = post.user;
  return typeof user === "string" ? user : user._id;
};

const toUserExposedName = (post: IFoodPostExposedWithLike): string => {
  const user = post.user;
  if (typeof user == "string") return "SYSTEM_USER";
  return user.firstName + " " + user.lastName;
};

export default function FoodPostViewerData() {
  const i18n = useI18nContext();
  const lang = i18n.of(
    FoodPostViewerData,
    "Commons",
    "Categories",
    "Quantities"
  );
  const appContentContext = useAppContentContext();
  const conversationContext = useConversationContext();
  const viewerContext = useFoodPostViewerContext();
  const { food: data, likeFood, editable } = viewerContext;

  const { user } = data;

  const handleLikeOrUnlike = () => {
    likeFood();
  };

  const userId = toUserId(data);
  const userExposedName = toUserExposedName(data);

  const { active, resolved, resolveTime } = data;

  const distance = toDistance(
    data.location.coordinates,
    appContentContext.currentLocation
  );

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
        <Stack>
          <Box component={"h3"} textTransform={"capitalize"} sx={{ mb: 2 }}>
            {data.title || lang("no-title")}
          </Box>
          <Stack direction={"row"} justifyContent={"end"} gap={2}>
            {editable && (
              <Stack direction={"row"} gap={1}>
                <Tooltip
                  arrow
                  title={lang(
                    active ? "every-one-tooltip" : "only-you-tooltip"
                  )}
                >
                  {!active ? (
                    <VisibilityOffOutlined color="error" />
                  ) : (
                    <VisibilityOutlined color="success" />
                  )}
                </Tooltip>
                <Typography>
                  {lang(active ? "every-one" : "only-you")}
                </Typography>
              </Stack>
            )}
            {resolved && (
              <>
                <Stack direction={"row"} gap={1}>
                  <Tooltip arrow title={lang("resolved-tooltip")}>
                    <SentimentVerySatisfiedOutlined color="primary" />
                  </Tooltip>
                  <Typography>
                    <TimeExposed time={resolveTime} milisecond={false} />
                  </Typography>
                </Stack>
              </>
            )}
          </Stack>
        </Stack>
        <Stack direction={"row"} justifyContent={"space-between"}>
          <Stack direction={"row"} alignItems={"center"}>
            <TimelapseOutlined
              color="info"
              sx={{
                marginLeft: "auto",
              }}
            />
            <CountDown time={data.duration} sx={{ ml: 1 }} enable={true} />
          </Stack>
          <FoodPostButtonWithMenu />
        </Stack>

        <Stack direction="row" justifyContent={"space-between"}>
          <Stack direction={"row"} gap={1}>
            <SocialDistanceOutlined color="info" />
            <Typography>
              {lang("distance-x", (distance * 1000).toFixed(0), "m")}
            </Typography>
          </Stack>
          <Stack direction="row">
            <IconButton color={data.liked ? "error" : "default"}>
              <Badge
                badgeContent={<span>{data.likeCount}</span>}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                color="secondary"
              >
                <Tooltip title={lang("favorite-label")}>
                  <Favorite onClick={() => handleLikeOrUnlike()} />
                </Tooltip>
              </Badge>
            </IconButton>
            <Tooltip title={lang("share-label")}>
              <ButtonShareAction
                color="info"
                link={new URL(`/food/${data._id}`, window.location.href).href}
              />
            </Tooltip>
            <IconButton
              color="success"
              onClick={() => {
                conversationContext.doBeginConversationWith(userId);
              }}
            >
              <Tooltip title={lang("message-label")}>
                <MapsUgcOutlined />
              </Tooltip>
            </IconButton>
          </Stack>
        </Stack>
        <Stack direction={"row"} justifyContent={"space-between"}>
          <Stack direction="row" alignItems={"center"}>
            <ProductionQuantityLimitsOutlined color="info" />
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
          <Stack direction={"row"} pr={1} gap={1}>
            <LocalOfferOutlined color="secondary" />
            <Typography>
              {data.price ? `${data.price} VNĐ` : lang("free")}
            </Typography>
          </Stack>
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
        <Stack gap={2} width={"100%"}>
          <Stack direction={"row"} gap={2}>
            <FoodAvatars food={data} navigate={true} />
            <Typography>{userExposedName}</Typography>
          </Stack>
          <Divider />
          <Stack direction={"column"}>
            {typeof user === "object" && (
              <Stack direction={"row"} gap={3}>
                <SocialDistanceOutlined color="info" />
                <Typography>
                  {user.location?.name
                    ? lang(
                        "distance-x",
                        (
                          toDistance(
                            user.location?.coordinates,
                            appContentContext.currentLocation
                          ) * 1000
                        ).toFixed(0),
                        "m"
                      )
                    : lang("no-address")}
                </Typography>
              </Stack>
            )}
            <Stack direction={"row"} width={"100%"} gap={3}>
              <LocationOnOutlined color="info" />
              {typeof user === "object" && (
                <Typography>
                  {user.location?.name ?? lang("no-address")}
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
