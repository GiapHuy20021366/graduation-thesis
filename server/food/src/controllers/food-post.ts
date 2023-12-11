import { NextFunction, Request, Response } from "express";
import {
	AuthLike,
	ICoordinates,
	isAllNotEmptyString,
	isAllObjectId,
	isCoordinates,
	isNotEmptyString,
	isNumber,
	throwErrorIfInvalidFormat,
	throwErrorIfNotFound,
	toResponseSuccessData,
} from "../data";
import {
	postFood as postFoodService
} from "../services";

interface IPostFoodBody {
	images?: string[];
	title?: string;
	location?: ICoordinates;
	categories?: string[];
	description?: string;
	quantity?: number;
	duration?: number;
	pickUpTimes?: number;
	cost?: number;
}

const validatePostFoodBody = (data: IPostFoodBody): void => {
	const {
		images,
		categories,
		description,
		duration,
		location,
		pickUpTimes,
		quantity,
		title,
		cost
	} = data;

	// throw if not found
	throwErrorIfNotFound("images", images);
	throwErrorIfNotFound("categories", categories);
	throwErrorIfNotFound("description", description);
	throwErrorIfNotFound("duration", duration);
	throwErrorIfNotFound("location", location);
	throwErrorIfNotFound("pickUpTimes", pickUpTimes);
	throwErrorIfNotFound("quantity", quantity);
	throwErrorIfNotFound("title", title);
	throwErrorIfNotFound("cost", cost);

	// check data format
	throwErrorIfInvalidFormat(
		"images",
		images,
		[isAllObjectId]
	);

	throwErrorIfInvalidFormat(
		"categories",
		categories,
		[isAllNotEmptyString]
	);

	throwErrorIfInvalidFormat(
		"description",
		description,
		[isNotEmptyString]
	);

	throwErrorIfInvalidFormat(
		"duration",
		duration,
		[isNumber]
	);

	throwErrorIfInvalidFormat(
		"location",
		location,
		[isCoordinates]
	);

	throwErrorIfInvalidFormat(
		"pickUpTimes",
		pickUpTimes,
		[isNumber]
	);

	throwErrorIfInvalidFormat(
		"quantity",
		quantity,
		[isNumber]
	);

	throwErrorIfInvalidFormat(
		"title",
		title,
		[isNotEmptyString]
	);

};

export const postFood = async (
	req: Request<{}, {}, IPostFoodBody, {}>,
	res: Response,
	next: NextFunction
) => {
	try {
		validatePostFoodBody(req.body);
	} catch (error) {
		return next(error);
	}
	const auth = req.authContext as AuthLike;
	const {
		categories,
		cost,
		description,
		duration,
		images,
		location,
		pickUpTimes,
		quantity,
		title
	} = req.body;
	postFoodService({
		categories: categories!,
		cost: cost!,
		description: description!,
		duration: duration!,
		location: location!,
		pickUpTimes: pickUpTimes!,
		quantity: quantity!,
		title: title!,
		user: auth._id,
		images: images!
	}).then(data => res.status(200).json(toResponseSuccessData(data)))
		.catch(next);
};
