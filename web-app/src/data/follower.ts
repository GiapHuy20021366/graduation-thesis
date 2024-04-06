export const FollowType = {
  SUBCRIBER: 1, // Notification
  MEMBER: 2,
  SUB_ADMIN: 4,
  ADMIN: 8,
} as const;
export type FollowType = (typeof FollowType)[keyof typeof FollowType];

export const FollowRole = {
  USER: 1,
  PLACE: 2,
} as const;
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

export const toFollowTypeLabel = (type?: FollowType): string | undefined => {
  switch (type) {
    case FollowType.ADMIN:
      return "ADMIN";
    case FollowType.SUB_ADMIN:
      return "SUB_ADMIN";
    case FollowType.SUBCRIBER:
      return "SUBCRIBER";
    case FollowType.MEMBER:
      return "MEMBER";
  }
  return;
};
