import { Model, Schema, model, ObjectId } from "mongoose";
import collections from "../collections";
import { IPlaceRating, Timed } from "../../data";

export interface IPlaceRatingSchema
  extends Omit<IPlaceRating, "place" | "user">,
    Timed {
  place: ObjectId;
  user: ObjectId;
}

interface IPlaceRatingMethods {}

interface IPlaceRatingModel
  extends Model<IPlaceRatingSchema, {}, IPlaceRatingMethods> {}

const placeRatingSchema = new Schema<
  IPlaceRatingSchema,
  IPlaceRatingModel,
  IPlaceRatingMethods
>({
  place: {
    type: Schema.ObjectId,
    ref: "Place",
    index: true,
    required: true,
  },
  user: {
    type: Schema.ObjectId,
    ref: "User",
    index: true,
    required: true,
  },
  score: {
    type: Number,
    required: true,
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

export const PlaceRating = model<IPlaceRatingSchema, IPlaceRatingModel>(
  "PlaceRating",
  placeRatingSchema,
  collections.placeRating
);

export default PlaceRating;
