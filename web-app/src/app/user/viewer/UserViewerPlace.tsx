import React, { useCallback, useEffect, useState } from "react";
import { Stack, StackProps } from "@mui/material";
import {
  useAppContentContext,
  useAuthContext,
  useDirty,
  useDynamicStorage,
  useLoader,
  usePageProgessContext,
  useUserViewerContext,
} from "../../../hooks";
import {
  IPagination,
  IPlaceExposedCooked,
  toPlaceExposedCooked,
} from "../../../data";
import { userFetcher } from "../../../api";
import PlaceListItemMine from "../../place/list/PlaceListItemMine";
import PlaceSearchItemHolder from "../../place/search/PlaceSearchItemHolder";
import ErrorRetry from "../../common/viewer/data/ErrorRetry";
import SearchMore from "../../common/viewer/data/SearchMore";

interface IUserViewerPlaceSnapshotData {
  data: IPlaceExposedCooked[];
  scrollTop?: number;
}

const USER_VIEWER_PLACE = (userId: string) => `user.viewer@${userId}.place`;

type UserViewerPlaceProps = StackProps & {
  active: boolean;
};

const UserViewerPlace = React.forwardRef<HTMLDivElement, UserViewerPlaceProps>(
  (props, ref) => {
    const { active, ...rest } = props;
    const viewerContext = useUserViewerContext();
    const { _id } = viewerContext;

    const storage = useDynamicStorage<IUserViewerPlaceSnapshotData>(
      USER_VIEWER_PLACE(_id)
    );
    const stored = storage.get();

    const [data, setData] = useState<IPlaceExposedCooked[]>(stored?.data ?? []);

    const appContentContext = useAppContentContext();
    const { currentLocation } = appContentContext;
    const authContext = useAuthContext();
    const { auth, account } = authContext;

    const progessContext = usePageProgessContext();

    const loader = useLoader();

    const doSaveStorage = useCallback(() => {
      const snapshot: IUserViewerPlaceSnapshotData = {
        data: data,
        scrollTop: appContentContext.mainRef?.current?.scrollTop,
      };
      storage.update(() => snapshot);
      storage.save();
    }, [appContentContext.mainRef, data, storage]);

    const handleBeforeNavigate = () => {
      doSaveStorage();
    };

    const doSearch = useCallback(() => {
      if (auth == null) return;
      if (loader.isFetching || !active) return;
      const pagination: IPagination = {
        skip: data.length,
        limit: 24,
      };

      progessContext.start();
      loader.setIsFetching(true);
      loader.setIsError(false);
      loader.setIsEnd(false);

      userFetcher
        .searchPlace(
          {
            author: {
              include: [_id],
            },
            pagination: pagination,
          },
          auth
        )
        .then((res) => {
          const places = res.data;
          if (places != null) {
            if (places.length < pagination.limit) {
              loader.setIsEnd(true);
            }

            const _newData = data.slice();
            places.forEach((place) => {
              _newData.push(
                toPlaceExposedCooked(place, {
                  currentCoordinates: currentLocation,
                  homeCoordinates: account?.location?.coordinates,
                })
              );
            });

            setData(_newData);
          }
        })
        .catch(() => {
          loader.setIsError(true);
        })
        .finally(() => {
          loader.setIsFetching(false);
          progessContext.end();
        });
    }, [
      auth,
      loader,
      active,
      data,
      progessContext,
      _id,
      currentLocation,
      account?.location?.coordinates,
    ]);

    useEffect(() => {
      const main = appContentContext.mainRef?.current;
      let listener: any;

      if (main != null) {
        listener = (event: Event) => {
          const element = event.target as HTMLDivElement;
          const isAtBottom =
            element.scrollHeight * 0.95 <=
            element.scrollTop + element.clientHeight;
          if (isAtBottom && !loader.isEnd && !loader.isFetching) {
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
    }, [appContentContext.mainRef, doSearch, loader.isEnd, loader.isFetching]);

    const dirty = useDirty();
    useEffect(() => {
      if (account == null) return;
      if (!active) return;
      dirty.perform(() => {
        if (storage.isNew) {
          doSearch();
        } else {
          if (stored && stored?.data.length < 24) loader.setIsEnd(true);
          const mainRef = appContentContext.mainRef?.current;
          if (mainRef != null) {
            setTimeout(() => {
              mainRef.scrollTop = stored?.scrollTop ?? 0;
            }, 0);
          }
        }
      });
    }, [
      account,
      active,
      appContentContext.mainRef,
      dirty,
      doSearch,
      loader,
      storage.isNew,
      stored,
    ]);

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
            <PlaceListItemMine
              data={place}
              key={index}
              onBeforeNavigate={handleBeforeNavigate}
              boxShadow={1}
            />
          );
        })}
        {/* <SpeedDial
          icon={<AddOutlined />}
          sx={{ position: "fixed", bottom: 136, right: 26 }}
          ariaLabel={"Create"}
          onClick={() => navigate("/place/update")}
        /> */}

        {loader.isFetching && <PlaceSearchItemHolder />}

        <SearchMore
          active={loader.isEnd && !loader.isError}
          onSearchMore={doSearch}
        />

        <ErrorRetry active={loader.isError} onRetry={doSearch} />
      </Stack>
    );
  }
);

export default UserViewerPlace;
