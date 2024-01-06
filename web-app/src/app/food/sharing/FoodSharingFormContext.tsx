import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useEffect,
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
} from "../../../data";

interface IFoodSharingFormContextProviderProps {
  children?: React.ReactNode;
}

interface IFoodSharingFormContext {
  images: (IImageExposed | null)[];
  categories: FoodCategory[];
  location: IFoodUpLoadLocation;
  price: number;
  duration: string;
  quantity: number;
  title: string;

  setImages: Dispatch<SetStateAction<(IImageExposed | null)[]>>;
  setCategories: Dispatch<SetStateAction<FoodCategory[]>>;
  setLocation: Dispatch<IFoodUpLoadLocation>;
  setCoordinates: (pos: ICoordinates) => void;
  setLocationName: (name: string) => void;
  setPrice: Dispatch<SetStateAction<number>>;
  setDuration: Dispatch<SetStateAction<string>>;
  setQuantity: Dispatch<SetStateAction<number>>;
  setTitle: Dispatch<SetStateAction<string>>;
}

export const FoodSharingFormContext = createContext<IFoodSharingFormContext>({
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

  setCategories: () => {},
  setDuration: () => {},
  setImages: () => {},
  setLocation: () => {},
  setCoordinates: () => {},
  setLocationName: () => {},
  setPrice: () => {},
  setQuantity: () => {},
  setTitle: () => {},
});

export default function FoodSharingFormContextProvider({
  children,
}: IFoodSharingFormContextProviderProps) {
  const [images, setImages] = useState<(IImageExposed | null)[]>([]);
  const [categories, setCategories] = useState<FoodCategory[]>([]);
  const [duration, setDuration] = useState<string>(
    convertDateToString(toNextMidnight(new Date()))
  );
  const [location, setLocation] = useState<IFoodUpLoadLocation>({
    name: "",
    coordinates: {
      lat: 0,
      lng: 0,
    },
  });

  const [price, setPrice] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(
    toQuantityLevel(QuantityType.TOTAL_GOOD)
  );
  const [title, setTitle] = useState<string>("");

  const setLocationName = (name: string) => {
    setLocation({
        ...location,
        name: name
    })
  }

  const setCoordinates = (pos: ICoordinates) => {
    setLocation({
        ...location,
        coordinates: pos
    })
  }

  useEffect(() => {
    if (navigator.geolocation) {
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
  }, []);

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
        setCoordinates
      }}
    >
      {children}
    </FoodSharingFormContext.Provider>
  );
}
