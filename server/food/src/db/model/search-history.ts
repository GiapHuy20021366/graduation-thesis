import { Model, Schema, model } from "mongoose";
import collections from "../collections";
import { IFoodSearchHistory, Timed } from "../../data";

export interface IFoodSearchHistorySchema
  extends IFoodSearchHistory,
    Pick<Timed, "createdAt"> {}

interface IFoodSearchHistoryMethods {}

interface IFoodSearchHistoryModel
  extends Model<IFoodSearchHistorySchema, {}, IFoodSearchHistoryMethods> {}

const foodSeachHistorySchema = new Schema<
  IFoodSearchHistorySchema,
  IFoodSearchHistoryModel,
  IFoodSearchHistoryMethods
>({
  userId: {
    type: String,
    require: true,
    index: true,
  },
  params: {
    user: {
      include: Schema.Types.Mixed,
      exclude: Schema.Types.Mixed,
    },
    place: {
      include: Schema.Types.Mixed,
      exclude: Schema.Types.Mixed,
    },
    query: {
      type: String,
      index: "text",
    },
    distance: {
      max: Number,
      current: {
        lat: Number,
        lng: Number,
      },
    },
    category: Schema.Types.Mixed,
    price: {
      min: Number,
      max: Number,
    },
    addedBy: Schema.Types.Mixed,
    order: {
      distance: Number,
      time: Number,
      price: Number,
      quantity: Number,
    },
    time: {
      from: Number,
      to: Number,
    },
    duration: {
      from: Number,
      to: Number,
    },
    quantity: {
      min: Number,
      max: Number,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Statics

// Methods

export const FoodSeachHistory = model<
  IFoodSearchHistorySchema,
  IFoodSearchHistoryModel
>("FoodSeachHistory", foodSeachHistorySchema, collections.foodSearchHistory);

export default FoodSeachHistory;
