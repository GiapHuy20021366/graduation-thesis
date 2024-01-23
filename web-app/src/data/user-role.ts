export const UserRole = {
  PERSONAL: 0,
  VOLUNTEER: 1,
  EATERY: 2,
  RESTAURANT: 4,
  SUPERMARKET: 8,
  GROCERY: 16,
};

export type UserRole = (typeof UserRole)[keyof typeof UserRole];