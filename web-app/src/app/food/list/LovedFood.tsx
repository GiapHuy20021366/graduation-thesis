import React, { useCallback, useEffect, useRef, useState } from "react";
import { Stack, StackProps } from "@mui/material";
import {
  IFoodPostExposedWithLike,
  IPagination,
  loadFromSessionStorage,
  saveToSessionStorage,
} from "../../../data";
import {
  useAppContentContext,
  useAuthContext,
  usePageProgessContext,
  useLoader,
} from "../../../hooks";
import { foodFetcher } from "../../../api";
import MyFoodItemHolder from "./MyFoodItemHolder";
import FoodSearchItem from "../search/FoodSearchItem";
import ListEnd from "../../common/viewer/data/ListEnd";
import ErrorRetry from "../../common/viewer/data/ErrorRetry";

type LovedFoodProps = StackProps & {
  active?: boolean;
};

interface ILovedFoodSnapshotData {
  data: IFoodPostExposedWithLike[];
  scrollTop?: number;
}

const LOVED_FOOD_STORAGE_KEY = "loved.food";

const LovedFood = React.forwardRef<HTMLDivElement, LovedFoodProps>(
  (props, ref) => {
    const { active, ...rest } = props;

    const [data, setData] = useState<IFoodPostExposedWithLike[]>([]);
    const appContentContext = useAppContentContext();
    const authContext = useAuthContext();
    const { auth, account } = authContext;
    const progessContext = usePageProgessContext();
    const loader = useLoader();
    const dirtyRef = useRef<boolean>(false);

    const doSaveStorage = () => {
      const snapshot: ILovedFoodSnapshotData = {
        data: data,
        scrollTop: appContentContext.mainRef?.current?.scrollTop,
      };
      saveToSessionStorage(snapshot, {
        key: LOVED_FOOD_STORAGE_KEY,
        account: authContext.account?._id,
      });
    };

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

      progessContext.start();
      loader.setIsFetching(true);
      loader.setIsError(false);
      loader.setIsEnd(false);

      foodFetcher
        .getLikedFood(account._id, auth, pagination)
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

    // Recover result
    useEffect(() => {
      if (account == null) return;
      if (!active) return;
      if (!dirtyRef.current) {
        // At begining
        const snapshot = loadFromSessionStorage<ILovedFoodSnapshotData>({
          key: LOVED_FOOD_STORAGE_KEY,
          maxDuration: 1 * 24 * 60 * 60 * 1000,
          account: account._id,
        });
        if (snapshot) {
          const snapshotData = snapshot.data;
          if (snapshotData.length < 24) {
            loader.setIsEnd(true);
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
    }, [account, active, appContentContext.mainRef, doSearch, loader]);

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
            <FoodSearchItem
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
  }
);

export default LovedFood;
