import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  SpeedDial,
  Stack,
  StackProps,
  Typography,
} from "@mui/material";
import { AddOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router";
import {
  useAppContentContext,
  useAuthContext,
  useDistanceCalculation,
  usePageProgessContext,
} from "../../../hooks";
import {
  IPagination,
  IPlaceExposedCooked,
  OrderState,
  loadFromSessionStorage,
  saveToSessionStorage,
  toPlaceExposedCooked,
} from "../../../data";
import PlaceSearchItemHolder from "../search/PlaceSearchItemHolder";
import PlaceSearchItem from "../search/PlaceSearchItem";
import { userFetcher } from "../../../api";

interface INearPlaceSnapshotData {
  data: IPlaceExposedCooked[];
  scrollTop?: number;
}

const NEAR_PLACE_STORAGE_KEY = "place.list.near.place";

type NearPlaceProps = StackProps & {
  active?: boolean;
};

const NearPlace = React.forwardRef<HTMLDivElement, NearPlaceProps>(
  (props, ref) => {
    const navigate = useNavigate();
    const { active, ...rest } = props;

    const [data, setData] = useState<IPlaceExposedCooked[]>([]);

    const appContentContext = useAppContentContext();
    const authContext = useAuthContext();
    const progessContext = usePageProgessContext();
    const distances = useDistanceCalculation();

    const { auth, account } = authContext;

    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [isEnd, setIsEnd] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);

    // Recover at begining or fetch at begining
    const dirtyRef = useRef<boolean>(false);

    const doSaveStorage = () => {
      const snapshot: INearPlaceSnapshotData = {
        data: data,
        scrollTop: appContentContext.mainRef?.current?.scrollTop,
      };
      saveToSessionStorage(snapshot, {
        key: NEAR_PLACE_STORAGE_KEY,
        account: authContext.account?._id,
      });
    };

    const handleBeforeNavigate = () => {
      doSaveStorage();
    };

    const doSearch = useCallback(() => {
      if (auth == null) return;
      if (isFetching || !active) return;
      const pagination: IPagination = {
        skip: data.length,
        limit: 24,
      };

      progessContext.start();
      setIsFetching(true);
      setIsError(false);
      setIsEnd(false);

      userFetcher
        .searchPlace(
          {
            currentLocation: distances.currentLocation?.coordinates,
            order: {
              distance: OrderState.INCREASE,
            },
            pagination: pagination,
          },
          auth
        )
        .then((res) => {
          const places = res.data;
          if (places != null) {
            if (places.length < pagination.limit) {
              setIsEnd(true);
            }
            const _newPlaces = data.slice();
            places.forEach((place) => {
              _newPlaces.push(
                toPlaceExposedCooked(place, {
                  currentCoordinates: distances.currentLocation?.coordinates,
                  homeCoordinates: account?.location?.coordinates,
                })
              );
            });
            setData(_newPlaces);
          }
        })
        .catch(() => {
          setIsError(true);
        })
        .finally(() => {
          progessContext.end();
          setIsFetching(false);
        });
    }, [
      auth,
      isFetching,
      active,
      data,
      progessContext,
      distances.currentLocation,
      account?.location,
    ]);

    useEffect(() => {
      const main = appContentContext.mainRef?.current;
      let listener: any;

      if (main != null) {
        listener = (event: Event) => {
          const element = event.target as HTMLDivElement;
          const isAtBottom =
            element.scrollTop + element.clientHeight === element.scrollHeight;

          if (isAtBottom && !isEnd) {
            doSearch();
          }
        };
        main.addEventListener("scroll", listener);
      }
      return () => {
        if (main != null && listener != null) {
          main.removeEventListener("scroll", listener);
        }
      };
    }, [appContentContext.mainRef, doSearch, isEnd]);

    // Recover result
    useEffect(() => {
      if (account == null) return;
      if (!active) return;
      if (!dirtyRef.current) {
        // At begining
        const snapshot = loadFromSessionStorage<INearPlaceSnapshotData>({
          key: NEAR_PLACE_STORAGE_KEY,
          maxDuration: 1 * 24 * 60 * 60 * 1000,
          account: account._id,
        });
        if (snapshot) {
          const snapshotData = snapshot.data;
          if (snapshotData.length < 24) {
            setIsEnd(true);
          }
          setData(snapshotData);

          const mainRef = appContentContext.mainRef?.current;
          if (mainRef) {
            setTimeout(() => {
              mainRef.scrollTop = snapshot.scrollTop ?? 0;
            }, 300);
          }
        } else {
          doSearch();
        }
        dirtyRef.current = true;
      }
    }, [account, active, appContentContext.mainRef, doSearch]);

    return (
      <Stack
        ref={ref}
        {...rest}
        sx={{
          width: "100%",
          ...(props.sx ?? {}),
          display: active ? "flex" : "none",
        }}
      >
        {data.map((place, index) => {
          return (
            <PlaceSearchItem
              data={place}
              key={index}
              onBeforeNavigate={handleBeforeNavigate}
              boxShadow={1}
            />
          );
        })}
        <SpeedDial
          icon={<AddOutlined />}
          sx={{ position: "absolute", bottom: 136, right: 26 }}
          ariaLabel={"Create"}
          onClick={() => navigate("/place/update")}
        />
        {isFetching && <PlaceSearchItemHolder />}
        {isEnd && !isError && (
          <Box textAlign={"center"} mt={2}>
            <Typography>Bạn đã tìm kiếm hết</Typography>
            <Button onClick={() => doSearch()}>Tìm kiếm thêm</Button>
          </Box>
        )}
        {isError && (
          <Box textAlign={"center"} mt={2}>
            <Typography>Có lỗi xảy ra</Typography>
            <Button onClick={() => doSearch()}>Thử lại</Button>
          </Box>
        )}
      </Stack>
    );
  }
);

export default NearPlace;
