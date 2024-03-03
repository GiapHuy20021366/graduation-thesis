import { Model, Schema, model, Document } from "mongoose";
import collections from "../collections";
import { IFoodSearchHistory } from "../../data";

export interface FoodSearchHistoryDocument
  extends IFoodSearchHistory,
    Document {
  createdAt: Date;
}

interface IFoodSearchHistoryMethods {}

interface IFoodSearchHistoryModel
  extends Model<FoodSearchHistoryDocument, {}, IFoodSearchHistoryMethods> {}

const foodSeachHistorySchema = new Schema<
  FoodSearchHistoryDocument,
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
    maxDuration: Number,
    price: {
      min: Number,
      max: Number,
    },
    minQuantity: Number,
    addedBy: Schema.Types.Mixed,
    available: String,
    order: {
      distance: Number,
      time: Number,
      price: Number,
      quantity: Number,
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
  FoodSearchHistoryDocument,
  IFoodSearchHistoryModel
>("FoodSeachHistory", foodSeachHistorySchema, collections.foodSearchHistory);

export default FoodSeachHistory;
