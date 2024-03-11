import React, { useCallback, useEffect, useRef, useState } from "react";
import { Divider, Stack, StackProps } from "@mui/material";
import {
  IFoodPostExposed,
  IFoodSearchParams,
  IPagination,
  IUserExposed,
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

type UserViewerSharedProps = StackProps & {
  user: IUserExposed;
  active: boolean;
};

interface IUserViewerSharedSnapshotData {
  data: IFoodPostExposed[];
  scrollTop?: number;
}

const USER_VIEWER_SHARED = (userId: string) => `user.viewer@${userId}.shared`;

const UserViewerShared = React.forwardRef<
  HTMLDivElement,
  UserViewerSharedProps
>((props, ref) => {
  const { user, active, ...rest } = props;

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
      user: {
        include: [user._id],
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
  }, [active, auth, foods, loader, user._id, progessContext]);

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
    const snapshot: IUserViewerSharedSnapshotData = {
      data: foods,
      scrollTop: appContentContext.mainRef?.current?.scrollTop,
    };
    saveToSessionStorage(snapshot, {
      key: USER_VIEWER_SHARED(user._id),
      account: authContext.account?.id_,
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
      const snapshot = loadFromSessionStorage<IUserViewerSharedSnapshotData>({
        key: USER_VIEWER_SHARED(user._id),
        maxDuration: 1 * 24 * 60 * 60 * 1000,
        account: account.id_,
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
  }, [account, active, appContentContext.mainRef, doSearch, loader, user._id]);

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
              source={SystemSide.USER}
            />
            <Divider variant="middle" />
          </>
        );
      })}

      {loader.isFetching && <SharedFoodHolder />}

      <SearchMore
        active={loader.isEnd && !loader.isError}
        onSearchMore={doSearch}
      />

      <ErrorRetry active={loader.isError} onRetry={doSearch} />
    </Stack>
  );
});

export default UserViewerShared;
