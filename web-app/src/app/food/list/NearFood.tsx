import React, { useCallback, useEffect, useRef, useState } from "react";
import { Stack, StackProps } from "@mui/material";
import {
  IFoodPostExposed,
  IFoodSearchParams,
  IPagination,
  OrderState,
  loadFromSessionStorage,
  saveToSessionStorage,
} from "../../../data";
import {
  useAppContentContext,
  useAuthContext,
  usePageProgessContext,
  useLoader,
  useDistanceCalculation,
} from "../../../hooks";
import { foodFetcher } from "../../../api";
import MyFoodItemHolder from "./MyFoodItemHolder";
import FoodSearchItem from "../search/FoodSearchItem";
import ErrorRetry from "../../common/viewer/data/ErrorRetry";
import ListEnd from "../../common/viewer/data/ListEnd";

type NearFoodProps = StackProps & {
  active?: boolean;
};

interface INearFoodSnapshotData {
  data: IFoodPostExposed[];
  scrollTop?: number;
}

const NEAR_FOOD_STORAGE_KEY = "near.food";

const NearFood = React.forwardRef<HTMLDivElement, NearFoodProps>(
  (props, ref) => {
    const { active, ...rest } = props;

    const [data, setData] = useState<IFoodPostExposed[]>([]);
    const appContentContext = useAppContentContext();
    const authContext = useAuthContext();
    const { auth, account } = authContext;
    const progessContext = usePageProgessContext();
    const loader = useLoader();
    const dirtyRef = useRef<boolean>(false);
    const distances = useDistanceCalculation();

    const doSaveStorage = () => {
      const snapshot: INearFoodSnapshotData = {
        data: data,
        scrollTop: appContentContext.mainRef?.current?.scrollTop,
      };
      saveToSessionStorage(snapshot, {
        key: NEAR_FOOD_STORAGE_KEY,
        account: authContext.account?._id,
      });
    };

    const handleBeforeNavigate = () => {
      doSaveStorage();
    };

    const doSearch = useCallback(() => {
      if (auth == null || account == null) return;
      const current = distances.currentLocation?.coordinates;
      if (current == null) return;
      if (loader.isFetching || !active) return;

      const pagination: IPagination = {
        skip: data.length,
        limit: 24,
      };

      const params: IFoodSearchParams = {
        user: {
          exclude: [account._id],
        },
        order: {
          distance: OrderState.INCREASE,
        },
        distance: {
          current: current,
          max: Number.MAX_SAFE_INTEGER,
        },
        pagination: pagination,
        active: true,
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
    }, [
      auth,
      account,
      distances.currentLocation,
      loader,
      active,
      data,
      progessContext,
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
        const snapshot = loadFromSessionStorage<INearFoodSnapshotData>({
          key: NEAR_FOOD_STORAGE_KEY,
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
          const current = distances.currentLocation?.coordinates;
          if (current) {
            doSearch();
          } else {
            dirtyRef.current = false;
          }
        }
      }
    }, [
      account,
      active,
      appContentContext.mainRef,
      distances.currentLocation,
      doSearch,
      loader,
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

export default NearFood;
