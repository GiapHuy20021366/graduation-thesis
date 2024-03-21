import { Model, Schema, model } from "mongoose";
import collections from "../collections";
import { IImage, IFoodPost, Timed, Actived, Edited } from "../../data";

export interface IFoodPostSchema extends IFoodPost, Timed, Actived, Edited {
  likeCount: number;
}

interface IFoodPostMethods {}

interface IFoodPostModel extends Model<IFoodPostSchema, {}, IFoodPostMethods> {}

const foodPostSchema = new Schema<
  IFoodPostSchema,
  IFoodPostModel,
  IFoodPostMethods
>({
  user: {
    type: String,
    require: true,
    index: true,
  },
  place: {
    _id: {
      type: String,
      index: true,
    },
    type: {
      type: Number,
    },
  },
  images: {
    type: [String],
    required: true,
  },
  title: {
    type: String,
    required: true,
    index: "text",
  },
  location: {
    name: String,
    coordinates: {
      lat: {
        type: Number,
        required: true,
      },
      lng: {
        type: Number,
        require: true,
      },
    },
    two_array: {
      type: [Number],
      default: [0, 0],
      index: "2dsphere",
    },
  },
  categories: {
    type: [String],
    require: true,
    index: "text",
  },
  description: {
    type: String,
  },
  quantity: {
    type: Number,
    required: true,
  },
  duration: {
    type: Date,
    required: true,
    index: "descending",
  },
  price: {
    type: Number,
    require: true,
    index: "descending",
  },
  isEdited: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  likeCount: {
    type: Number,
    default: 0,
  },
  active: {
    type: Boolean,
    default: true,
  },
});

// Statics

// Methods

export interface FoodPostMappings {
  images: IImage[];
}

export const FoodPost = model<IFoodPostSchema, IFoodPostModel>(
  "FoodPost",
  foodPostSchema,
  collections.foodPost
);

export default FoodPost;
