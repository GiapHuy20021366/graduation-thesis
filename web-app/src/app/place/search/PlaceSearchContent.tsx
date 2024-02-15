import { usePlaceSearchContext } from "../../../hooks";
import PlaceSearchTabDistance from "./PlaceSearchTabDistance";
import PlaceSearchTabRating from "./PlaceSearchTabRating";
import PlaceSearchTabRelative from "./PlaceSearchTabRelative";
import { placeSearchTabs } from "./place-search-tab";

export default function PlaceSearchContent() {
  const searchContext = usePlaceSearchContext();
  const { tab } = searchContext;
  return (
    <>
      <PlaceSearchTabRelative active={tab === placeSearchTabs.RALATIVE} />
      <PlaceSearchTabDistance active={tab === placeSearchTabs.DISTANCE} />
      <PlaceSearchTabRating active={tab === placeSearchTabs.RATING} />
    </>
  );
}
