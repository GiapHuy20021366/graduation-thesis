import { UploadApiResponse } from "cloudinary";
import { cloudinary } from "../config";
import { IImageExposed } from "../data";
import { Image } from "../db/model";
import md5 from "md5";

interface IImageInfo {
    base64: string;
    name: string;
}

export const saveImage = async (imageInfo: UploadApiResponse, md5: string): Promise<IImageExposed> => {
    const image = new Image({
        bytes: imageInfo.bytes,
        createdAt: imageInfo.created_at,
        exposedName: imageInfo.asset_id ?? "",
        format: imageInfo.format,
        height: imageInfo.height,
        md5: md5,
        publicId: imageInfo.public_id,
        width: imageInfo.width,
        resourceType: imageInfo.resource_type,
        secureUrl: imageInfo.secure_url,
        type: imageInfo.type,
        url: imageInfo.url
    });
    await image.save();
    return {
        name: image.exposedName,
        url: image.url,
        _id: image._id.toString()
    }
}

export const uploadImage = async (image: IImageInfo): Promise<IImageExposed> => {
    const md5Hash = md5(image.base64);
    const imageExisted = await Image.findByMd5(md5Hash);
    if (imageExisted != null) {
        return {
            name: imageExisted.exposedName,
            url: imageExisted.url,
            _id: imageExisted._id.toString()
        }
    }

    const imageInfo = await cloudinary.uploader.upload(image.base64, {});
    return saveImage(imageInfo, md5(image.base64));
}

export const uploadImages = async (images: IImageInfo[]): Promise<IImageExposed[]> => {
    return Promise.all(images.map((image) => uploadImage(image)));
}