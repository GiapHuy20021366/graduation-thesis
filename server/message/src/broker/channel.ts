import amqplib, { Connection, Channel } from "amqplib";
import { AMQP_PATH } from "../config";

interface RabbitInfo {
  connection?: Connection;
  channel?: Channel
}
const rabbit: RabbitInfo = {
    connection: undefined,
    channel: undefined
}

export const getChannel = async (): Promise<Channel> => {
  if (rabbit.connection === undefined) {
    rabbit.connection = await amqplib.connect(AMQP_PATH);
  }
  if (rabbit.channel == undefined) {
    rabbit.channel = await rabbit.connection.createChannel();
  }
  return rabbit.channel;
};
