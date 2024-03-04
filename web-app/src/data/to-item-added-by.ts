import { ItemAddedBy } from "./item-added-by";
import { PlaceType } from "./place-type";

export const toItemAddedBy = (value?: PlaceType[]): ItemAddedBy => {
  if (value == null) return ItemAddedBy.ALL;
  if (value.includes(PlaceType.PERSONAL)) return ItemAddedBy.PERSONAL;
  if (value.includes(PlaceType.VOLUNTEER)) return ItemAddedBy.VOLUNTEER;
  return ItemAddedBy.PLACE;
};
