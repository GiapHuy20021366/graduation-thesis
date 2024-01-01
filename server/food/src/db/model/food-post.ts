import { Model, Schema, model, Document } from 'mongoose';
import collections from '../collections';
import { IImage, IFoodPost } from '../../data';

export interface FoodPostDocument extends IFoodPost, Document {
    isEdited: boolean;
    createdAt: Date;
    updatedAt: Date;
}

interface IFoodPostMethods {
}

interface IFoodPostModel extends Model<FoodPostDocument, {}, IFoodPostMethods> {
}

const foodPostSchema = new Schema<FoodPostDocument, IFoodPostModel, IFoodPostMethods>({
    user: {
        _id: {
            type: String,
            required: true,
            index: true
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
    },
    location: {
        name: String,
        coordinates: {
            lat: {
                type: Number,
                required: true
            },
            lng: {
                type: Number,
                require: true
            },
        }
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
        type: Date,
        required: true
    },
    price: {
        type: Number,
        require: true
    },
    isEdited: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
});

// Statics


// Methods


export interface FoodPostMappings {
    images: IImage[];
}

export const FoodPost = model<FoodPostDocument, IFoodPostModel>('FoodPost', foodPostSchema, collections.foodPost);

export default FoodPost;
