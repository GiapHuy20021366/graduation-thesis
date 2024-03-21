import { Model, Schema, model, ObjectId, SchemaTypes } from "mongoose";
import collections from "../collections";
import { IFoodUserLike, Timed } from "../../data";

export interface IIFoodUserLikeSchema
  extends Omit<IFoodUserLike, "foodPost">,
    Pick<Timed, "createdAt"> {
  foodPost: ObjectId;
}

interface IFoodUserLikeMethods {}

interface IFoodUserLikeModel
  extends Model<IIFoodUserLikeSchema, {}, IFoodUserLikeMethods> {}

const foodUserLikeSchema = new Schema<
  IIFoodUserLikeSchema,
  IFoodUserLikeModel,
  IFoodUserLikeMethods
>({
  user: {
    type: String,
    required: true,
    index: true,
  },
  foodPost: {
    type: SchemaTypes.ObjectId,
    required: true,
    index: true,
    ref: "FoodPost",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Statics

// Methods

export const FoodUserLike = model<IIFoodUserLikeSchema, IFoodUserLikeModel>(
  "FoodUserLike",
  foodUserLikeSchema,
  collections.foodUserLike
);

export default FoodUserLike;
