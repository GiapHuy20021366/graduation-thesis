import { useLocation } from "react-router-dom";
import FoodSharingForm from "./FoodSharingForm";
import FoodSharingFormContextProvider from "./FoodSharingFormContext";
import { IFoodPostData } from "../../../data";

export default function FoodSharingPage() {
  const locationProps = useLocation();
  const receivedState = locationProps.state as IFoodPostData | undefined;
  return (
    <FoodSharingFormContextProvider preData={receivedState}>
      <FoodSharingForm />
    </FoodSharingFormContextProvider>
  );
}
