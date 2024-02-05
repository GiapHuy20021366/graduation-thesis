import { Model, Schema, model, ObjectId } from "mongoose";
import collections from "../collections";
import { FollowRole, FollowType, IFollower } from "../../data";

export interface IFollowerSchema
  extends Omit<IFollower, "place" | "user" | "subcriber"> {
  place: ObjectId;
  user: ObjectId;
  subcriber: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

interface IFollowerMethods {}

interface IFollowerModel extends Model<IFollowerSchema, {}, IFollowerMethods> {}

const followerSchema = new Schema<
  IFollowerSchema,
  IFollowerModel,
  IFollowerMethods
>({
  place: {
    type: Schema.ObjectId,
    ref: "Place",
    index: true,
  },
  user: {
    type: Schema.ObjectId,
    ref: "User",
    index: true,
  },
  subcriber: {
    type: Schema.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  type: {
    type: Number,
    required: true,
    default: FollowType.SUBCRIBER,
  },
  role: {
    type: Number,
    required: true,
    default: FollowRole.USER,
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

export const Follower = model<IFollowerSchema, IFollowerModel>(
  "Follower",
  followerSchema,
  collections.userAndPlaceFollower
);

export default Follower;
