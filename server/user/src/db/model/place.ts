import { Model, Schema, model, Document, ObjectId } from "mongoose";
import collections from "../collections";
import { IPlace } from "../../data";

export interface PlaceDocument extends Omit<IPlace, "author">, Document {
  author: ObjectId;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface IPlaceMethods {}

interface IPlaceModel extends Model<PlaceDocument, {}, IPlaceMethods> {}

const placeSchema = new Schema<PlaceDocument, IPlaceModel, IPlaceMethods>({
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

export const Place = model<PlaceDocument, IPlaceModel>(
  "Place",
  placeSchema,
  collections.place
);

export default Place;
