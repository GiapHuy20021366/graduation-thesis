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
import PlaceListItemMine from "./PlaceListItemMine";
import PlaceSearchItemHolder from "../search/PlaceSearchItemHolder";
import { userFetcher } from "../../../api";
import ListEnd from "../../common/viewer/data/ListEnd";
import ErrorRetry from "../../common/viewer/data/ErrorRetry";

interface IMyPlaceSnapshotData {
  data: IPlaceExposedCooked[];
  scrollTop?: number;
}

const MY_PLACE_STORAGE_KEY = "place.list.my.place";

type MyPlaceProps = StackProps & {
  active?: boolean;
};

const MyPlace = React.forwardRef<HTMLDivElement, MyPlaceProps>((props, ref) => {
  const { active, ...rest } = props;

  const storage = useDynamicStorage<IMyPlaceSnapshotData>(MY_PLACE_STORAGE_KEY);
  const stored = storage.get();

  const [data, setData] = useState<IPlaceExposedCooked[]>(stored?.data ?? []);

  const appContentContext = useAppContentContext();
  const { currentLocation } = appContentContext;
  const authContext = useAuthContext();
  const progessContext = usePageProgessContext();

  const { auth, account } = authContext;

  const loader = useLoader();

  const doSaveStorage = useCallback(() => {
    const snapshot: IMyPlaceSnapshotData = {
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
            include: [account!._id],
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
  }, [auth, loader, active, data, progessContext, account, currentLocation]);

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

      {loader.isFetching && <PlaceSearchItemHolder />}
      <ListEnd active={loader.isEnd && !loader.isError} onRetry={doSearch} />
      <ErrorRetry active={loader.isError} onRetry={doSearch} />
    </Stack>
  );
});

export default MyPlace;
