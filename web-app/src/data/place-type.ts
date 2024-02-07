export const PlaceType = {
  PERSONAL: 0,
  VOLUNTEER: 1,
  EATERY: 2,
  RESTAURANT: 4,
  SUPERMARKET: 8,
  GROCERY: 16,
} as const;

export type PlaceType = (typeof PlaceType)[keyof typeof PlaceType];

export const toPlaceTypeLabel = (type: PlaceType): string => {
  switch (type) {
    case PlaceType.PERSONAL:
      return "PERSONAL";
    case PlaceType.VOLUNTEER:
      return "VOLUNTEER";
    case PlaceType.EATERY:
      return "EATERY";
    case PlaceType.RESTAURANT:
      return "RESTAURANT";
    case PlaceType.SUPERMARKET:
      return "SUPERMARKET";
    case PlaceType.GROCERY:
      return "GROCERY";
    default:
      return "UNKNOWN";
  }
};
