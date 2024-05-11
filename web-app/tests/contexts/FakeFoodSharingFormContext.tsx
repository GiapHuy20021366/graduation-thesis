import React from "react";
import {
  FoodSharingFormContext,
  IFoodSharingFormContext,
} from "../../src/app/food/sharing/FoodSharingFormContext";
import { IFoodPostExposedWithLike } from "../../src/data";
import { vi } from "vitest";

export interface IFoodUploadContextData
  extends Pick<
    IFoodSharingFormContext,
    | "categories"
    | "description"
    | "duration"
    | "images"
    | "isEditable"
    | "location"
    | "place"
    | "price"
    | "quantity"
    | "title"
  > {}

export default function FakeFoodSharingFormContext({
  children,
  data,
  preData,
}: {
  children?: React.ReactNode;
  data: IFoodUploadContextData;
  preData?: IFoodPostExposedWithLike;
}) {
  return (
    <FoodSharingFormContext.Provider
      value={{
        // From input
        categories: data.categories,
        description: data.description,
        duration: data.duration,
        images: data.images,
        isEditable: data.isEditable,
        location: data.location,
        price: data.price,
        quantity: data.quantity,
        title: data.title,
        place: data.place,
        // Fake
        setCategories: vi.fn(),
        setCoordinates: vi.fn(),
        setDescription: vi.fn(),
        setDuration: vi.fn(),
        setImages: vi.fn(),
        setLocation: vi.fn(),
        setLocationName: vi.fn(),
        setPlace: vi.fn(),
        setPrice: vi.fn(),
        setQuantity: vi.fn(),
        setTitle: vi.fn(),
        editDataRef: preData ? { current: preData } : undefined,
      }}
    >
      {children}
    </FoodSharingFormContext.Provider>
  );
}
