import React, { useCallback, useEffect, useRef, useState } from "react";
import { Divider, Stack, StackProps } from "@mui/material";
import {
  IFoodPostExposed,
  IFoodSearchParams,
  IPagination,
  IPlaceExposed,
  OrderState,
  SystemSide,
  loadFromSessionStorage,
  saveToSessionStorage,
} from "../../../data";
import {
  useAppContentContext,
  useAuthContext,
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

  const [foods, setFoods] = useState<IFoodPostExposed[]>([]);

  const progessContext = usePageProgessContext();
  const authContext = useAuthContext();
  const { auth, account } = authContext;
  const appContentContext = useAppContentContext();
  const loader = useLoader();
  const dirtyRef = useRef<boolean>(true);

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
          element.scrollTop + element.clientHeight === element.scrollHeight;

        if (isAtBottom && !loader.isEnd && !loader.isError) {
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
  }, [appContentContext.mainRef, doSearch, loader.isEnd, loader.isError]);

  const doSaveStorage = () => {
    const snapshot: IPlaceViewerSharedSnapshotData = {
      data: foods,
      scrollTop: appContentContext.mainRef?.current?.scrollTop,
    };
    saveToSessionStorage(snapshot, {
      key: PLACE_VIEWER_SHARED(place._id),
      account: authContext.account?._id,
    });
  };

  const handleBeforeNavigate = () => {
    doSaveStorage();
  };

  // Recover result
  useEffect(() => {
    if (account == null) return;
    if (!active) return;
    if (dirtyRef.current) {
      dirtyRef.current = false;
      // At begining
      const snapshot = loadFromSessionStorage<IPlaceViewerSharedSnapshotData>({
        key: PLACE_VIEWER_SHARED(place._id),
        maxDuration: 1 * 24 * 60 * 60 * 1000,
        account: account._id,
      });
      if (snapshot) {
        const snapshotData = snapshot.data;
        setFoods(snapshotData);
        if (snapshotData.length < 24) {
          loader.setIsEnd(true);
        }
        const mainRef = appContentContext.mainRef?.current;
        if (mainRef) {
          setTimeout(() => {
            mainRef.scrollTop = snapshot.scrollTop ?? 0;
          }, 300);
        }
      } else {
        doSearch();
      }
    }
  }, [account, active, appContentContext.mainRef, doSearch, loader, place._id]);

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
