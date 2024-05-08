import React, { useCallback, useEffect, useState } from "react";
import { Divider, Stack, StackProps } from "@mui/material";
import {
  IFoodPostExposed,
  IFoodSearchParams,
  IPagination,
  IPlaceExposed,
  OrderState,
  SystemSide,
} from "../../../data";
import {
  useAppContentContext,
  useAuthContext,
  useDirty,
  useDynamicStorage,
  useLoader,
  usePageProgessContext,
} from "../../../hooks";
import { foodFetcher } from "../../../api";
import SharedFood from "../../common/viewer/data/SharedFood";
import SharedFoodHolder from "../../common/viewer/holder/SharedFoodHolder";
import ErrorRetry from "../../common/viewer/data/ErrorRetry";
import SearchMore from "../../common/viewer/data/SearchMore";

type PlaceViewerSharedProps = StackProps & {
  place: IPlaceExposed;
  active: boolean;
};

interface IPlaceViewerSharedSnapshotData {
  data: IFoodPostExposed[];
  scrollTop?: number;
}

const PLACE_VIEWER_SHARED = (placeId: string) =>
  `place.viewer@${placeId}.shared`;

const PlaceViewerShared = React.forwardRef<
  HTMLDivElement,
  PlaceViewerSharedProps
>((props, ref) => {
  const { place, active, ...rest } = props;

  const storage = useDynamicStorage<IPlaceViewerSharedSnapshotData>(
    PLACE_VIEWER_SHARED(place._id)
  );
  const stored = storage.get();

  const [foods, setFoods] = useState<IFoodPostExposed[]>(stored?.data ?? []);

  const progessContext = usePageProgessContext();
  const authContext = useAuthContext();
  const { auth, account } = authContext;
  const appContentContext = useAppContentContext();
  const loader = useLoader();

  const doSaveStorage = useCallback(() => {
    const snapshot: IPlaceViewerSharedSnapshotData = {
      data: foods,
      scrollTop: appContentContext.mainRef?.current?.scrollTop,
    };
    storage.update(() => snapshot);
    storage.save();
  }, [appContentContext.mainRef, foods, storage]);

  const handleBeforeNavigate = () => {
    doSaveStorage();
  };

  const doSearch = useCallback(() => {
    if (auth == null) return;
    if (loader.isFetching || !active) return;

    const pagination: IPagination = {
      skip: foods.length,
      limit: 24,
    };

    progessContext.start();
    loader.setIsFetching(true);
    loader.setIsError(false);
    loader.setIsEnd(false);

    const searchParams: IFoodSearchParams = {
      pagination: pagination,
      order: {
        time: OrderState.DECREASE,
      },
      place: {
        include: [place._id],
      },
    };

    foodFetcher
      .searchFood(searchParams, auth)
      .then((res) => {
        const data = res.data;
        if (data != null) {
          if (data.length < pagination.limit) {
            loader.setIsEnd(true);
          }
          const _newData = foods.slice();
          _newData.push(...data);
          setFoods(_newData);
        }
      })
      .catch(() => {
        loader.setIsError(true);
      })
      .finally(() => {
        loader.setIsFetching(false);
        progessContext.end();
      });
  }, [active, auth, foods, loader, place._id, progessContext]);

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
      }}
      display={active ? "flex" : "none"}
    >
      {foods.map((food) => {
        return (
          <>
            <SharedFood
              py={1}
              data={food}
              key={food._id}
              onBeforeNavigate={handleBeforeNavigate}
              source={SystemSide.PLACE}
            />
            <Divider variant="middle" />
          </>
        );
      })}

      {progessContext.isLoading && <SharedFoodHolder />}

      <SearchMore
        active={loader.isEnd && !loader.isError}
        onSearchMore={doSearch}
      />

      <ErrorRetry active={loader.isError} onRetry={doSearch} />
    </Stack>
  );
});

export default PlaceViewerShared;
