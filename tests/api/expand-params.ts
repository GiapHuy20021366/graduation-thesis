interface IFoodSearchParams {
  query?: string;
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
  price?: {
    min?: number;
    max?: number;
  };
  addedBy?: (0 | 1 | 2 | 4 | 8 | 16)[];
  resolved?: boolean;
  resolveBy?: {
    include?: string[];
    exclude?: string[];
  };
  active?: boolean;
  time?: {
    from?: number;
    to?: number;
  };
  duration?: {
    from?: number;
    to?: number;
  };
  quantity?: {
    min?: number;
    max?: number;
  };
  pagination?: {
    skip: number;
    limit: number;
  };
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
}

interface IPlaceSearchParams {
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
  types?: (0 | 1 | 2 | 4 | 8 | 16)[];
  rating?: {
    min?: number;
    max?: number;
  };
  active?: boolean;
  pagination?: {
    skip: number;
    limit: number;
  };
  order?: {
    distance?: -1 | 1 | 0;
    rating?: -1 | 1 | 0;
    time?: -1 | 1 | 0;
  };
}

interface IFoodPostUploadData {
  place?: string;
  user: string;
  images: string[];
  title: string;
  location: {
    name: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  categories: string[];
  decription: string;
  quantity: number;
  duration: number;
  price: number;
}
