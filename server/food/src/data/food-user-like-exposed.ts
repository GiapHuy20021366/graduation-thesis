import { HydratedDocument } from "mongoose";
import { IFoodUserLike } from "./food-user-like";
import { Ided, Timed } from "./schemad";
import { IFoodUserLikeSchema } from "../db/model";

export interface IFoodUserLikeExposed
  extends IFoodUserLike,
    Ided,
    Pick<Timed, "createdAt"> {}

export const toFoodUserLikeExposed = (
  data: HydratedDocument<IFoodUserLikeSchema>
): IFoodUserLikeExposed => {
  return {
    _id: data._id.toString(),
    createdAt: data.createdAt,
    foodPost: data.foodPost.toString(),
    user: data.user,
  };
};
