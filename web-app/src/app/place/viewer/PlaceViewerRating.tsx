import React, { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Rating,
  Stack,
  StackProps,
  Typography,
} from "@mui/material";
import { IPlaceExposedWithRatingAndFollow, IRating } from "../../../data";
import {
  useAuthContext,
  useComponentLanguage,
  useToastContext,
} from "../../../hooks";
import { Star } from "@mui/icons-material";
import { userFetcher } from "../../../api";

type PlaceViewerRatingProps = StackProps & {
  data: IPlaceExposedWithRatingAndFollow;
};

const ratingLables: { [index: string]: string } = {
  1: "useless",
  2: "poor",
  3: "ok",
  4: "good",
  5: "excellent",
};

function getLabelText(value: number) {
  return `${value} Star${value !== 1 ? "s" : ""}, ${ratingLables[value]}`;
}

const PlaceViewerRating = React.forwardRef<
  HTMLDivElement,
  PlaceViewerRatingProps
>((props, ref) => {
  const { data, ...rest } = props;

  const [rating, setRating] = useState<number | null>(
    data.userRating?.score ?? null
  );
  const [hover, setHover] = useState<number>(-1);
  const [ratingExpose, setRatingExpose] = useState<IRating>(data.rating);

  const authContext = useAuthContext();
  const { account, auth } = authContext;
  const toastContext = useToastContext();
  const lang = useComponentLanguage();

  useEffect(() => {
    if (rating == null) {
      if (account != null) {
        if (account._id === data.userRating?.user) {
          setRating(data.userRating.score);
        }
      }
    }
  }, [account, data, rating]);

  const ratingPlace = (score: number | null) => {
    if (auth == null) return;
    userFetcher
      .ratingPlace(data._id, auth, score ?? undefined)
      .then((res) => {
        const resRating = res.data;
        if (resRating) {
          setRating(score);
          setRatingExpose(resRating);
        }
      })
      .catch(() => {
        toastContext.error(lang("cannot-rating-now"));
      });
  };

  return (
    <Stack
      ref={ref}
      gap={1}
      {...rest}
      direction={"row"}
      sx={{
        ...(props.sx ?? {}),
      }}
    >
      <Box>
        <Box
          sx={{
            position: "relative",
          }}
        >
          <CircularProgress
            variant="determinate"
            value={100}
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              color: "gray",
            }}
          />
          <CircularProgress
            variant="determinate"
            value={(ratingExpose.mean / 5) * 100}
            color="secondary"
          />

          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: "absolute",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              variant="caption"
              component="div"
              color="text.secondary"
            >{`${Math.round((ratingExpose.mean / 5) * 100)}%`}</Typography>
          </Box>
        </Box>
      </Box>
      <Stack>
        <Typography>
          {lang(
            "rated-point",
            ratingExpose.count,
            ratingExpose.mean.toFixed(1),
            "5.0"
          )}
        </Typography>
        <Box
          sx={{
            width: 200,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Rating
            name="hover-feedback"
            value={rating}
            getLabelText={getLabelText}
            onChange={(_event, newValue) => {
              if (newValue != null) {
                ratingPlace(newValue);
              }
            }}
            onChangeActive={(_event, newHover) => {
              setHover(newHover);
            }}
            emptyIcon={<Star style={{ opacity: 0.55 }} fontSize="inherit" />}
          />
          {rating !== null && (
            <Box sx={{ ml: 2 }}>
              {lang(ratingLables[hover !== -1 ? hover : rating])}
            </Box>
          )}
        </Box>
      </Stack>
    </Stack>
  );
});

export default PlaceViewerRating;
