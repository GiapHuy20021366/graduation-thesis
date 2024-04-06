import React, { useCallback, useEffect, useRef, useState } from "react";
import { Divider, Stack, StackProps } from "@mui/material";
import {
  IFollowerSearchParams,
  IPagination,
  IPlaceExposed,
  IPlaceFollowerExposed,
  loadFromSessionStorage,
  saveToSessionStorage,
} from "../../../data";
import {
  useAppContentContext,
  useAuthContext,
  useLoader,
  usePageProgessContext,
} from "../../../hooks";
import { userFetcher } from "../../../api";
import SubcriberHolder from "../../common/viewer/holder/SubcriberHolder";
import SubcriberExposed from "../../common/viewer/data/SubcriberExposed";
import SearchMore from "../../common/viewer/data/SearchMore";
import ErrorRetry from "../../common/viewer/data/ErrorRetry";

type PlaceViewerSubcribedProps = StackProps & {
  place: IPlaceExposed;
  active: boolean;
};

interface IPlaceViewerSubcribedSnapshotData {
  data: IPlaceFollowerExposed[];
  scrollTop?: number;
}

const PLACE_VIEWER_SUBCRIBED = (placeId: string) =>
  `place.viewer@${placeId}.subcribed`;

const PlaceViewerSubcribed = React.forwardRef<
  HTMLDivElement,
  PlaceViewerSubcribedProps
>((props, ref) => {
  const { place, active, ...rest } = props;

  const [followers, setFollowers] = useState<IPlaceFollowerExposed[]>([]);

  const progessContext = usePageProgessContext();
  const authContext = useAuthContext();
  const { auth, account } = authContext;
  const appContentContext = useAppContentContext();

  const loader = useLoader();

  // Recover at begining or fetch at begining
  const dirtyRef = useRef<boolean>(true);

  const doSaveStorage = () => {
    const snapshot: IPlaceViewerSubcribedSnapshotData = {
      data: followers,
      scrollTop: appContentContext.mainRef?.current?.scrollTop,
    };
    saveToSessionStorage(snapshot, {
      key: PLACE_VIEWER_SUBCRIBED(place._id),
      account: authContext.account?._id,
    });
  };

  const handleBeforeNavigate = () => {
    doSaveStorage();
  };

  const doSearch = useCallback(() => {
    if (auth == null) return;
    if (loader.isFetching || !active) return;

    const pagination: IPagination = {
      skip: followers.length,
      limit: 24,
    };

    progessContext.start();
    loader.setIsFetching(true);
    loader.setIsError(false);
    loader.setIsEnd(false);

    const params: IFollowerSearchParams = {
      pagination: pagination,
      populate: {
        subcriber: true,
      },
    };

    userFetcher
      .getPlaceFollowers(place._id, params, auth)
      .then((res) => {
        const data = res.data;
        if (data != null) {
          if (data.length < pagination.limit) {
            loader.setIsEnd(true);
          }
          const _newData = followers.slice();
          _newData.push(...data);
          setFollowers(_newData);
        }
      })
      .catch(() => {
        loader.setIsError(true);
      })
      .finally(() => {
        loader.setIsFetching(false);
        progessContext.end();
      });
  }, [active, auth, followers, loader, place._id, progessContext]);

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

  // Recover result
  useEffect(() => {
    if (account == null) return;
    if (!active) return;
    if (dirtyRef.current) {
      dirtyRef.current = false;
      // At begining
      const snapshot =
        loadFromSessionStorage<IPlaceViewerSubcribedSnapshotData>({
          key: PLACE_VIEWER_SUBCRIBED(place._id),
          maxDuration: 1 * 24 * 60 * 60 * 1000,
          account: account._id,
        });
      if (snapshot) {
        const snapshotData = snapshot.data;
        setFollowers(snapshotData);
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
      {...rest}
      sx={{
        width: "100%",
        ...(props.sx ?? {}),
      }}
      display={active ? "flex" : "none"}
    >
      {followers.map((follower) => {
        return (
          <>
            <SubcriberExposed
              py={1}
              data={follower}
              key={follower._id}
              onBeforeNavigate={handleBeforeNavigate}
            />
            <Divider variant="middle" />
          </>
        );
      })}

      {loader.isFetching && <SubcriberHolder />}

      <SearchMore
        active={loader.isEnd && !loader.isError}
        onSearchMore={doSearch}
      />

      <ErrorRetry active={loader.isError} onRetry={doSearch} />
    </Stack>
  );
});

export default PlaceViewerSubcribed;
