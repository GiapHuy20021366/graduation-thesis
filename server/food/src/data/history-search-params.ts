import { isAllObjectId, isNotEmptyString, isNumber } from "./data-validate";
import { IPagination } from "./pagination";

export interface IHistorySearchParams {
  users?: string[];
  query?: string;
  pagination?: IPagination;
}

export const toHistorySearchParams = (value: any): IHistorySearchParams => {
  const result: IHistorySearchParams = {};
  if (value == null || typeof value != "object") return {};
  const query = value.query;
  if (isNotEmptyString(query)) {
    result.query = query;
  }

  const users = value.users;
  if (isAllObjectId(users)) result.users = users as string[];

  result.pagination = {
    skip: 0,
    limit: 24,
  };
  const pagination = value.pagination;
  if (typeof pagination === "object") {
    result;
    const skip = pagination.skip;
    const limit = pagination.limit;
    if (isNumber(skip)) {
      result.pagination.skip = skip;
    }
    if (isNumber(limit)) {
      result.pagination.limit = limit;
    }
  }

  return result;
};
