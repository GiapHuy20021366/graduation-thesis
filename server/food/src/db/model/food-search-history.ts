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
    order: {
      orderDistance: Number,
      orderNew: Number,
      orderPrice: Number,
      orderQuantity: Number,
    },
    maxDistance: Number,
    query: {
      type: String,
      index: "text",
    },
    categories: [String],
    maxDuration: Number,
    price: {
      active: Boolean,
      min: Number,
      max: Number,
    },
    minQuantity: Number,
    addedBy: String,
    available: String,
    currentLocation: {
      lat: Number,
      lng: Number,
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
