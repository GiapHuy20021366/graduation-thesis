import React, { useCallback, useEffect, useState } from "react";
import { Divider, Stack, StackProps } from "@mui/material";
import { IPagination, IUserFollowerExposed } from "../../../data";
import {
  useAppContentContext,
  useAuthContext,
  useDirty,
  useDynamicStorage,
  useLoader,
  usePageProgessContext,
  useUserViewerContext,
} from "../../../hooks";
import { userFetcher } from "../../../api";
import SubcriberHolder from "../../common/viewer/holder/SubcriberHolder";
import SubcriberExposed from "../../common/viewer/data/SubcriberExposed";
import SearchMore from "../../common/viewer/data/SearchMore";
import ErrorRetry from "../../common/viewer/data/ErrorRetry";

type UserViewerSubcribedProps = StackProps & {
  active: boolean;
};

interface IUserViewerSubcribedSnapshotData {
  data: IUserFollowerExposed[];
  scrollTop?: number;
}

const USER_VIEWER_SUBCRIBED = (userId: string) =>
  `user.viewer@${userId}.subcribed`;

const UserViewerSubcribed = React.forwardRef<
  HTMLDivElement,
  UserViewerSubcribedProps
>((props, ref) => {
  const { active, ...rest } = props;
  const viewerContext = useUserViewerContext();
  const { _id } = viewerContext;

  const storage = useDynamicStorage<IUserViewerSubcribedSnapshotData>(
    USER_VIEWER_SUBCRIBED(_id)
  );
  const stored = storage.get();

  const [followers, setFollowers] = useState<IUserFollowerExposed[]>(
    stored?.data ?? []
  );

  const progessContext = usePageProgessContext();
  const authContext = useAuthContext();
  const { auth, account } = authContext;
  const appContentContext = useAppContentContext();

  const loader = useLoader();

  const doSaveStorage = useCallback(() => {
    const snapshot: IUserViewerSubcribedSnapshotData = {
      data: followers,
      scrollTop: appContentContext.mainRef?.current?.scrollTop,
    };
    storage.update(() => snapshot);
    storage.save();
  }, [appContentContext.mainRef, followers, storage]);

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

    userFetcher
      .getUserFollowers(
        _id,
        { pagination: pagination, populate: { subcriber: true } },
        auth
      )
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
  }, [active, auth, followers, loader, _id, progessContext]);

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
      minHeight={"60vh"}
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

export default UserViewerSubcribed;
