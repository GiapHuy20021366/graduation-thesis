import { useNavigate } from "react-router-dom";
import {
  IFoodPostData,
  IUserInfo,
  toDistance,
  toQuantityType,
} from "../../../data";
import {
  useAppContentContext,
  useAuthContext,
  useI18nContext,
} from "../../../hooks";
import { useEffect, useState } from "react";
import FullWidthBox from "../../common/custom/FullWidthBox";
import Carousel from "react-material-ui-carousel";
import {
  Avatar,
  Badge,
  Box,
  Chip,
  Divider,
  IconButton,
  Rating,
  Skeleton,
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
import { foodFetcher, userFetcher } from "../../../api";
import CountDown from "../../common/util/CountDown";

interface IFoodPostInfoDataDisplayProps {
  data: IFoodPostData;
}

export default function FoodPostInfoDataDisplay({
  data,
}: IFoodPostInfoDataDisplayProps) {
  const i18n = useI18nContext();
  const lang = i18n.of(
    FoodPostInfoDataDisplay,
    "Commons",
    "Categories",
    "Quantities"
  );
  const appContentContext = useAppContentContext();
  const navigate = useNavigate();
  const authContext = useAuthContext();
  const [liked, setLiked] = useState<boolean>(data.liked ?? false);
  const [author, setAuthor] = useState<IUserInfo>();

  useEffect(() => {
    if (authContext.auth == null) return;

    userFetcher.getUserInfo(data.user._id, authContext.auth).then((data) => {
      const datas = data.data;
      if (datas != null) {
        setAuthor(datas);
      }
    });
  }, [authContext.auth, data.user._id]);

  const handleLikeOrUnlike = () => {
    if (authContext.auth == null) return;
    foodFetcher
      .likeFood(data._id, liked ? "UNLIKE" : "LIKE", authContext.auth)
      .then(() => {
        setLiked(!liked);
      });
  };

  const likeCount =
    liked == data.liked
      ? data.likeCount ?? 0
      : !data.liked && liked
      ? (data.likeCount ?? 0) + 1
      : (data.likeCount ?? 0) - 1;

  return (
    <FullWidthBox>
      <Carousel
        indicators
        swipe
        autoPlay
        animation="slide"
        cycleNavigation
        fullHeightHover
        sx={{
          backgroundColor: "white",
        }}
      >
        {data.images.map((url) => {
          return (
            <Box
              sx={{
                width: "100%",
                height: "260px",
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
          backgroundColor: "white",
          my: 2,
        }}
        gap={0.5}
        p={1}
      >
        <Box component={"h4"} textTransform={"capitalize"} sx={{ mb: 2 }}>
          {data.title || lang("no-title")}
        </Box>
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
            <IconButton
              sx={{
                color: liked ? "red" : "gray",
                ":hover": {
                  color: "red",
                },
              }}
            >
              <Badge
                badgeContent={<span>{likeCount}</span>}
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
            <IconButton color="success">
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
      <Stack sx={{ backgroundColor: "white", my: 2 }} minHeight={100} p={1}>
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

      <Stack sx={{ backgroundColor: "white" }} my={2} p={1} direction={"row"}>
        <Stack direction={"row"} alignItems={"center"} gap={2} width={"100%"}>
          <Avatar
            alt={data.user.exposeName}
            sx={{ bgcolor: deepOrange[500], cursor: "pointer" }}
            onClick={() => {
              navigate(`/profile/${data.user._id}`);
            }}
          >
            {data.user.exposeName ? data.user.exposeName[0] : "U"}
          </Avatar>
          <Stack direction={"column"} flex={1}>
            <Typography>{data.user.exposeName}</Typography>
            {author == null && <Skeleton variant="text" sx={{ flex: 1 }} />}
            {author != null && (
              <Typography>
                {author.location?.name
                  ? toDistance(
                      author.location?.coordinates,
                      appContentContext.currentLocation
                    ) + "km"
                  : lang("Không địa chỉ")}
              </Typography>
            )}
            <Stack direction={"row"} width={"100%"}>
              <LocationOnOutlined color="info" />
              {author == null && <Skeleton variant="text" sx={{ flex: 1 }} />}
              {author != null && (
                <Typography>
                  {author.location?.name ?? lang("Không địa chỉ")}
                </Typography>
              )}
            </Stack>
          </Stack>
        </Stack>
      </Stack>

      <Stack sx={{ backgroundColor: "white" }} minHeight={100} p={1}>
        <Box component={"h4"}>{lang("description")}</Box>
        <Divider />
        {data.description ? (
          <Box>{data.description}</Box>
        ) : (
          <Typography>{lang("no-description")}</Typography>
        )}
      </Stack>
    </FullWidthBox>
  );
}
