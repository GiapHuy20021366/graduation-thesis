import { Model, Schema, model, Document, ObjectId } from "mongoose";
import collections from "../collections";
import { IPlaceRating } from "../../data";

export interface PlaceRatingDocument
  extends Omit<IPlaceRating, "place" | "user">,
    Document {
  place: ObjectId;
  user: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

interface IPlaceRatingMethods {}

interface IPlaceRatingModel
  extends Model<PlaceRatingDocument, {}, IPlaceRatingMethods> {}

const placeRatingSchema = new Schema<
  PlaceRatingDocument,
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

export const PlaceRating = model<PlaceRatingDocument, IPlaceRatingModel>(
  "PlaceRating",
  placeRatingSchema,
  collections.placeRating
);

export default PlaceRating;
