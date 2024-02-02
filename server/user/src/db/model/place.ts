import { Model, Schema, model, ObjectId } from "mongoose";
import collections from "../collections";
import { IPlace, IRating, PlaceType } from "../../data";

export interface IPlaceSchema extends Omit<IPlace, "author"> {
  author: ObjectId;
  rating: IRating;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface IPlaceMethods {}

interface IPlaceModel extends Model<IPlaceSchema, {}, IPlaceMethods> {}

const placeSchema = new Schema<IPlaceSchema, IPlaceModel, IPlaceMethods>({
  exposeName: {
    type: String,
    required: true,
    index: "text",
  },
  description: {
    type: String,
    default: "",
  },
  images: {
    type: [String],
    default: [],
  },
  categories: {
    type: [String],
    default: [],
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
  type: {
    type: Number,
    required: true,
    index: true,
    default: PlaceType.PERSONAL,
  },
  avartar: String,
  author: {
    type: Schema.ObjectId,
    required: true,
    index: true,
    ref: "User",
  },
  rating: {
    mean: {
      type: Number,
      default: 0,
    },
    count: {
      type: Number,
      default: 0,
    },
  },
  active: {
    type: Boolean,
    default: true,
  },
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

export const Place = model<IPlaceSchema, IPlaceModel>(
  "Place",
  placeSchema,
  collections.place
);

export default Place;
