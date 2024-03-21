import { Model, Schema, HydratedDocument, model } from "mongoose";
import collections from "../collections";
import md5 from "md5";
import { ImageRourceType } from "../../data";

export interface IIImageSchema {
  md5: string;
  refs: number;
  publicId: string;
  width: number;
  height: number;
  format: string;
  resourceType: ImageRourceType;
  createdAt: string;
  type: string;
  url: string;
  secureUrl: string;
  exposedName: string;
  bytes: number;
}

interface IImageMethods {
  increaseRefs(): Promise<void>;
  decreaseRef(): Promise<void>;
}

interface IImageModel extends Model<IIImageSchema, {}, IImageMethods> {
  findByMd5(
    md5: string
  ): Promise<HydratedDocument<IIImageSchema, IImageMethods> | null>;
  findByBase64(
    base64: string
  ): Promise<HydratedDocument<IIImageSchema, IImageMethods> | null>;
}

const imageSchema = new Schema<IIImageSchema, IImageModel, IImageMethods>({
  md5: {
    type: String,
    require: true,
    index: true,
  },
  refs: {
    type: Number,
    default: 0,
  },
  publicId: {
    type: String,
    required: true,
  },
  width: {
    type: Number,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
  format: {
    type: String,
    required: true,
  },
  resourceType: {
    type: String,
    required: true,
  },
  createdAt: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  secureUrl: {
    type: String,
    required: true,
  },
  exposedName: {
    type: String,
    required: true,
  },
  bytes: {
    type: Number,
    required: true,
  },
});

// Statics
imageSchema.static("findByMd5", function (md5: string) {
  return this.findOne({ md5 });
});

imageSchema.static("findByBase64", function (base64: string) {
  return this.findOne({ md5: md5(base64) });
});

// Methods
imageSchema.method("increaseRefs", function () {
  this.refs += 1;
  return this.save();
});
imageSchema.method("decreaseRefs", function () {
  this.refs -= 1;
  return this.save();
});

export const Image = model<IIImageSchema, IImageModel>(
  "Image",
  imageSchema,
  collections.image
);

export default Image;
