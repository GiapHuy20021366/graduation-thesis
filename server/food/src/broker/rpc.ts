import { ConsumeMessage } from "amqplib";
import { v4 as uuid4 } from "uuid";
import { FOOD_SERVICE_RPC_QUEUE, RPC_REQUEST_TIME_OUT } from "../config";
import { getChannel } from "./channel";
import { RpcQueueName, RpcRequest, RpcResponse, RpcSource } from "../data";

export const RPCObserver = async () => {
  const channel = await getChannel();
  await channel.assertQueue(FOOD_SERVICE_RPC_QUEUE, {
    durable: false,
  });
  channel.prefetch(1);
  channel.consume(
    FOOD_SERVICE_RPC_QUEUE,
    async (msg: ConsumeMessage | null) => {
      if (msg != null) {
        const payload = JSON.parse(msg.content.toString()) as RpcRequest;
        switch (payload.source) {
          case RpcSource.FOOD: {
            // 
            break;
          }
          case RpcSource.MESSAGE: {
            // 
            break;
          }
          case RpcSource.USER: {
            // 
            break;
          }
        }
        const response: RpcResponse = {

        }

        // Implement response;
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

const requestData = async <T> (
  RPC_QUEUE_NAME: RpcQueueName,
  requestPayload: RpcRequest,
  uuid: string
): Promise<RpcResponse<T> | null> => {
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
        resolve({
          err: {
            code: 500,
            target: "timeout",
            reason: "timeout"
          }
        });
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

export const RPCRequest = async <T> (RPCQueueName: RpcQueueName, request: RpcRequest) => {
  const uuid = uuid4();
  return await requestData<T>(RPCQueueName, request, uuid);
};

