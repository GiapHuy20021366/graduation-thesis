export const UserRole = {
  USER: 0,
  VOLUNTEER: 1,
  RESTAURANT: 2,
  MARKET: 3,
  SUPERMARKET: 4,
  GROCERY: 5,
};

export type UserRole = (typeof UserRole)[keyof typeof UserRole];