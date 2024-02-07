import React, { useCallback, useEffect, useState } from "react";
import { Box, Button, Divider, Stack, StackProps } from "@mui/material";
import {
  FollowType,
  IPlaceExposed,
  IPlaceFollowerExposed,
} from "../../../data";
import {
  useAppContentContext,
  useAuthContext,
  usePageProgessContext,
} from "../../../hooks";
import PlaceViewerSubciber from "./PlaceViewerSubcriber";
import PlaceViewerSubciberHolder from "./PlaceViewerSubcriberHolder";

type PlaceViewerSubcribedProps = StackProps & {
  place: IPlaceExposed;
  active: boolean;
};

const sample: IPlaceFollowerExposed = {
  _id: "0123456789",
  subcriber: {
    _id: "0123456789",
    firstName: "Giap",
    lastName: "Huy",
  },
  time: Date.now(),
  type: Math.pow(2, Math.floor(Math.random() * 4)),
};

const genSample = (type: FollowType): IPlaceFollowerExposed => {
  return { ...sample, type };
};

const PlaceViewerSubcribed = React.forwardRef<
  HTMLDivElement,
  PlaceViewerSubcribedProps
>((props, ref) => {
  const { place, active, ...rest } = props;

  const [end, setEnd] = useState<boolean>(false);
  const [followers, setFollowers] = useState<IPlaceFollowerExposed[]>([sample]);

  const progessContext = usePageProgessContext();
  const authContext = useAuthContext();
  const auth = authContext.auth;
  const appContextContext = useAppContentContext();

  const doSearchMore = useCallback(() => {
    const skip = followers.length;
    console.log(skip, place._id, auth);

    if (progessContext.isLoading) return;
    progessContext.start();
    setTimeout(() => {
      const nFollowers = [...followers];
      nFollowers.push(
        genSample(Math.pow(2, Math.floor(Math.random() * 4))),
        genSample(Math.pow(2, Math.floor(Math.random() * 4))),
        genSample(Math.pow(2, Math.floor(Math.random() * 4)))
      );
      setFollowers(nFollowers);
      setEnd(true);
      progessContext.end();
    }, 1000);
  }, [auth, followers, place._id, progessContext]);

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
      {followers.map((follower, index) => {
        return (
          <>
            <PlaceViewerSubciber py={1} data={follower} key={index} />
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

export default PlaceViewerSubcribed;
