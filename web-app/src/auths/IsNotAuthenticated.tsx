import { useAuthenticationContext } from "../hooks/useAuthenticationContext";
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
  if (authentiationContext.account.isAuthenticated === true) {
    if (forceLogout === true) {
      authentiationContext.logout();
      return <>{children}</>;
    }
    const urlParams = new URLSearchParams(window.location.href);
    const urlToRedirect =
      redirectUrl ?? urlParams.get("redirect") ?? "/dashboard";
    return <Navigate to={urlToRedirect} replace />;
  }

  return <>{children}</>;
}
