import { ConsumeMessage } from "amqplib";
import { v4 as uuid4 } from "uuid";
import { USER_SERVICE_RPC_QUEUE, RPC_REQUEST_TIME_OUT } from "../config";
import { getChannel } from "./channel";
import { RpcQueueName, RpcRequest } from "../data";
import consum from "./rpc-consumer";

export const RPCObserver = async () => {
  const channel = await getChannel();
  await channel.assertQueue(USER_SERVICE_RPC_QUEUE, {
    durable: false,
  });
  channel.prefetch(1);
  channel.consume(
    USER_SERVICE_RPC_QUEUE,
    async (msg: ConsumeMessage | null) => {
      if (msg != null) {
        const request = JSON.parse(msg.content.toString()) as RpcRequest;

        const response = await consum(request);

        channel.sendToQueue(
          msg.properties.replyTo,
          Buffer.from(JSON.stringify(response)),
          {
            correlationId: msg.properties.correlationId,
          }
        );
        channel.ack(msg);
      }
    },
    {
      noAck: false,
    }
  );
};

const requestData = async (
  RPC_QUEUE_NAME: string, // target service rpc queue
  requestPayload: any,
  uuid: string
): Promise<string | null> => {
  try {
    const channel = await getChannel();

    const q = await channel.assertQueue("", { exclusive: true });

    channel.sendToQueue(
      RPC_QUEUE_NAME,
      Buffer.from(JSON.stringify(requestPayload)),
      {
        replyTo: q.queue,
        correlationId: uuid,
      }
    );

    return new Promise((resolve, reject) => {
      // timeout
      const timeout = setTimeout(() => {
        channel.close();
        resolve("Request time out!");
      }, RPC_REQUEST_TIME_OUT);

      channel.consume(
        q.queue,
        (msg: ConsumeMessage | null) => {
          if (msg != null) {
            if (msg.properties.correlationId == uuid) {
              clearTimeout(timeout);
              resolve(JSON.parse(msg.content.toString()));
            } else {
              reject("Data not found!");
            }
          }
        },
        {
          noAck: true,
        }
      );
    });
  } catch (error) {
    return null;
  }
};

export const RPCRequest = async (
  RPCQueueName: RpcQueueName,
  requestPayload: RpcRequest
) => {
  const uuid = uuid4();
  return await requestData(RPCQueueName, requestPayload, uuid);
};
