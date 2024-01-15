import { isAllObjectId, isNotEmptyString } from "./data-validate";
import { toPagination } from "./food-search-params";
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

  result.pagination = toPagination(value.pagination);
  return result;
};
