import {
  Model,
  Schema,
  model,
  Document,
  ObjectId,
  SchemaTypes,
} from "mongoose";
import collections from "../collections";
import { IFoodUserLike } from "../../data";

export interface FoodUserLikeDocument
  extends Omit<IFoodUserLike, "foodPost">,
    Document {
  createdAt: Date;
  foodPost: ObjectId;
}

interface IFoodUserLikeMethods {}

interface IFoodUserLikeModel
  extends Model<FoodUserLikeDocument, {}, IFoodUserLikeMethods> {}

const foodUserLikeSchema = new Schema<
  FoodUserLikeDocument,
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

export const FoodUserLike = model<FoodUserLikeDocument, IFoodUserLikeModel>(
  "FoodUserLike",
  foodUserLikeSchema,
  collections.foodUserLike
);

export default FoodUserLike;
