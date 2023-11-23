import { useAuthenticationContext } from "../contexts/useAuthenticationContext";
import { Navigate } from "react-router";

interface AuthenticatedOptions {
  forceLogout?: boolean;
  redirectUrl?: string;
}

interface IAuthenticatedProps {
  children: React.ReactNode;
  options?: AuthenticatedOptions;
}

export default function IsNotAuthenticated({
  children,
  options,
}: IAuthenticatedProps): JSX.Element {
  const authentiationContext = useAuthenticationContext();

  const { forceLogout, redirectUrl } = options ?? {};
  if (authentiationContext.auth != null) {
    if (forceLogout === true) {
      authentiationContext.logout();
      return <>{children}</>;
    }
    const urlParams = new URLSearchParams(window.location.href);
    const urlToRedirect = redirectUrl ?? urlParams.get("redirect") ?? "/";
    return <Navigate to={urlToRedirect} replace />;
  }

  return <>{children}</>;
}
