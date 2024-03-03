import { NextFunction, Request, Response } from "express";
import {
  IPagination,
  toHistorySearchParams,
  toResponseSuccessData,
} from "../data";
import { searchHistory as searchHistoryService } from "../services";

interface ISearchHistoryBody {
  users?: string[];
  query?: string;
  pagination?: IPagination;
}
export const searchHistory = async (
  req: Request<{}, {}, ISearchHistoryBody, {}>,
  res: Response,
  next: NextFunction
) => {
  const params = req.body;
  const paramsToSearch = toHistorySearchParams(params);
  searchHistoryService(paramsToSearch!)
    .then((data) => res.status(200).json(toResponseSuccessData(data)))
    .catch(next);
};
