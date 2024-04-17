import { NextFunction, Request, Response } from "express";
import { AuthLike, num, toResponseSuccessData } from "../data";
import * as services from "../services";

export const getNotifications = async (
  req: Request<{}, {}, {}, { from?: string; to?: string; limit?: string }>,
  res: Response,
  next: NextFunction
) => {
  const auth = req.authContext as AuthLike;
  const query = req.query;
  const from = num(query.from, 0);
  const to = num(query.to, Date.now());
  const limit = num(query.from, 100);

  services
    .getNotifications(auth._id, from, to, limit)
    .then((data) => res.status(200).json(toResponseSuccessData(data)))
    .catch(next);
};
