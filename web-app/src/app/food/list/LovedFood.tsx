import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  SpeedDial,
  Stack,
  StackProps,
  Typography,
} from "@mui/material";
import { AddOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router";
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
  useDistanceCalculation,
} from "../../../hooks";
import { foodFetcher } from "../../../api";
import MyFoodItemHolder from "./MyFoodItemHolder";
import FoodSearchItem from "../search/FoodSearchItem";

type LovedFoodProps = StackProps & {
  active?: boolean;
};

interface ILovedFoodSnapshotData {
  data: IFoodPostExposedWithLike[];
  scrollTop?: number;
}

const LOVED_FOOD_STORAGE_KEY = "near.food";

const LovedFood = React.forwardRef<HTMLDivElement, LovedFoodProps>(
  (props, ref) => {
    const { active, ...rest } = props;

    const navigate = useNavigate();
    const [data, setData] = useState<IFoodPostExposedWithLike[]>([]);
    const appContentContext = useAppContentContext();
    const authContext = useAuthContext();
    const { auth, account } = authContext;
    const progessContext = usePageProgessContext();
    const loader = useLoader();
    const dirtyRef = useRef<boolean>(false);
    const distances = useDistanceCalculation();

    const doSaveStorage = () => {
      const snapshot: ILovedFoodSnapshotData = {
        data: data,
        scrollTop: appContentContext.mainRef?.current?.scrollTop,
      };
      saveToSessionStorage(snapshot, {
        key: LOVED_FOOD_STORAGE_KEY,
        account: authContext.account?.id_,
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

      progessContext.start();
      loader.setIsFetching(true);
      loader.setIsError(false);
      loader.setIsEnd(false);

      foodFetcher
        .getLikedFood(account.id_, auth, pagination)
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
        // At begining
        const snapshot = loadFromSessionStorage<ILovedFoodSnapshotData>({
          key: LOVED_FOOD_STORAGE_KEY,
          maxDuration: 1 * 24 * 60 * 60 * 1000,
          account: account.id_,
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
        {loader.isEnd && !loader.isError && (
          <Box textAlign={"center"} mt={2}>
            <Typography>Bạn đã tìm kiếm hết</Typography>
            <Button onClick={() => doSearch()}>Tìm kiếm thêm</Button>
          </Box>
        )}
        {loader.isError && (
          <Box textAlign={"center"} mt={2}>
            <Typography>Có lỗi xảy ra</Typography>
            <Button onClick={() => doSearch()}>Thử lại</Button>
          </Box>
        )}
        <SpeedDial
          icon={<AddOutlined />}
          ariaLabel={"search"}
          sx={{ position: "absolute", bottom: 196, right: 26 }}
          onClick={() => navigate("/food/sharing")}
        />
      </Stack>
    );
  }
);

export default LovedFood;
