import amqplib, { Channel, Connection, ConsumeMessage } from "amqplib";
import { v4 as uuid4 } from "uuid";
import {
  AMQP_PATH,
  EXCHANGE_NAME,
  FOOD_SERVICE,
  FOOD_SERVICE_RPC_QUEUE,
  RPC_REQUEST_TIME_OUT,
  consoleLogger,
} from "../config";
import { getChannel } from "./channel";
import {
  RpcAction,
  RpcQueueName,
  RpcRequest,
  RpcResponse,
  RpcSource,
} from "../data";

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
        const response: RpcResponse = {};

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

const requestData = async <T>(
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
            reason: "timeout",
          },
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

export const RPCRequest = async <T>(
  RPCQueueName: RpcQueueName,
  request: RpcRequest
) => {
  const uuid = uuid4();
  return await requestData<T>(RPCQueueName, request, uuid);
};

export interface IRabbitMQOptions {
  path: string; // path amqp
  exchange: string; // exchange name of application
  service: string; // current service
  rpc: string; // current rpc service
}

export interface IBrokerMessage<T> {
  source: string;
  data: T;
  path: string;
}

export type TBrokerConsumer<T> = (msg: IBrokerMessage<T>) => void;

export type TRpcConsumer<T> = (req: RpcRequest<T>) => Promise<RpcResponse>;

export class RabbitMQ {
  protected _connection?: Connection;
  protected _channel?: Channel;
  protected _options: IRabbitMQOptions;
  protected _pathToBrokerListConsumers: Record<string, TBrokerConsumer<any>[]>;
  protected _actionToRpcConsumers: Record<string, TRpcConsumer<any>>;

  constructor(options: IRabbitMQOptions) {
    this._options = options;
    this._pathToBrokerListConsumers = {};
    this._actionToRpcConsumers = {};
    this.config(options);
  }

  private async config(options: IRabbitMQOptions): Promise<void> {
    await this.configChannel(options);
    await this.configListenQueue(options);
    await this.configRpcObserver(options);
  }

  private async configChannel(options: IRabbitMQOptions): Promise<Channel> {
    if (this._connection == null || this._channel == null) {
      const connection = await amqplib.connect(options.path);
      consoleLogger.info(`[MESSAGE BROKER] Connection established`);
      this._connection = connection;

      const channel = await connection.createChannel();
      this._channel = channel;
      consoleLogger.info(`[MESSAGE BROKER] Channel created`);

      return channel;
    }
    return this._channel;
  }

  // Bind exchange queue to service queue
  private async configListenQueue(options: IRabbitMQOptions): Promise<void> {
    const { exchange, service } = options;
    const channel = await this.configChannel(options);
    channel.assertExchange(exchange, "direct", { durable: true });
    consoleLogger.info(
      `[MESSAGE BROKER] [EXCHANGE] Create exchange with name ${exchange}`
    );
    const q = await channel.assertQueue("", { exclusive: true });
    consoleLogger.info(
      `[MESSAGE BROKER] [QUEUE] Create queue with name ${q.queue}`
    );
    consoleLogger.info(
      `[MESSAGE BROKER] [QUEUE] Waiting for messages in queue ${q.queue}`
    );

    channel.bindQueue(q.queue, exchange, service);
    consoleLogger.info(
      `[MESSAGE BROKER] [BINDING] Biding exchange ${exchange} and queue ${q.queue} with name ${service}`
    );

    channel.consume(q.queue, this.consumeBrokerMessage, {
      noAck: true,
    });
  }

  private consumeBrokerMessage(msg: ConsumeMessage | null) {
    if (msg == null) {
      return;
    }
    const content = msg.content.toString();
    try {
      const data = JSON.parse(content) as IBrokerMessage<unknown>;
      const path = data.path;
      const consumers = this._pathToBrokerListConsumers[path];
      if (consumers != null) {
        consumers.forEach((consumer) => consumer(data));
      }
    } catch (error) {
      consoleLogger.err("An broker message is wrong format:", content);
    }
  }

  listenMessage(path: string, consumer: TBrokerConsumer<any>): void {
    const consumers = this._pathToBrokerListConsumers[path];
    if (consumers == null) {
      this._pathToBrokerListConsumers[path] = [consumer];
    } else {
      consumers.push(consumer);
    }
  }

  publicMessage(target: string, path: string, data: object): void {
    const options = this._options;
    const messageToSend: IBrokerMessage<object> = {
      data: data,
      path: path,
      source: this._options.service,
    };
    this.configChannel(options).then((channel) => {
      channel.publish(
        options.exchange,
        target,
        Buffer.from(JSON.stringify(messageToSend))
      );
    });
  }

  private async configRpcObserver(options: IRabbitMQOptions) {
    const { rpc } = options;
    const channel = await this.configChannel(options);
    await channel.assertQueue(rpc, {
      durable: false,
    });
    channel.prefetch(1);
    channel.consume(
      rpc,
      async (msg: ConsumeMessage | null) => {
        if (msg != null) {
          const content = msg.content.toString();
          const response: RpcResponse = {};
          try {
            const request = JSON.parse(content) as RpcRequest;
            const action = request.action;
            const consumer = this._actionToRpcConsumers[action];
            if (consumer != null) {
              response.data = await consumer(request);
            }
          } catch (error) {
            response.err = {
              code: 500,
              reason: "unknown",
              target: "unknown",
            };
          }

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
  }

  listenRpc(action: RpcAction, consumer: TRpcConsumer<any>): void {
    this._actionToRpcConsumers[action] = consumer;
  }

  async requestData<T>(
    targetRpc: RpcSource,
    payload: any
  ): Promise<RpcResponse<T> | null> {
    const options = this._options;
    const channel = await this.configChannel(options);
    const q = await channel.assertQueue("", { exclusive: true });
    const uuid = uuid4();
    channel.sendToQueue(targetRpc, Buffer.from(JSON.stringify(payload)), {
      replyTo: q.queue,
      correlationId: uuid,
    });
    return new Promise((resolve, reject) => {
      // timeout
      const timeout = setTimeout(() => {
        channel.close();
        resolve({
          err: {
            code: 500,
            target: "timeout",
            reason: "timeout",
          },
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
  }

  static _instance?: RabbitMQ;

  static get instance(): RabbitMQ {
    if (this._instance == null) {
      this._instance = new RabbitMQ({
        exchange: EXCHANGE_NAME,
        path: AMQP_PATH,
        rpc: FOOD_SERVICE_RPC_QUEUE,
        service: FOOD_SERVICE,
      });
    }
    return this._instance;
  }
}
