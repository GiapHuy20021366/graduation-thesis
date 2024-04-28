import React, { createContext, useEffect, useState } from "react";
import { IFoodPostExposed, IFoodPostExposedWithLike } from "../../../data";
import { useAuthContext, useLoading } from "../../../hooks";
import { foodFetcher } from "../../../api";
import { useParams } from "react-router";

interface IFoodPostViewerIdHigherContextProviderProps {
  children?: React.ReactNode;
  id?: string;
}

interface IFoodPostViewerIdHigherContext {
  found: boolean;
  isLoading: boolean;
  accessable: boolean;
  data?: IFoodPostExposedWithLike;
  bounded: boolean;
}

export const FoodPostViewerIdHigherContext =
  createContext<IFoodPostViewerIdHigherContext>({
    accessable: true,
    found: true,
    isLoading: false,
    bounded: false,
  });

const toUserId = (food: IFoodPostExposed): string => {
  const user = food.user;
  return typeof user === "string" ? user : user._id;
};

export default function FoodPostViewerIdHigherContextProvider({
  children,
  id,
}: IFoodPostViewerIdHigherContextProviderProps) {
  const params = useParams();
  const authContext = useAuthContext();
  const { auth, account } = authContext;
  const loading = useLoading();
  const [data, setData] = useState<IFoodPostExposedWithLike>();
  const [found, setFound] = useState<boolean>(true);

  const fetchingFood = (id: string) => {
    if (auth != null) {
      loading.active();
      foodFetcher
        .getFoodPost(id, auth)
        .then((data) => {
          setFound(true);
          setData(data.data);
        })
        .catch(() => {
          setFound(false);
        })
        .finally(() => {
          loading.deactive();
        });
    }
  };

  useEffect(() => {
    const foodPostId = id ?? params.id;
    if (foodPostId != null) {
      fetchingFood(foodPostId);
    } else {
      setFound(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const accessable = data && (data.active || toUserId(data) === account?._id);

  return (
    <FoodPostViewerIdHigherContext.Provider
      value={{
        accessable: accessable ?? false,
        found,
        isLoading: loading.isActice,
        data,
        bounded: true,
      }}
    >
      {children}
    </FoodPostViewerIdHigherContext.Provider>
  );
}
