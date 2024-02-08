export const FollowType = {
  SUBCRIBER: 1, // Notification
  MEMBER: 2,
  SUB_ADMIN: 4,
  ADMIN: 8,
};
export type FollowType = (typeof FollowType)[keyof typeof FollowType];

export const FollowRole = {
  USER: 1,
  PLACE: 2,
};
export type FollowRole = (typeof FollowRole)[keyof typeof FollowRole];

export interface IFollowerBase {
  subcriber: string;
  type: FollowType;
  role: FollowRole; // is subcriber user or place ?
}

export interface IPlaceFollower extends IFollowerBase {
  place: string;
}

export interface IUserFollower extends IFollowerBase {
  user: string;
}

export type IFollower = IPlaceFollower | IUserFollower;