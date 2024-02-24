import express, { Express } from "express";
import { errorHandler, tokenParser } from "../middlewares";
import {
  getConversation,
  createConversation,
  getConversationMessages,
  getConversations,
} from "../controllers";

const userRouter = express.Router();

export const initUserRouters = (app: Express): void => {
  userRouter.put("/conversations", tokenParser, createConversation);
  userRouter.get("/conversations/:id", tokenParser, getConversation);
  userRouter.get(
    "/conversations/:id/messages",
    tokenParser,
    getConversationMessages
  );
  userRouter.post("/conversations", tokenParser, getConversations);

  userRouter.use(errorHandler);
  app.use("/", userRouter);
};
