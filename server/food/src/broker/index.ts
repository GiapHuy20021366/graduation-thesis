import { MESSAGE_SERVICE } from "../config";
import { publishMessage } from "./broker";

export { getChannel } from "./channel";
export { withQueue, subscribeMessage, publishMessage, operations } from "./broker";
export { RPCObserver, RPCRequest } from "./rpc";

export const brokerChannel = {
    toMessageServiceQueue: (message: string) => publishMessage(MESSAGE_SERVICE, message)
}