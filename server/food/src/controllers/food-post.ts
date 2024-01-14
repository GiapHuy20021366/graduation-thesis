import { NextFunction, Request, Response } from "express";
import {
	AuthLike,
	IFoodSearchParams,
	InvalidDataError,
	isAllNotEmptyString,
	isLocation,
	isNumber,
	isObjectId,
	throwErrorIfInvalidFormat,
	throwErrorIfNotFound,
	toFoodSearchParams,
	toResponseSuccessData,
} from "../data";
import {
	postFood as postFoodService,
	findFoodPostById,
	searchFood as searchFoodService
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

	// throwErrorIfInvalidFormat(
	// 	"description",
	// 	description,
	// 	[isNotEmptyString]
	// );

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

	// throwErrorIfInvalidFormat(
	// 	"title",
	// 	title,
	// 	[isNotEmptyString]
	// );

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

export const findFoodPost = async (
	req: Request<{ id?: string }, {}, {}, {}>,
	res: Response,
	next: NextFunction
) => {
	const id = req.params.id;
	if (id == null || id.length === 0) {
		return next(new InvalidDataError({
			message: "Invalid food id",
			data: {
				target: "id",
				reason: "invalid"
			}
		}))
	}

	if (!isObjectId(id)) {
		return next(new InvalidDataError({
			message: "Invalid id format",
			data: {
				target: "id",
				reason: "invalid"
			}
		}))
	}

	findFoodPostById(id)
		.then(data => res.status(200).send(toResponseSuccessData(data)))
		.catch(next);
}

interface IFoodSearchBody extends Omit<IFoodSearchParams, "query"> {
	query?: string;
}

export const searchFoodPost = async (
	req: Request<{}, {}, IFoodSearchBody, {}>,
	res: Response,
	next: NextFunction
) => {
	const params = req.body;
	const query = params.query;
	if (typeof query !== "string" || !query) {
		return next(new InvalidDataError({
			data: {
				target: "query",
				reason: "no-query-found"
			}
		}));
	}
	const paramsToSerach = toFoodSearchParams(params);
	searchFoodService(paramsToSerach).then((data) => res.status(200).json(toResponseSuccessData(data))).catch(next);
}
