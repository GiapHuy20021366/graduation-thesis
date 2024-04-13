import { Model, Schema, model } from "mongoose";
import collections from "../collections";
import {
  IImage,
  IFoodPost,
  Timed,
  Actived,
  Edited,
  Resolved,
} from "../../data";

export interface IFoodPostSchema
  extends IFoodPost,
    Timed,
    Actived,
    Edited,
    Partial<Resolved> {
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

  likeCount: {
    type: Number,
    default: 0,
  },

  isEdited: {
    type: Boolean,
    default: false,
  },
  active: {
    type: Boolean,
    default: true,
  },

  resolved: Boolean,
  resolveBy: {
    type: String,
    index: true,
  },
  resolveTime: Date,

  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
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
