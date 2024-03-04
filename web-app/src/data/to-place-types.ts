import { ItemAddedBy } from "./item-added-by";
import { PlaceType } from "./place-type";

export const toPlaceTypes = (addedBy: ItemAddedBy): PlaceType[] | undefined => {
  switch (addedBy) {
    case ItemAddedBy.ALL: {
      return;
    }
    case ItemAddedBy.PERSONAL: {
      return [PlaceType.PERSONAL];
    }
    case ItemAddedBy.VOLUNTEER: {
      return [PlaceType.VOLUNTEER];
    }
    case ItemAddedBy.PLACE: {
      return [
        PlaceType.EATERY,
        PlaceType.GROCERY,
        PlaceType.RESTAURANT,
        PlaceType.SUPERMARKET,
      ];
    }
  }
};
