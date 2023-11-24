import { useAuthenticationContext } from "../contexts";

export default function DashBoard() {
  const auth = useAuthenticationContext();
  return (
    <>
      <button onClick={() => auth.logout()}>Logout</button>
    </>
  );
}
