interface IIFoodSearchParams {
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
  addedBy?: (0 | 1 | 2 | 3 | 4 | 5)[];
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
