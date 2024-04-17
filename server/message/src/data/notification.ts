export const NotificationType = {
  /**
   * When a or many food near expired (had gone)
   */
  FOOD_NEAR_EXPIRED: 0,
  /**
   * When a or many food expired
   */
  FOOD_EXPIRED: 1,
  /**
   * When a user like a food
   */
  FOOD_LIKED: 2,
  /**
   * A or many food around suggested around
   */
  FOOD_SUGGESTED_AROUND: 3,
  /**
   * A or many food matched with user favorite suggested
   */
  FOOD_SUGGESTED_CATEGORY: 4,
  /**
   * A place that subcribed post a food
   */
  FOOD_SUBCRIBED_PLACE: 5,
  /**
   * A user that subcribed post a food
   */
  FOOD_SUBCRIBED_USER: 6,

  /**
   * A place was rating by user
   */
  PLACE_RATING: 7,
  /**
   * A place was reported by user
   */
  PLACE_REPORT: 8,
  /**
   * A place was inactive due to report
   */
  PLACE_INACTIVE: 9,

  /**
   * Wellcome user
   */
  USER_WELLCOME: 10,
  /**
   * A user need to update personal information
   */
  USER_PERSONAL_NEED_UPDATE: 11,
} as const;

export type NotificationType =
  (typeof NotificationType)[keyof typeof NotificationType];

export interface INotification {
  users: string[];
  reads: string[];
  type: NotificationType;

  typedFoods?: string[]; // for food type
  typedPlace?: string; // for place type
  typedUser?: string; // for user type
}
