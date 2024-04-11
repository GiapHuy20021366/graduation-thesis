import { NextFunction, Request, Response } from "express";
import {
  IPagination,
  InvalidDataError,
  isObjectId,
  num,
  toResponseSuccessData,
} from "../data";
import {
  getRegisteredFoods as getRegisteredFoodsService,
  getFavoriteFoods as getFavoriteFoodsService,
} from "../services";

export const getRegisteredFoods = (
  req: Request<{ id: string }, {}, {}, { skip?: string; limit?: string }>,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  if (!isObjectId(id)) {
    return next(new InvalidDataError());
  }
  const { skip, limit } = req.query;
  const pagination: IPagination = {
    skip: num(skip, 0),
    limit: num(limit, 24),
  };
  getRegisteredFoodsService(id, pagination)
    .then((data) => res.send(toResponseSuccessData(data)))
    .catch(next);
};

export const getFavoriteFoods = (
  req: Request<{ id: string }, {}, {}, { skip?: string; limit?: string }>,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  if (!isObjectId(id)) {
    return next(new InvalidDataError());
  }
  const { skip, limit } = req.query;
  const pagination: IPagination = {
    skip: num(skip, 0),
    limit: num(limit, 24),
  };
  getFavoriteFoodsService(id, pagination)
    .then((data) => res.send(toResponseSuccessData(data)))
    .catch(next);
};
