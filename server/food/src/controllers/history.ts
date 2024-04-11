import { NextFunction, Request, Response } from "express";
import {
  Paginationed,
  toHistorySearchParams,
  toResponseSuccessData,
} from "../data";
import { searchHistory as searchHistoryService } from "../services";
import { Queried } from "~/data/schemad";

interface ISearchHistoryBody extends Paginationed, Queried {
  users?: string[];
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
