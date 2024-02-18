import React, { useCallback, useEffect, useRef, useState } from "react";
import { Box, SpeedDial, Stack, StackProps } from "@mui/material";
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
  IPlaceExposed,
  IPlaceExposedCooked,
  PlaceType,
  loadFromSessionStorage,
  saveToSessionStorage,
  toPlaceExposedCooked,
} from "../../../data";
import PlaceSearchItemHolder from "../search/PlaceSearchItemHolder";
import PlaceSearchItem from "../search/PlaceSearchItem";

interface IFavoritePlaceSnapshotData {
  data: IPlaceExposedCooked[];
  scrollTop?: number;
}

const FAVORITE_PLACE_STORAGE_KEY = "place.list.favorite.place";

type FavoritePlaceProps = StackProps & {
  active?: boolean;
};

const FavoritePlace = React.forwardRef<HTMLDivElement, FavoritePlaceProps>(
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

    // Recover at begining or fetch at begining
    const dirtyRef = useRef<boolean>(false);

    const doSaveStorage = () => {
      const snapshot: IFavoritePlaceSnapshotData = {
        data: data,
        scrollTop: appContentContext.mainRef?.current?.scrollTop,
      };
      saveToSessionStorage(snapshot, {
        key: FAVORITE_PLACE_STORAGE_KEY,
        account: authContext.account?.id_,
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
      setIsFetching(true);
      progessContext.start();
      setTimeout(() => {
        const newData: IPlaceExposed[] = [];
        for (let i = 0; i < 24; ++i) {
          newData.push(
            toPlaceExposedCooked(
              {
                _id: "65c23fe0e1108a5e08d91acb",
                active: true,
                author: {
                  _id: "0",
                  email: "0",
                  firstName: "H",
                  lastName: "G",
                },
                categories: [],
                createdAt: new Date(),
                exposeName: "HUY",
                images: [],
                location: {
                  name: "0",
                  coordinates: {
                    lat: 100,
                    lng: 16,
                  },
                },
                rating: {
                  count: 0,
                  mean: 0,
                },
                type: PlaceType.PERSONAL,
                updatedAt: new Date(),
              },
              {
                currentCoordinates: distances.currentLocation?.coordinates,
                homeCoordinates: account?.location?.coordinates,
              }
            )
          );
        }
        if (newData.length < pagination.limit) {
          setIsEnd(true);
        }
        setData(newData);

        setIsFetching(false);
        progessContext.end();
      }, 1000);
    }, [
      account?.location,
      auth,
      data.length,
      distances.currentLocation,
      isFetching,
      progessContext,
      active,
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
        const snapshot = loadFromSessionStorage<IFavoritePlaceSnapshotData>({
          key: FAVORITE_PLACE_STORAGE_KEY,
          maxDuration: 1 * 24 * 60 * 60 * 1000,
          account: account.id_,
        });
        if (snapshot) {
          setData(snapshot.data);
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
        {isEnd && (
          <Box textAlign={"center"} mt={2}>
            Đã hết
          </Box>
        )}
      </Stack>
    );
  }
);

export default FavoritePlace;
