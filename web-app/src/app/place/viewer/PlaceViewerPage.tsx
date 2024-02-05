import { useParams } from "react-router-dom";
import PlaceViewerId from "./PlaceViewerId";

export default function PlaceViewerPage() {
  const params = useParams();
  const id = params.id;

  return <PlaceViewerId id={id} />;
}
