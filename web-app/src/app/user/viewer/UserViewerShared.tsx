import React, { useCallback, useEffect, useState } from "react";
import { Box, Button, Divider, Stack, StackProps } from "@mui/material";
import { IFoodPostExposed, IUserExposed, SystemSide } from "../../../data";
import {
  useAppContentContext,
  useAuthContext,
  usePageProgessContext,
} from "../../../hooks";
import SharedFood from "../../common/viewer/data/SharedFood";

type UserViewerSharedProps = StackProps & {
  user: IUserExposed;
  active: boolean;
};

const sample: IFoodPostExposed = {
  user: {
    _id: "656224f0d5a6da1d1e2c49e2",
    firstName: "Giap",
    lastName: "Huy",
    avartar: undefined,
  },
  _id: "0",
  active: true,
  categories: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  duration: new Date(),
  images: [],
  isEdited: true,
  likeCount: 4,
  price: 9999,
  quantity: 5,
  title: "Sample",
  description: "",
};

const genSample = (): IFoodPostExposed => {
  return sample;
};

const PlaceViewerShared = React.forwardRef<
  HTMLDivElement,
  UserViewerSharedProps
>((props, ref) => {
  const { place, active, ...rest } = props;

  const [end, setEnd] = useState<boolean>(false);
  const [foods, setFoods] = useState<IFoodPostExposed[]>([sample]);

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
      display={active ? "flex" : "none"}
    >
      {foods.map((food, index) => {
        return (
          <>
            <SharedFood
              source={SystemSide.USER}
              py={1}
              data={food}
              key={index}
            />
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
