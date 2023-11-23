import { ConsumeMessage } from "amqplib";
import { EXCHANGE_NAME, MESSAGE_SERVICE, consoleLogger } from "../config";
import { getChannel } from "./channel";
import { ManualAccountInfo, sendActiveManualAccount } from "../services";

export const operations = {
  mail: {
    ACTIVE_MANUAL_ACCOUNT: "ACTIVE_MANUAL_ACCOUNT"
  }
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
  consoleLogger.info(`[MESSAGE BROKER] [EXCHANGE] Create exchange with name ${EXCHANGE_NAME}`)
  const q = await channel.assertQueue("", { exclusive: true });
  consoleLogger.info(`[MESSAGE BROKER] [QUEUE] Create queue with name ${q.queue}`);
  consoleLogger.info(`[MESSAGE BROKER] [QUEUE] Waiting for messages in queue ${q.queue}`)

  channel.bindQueue(q.queue, EXCHANGE_NAME, MESSAGE_SERVICE);
  consoleLogger.info(`[MESSAGE BROKER] [BINDING] Biding exchange ${EXCHANGE_NAME} and queue ${q.queue} with name ${MESSAGE_SERVICE}`);

  channel.consume(
    q.queue,
    (msg: ConsumeMessage | null) => {
      if (msg != null) {
        const message = msg.content.toString();
        let parsed: { [key: string]: any; } | null = null;
        try {
          parsed = JSON.parse(message);
          if (parsed === null) {
            return;
          }
          
          consoleLogger.info("[MESSAGE BROKER] ", "recieved message from ", parsed.from, parsed);
          
          exeOperation(parsed).then((result: boolean) => {
            if (result === false) {
              consoleLogger.err("Cannot to execute operation with data ", parsed);
            }
          });

        } catch (error) {
          consoleLogger.err("Error when parsed message", error);
        }
      }
    },
    {
      noAck: true,
    }
  );
};

export const exeOperation = async (info: {[key: string]: any}): Promise<boolean> => {

  try {
    switch (info.operation) {
      case operations.mail.ACTIVE_MANUAL_ACCOUNT: {
        const accountInfo = info as ManualAccountInfo;
        const messageInfo = await sendActiveManualAccount(accountInfo);
        if (messageInfo === null) {
          return false;
        }
        break;
      }
    }
  } catch (error) {
    consoleLogger.err("Error while execute operation", error);
    return false;
  }

  return true;
}