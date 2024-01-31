import { isObjectId } from "./data-validate";

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

export const toFollower = (value: any): IFollower | undefined => {
  if (typeof value !== "object") return;
  if (!isObjectId(value.subcriber)) return;
  if (!isObjectId(value.place) && !isObjectId(value.user)) return;

  let role: FollowRole | null = null;
  if (Object.values(FollowRole).includes(value.user)) {
    role = FollowRole.USER;
  } else {
    role = FollowRole.PLACE;
  }

  const result: IFollower = {
    subcriber: value.subcriber as string,
    place: value.place as string,
    type: FollowType.SUBCRIBER,
    role: role,
  };

  if (Object.values(FollowType).includes(value.type)) {
    result.type = value.type as FollowType;
  }
  return result;
};
