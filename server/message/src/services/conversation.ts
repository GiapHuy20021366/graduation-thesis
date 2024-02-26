import {
  IConversationExposed,
  IConversationMessage,
  IConversationMessageExposed,
  IPagination,
  InternalError,
  ResourceNotExistedError,
  UnauthorizationError,
} from "../data";
import { Conversation, ConversationMessage } from "../db/model";

export const createConversation = async (
  participants: string[]
): Promise<IConversationExposed> => {
  const conversation = await Conversation.findOne({
    participants: { $all: participants, $elemMatch: { $exists: true } },
  });

  if (conversation == null) {
    const newConversation = new Conversation({
      participants: participants,
      createdAt: new Date(),
      updatedAt: new Date(),
      meta: participants.map((par) => ({ id: par, joinTime: new Date() })),
    });
    await newConversation.save();
    return {
      _id: newConversation._id.toString(),
      createdAt: newConversation.createdAt,
      meta: newConversation.meta,
      participants: newConversation.participants,
      updatedAt: newConversation.updatedAt,
    };
  } else {
    return {
      createdAt: conversation.createdAt,
      meta: conversation.meta,
      participants: conversation.participants,
      updatedAt: conversation.updatedAt,
      _id: conversation._id.toString(),
    };
  }
};

export const getConversation = async (
  conversationId: string,
  userId: string
): Promise<IConversationExposed> => {
  const conversation = await Conversation.findById(conversationId);
  if (conversation == null) {
    throw new ResourceNotExistedError({
      message: `No conversation with id ${conversationId} found`,
      data: {
        target: "id",
        reason: "not-found",
      },
    });
  }
  if (!conversation.participants.includes(userId)) {
    throw new UnauthorizationError();
  }
  return {
    _id: conversation._id.toString(),
    createdAt: conversation.createdAt,
    meta: conversation.meta,
    participants: conversation.participants,
    updatedAt: conversation.updatedAt,
  };
};

export const getConversations = async (
  userId: string,
  pagination?: IPagination
): Promise<IConversationExposed[]> => {
  const conversations = await Conversation.aggregate([
    {
      $match: {
        participants: {
          $in: [userId],
        },
      },
    },
    {
      $lookup: {
        from: "Message",
        let: { conversationId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$conversationId", "$$conversationId"],
              },
            },
          },
          {
            $sort: { createdAt: -1 },
          },
          {
            $limit: 100,
          },
        ],
        as: "messages",
      },
    },
    {
      $addFields: {
        latestMessage: { $arrayElemAt: ["$messages", 0] },
      },
    },
    {
      $sort: { "latestMessage.createdAt": -1 },
    },
    {
      $project: {
        messages: 0,
      },
    },
    {
      $skip: pagination?.skip ?? 0,
    },
    {
      $limit: pagination?.limit ?? 12,
    },
  ]).exec();

  if (conversations == null) {
    throw new InternalError();
  }
  return conversations.map((conversation) => ({
    _id: conversation._id.toString(),
    createdAt: conversation.createdAt,
    meta: conversation.meta,
    participants: conversation.participants,
    updatedAt: conversation.updatedAt,
  }));
};

export const newConversationMessage = async (
  conversasionMessage: IConversationMessage
): Promise<IConversationMessageExposed> => {
  const message = new ConversationMessage(conversasionMessage);
  await message.save();
  return {
    ...conversasionMessage,
    createdAt: message.createdAt,
    updatedAt: message.updatedAt,
    conversation: message.conversation,
    _id: message._id.toString(),
  };
};

export const getMessages = async (
  conversationId: string,
  from: number,
  to: Number
): Promise<IConversationMessageExposed[]> => {
  const messages = await ConversationMessage.find({
    conversation: conversationId,
    createdAt: {
      $gte: from,
      $lte: to,
    },
  }).exec();

  return messages.map((message) => ({
    _id: message._id.toString(),
    conversation: message.conversation,
    createdAt: message.createdAt,
    sender: message.sender,
    type: message.type,
    updatedAt: message.updatedAt,
    contextContent: message.contextContent,
    imageContent: message.imageContent,
    linkContent: message.linkContent,
    locationContent: message.locationContent,
    reactionContent: message.reactionContent,
    textContent: message.textContent,
  }));
};
