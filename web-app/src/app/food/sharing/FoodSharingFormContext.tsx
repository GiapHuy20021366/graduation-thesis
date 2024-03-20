import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  FoodCategory,
  ICoordinates,
  IFoodUpLoadLocation,
  IImageExposed,
  QuantityType,
  convertDateToString,
  toNextMidnight,
  toQuantityLevel,
  IFoodPostExposedWithLike,
} from "../../../data";

interface IFoodSharingFormContext {
  images: (IImageExposed | null)[];
  categories: FoodCategory[];
  location: IFoodUpLoadLocation;
  price: number;
  duration: string;
  quantity: number;
  title: string;
  description: string;
  place?: string;
  isEditable: boolean;

  setImages: Dispatch<SetStateAction<(IImageExposed | null)[]>>;
  setCategories: Dispatch<SetStateAction<FoodCategory[]>>;
  setLocation: Dispatch<IFoodUpLoadLocation>;
  setCoordinates: (pos: ICoordinates) => void;
  setLocationName: (name: string) => void;
  setPrice: Dispatch<SetStateAction<number>>;
  setDuration: Dispatch<SetStateAction<string>>;
  setQuantity: Dispatch<SetStateAction<number>>;
  setTitle: Dispatch<SetStateAction<string>>;
  setDescription: Dispatch<SetStateAction<string>>;
  setPlace: Dispatch<SetStateAction<string | undefined>>;

  editDataRef?: React.MutableRefObject<IFoodPostExposedWithLike | undefined>;
}

const defaultSharingContext: IFoodSharingFormContext = {
  images: [],
  categories: [],
  duration: convertDateToString(toNextMidnight(new Date())),
  location: {
    name: "",
    coordinates: {
      lat: 0,
      lng: 0,
    },
  },
  price: 0,
  quantity: toQuantityLevel(QuantityType.TOTAL_GOOD),
  title: "",
  description: "",
  isEditable: false,

  setCategories: () => {},
  setDuration: () => {},
  setImages: () => {},
  setLocation: () => {},
  setCoordinates: () => {},
  setLocationName: () => {},
  setPrice: () => {},
  setQuantity: () => {},
  setTitle: () => {},
  setDescription: () => {},
  setPlace: () => {},
};

export const FoodSharingFormContext = createContext<IFoodSharingFormContext>(
  defaultSharingContext
);

const toImageExposeds = (
  imgs?: string[] | (IImageExposed | null)[]
): IImageExposed[] => {
  if (imgs == null) return [];
  return imgs.map((img, idx) => {
    if (typeof img === "string")
      return {
        _id: String(idx),
        name: String(idx),
        url: img,
      };
    else return img;
  }) as IImageExposed[];
};

interface IFoodSharingFormContextProviderProps {
  children?: React.ReactNode;
  preData?: IFoodPostExposedWithLike;
  place?: string | null;
}

export default function FoodSharingFormContextProvider({
  children,
  preData,
  place: targetPlace,
}: IFoodSharingFormContextProviderProps) {
  // Props state from edit function
  const defaultData = preData ?? defaultSharingContext;
  const editDataRef = useRef(preData);

  const [images, setImages] = useState<(IImageExposed | null)[]>(
    toImageExposeds(defaultData?.images)
  );

  const [categories, setCategories] = useState<FoodCategory[]>(
    defaultData.categories
  );

  const [duration, setDuration] = useState<string>(
    preData != null
      ? convertDateToString(new Date(defaultData.duration))
      : (defaultData.duration as string)
  );

  const [location, setLocation] = useState<IFoodUpLoadLocation>(
    defaultData.location
  );

  const [price, setPrice] = useState<number>(defaultData.price);
  const [quantity, setQuantity] = useState<number>(defaultData.quantity);
  const [title, setTitle] = useState<string>(defaultData.title);
  const [description, setDescription] = useState<string>(
    defaultData.description ?? ""
  );
  const [place, setPlace] = useState<string | undefined>(
    targetPlace ??
      (typeof preData?.place === "string"
        ? preData?.place
        : preData?.place?._id)
  );

  const setLocationName = (name: string) => {
    setLocation({
      ...location,
      name: name,
    });
  };

  const setCoordinates = (pos: ICoordinates) => {
    setLocation({
      ...location,
      coordinates: pos,
    });
  };

  useEffect(() => {
    if (preData == null && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setLocation({
            name: "My Location",
            coordinates: pos,
          });
        },
        (error: GeolocationPositionError) => {
          console.log(error);
        }
      );
    }
  }, [preData]);

  return (
    <FoodSharingFormContext.Provider
      value={{
        images,
        setImages,
        categories,
        setCategories,
        duration,
        setDuration,
        location,
        setLocation,
        price,
        setPrice,
        quantity,
        setQuantity,
        title,
        setTitle,
        setLocationName,
        setCoordinates,
        description,
        setDescription,
        place,
        setPlace,

        isEditable: preData != null,
        editDataRef,
      }}
    >
      {children}
    </FoodSharingFormContext.Provider>
  );
}
