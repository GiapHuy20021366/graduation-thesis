import { IFoodUploadData } from ".";

export interface IFoodPostData extends IFoodUploadData {
    user: {
        _id: string;
        exposeName: string;
    }
}