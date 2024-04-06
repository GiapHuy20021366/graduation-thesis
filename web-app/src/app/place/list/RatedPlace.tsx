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
      const snapshot: IRatedPlaceSnapshotData = {
        data: data,
        scrollTop: appContentContext.mainRef?.current?.scrollTop,
      };
      saveToSessionStorage(snapshot, {
        key: RATED_PLACE_STORAGE_KEY,
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
        .getRatedPlace(authContext.account!._id, pagination, auth)
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
      authContext.account,
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
        const snapshot = loadFromSessionStorage<IRatedPlaceSnapshotData>({
          key: RATED_PLACE_STORAGE_KEY,
          account: account._id,
          maxDuration: 1 * 24 * 60 * 60 * 1000,
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
            <RatedPlaceItem
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
  }
);

export default RatedPlace;
