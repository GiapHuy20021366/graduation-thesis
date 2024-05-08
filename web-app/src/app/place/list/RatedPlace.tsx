import React, { useCallback, useEffect, useState } from "react";
import { Stack, StackProps } from "@mui/material";
import {
  useAppContentContext,
  useAuthContext,
  useDirty,
  useDynamicStorage,
  useLoader,
  usePageProgessContext,
} from "../../../hooks";
import {
  IPagination,
  IPlaceExposedCooked,
  toPlaceExposedCooked,
} from "../../../data";
import PlaceSearchItemHolder from "../search/PlaceSearchItemHolder";
import RatedPlaceItem from "./RatedPlaceItem";
import { userFetcher } from "../../../api";
import ErrorRetry from "../../common/viewer/data/ErrorRetry";
import ListEnd from "../../common/viewer/data/ListEnd";

interface IRatedPlaceSnapshotData {
  data: IPlaceExposedCooked[];
  scrollTop?: number;
}

const RATED_PLACE_STORAGE_KEY = "place.list.rated.place";

type RatedPlaceProps = StackProps & {
  active?: boolean;
};

const RatedPlace = React.forwardRef<HTMLDivElement, RatedPlaceProps>(
  (props, ref) => {
    const { active, ...rest } = props;

    const storage = useDynamicStorage<IRatedPlaceSnapshotData>(
      RATED_PLACE_STORAGE_KEY
    );
    const stored = storage.get();

    const [data, setData] = useState<IPlaceExposedCooked[]>(stored?.data ?? []);

    const appContentContext = useAppContentContext();
    const { currentLocation } = appContentContext;
    const authContext = useAuthContext();
    const progessContext = usePageProgessContext();

    const { auth, account } = authContext;

    const loader = useLoader();

    const doSaveStorage = useCallback(() => {
      const snapshot: IRatedPlaceSnapshotData = {
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
        .getRatedPlace(authContext.account!._id, pagination, auth)
        .then((res) => {
          const places = res.data;
          if (places != null) {
            if (places.length < pagination.limit) {
              loader.setIsEnd(true);
            }
            const _newPlaces = data.slice();
            places.forEach((place) => {
              _newPlaces.push(
                toPlaceExposedCooked(place, {
                  currentCoordinates: currentLocation,
                  homeCoordinates: account?.location?.coordinates,
                })
              );
            });
            setData(_newPlaces);
          }
        })
        .catch(() => {
          loader.setIsError(true);
        })
        .finally(() => {
          progessContext.end();
          loader.setIsFetching(false);
        });
    }, [
      auth,
      loader,
      active,
      data,
      progessContext,
      authContext.account,
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
            <RatedPlaceItem
              data={place}
              key={index}
              onBeforeNavigate={handleBeforeNavigate}
              boxShadow={1}
            />
          );
        })}

        {loader.isFetching && <PlaceSearchItemHolder />}
        <ListEnd active={loader.isEnd && !loader.isError} onRetry={doSearch} />
        <ErrorRetry active={loader.isError} onRetry={doSearch} />
      </Stack>
    );
  }
);

export default RatedPlace;
