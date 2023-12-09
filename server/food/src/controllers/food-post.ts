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

interface IPostFoodBody {
	images?: string[];
	title?: string;
	location?: ICoordinates;
	categories?: string[];
	description?: string;
	quantity?: number;
	duration?: number;
	pickUpTimes?: number;
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
	return res.status(200).json(toResponseSuccessData({}));
};
