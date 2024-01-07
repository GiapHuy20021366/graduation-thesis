import { RPCRequest } from "../broker";
import { IFoodPost, InternalError, ResourceNotExistedError, RpcAction, RpcQueueName, RpcSource } from "../data";
import { FoodPost, FoodPostDocument } from "../db/model";

interface IPostFoodData extends Omit<IFoodPost, 'user'> {
    user: string;
}

interface IPostFoodReturn {
    _id: string;
    createdAt: Date;
    updatedAt: Date;
}

interface IRpcUserInfo {
    _id: string;
    firstName: string;
    lastName: string;
}

export const postFood = async (data: IPostFoodData): Promise<IPostFoodReturn> => {
    const rpcUser = await RPCRequest<IRpcUserInfo>(RpcQueueName.RPC_USER, {
        source: RpcSource.FOOD,
        action: RpcAction.USER_RPC_GET_INFO,
        payload: {
            _id: data.user
        }
    });
    if (rpcUser == null) {
        throw new InternalError({
            data: {
                target: "rpc-user",
                reason: "unknown"
            }
        });
    }
    if (rpcUser.data == null) {
        throw new InternalError({
            data: {
                target: "rpc-user",
                reason: "unknown"
            }
        })
    }
    const user = rpcUser.data;
    const foodPost = new FoodPost({
        ...data,
        user: {
            _id: user._id,
            exposeName: user.firstName + " " + user.lastName
        }
    });
    await foodPost.save();
    return {
        _id: foodPost._id,
        createdAt: foodPost.createdAt,
        updatedAt: foodPost.updatedAt,
    }
}

export const findFoodPostById = async (id: string): Promise<FoodPostDocument> => {
    const foodPost = await FoodPost.findById(id);
    if (foodPost == null) {
        throw new ResourceNotExistedError({
            message: `No food post with id ${id} found`,
            data: {
                target: "id",
                reason: "not-found"
            }
        })
    }
    return foodPost;
}