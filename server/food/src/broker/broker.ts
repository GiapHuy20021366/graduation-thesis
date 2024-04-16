import { ConsumeMessage } from "amqplib";
import { EXCHANGE_NAME, FOOD_SERVICE, consoleLogger } from "../config";
import { getChannel } from "./channel";

export const operations = {
  mail: {
    ACTIVE_MANUAL_ACCOUNT: "ACTIVE_MANUAL_ACCOUNT",
    NEW_ACCOUNT_CREATED: "NEW_ACCOUNT_CREATED",
  },
} as const;

// Message Broker
export const withQueue = async () => {
  try {
    const channel = await getChannel();
    await channel.assertQueue(EXCHANGE_NAME, {
      durable: true,
    });
    return channel;
  } catch (err) {
    throw err;
  }
};

export const publishMessage = async (targetService: string, msg: string) => {
  const channel = await getChannel();
  channel.publish(EXCHANGE_NAME, targetService, Buffer.from(msg));
};

export const subscribeMessage = async () => {
  const channel = await getChannel();
  await channel.assertExchange(EXCHANGE_NAME, "direct", { durable: true });
  consoleLogger.info(
    `[MESSAGE BROKER] [EXCHANGE] Create exchange with name ${EXCHANGE_NAME}`
  );
  const q = await channel.assertQueue("", { exclusive: true });
  consoleLogger.info(
    `[MESSAGE BROKER] [QUEUE] Create queue with name ${q.queue}`
  );
  consoleLogger.info(
    `[MESSAGE BROKER] [QUEUE] Waiting for messages in queue ${q.queue}`
  );

  channel.bindQueue(q.queue, EXCHANGE_NAME, FOOD_SERVICE);
  consoleLogger.info(
    `[MESSAGE BROKER] [BINDING] Biding exchange ${EXCHANGE_NAME} and queue ${q.queue} with name ${FOOD_SERVICE}`
  );

  channel.consume(
    q.queue,
    (msg: ConsumeMessage | null) => {
      if (msg != null) {
        console.log("the message is:", msg.content.toString());
      }
      console.log("[X] received");
    },
    {
      noAck: true,
    }
  );
};
