import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useState,
} from "react";
import {
  FoodCategory,
  ILocation,
  IPlaceExposed,
  PlaceType,
} from "../../../data";

interface IPlaceEditContext {
  exposedName: string;
  description?: string;
  categories: FoodCategory[];
  location?: ILocation;
  avatar?: string;
  images: string[];
  type: PlaceType;
  isEditable?: boolean;
  meta?: IPlaceExposed;

  setExposeName: Dispatch<SetStateAction<string>>;
  setDescription: Dispatch<SetStateAction<string | undefined>>;
  setCategories: Dispatch<SetStateAction<FoodCategory[]>>;
  setLocation: Dispatch<SetStateAction<ILocation | undefined>>;
  setavatar: Dispatch<SetStateAction<string | undefined>>;
  setImages: Dispatch<SetStateAction<string[]>>;
  setType: Dispatch<SetStateAction<PlaceType>>;
}

const defaultPlaceEditContext: IPlaceEditContext = {
  categories: [],
  exposedName: "",
  images: [],
  type: PlaceType.VOLUNTEER,

  setavatar: () => {},
  setCategories: () => {},
  setDescription: () => {},
  setExposeName: () => {},
  setImages: () => {},
  setLocation: () => {},
  setType: () => {},
};

export const PlaceEditContext = createContext<IPlaceEditContext>(
  defaultPlaceEditContext
);

interface IPlaceEditContextProviderProps {
  children?: React.ReactNode;
  preData?: IPlaceExposed;
}

export default function PlaceEditContextProvider({
  children,
  preData,
}: IPlaceEditContextProviderProps) {
  const dataToEdit = preData ?? defaultPlaceEditContext;

  const [exposedName, setExposeName] = useState<string>(dataToEdit.exposedName);
  const [description, setDescription] = useState<string | undefined>(
    dataToEdit.description ?? ""
  );
  const [categories, setCategories] = useState<FoodCategory[]>(
    dataToEdit.categories
  );
  const [location, setLocation] = useState<ILocation | undefined>(
    dataToEdit.location
  );
  const [avatar, setavatar] = useState<string | undefined>(
    dataToEdit.avatar
  );

  const [images, setImages] = useState<string[]>(dataToEdit.images);
  const [type, setType] = useState<PlaceType>(dataToEdit.type);

  return (
    <PlaceEditContext.Provider
      value={{
        categories,
        exposedName,
        images,
        location,
        type,
        avatar,
        description,
        isEditable: preData != null,

        setavatar,
        setCategories,
        setDescription,
        setExposeName,
        setImages,
        setLocation,
        setType,

        meta: preData,
      }}
    >
      {children}
    </PlaceEditContext.Provider>
  );
}
