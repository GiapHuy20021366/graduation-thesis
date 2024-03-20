import {
  isArrayFollowRoles,
  isArrayFollowTypes,
  isNumber,
  isOrderState,
  isPagination,
} from "./data-validate";
import { FollowRole, FollowType } from "./follower";
import { IIncludeAndExclude, toIncludeAndExclude } from "./include-and-exclude";
import { OrderState } from "./order-state";
import { IPagination } from "./pagination";

export interface IFollowerSearchPlace extends IIncludeAndExclude {}

export interface IFollowerSearchUser extends IIncludeAndExclude {}

export interface IFollowerSearchSubcriber extends IIncludeAndExclude {}

export interface IFollowerSearchDuration {
  from?: number;
  to?: number;
}

export interface IFollowerSearchOrder {
  time?: OrderState;
}

export interface IFollowerSearchPopulate {
  user?: boolean;
  place?: boolean;
  subcriber?: boolean;
}

export interface IFollowerSearchParams {
  place?: IFollowerSearchPlace;
  user?: IFollowerSearchUser;
  subcriber?: IFollowerSearchSubcriber;
  role?: FollowRole[];
  type?: FollowType[];
  duration?: IFollowerSearchDuration;
  pagination?: IPagination;
  order?: IFollowerSearchOrder;
  populate?: IFollowerSearchPopulate;
}

export const toFollowerSearchDuration = (
  value: any
): IFollowerSearchDuration | undefined => {
  if (typeof value !== "object") return;
  const result: IFollowerSearchDuration = {};
  const { from, to } = value;
  if (isNumber(from)) result.from = from;
  if (isNumber(to)) result.to = to;
  return result;
};

export const toFollowerSearchOrder = (
  value: any
): IFollowerSearchOrder | undefined => {
  if (typeof value !== "object") return;
  const result: IFollowerSearchOrder = {};
  const { time } = value;
  if (isOrderState(time)) {
    result.time = time;
  }
  return result;
};

export const toFollowerSearchParams = (value: any): IFollowerSearchParams => {
  if (typeof value !== "object") return {};

  const result: IFollowerSearchParams = {};
  result.place = toIncludeAndExclude(value.place);
  result.user = toIncludeAndExclude(value.user);
  result.subcriber = toIncludeAndExclude(value.subcriber);

  const role = value.role;
  if (isArrayFollowRoles(role)) {
    result.role = role;
  }
  const type = value.type;
  if (isArrayFollowTypes(type)) {
    result.type = value.type;
  }
  result.duration = toFollowerSearchDuration(value.duration);
  result.order = toFollowerSearchOrder(value.order);

  const pagination = value.pagination;
  if (isPagination(pagination)) {
    result.pagination = pagination;
  }

  const populate = value.populate;
  if (typeof populate === "object") {
    const {user, place, subcriber} = populate;
    const populateValue: IFollowerSearchPopulate = {};
    if (typeof user === "boolean") {
      populateValue.user = user;
    }
    if (typeof place === "boolean") {
      populateValue.place = place;
    }
    if (typeof subcriber === "boolean") {
      populateValue.subcriber = subcriber;
    }
    result.populate = populateValue;
  }

  return result;
};
