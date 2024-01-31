import { Model, Schema, model, Document, ObjectId } from "mongoose";
import collections from "../collections";
import { FollowRole, IFollower } from "../../data";

export interface FollowerDocument
  extends Omit<IFollower, "place" | "user" | "subcriber">,
    Document {
  place: ObjectId;
  user: ObjectId;
  subcriber: ObjectId;
  createdAt: Date;
}

interface IFollowerMethods {}

interface IFollowerModel extends Model<FollowerDocument, {}, IFollowerMethods> {}

const followerSchema = new Schema<FollowerDocument, IFollowerModel, IFollowerMethods>({
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
    default: FollowRole.USER,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Statics

// Methods

export const Follower = model<FollowerDocument, IFollowerModel>(
  "Follower",
  followerSchema,
  collections.userAndPlaceFollower
);

export default Follower;
