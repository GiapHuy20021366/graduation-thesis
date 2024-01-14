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
import Carousel from "react-material-ui-carousel";
import PageNotFound from "../../common/PageNotFound";
import { useNavigate, useParams } from "react-router";
import {
  useAppContentContext,
  useAuthContext,
  useI18nContext,
  useLoading,
} from "../../../hooks";
import { useEffect, useState } from "react";
import { foodFetcher } from "../../../api";
import { IFoodPostData, toDistance, toQuantityType } from "../../../data";
import FullWidthBox from "../../common/custom/FullWidthBox";
import {
  Favorite,
  LocalOfferOutlined,
  LocationOnOutlined,
  MapsUgcOutlined,
  Share,
  TimelapseOutlined,
} from "@mui/icons-material";
import CountDown from "../../common/util/CountDown";
import { deepOrange } from "@mui/material/colors";

function FoodPostInfoReplacer() {
  return (
    <Stack>
      <Carousel autoPlay indicators swipe>
        <Skeleton variant="rectangular" width={"100%"} height={200} />
        <Skeleton variant="rectangular" width={"100%"} height={200} />
        <Skeleton variant="rectangular" width={"100%"} height={200} />
        <Skeleton variant="rectangular" width={"100%"} height={200} />
      </Carousel>
      <Skeleton variant="text" width={"100%"} height={50} />
      <Skeleton variant="text" width={"100%"} height={200} />
      <Skeleton variant="text" width={"100%"} height={50} />
      <Skeleton variant="text" width={"100%"} height={50} />
      <Skeleton variant="text" width={"100%"} height={50} />
    </Stack>
  );
}

interface IFoodPostInfoDataDisplayProps {
  data: IFoodPostData;
}

function FoodPostInfoDataDisplay({ data }: IFoodPostInfoDataDisplayProps) {
  const i18n = useI18nContext();
  const lang = i18n.of(
    FoodPostInfoDataDisplay,
    "Commons",
    "Categories",
    "Quantities"
  );
  const appContentContext = useAppContentContext();
  const navigate = useNavigate();
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
                ":hover": {
                  color: "red",
                },
              }}
            >
              <Badge
                badgeContent={4}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                color="secondary"
              >
                <Favorite />
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
            <Skeleton variant="text" sx={{ flex: 1 }} />
            <Stack direction={"row"} width={"100%"}>
              <LocationOnOutlined color="info" />
              <Skeleton variant="text" sx={{ flex: 1 }} />
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

export default function FoodPostInfo() {
  const params = useParams();
  const authContext = useAuthContext();
  const loading = useLoading();
  const [data, setData] = useState<IFoodPostData>();
  const [found, setFound] = useState<boolean>(true);

  const fetchingFood = (id: string) => {
    const auth = authContext.auth;
    if (auth != null) {
      loading.active();
      foodFetcher
        .findFoodPost(id, auth)
        .then((data) => {
          setFound(true);
          setData(data.data);
        })
        .catch((err) => {
          setFound(false);
          console.log(err);
        })
        .finally(() => {
          loading.deactive();
        });
    }
  };

  useEffect(() => {
    const foodId = params.id;
    if (foodId != null) {
      fetchingFood(foodId);
    }
  }, []);

  return (
    <>
      {params.id == null || (params.id === "" && <PageNotFound />)}
      {loading.isActice && <FoodPostInfoReplacer />}
      {data && <FoodPostInfoDataDisplay data={data} />}
      {!found && <PageNotFound />}
    </>
  );
}
