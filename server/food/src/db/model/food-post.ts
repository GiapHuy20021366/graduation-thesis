import { Model, Schema, model, Document } from "mongoose";
import collections from "../collections";
import { IImage, IFoodPost } from "../../data";

export interface FoodPostDocument extends IFoodPost, Document {
  isEdited: boolean;
  createdAt: Date;
  updatedAt: Date;
  likeCount: number;
  _doc: any;
}

interface IFoodPostMethods {}

interface IFoodPostModel
  extends Model<FoodPostDocument, {}, IFoodPostMethods> {}

const foodPostSchema = new Schema<
  FoodPostDocument,
  IFoodPostModel,
  IFoodPostMethods
>({
  user: {
    _id: {
      type: String,
      required: true,
      index: true,
    },
    exposeName: {
      type: String,
      required: true,
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
    // required: true
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
});

// Statics

// Methods

export interface FoodPostMappings {
  images: IImage[];
}

export const FoodPost = model<FoodPostDocument, IFoodPostModel>(
  "FoodPost",
  foodPostSchema,
  collections.foodPost
);

export default FoodPost;
