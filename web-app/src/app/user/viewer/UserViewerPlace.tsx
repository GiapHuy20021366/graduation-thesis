import React, { useCallback, useEffect, useRef, useState } from "react";
import { SpeedDial, Stack, StackProps } from "@mui/material";
import { AddOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router";
import {
  useAppContentContext,
  useAuthContext,
  useDistanceCalculation,
  useLoader,
  usePageProgessContext,
} from "../../../hooks";
import {
  IPagination,
  IPlaceExposedCooked,
  IUserExposed,
  loadFromSessionStorage,
  saveToSessionStorage,
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
  user: IUserExposed;
  active: boolean;
};

const UserViewerPlace = React.forwardRef<HTMLDivElement, UserViewerPlaceProps>((props, ref) => {
  const navigate = useNavigate();
  const { active, user, ...rest } = props;

  const [data, setData] = useState<IPlaceExposedCooked[]>([]);

  const appContentContext = useAppContentContext();
  const authContext = useAuthContext();
  const progessContext = usePageProgessContext();
  const distances = useDistanceCalculation();

  const { auth, account } = authContext;

  const loader = useLoader();

  // Recover at begining or fetch at begining
  const dirtyRef = useRef<boolean>(false);

  const doSaveStorage = () => {
    const snapshot: IUserViewerPlaceSnapshotData = {
      data: data,
      scrollTop: appContentContext.mainRef?.current?.scrollTop,
    };
    saveToSessionStorage(snapshot, {
      key: USER_VIEWER_PLACE(user._id),
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
          author: user._id,
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
                currentCoordinates: distances.currentLocation?.coordinates,
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
    user._id,
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

        if (isAtBottom && !loader.isEnd) {
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
  }, [appContentContext.mainRef, doSearch, loader.isEnd]);

  // Recover result
  useEffect(() => {
    if (account == null) return;
    if (!active) return;
    if (!dirtyRef.current) {
      dirtyRef.current = true;
      // At begining
      const snapshot = loadFromSessionStorage<IUserViewerPlaceSnapshotData>({
        key: USER_VIEWER_PLACE(user._id),
        maxDuration: 1 * 24 * 60 * 60 * 1000,
        account: account._id,
      });
      if (snapshot) {
        const snapshotData = snapshot.data;
        setData(snapshotData);
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
  }, [account, active, appContentContext.mainRef, doSearch, loader, user._id]);

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
      <SpeedDial
        icon={<AddOutlined />}
        sx={{ position: "absolute", bottom: 136, right: 26 }}
        ariaLabel={"Create"}
        onClick={() => navigate("/place/update")}
      />

      {loader.isFetching && <PlaceSearchItemHolder />}

      <SearchMore
        active={loader.isEnd && !loader.isError}
        onSearchMore={doSearch}
      />

      <ErrorRetry active={loader.isError} onRetry={doSearch} />
    </Stack>
  );
});

export default UserViewerPlace;
