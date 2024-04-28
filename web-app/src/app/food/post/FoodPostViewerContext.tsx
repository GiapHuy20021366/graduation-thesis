import React, { createContext, useState } from "react";
import { IFoodPostExposed, IFoodPostExposedWithLike } from "../../../data";
import {
  useAuthContext,
  useComponentLanguage,
  useToastContext,
} from "../../../hooks";
import { foodFetcher } from "../../../api";

interface IFoodPostViewerContextProviderProps {
  children?: React.ReactNode;
  foodPost: IFoodPostExposedWithLike;
}

interface IFoodPostViewerContext {
  food: IFoodPostExposedWithLike;
  activeFood: () => void;
  resolveFood: (resolvedBy?: string) => void;
  likeFood: () => void;
  editable: boolean;
}

export const FoodPostViewerContext = createContext<IFoodPostViewerContext>({
  food: {} as IFoodPostExposedWithLike,
  activeFood: () => {},
  resolveFood: () => {},
  likeFood: () => {},
  editable: false,
});

const isEditable = (food: IFoodPostExposed, accountId?: string): boolean => {
  const id = typeof food.user === "string" ? food.user : food.user._id;
  return id === accountId;
};

export default function FoodPostViewerContextProvider({
  children,
  foodPost,
}: IFoodPostViewerContextProviderProps) {
  const [food, setFood] = useState<IFoodPostExposedWithLike>(foodPost);

  const authContext = useAuthContext();
  const { auth, account } = authContext;
  const toast = useToastContext();
  const lang = useComponentLanguage();

  const activeFood = () => {
    if (auth == null) return;
    const { _id, active } = food;
    foodFetcher
      .activeFood(_id, auth, !active)
      .then((res) => {
        const data = res.data;
        if (data) {
          setFood({
            ...food,
            active: data.active,
          });
        }
      })
      .catch(() => {
        toast.error(lang(active ? "cannot-hide" : "cannot-unhide"));
      });
  };

  const resolveFood = (resolvedBy?: string) => {
    if (auth == null || account == null) return;
    const { _id, resolved } = food;
    foodFetcher
      .resolveFood(_id, auth, resolved ? resolvedBy : resolvedBy ?? account._id)
      .then((res) => {
        const data = res.data;
        if (data) {
          setFood({
            ...food,
            resolved: data.resolved ?? false,
            resolveBy: data.resolveBy,
            resolveTime: data.resolveTime,
          });
        }
      })
      .catch(() => {
        toast.error(lang(resolved ? "cannot-unresolve" : "cannot-resolve"));
      });
  };

  const likeFood = () => {
    if (auth == null) return;
    const liked = food.liked;
    foodFetcher.likeFood(food._id, liked ? "UNLIKE" : "LIKE", auth).then(() => {
      let newCount: number = food.likeCount;
      if (food.like != null && liked) {
        newCount--;
      } else if (food.like != null && !liked) {
        newCount++;
      }
      setFood({
        ...food,
        liked: !liked,
        likeCount: newCount,
      });
    });
  };

  const editable = isEditable(food, account?._id);

  return (
    <FoodPostViewerContext.Provider
      value={{
        activeFood,
        food,
        resolveFood,
        likeFood,
        editable,
      }}
    >
      {children}
    </FoodPostViewerContext.Provider>
  );
}
