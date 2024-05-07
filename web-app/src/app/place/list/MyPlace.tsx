import React, { useCallback, useEffect, useRef, useState } from "react";
import { Stack, StackProps } from "@mui/material";
import {
  useAppContentContext,
  useAuthContext,
  useDistanceCalculation,
  usePageProgessContext,
} from "../../../hooks";
import {
  IPagination,
  IPlaceExposedCooked,
  loadFromSessionStorage,
  saveToSessionStorage,
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
    const snapshot: IMyPlaceSnapshotData = {
      data: data,
      scrollTop: appContentContext.mainRef?.current?.scrollTop,
    };
    saveToSessionStorage(snapshot, {
      key: MY_PLACE_STORAGE_KEY,
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
            setIsEnd(true);
          }

          const _newData = data.slice();
          places.forEach((place) => {
            _newData.push(
              toPlaceExposedCooked(place, {
                currentCoordinates: distances.currentLocation?.coordinates,
                homeCoordinates: account?.location?.coordinates,
              })
            );
          });

          setData(_newData);
        }
      })
      .catch(() => {
        setIsError(true);
      })
      .finally(() => {
        setIsFetching(false);
        progessContext.end();
      });
  }, [
    auth,
    isFetching,
    active,
    data,
    progessContext,
    account,
    distances.currentLocation,
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
        if (isAtBottom && !isEnd && !isFetching) {
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
  }, [appContentContext.mainRef, doSearch, isEnd, isFetching]);

  // Recover result
  useEffect(() => {
    if (account == null) return;
    if (!active) return;
    if (!dirtyRef.current) {
      dirtyRef.current = true;
      // At begining
      const snapshot = loadFromSessionStorage<IMyPlaceSnapshotData>({
        key: MY_PLACE_STORAGE_KEY,
        maxDuration: 1 * 24 * 60 * 60 * 1000,
        account: account._id,
      });
      if (snapshot) {
        const snapshotData = snapshot.data;
        setData(snapshotData);
        if (snapshotData.length < 24) {
          setIsEnd(true);
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
          <PlaceListItemMine
            data={place}
            key={index}
            onBeforeNavigate={handleBeforeNavigate}
            boxShadow={1}
          />
        );
      })}

      {isFetching && <PlaceSearchItemHolder />}
      <ListEnd active={isEnd && !isError} onRetry={doSearch} />
      <ErrorRetry active={isError} onRetry={doSearch} />
    </Stack>
  );
});

export default MyPlace;
