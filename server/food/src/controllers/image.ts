import { NextFunction, Request, Response } from "express";
import { InvalidDataError, toResponseSuccessData } from "../data";
import { uploadImages as uploadImagesService } from "../services";

interface ImageInfo {
    name: string;
    base64: string;
}

interface IUploadImagesBody {
    images?: string | ImageInfo[];
}

export const uploadImages = async (req: Request<{}, {}, IUploadImagesBody, {}>, res: Response, next: NextFunction) => {
    let images = req.body.images;
    if (images == null) {
        return next(new InvalidDataError({
            message: "No images found"
        }))
    }
    if (typeof images === "string") {
        try {
            images = JSON.parse(images) as ImageInfo[];
            if (!images.every((image) => image.base64 && image.name)) {
                return next(new InvalidDataError({
                    message: "Invalid data format"
                }))
            }
        } catch (error) {
            return next(error);
        }
    }
    
    await uploadImagesService(images)
        .then((result) => {
            return res.status(200).json(toResponseSuccessData(result));
        })
        .catch(next);

}