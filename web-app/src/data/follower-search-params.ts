import { FollowRole, FollowType, IPagination, OrderState } from ".";

export interface IFollowerSearchPlace {
  include?: string[];
  exclude?: string[];
}

export interface IFollowerSearchUser {
  include?: string[];
  exclude?: string[];
}

export interface IFollowerSearchSubcriber {
  include?: string[];
  exclude?: string[];
}

export interface IFollowerSearchDuration {
  from?: number;
  to?: number;
}

export interface IFollowerSearchOrder {
  time?: OrderState;
}

export interface IFollowerSearchParams {
  role?: FollowRole[];
  type?: FollowType[];
  place?: IFollowerSearchPlace;
  user?: IFollowerSearchUser;
  subcriber?: IFollowerSearchSubcriber;
  duration?: IFollowerSearchDuration;
  pagination?: IPagination;
  order?: IFollowerSearchOrder;
}
