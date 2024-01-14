import { RPCRequest } from "../broker";
import { IFoodPost, IFoodPostLocation, IFoodSearchParams, InternalError, ResourceNotExistedError, RpcAction, RpcQueueName, RpcSource } from "../data";
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
    const { lat, lng } = data.location.coordinates;
    const locationWith2D: IFoodPostLocation = {
        ...data.location,
        two_array: [lng, lat]
    }
    const foodPost = new FoodPost({
        ...data,
        location: locationWith2D,
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

export const searchFood = async (params: IFoodSearchParams): Promise<FoodPostDocument[]> => {
    const options: any = {
        $text: {
            $search: params.query
        },
    }

    const { currentLocation, maxDistance, categories, available, minQuantity, maxDuration, price, pagination, order } = params;

    // max distance on location
    if (currentLocation) {
        const maxDis = maxDistance != undefined ? maxDistance : Number.MAX_SAFE_INTEGER;
        options["location.two_array"] = {
            $geoWithin: {
                $centerSphere: [
                    [currentLocation.lng, currentLocation.lat],
                    maxDis / 6371
                ]
            }
        }
    }
    // categories
    if (categories) {
        options["categories"] = {
            $in: categories
        }
    }

    // Available
    if (available) {
        switch (available) {
            case "ALL":
                break;
            case "AVAILABLE_ONLY":
                options["duration"] = {
                    $gt: Date.now()
                }
                break;
            case "JUST_GONE":
                options["duration"] = {
                    $lte: Date.now()
                }
                break;
        }
    }

    // Quantity
    if (minQuantity) {
        options["quantity"] = {
            $gte: minQuantity
        }
    }

    // Max duration
    if (maxDuration) {
        options["duration"] = {
            $gte: Date.now() + maxDuration * 24 * 60 * 60 * 1000 // days to miliseconds
        }
    }

    if (price && price.active) {
        options["price"] = {
            $gte: price.min,
            $lte: price.max
        }
    }

    const sort: any = {
        score: { $meta: 'textScore' }
    }

    if (order) {
        sort["createdAt"] = order.orderNew;
        sort["price"] = order.orderPrice;
        sort["quantity"] = order.orderQuantity;

        if (currentLocation) {
            sort["location.two_array"] = order.orderDistance
        }
    }

    const query = FoodPost.find(
        options,
        {
            score: {
                $meta: 'textScore'
            }
        })
        .sort(sort);

    // Pagination
    if (pagination) {
        query.skip(pagination.skip).limit(pagination.limit);
    }

    const result = await query.exec();
    if (result == null) throw new InternalError();
    return result;
}