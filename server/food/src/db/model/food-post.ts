import { Model, Schema, model, Document } from 'mongoose';
import collections from '../collections';
import { ICoordinates, IImage } from '../../data';

export interface FoodPostDocument extends Document {
    user: string;
    images: Schema.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
    title: string;
    location: ICoordinates;
    categories: string[];
    description: string;
    quantity: number;
    duration: number;
    pickUpTimes: number;
    cost: number;
}

interface IFoodPostMethods {
}

interface IFoodPostModel extends Model<FoodPostDocument, {}, IFoodPostMethods> {
}

const foodPostSchema = new Schema<FoodPostDocument, IFoodPostModel, IFoodPostMethods>({
    user: {
        type: String,
        required: true,
        index: true
    },
    images: {
        type: [Schema.ObjectId],
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    title: {
        type: String,
        required: true,
    },
    location: {
        lat: {
            type: Number,
            required: true
        },
        lng: {
            type: Number,
            require: true
        },
    },
    categories: {
        type: [String],
        require: true
    },
    description: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    pickUpTimes: {
        type: Number,
        required: true
    },
    cost: {
        type: Number,
        require: true
    }
});

// Statics


// Methods


export interface FoodPostMappings {
    images: IImage[];
}

export const FoodPost = model<FoodPostDocument, IFoodPostModel>('FoodPost', foodPostSchema, collections.foodPost);

export default FoodPost;
