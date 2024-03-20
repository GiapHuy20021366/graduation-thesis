import { useParams } from "react-router-dom";
import UserViewerId from "./UserViewerId";
import { useAuthContext } from "../../../hooks";

export default function UserViewerPage() {
  const params = useParams();
  const id = params.id;
  const authContext = useAuthContext();
  const account = authContext.account;

  return <UserViewerId id={id ?? account?._id} />;
}
