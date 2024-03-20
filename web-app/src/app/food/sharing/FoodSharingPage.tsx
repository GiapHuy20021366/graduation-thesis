import { useLocation } from "react-router-dom";
import FoodSharingForm from "./FoodSharingForm";
import FoodSharingFormContextProvider from "./FoodSharingFormContext";
import { IFoodPostExposedWithLike } from "../../../data";

export default function FoodSharingPage() {
  const locationProps = useLocation();
  const receivedState = locationProps.state as
    | IFoodPostExposedWithLike
    | undefined;
  const params = new URLSearchParams(location.search);
  const place = params.get("place");
  return (
    <FoodSharingFormContextProvider preData={receivedState} place={place}>
      <FoodSharingForm />
    </FoodSharingFormContextProvider>
  );
}
