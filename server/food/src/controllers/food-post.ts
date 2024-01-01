import { NextFunction, Request, Response } from "express";
import {
	AuthLike,
	isAllNotEmptyString,
	isLocation,
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
	location?: any;
	categories?: string[];
	description?: string;
	quantity?: number;
	duration?: number;
	price?: number;
}

const validatePostFoodBody = (data: IPostFoodBody): void => {
	const {
		images,
		categories,
		description,
		duration,
		location,
		quantity,
		title,
		price
	} = data;

	// throw if not found
	throwErrorIfNotFound("images", images);
	throwErrorIfNotFound("title", title);
	throwErrorIfNotFound("location", location);
	throwErrorIfNotFound("categories", categories);
	throwErrorIfNotFound("description", description);
	throwErrorIfNotFound("duration", duration);
	throwErrorIfNotFound("quantity", quantity);
	throwErrorIfNotFound("price", price);

	// check data format
	throwErrorIfInvalidFormat(
		"images",
		images,
		[isAllNotEmptyString]
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
		[isLocation]
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
		images,
		title,
		location,
		categories,
		description,
		quantity,
		duration,
		price,
	} = req.body;
	postFoodService({
		user: auth._id,
		images: images!,
		title: title!,
		location: location!,
		categories: categories!,
		description: description!,
		quantity: quantity!,
		duration: new Date(duration!),
		price: price!,
	}).then(data => res.status(200).json(toResponseSuccessData(data)))
		.catch(next);
};
