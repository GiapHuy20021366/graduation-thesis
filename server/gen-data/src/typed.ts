export interface ICoordinates {
  lat: number;
  lng: number;
}

export interface ILocation {
  name: string;
  coordinates: ICoordinates;
  two_array: [number, number];
}

export interface IProfile {
  name: string;
  email: string;
  location: ILocation;
  avatar: string;
}

export interface Oided {
  $oid: string;
}

export interface Ided {
  _id: Oided;
}

export interface Dated {
  $date: string;
}

export interface Timed {
  createdAt: Dated;
  updatedAt: Dated;
}

export interface Activated {
  active: boolean;
}

export interface Versioned {
  __v: number;
}

export interface Edited {
  isEdited: boolean;
}

export interface Categoried {
  categories: string[];
}

export interface Locationed {
  location: ILocation;
}

export interface IUserSchema
  extends Ided,
    Timed,
    Versioned,
    Activated,
    Categoried,
    Locationed {
  firstName: string;
  lastName: string;
  exposedName: string;
  avatar: string;
  description: string;

  email: string;
  password: string;
  validSince: Dated;
}

export interface IPlaceProfile {
  name: string;
  location: ILocation;
}

export const PlaceType = {
  VOLUNTEER: 1,
  EATERY: 2,
  RESTAURANT: 4,
  SUPERMARKET: 8,
  GROCERY: 16,
} as const;

export type PlaceType = (typeof PlaceType)[keyof typeof PlaceType];

export interface IPlaceSchema
  extends Ided,
    Timed,
    Versioned,
    Activated,
    Categoried,
    Locationed {
  exposedName: string;
  description: string;
  images: string[];
  type: number;
  avatar?: string;
  rating: {
    mean: number;
    count: number;
  };
  author: Oided;
}

export interface IFoodSchema
  extends Ided,
    Timed,
    Versioned,
    Activated,
    Edited,
    Categoried,
    Locationed {
  user: string;
  images: string[];
  title: string;
  quantity: number;
  duration: Dated;
  price: number;
  likeCount: number;
  place?: {
    _id: string;
    type: number;
  };
}

export interface IFollowerSchema extends Ided, Timed {
  place?: Oided;
  user?: Oided;
  subcriber: Oided;
  type: 1 | 8; // Subcriber or admin
  role: 1 | 2; // place: 2 | user: 1
}

export interface IPlaceRatingSchema extends Ided, Timed, Versioned {
  user: Oided;
  place: Oided;
  score: number;
}

export interface IFoodLoveSchema
  extends Ided,
    Pick<Timed, "createdAt">,
    Versioned {
  user: string;
  foodPost: Oided;
}
