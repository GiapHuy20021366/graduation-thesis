import React, { useCallback, useEffect, useState } from "react";
import { Stack, StackProps } from "@mui/material";
import {
  IFoodPostExposed,
  IFoodSearchParams,
  IPagination,
  OrderState,
} from "../../../data";
import {
  useAppContentContext,
  useAuthContext,
  usePageProgessContext,
  useLoader,
  useDynamicStorage,
  useDirty,
} from "../../../hooks";
import { foodFetcher } from "../../../api";
import MyFoodItemHolder from "./MyFoodItemHolder";
import MyFoodItem from "./MyFoodItem";
import ErrorRetry from "../../common/viewer/data/ErrorRetry";
import ListEnd from "../../common/viewer/data/ListEnd";

type MyFoodProps = StackProps & {
  active?: boolean;
};

interface IMyFoodSnapshotData {
  data: IFoodPostExposed[];
  scrollTop?: number;
}

const MY_FOOD_STORAGE_KEY = "my.food";

const MyFood = React.forwardRef<HTMLDivElement, MyFoodProps>((props, ref) => {
  const { active, ...rest } = props;

  const storage = useDynamicStorage<IMyFoodSnapshotData>(MY_FOOD_STORAGE_KEY);
  const stored = storage.get();

  const [data, setData] = useState<IFoodPostExposed[]>(stored?.data ?? []);
  const appContentContext = useAppContentContext();
  const authContext = useAuthContext();
  const { auth, account } = authContext;
  const progessContext = usePageProgessContext();
  const loader = useLoader();

  const doSaveStorage = useCallback(() => {
    const snapshot: IMyFoodSnapshotData = {
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
    if (auth == null || account == null) return;
    if (loader.isFetching || !active) return;

    const pagination: IPagination = {
      skip: data.length,
      limit: 24,
    };

    const params: IFoodSearchParams = {
      user: {
        include: [account._id],
      },
      order: {
        time: OrderState.DECREASE,
      },
      pagination: pagination,
    };

    progessContext.start();
    loader.setIsFetching(true);
    loader.setIsError(false);
    loader.setIsEnd(false);

    foodFetcher
      .searchFood(params, auth)
      .then((res) => {
        const foods = res.data;
        if (foods != null) {
          if (foods.length < pagination.limit) {
            loader.setIsEnd(true);
          }
          const _newFoods = data.slice();
          _newFoods.push(...foods);
          setData(_newFoods);
        }
      })
      .catch(() => {
        loader.setIsError(true);
      })
      .finally(() => {
        progessContext.end();
        loader.setIsFetching(false);
      });
  }, [auth, account, loader, active, data, progessContext]);

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
      {data.map((food, index) => {
        return (
          <MyFoodItem
            item={food}
            key={index}
            onBeforeNavigate={handleBeforeNavigate}
          />
        );
      })}

      {loader.isFetching && <MyFoodItemHolder />}
      <ListEnd active={loader.isEnd && !loader.isError} onRetry={doSearch} />

      <ErrorRetry active={loader.isError} onRetry={doSearch} />
    </Stack>
  );
});

export default MyFood;
