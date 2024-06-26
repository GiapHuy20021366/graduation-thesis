import FoodSeachHistory, {
  IFoodSearchHistorySchema,
} from "../db/model/search-history";
import {
  IFoodSearchParams,
  IHistorySearchParams,
  IPagination,
  InternalError,
} from "../data";
import { HydratedDocument } from "mongoose";

export const getQueryHistoryByUserId = async (
  userId: string,
  pagination?: IPagination
): Promise<string[]> => {
  if (pagination == null) {
    pagination = {
      skip: 0,
      limit: 24,
    };
  }
  const result = await FoodSeachHistory.find({
    userId: userId,
  })
    .skip(pagination.skip)
    .limit(pagination.limit)
    .exec();

  if (result == null) {
    throw new InternalError();
  }
  return result
    .filter((history) => history.params.query != null)
    .map((history) => history.params.query!);
};

interface ISearchOnQueryRecord {
  userId: string;
  query: string;
}

export const searchHistory = async (
  params: IHistorySearchParams
): Promise<ISearchOnQueryRecord[]> => {
  const { users, query, pagination } = params;
  const skip = pagination?.skip ?? 0;
  const limit = pagination?.limit ?? 24;

  const result = await FoodSeachHistory.aggregate<
    HydratedDocument<IFoodSearchHistorySchema>
  >([
    {
      $match: {
        userId:
          users != null
            ? {
                $in: users,
              }
            : undefined,
        "params.query": { $ne: "" },
        $text: { $search: query ?? "" },
      },
    },
    { $sort: { createdAt: -1 } },
    { $group: { _id: "$params.query", latestRecord: { $first: "$$ROOT" } } },
    { $replaceRoot: { newRoot: "$latestRecord" } },
    { $skip: skip },
    { $limit: limit },
  ]);

  if (result == null) {
    throw new InternalError();
  }

  return result
    .filter((history) => history.params.query != null)
    .map((history) => ({
      userId: history.userId,
      query: history.params.query!,
    }));
};

export const saveSearchHistory = (
  userId: string,
  params: IFoodSearchParams
): void => {
  const record = new FoodSeachHistory({
    userId: userId,
    params: {
      ...params,
      query: params.query ?? "",
    },
  });
  record.save();
};
