import { useLocation } from "react-router-dom";
import { IPlaceExposed } from "../../../data";
import PlaceEditContextProvider from "./PlaceEditContext";
import PlaceEditForm from "./PlaceEditForm";

export default function PlaceCRUD() {
  const locationProps = useLocation();
  const receivedState = locationProps.state as IPlaceExposed | undefined;
  return (
    <PlaceEditContextProvider preData={receivedState}>
      <PlaceEditForm />
    </PlaceEditContextProvider>
  );
}
