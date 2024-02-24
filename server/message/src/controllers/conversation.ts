import { NextFunction, Request, Response } from "express";
import {
  AuthLike,
  IPagination,
  InvalidDataError,
  isObjectId,
  toResponseSuccessData,
} from "../data";
import {
  getConversations as getConversationsService,
  getConversation as getConversationService,
  createConversation as createConversationService,
  getMessages as getConversationMessagesService,
} from "../services";

export const getConversation = async (
  req: Request<{ id: string }, {}, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  const auth = req.authContext as AuthLike;
  const id = req.params.id;
  if (!isObjectId(id)) {
    return next(
      new InvalidDataError({
        message: `${id} is not an id`,
        data: {
          target: "id",
          reason: "invalid",
        },
      })
    );
  }
  getConversationService(id, auth._id)
    .then((data) => res.status(200).json(toResponseSuccessData(data)))
    .catch(next);
};

export const getConversations = async (
  req: Request<{}, {}, { paginaton?: IPagination }, {}>,
  res: Response,
  next: NextFunction
) => {
  const auth = req.authContext as AuthLike;
  const pagination = req.body.paginaton;
  getConversationsService(auth._id, pagination)
    .then((data) => res.status(200).json(toResponseSuccessData(data)))
    .catch(next);
};

export const createConversation = async (
  req: Request<{}, {}, {}, { to: string }>,
  res: Response,
  next: NextFunction
) => {
  const auth = req.authContext as AuthLike;
  const to = req.query.to;
  if (!isObjectId) {
    return next(
      new InvalidDataError({
        message: `${to} is not an id`,
        data: {
          target: "id",
          reason: "invalid",
        },
      })
    );
  }

  createConversationService([auth._id, to])
    .then((data) => res.status(200).json(toResponseSuccessData(data)))
    .catch(next);
};

export const getConversationMessages = async (
  req: Request<{ id: string }, {}, {}, { from: string; to: string }>,
  res: Response,
  next: NextFunction
) => {
  const auth = req.authContext;
  const id = req.params.id;
  if (!isObjectId(id)) {
    return next(
      new InvalidDataError({
        message: `Invalid id ${id}`,
        data: {
          target: "id",
          reason: "invalid",
        },
      })
    );
  }
  const from = +req.query.from;
  const to = +req.query.to;
  if (isNaN(from) || isNaN(to)) {
    return next(
      new InvalidDataError({
        message: `Invalid from ${req.query.from} and to ${req.query.to}`,
      })
    );
  }
  getConversationMessagesService(id, from, to)
    .then((data) => res.status(200).json(toResponseSuccessData(data)))
    .catch(next);
};
