import React, { useCallback, useEffect, useState } from "react";
import { Box, Button, Divider, Stack, StackProps } from "@mui/material";
import { FoodCategory, IPlaceExposed, IPlaceFoodExposed } from "../../../data";
import {
  useAppContentContext,
  useAuthContext,
  usePageProgessContext,
} from "../../../hooks";
import PlaceViewerSubciberHolder from "./PlaceViewerSubcriberHolder";
import PlaceViewerSharedFood from "./PlaceViewerSharedFood";

type PlaceViewerSharedProps = StackProps & {
  place: IPlaceExposed;
  active: boolean;
};

const sample: IPlaceFoodExposed = {
  author: {
    _id: "0",
    email: "0",
    firstName: "Giap",
    lastName: "Huy",
  },
  food: {
    _id: "0",
    duration: Date.now() + 1 * 24 * 60 * 60 * 1000,
    images: [],
    time: Date.now(),
    title: "Thực phẩm sạch cho mọi nhà",
    categories: [FoodCategory.FRUITS],
  },
  place: {
    _id: "0",
    exposedName: "Địa điểm 1",
    location: {
      name: "Phố hàng bông",
      coordinates: {
        lat: 0,
        lng: 1,
      },
    },
  },
};

const genSample = (): IPlaceFoodExposed => {
  return sample;
};

const PlaceViewerShared = React.forwardRef<
  HTMLDivElement,
  PlaceViewerSharedProps
>((props, ref) => {
  const { place, active, ...rest } = props;

  const [end, setEnd] = useState<boolean>(false);
  const [foods, setFoods] = useState<IPlaceFoodExposed[]>([sample]);

  const progessContext = usePageProgessContext();
  const authContext = useAuthContext();
  const auth = authContext.auth;
  const appContextContext = useAppContentContext();

  const doSearchMore = useCallback(() => {
    const skip = foods.length;
    console.log(skip, place._id, auth);

    if (progessContext.isLoading) return;
    progessContext.start();
    setTimeout(() => {
      const nFoods = [...foods];
      nFoods.push(genSample(), genSample(), genSample());
      setFoods(nFoods);
      setEnd(true);
      progessContext.end();
    }, 1000);
  }, [auth, foods, place._id, progessContext]);

  useEffect(() => {
    const main = appContextContext.mainRef?.current;
    let listener: any;

    if (main != null) {
      listener = (event: Event) => {
        const element = event.target as HTMLDivElement;
        const isAtBottom =
          element.scrollTop + element.clientHeight === element.scrollHeight;

        if (isAtBottom && active && !end) {
          doSearchMore();
        }
      };
      main.addEventListener("scroll", listener);
    }
    return () => {
      if (main != null && listener != null) {
        main.removeEventListener("scroll", listener);
      }
    };
  }, [appContextContext.mainRef, active, doSearchMore, end]);

  return (
    <Stack
      ref={ref}
      minHeight={"60vh"}
      {...rest}
      sx={{
        width: "100%",
        ...(props.sx ?? {}),
      }}
    >
      {foods.map((food, index) => {
        return (
          <>
            <PlaceViewerSharedFood py={1} data={food} key={index} />
            <Divider variant="middle" />
          </>
        );
      })}

      {end && (
        <Box textAlign={"center"} mt={2}>
          Đã hết
        </Box>
      )}

      {progessContext.isLoading && <PlaceViewerSubciberHolder />}

      {!progessContext.isLoading && !end && (
        <Stack alignItems={"center"} mt={2}>
          <Button sx={{ width: "fit-content" }} onClick={() => doSearchMore()}>
            Tìm kiếm thêm
          </Button>
        </Stack>
      )}
    </Stack>
  );
});

export default PlaceViewerShared;
