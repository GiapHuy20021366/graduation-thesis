import { FollowType } from "./user-place-follower";

export interface IPlaceFollowerExposed {
    _id?: string;
    type: FollowType;
    time: string | number;  // updatedAt: last time update
    subcriber: {
        _id: string;
        firstName: string;
        lastName: string;
        avartar?: string;
    }
}