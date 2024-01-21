import { IFoodUploadData } from ".";

export interface IFoodPostData extends IFoodUploadData {
  user: {
    _id: string;
    exposeName: string;
  };
  likeCount?: number;
  liked?: boolean;
  _id: string;
}
