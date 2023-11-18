import { useLocation } from "react-router";
import SignUpForm from "./SignUpForm";
import SignInForm from "./SignInFrom";

type QParam = "login" | "register" | undefined | null;

export default function LoginPage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const qParam: QParam = queryParams.get("q") as QParam;
  console.log(qParam);

  return (
    <>
    {
      qParam === "register" && <SignUpForm/>
    }
    {
      qParam !== "register" && <SignInForm/>
    }
    </>
  );
}
