import { ILocation, ResourceNotExistedError } from "../data";
import { User } from "../db/model";

export const setUserLocation = async (
  userId: string,
  location: ILocation
): Promise<ILocation> => {
  const user = await User.findById(userId);
  if (user == null) {
    throw new ResourceNotExistedError({
      message: `No user with id ${userId} found`,
      data: {
        target: "user",
        reason: "not-found",
      },
    });
  }
  const locationToSet: ILocation = {
    ...location,
    two_array: [location.coordinates.lng, location.coordinates.lat],
  };
  user.location = locationToSet;
  await user.save();
  return location;
};
