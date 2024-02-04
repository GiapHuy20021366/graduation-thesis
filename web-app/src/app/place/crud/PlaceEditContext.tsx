import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useState,
} from "react";
import { FoodCategory, ILocation, IPlace, PlaceType } from "../../../data";

interface IPlaceEditContext {
  exposeName: string;
  description?: string;
  categories: FoodCategory[];
  location?: ILocation;
  avartar?: string;
  images: string[];
  type: PlaceType;
  isEditable?: boolean;

  setExposeName: Dispatch<SetStateAction<string>>;
  setDescription: Dispatch<SetStateAction<string | undefined>>;
  setCategories: Dispatch<SetStateAction<FoodCategory[]>>;
  setLocation: Dispatch<SetStateAction<ILocation | undefined>>;
  setAvartar: Dispatch<SetStateAction<string | undefined>>;
  setImages: Dispatch<SetStateAction<string[]>>;
  setType: Dispatch<SetStateAction<PlaceType>>;
}

const defaultPlaceEditContext: IPlaceEditContext = {
  categories: [],
  exposeName: "",
  images: [],
  type: PlaceType.PERSONAL,

  setAvartar: () => {},
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
  preData?: IPlace;
}

export default function PlaceEditContextProvider({
  children,
  preData,
}: IPlaceEditContextProviderProps) {
  const dataToEdit = preData ?? defaultPlaceEditContext;

  const [exposeName, setExposeName] = useState<string>(dataToEdit.exposeName);
  const [description, setDescription] = useState<string | undefined>(
    dataToEdit.description ?? ""
  );
  const [categories, setCategories] = useState<FoodCategory[]>(
    dataToEdit.categories
  );
  const [location, setLocation] = useState<ILocation | undefined>(
    dataToEdit.location
  );
  const [avartar, setAvartar] = useState<string | undefined>(
    dataToEdit.avartar
  );

  const [images, setImages] = useState<string[]>(dataToEdit.images);
  const [type, setType] = useState<PlaceType>(dataToEdit.type);

  return (
    <PlaceEditContext.Provider
      value={{
        categories,
        exposeName,
        images,
        location,
        type,
        avartar,
        description,
        isEditable: preData != null,

        setAvartar,
        setCategories,
        setDescription,
        setExposeName,
        setImages,
        setLocation,
        setType,
      }}
    >
      {children}
    </PlaceEditContext.Provider>
  );
}
