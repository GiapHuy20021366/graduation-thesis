import { useParams } from "react-router-dom";
import UserViewerId from "./UserViewerId";

export default function UserViewerPage() {
  const params = useParams();
  const id = params.id;

  return <UserViewerId id={id} />;
}
