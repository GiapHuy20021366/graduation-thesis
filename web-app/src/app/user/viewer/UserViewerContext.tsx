import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useState,
} from "react";
import {
  FoodCategory,
  ILocation,
  IUserExposedFollower,
  IUserExposedWithFollower,
} from "../../../data";
import { useAuthContext } from "../../../hooks";

interface IUserViewerContextProviderProps {
  children?: React.ReactNode;
  user: IUserExposedWithFollower;
}

interface IUserViewerContext {
  firstName: string;
  lastName: string;
  exposedName: string;
  avatar?: string;
  description?: string;
  location?: ILocation;
  categories: FoodCategory[];
  isEditable: boolean;
  subcribers?: number;
  userFollow?: IUserExposedFollower;
  createdAt: Date;
  active: boolean;
  _id: string;

  setFirstName: Dispatch<SetStateAction<string>>;
  setLastName: Dispatch<SetStateAction<string>>;
  setExposedName: Dispatch<SetStateAction<string>>;
  setAvatar: Dispatch<SetStateAction<string | undefined>>;
  setDescription: Dispatch<SetStateAction<string | undefined>>;
  setLocation: Dispatch<SetStateAction<ILocation | undefined>>;
  setCategories: Dispatch<SetStateAction<FoodCategory[]>>;
  setSubcribers: Dispatch<SetStateAction<number | undefined>>;
  setUserFollow: Dispatch<SetStateAction<IUserExposedFollower | undefined>>;
}

export const UserViewerContext = createContext<IUserViewerContext>({
  categories: [],
  exposedName: "",
  firstName: "",
  isEditable: false,
  lastName: "",
  createdAt: new Date(),
  active: true,
  _id: "",

  setAvatar: () => {},
  setCategories: () => {},
  setDescription: () => {},
  setExposedName: () => {},
  setFirstName: () => {},
  setLastName: () => {},
  setLocation: () => {},
  setSubcribers: () => {},
  setUserFollow: () => {},
});

export default function UserViewerContextProvider({
  children,
  user,
}: IUserViewerContextProviderProps) {
  const [firstName, setFirstName] = useState<string>(user.firstName);
  const [lastName, setLastName] = useState<string>(user.lastName);
  const [exposedName, setExposedName] = useState<string>(user.exposedName);
  const [avatar, setAvatar] = useState<string | undefined>(user.avatar);
  const [description, setDescription] = useState<string | undefined>(
    user.description
  );
  const [location, setLocation] = useState<ILocation | undefined>(
    user.location?.name ? user.location : undefined
  );
  const [categories, setCategories] = useState<FoodCategory[]>(
    user.categories ?? []
  );
  const [subcribers, setSubcribers] = useState<number | undefined>(
    user.subcribers ?? 0
  );
  const [userFollow, setUserFollow] = useState<
    IUserExposedFollower | undefined
  >(user.userFollow);

  const authContext = useAuthContext();
  const isEditable = authContext.account?._id === user._id;
  return (
    <UserViewerContext.Provider
      value={{
        categories,
        exposedName,
        firstName,
        isEditable,
        lastName,
        setAvatar,
        setCategories,
        setDescription,
        setExposedName,
        setFirstName,
        setLastName,
        setLocation,
        setSubcribers,
        setUserFollow,
        avatar,
        description,
        location,
        subcribers,
        userFollow,
        active: user.active,
        createdAt: user.createdAt,
        _id: user._id,
      }}
    >
      {children}
    </UserViewerContext.Provider>
  );
}
