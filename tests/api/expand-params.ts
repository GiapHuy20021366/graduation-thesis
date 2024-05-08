interface IFoodSearchParams {
  user?: {
    include?: string[];
    exclude?: string[];
  };
  place?: {
    include?: string[];
    exclude?: string[];
  };
  distance?: {
    max: number;
    current: {
      lat: number;
      lng: number;
    };
  };
  category?: string | string[];
  maxDuration?: number;
  price?: {
    min?: number;
    max?: number;
  };
  minQuantity?: number;
  addedBy?: (0 | 1 | 2 | 4 | 8 | 16)[];
  available?: "ALL" | "AVAIABLE_ONLY" | "JUST_GONE";
  order?: {
    distance?: -1 | 1 | 0;
    time?: -1 | 1 | 0;
    price?: -1 | 1 | 0;
    quantity?: -1 | 1 | 0;
  };
  populate?: {
    user?: boolean;
    place?: boolean;
  };
  resolved?: boolean;
  resolveBy?: {
    include?: string[];
    exclude?: string[];
  };
  pagination?: {
    skip: number;
    limit: number;
  };
  query?: string;
  active?: boolean;
}

interface IPlaceSearchParams {
  pagination?: {
    skip: number;
    limit: number;
  };
  query?: string;
  author?: {
    include?: string[];
    exclude?: string[];
  };
  distance?: {
    max: number;
    current: {
      lat: number;
      lng: number;
    };
  };
  order?: {
    distance?: -1 | 1 | 0;
    rating?: -1 | 1 | 0;
    time?: -1 | 1 | 0;
  };
  types?: (0 | 1 | 2 | 4 | 8 | 16)[];
  rating?: {
    min?: number;
    max?: number;
  };
  active?: boolean;
}
