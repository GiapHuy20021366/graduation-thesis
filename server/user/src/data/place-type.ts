export const PlaceType = {
  PERSONAL: 0,
  VOLUNTEER: 1,
  EATERY: 2,
  RESTAURANT: 4,
  SUPERMARKET: 8,
  GROCERY: 16,
} as const;

export type PlaceType = (typeof PlaceType)[keyof typeof PlaceType];
