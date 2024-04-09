import { ILocation } from "./location";

export interface IUserCachedFavoriteScore {
  category: string;
  score: number;
}

export interface IUserCachedRegisterData {
  _id: string;
  time: Date;
}

export interface IUserCachedRegister {
  users: IUserCachedRegisterData[];
  places: IUserCachedRegisterData[];
}

export interface IUserCachedFavorite {
  loveds: IUserCachedFavoriteScore[]; // categories of food loved
  rateds: IUserCachedFavoriteScore[]; // categories of place rated
}

export interface IUserCached {
  user: string;
  location?: ILocation; // user location
  categories: string[]; // categories of user
  favorite: IUserCachedFavorite;
  register: IUserCachedRegister;
}
