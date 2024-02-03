import { useLocation } from "react-router-dom";
import { IPlace } from "../../../data";
import PlaceEditContextProvider from "./PlaceEditContext";
import PlaceEditForm from "./PlaceEditForm";

export default function PlaceCRUD() {
  const locationProps = useLocation();
  const receivedState = locationProps.state as IPlace | undefined;
  return (
    <PlaceEditContextProvider preData={receivedState}>
      <PlaceEditForm />
    </PlaceEditContextProvider>
  );
}
