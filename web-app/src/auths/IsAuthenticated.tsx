import { useAuthenticationContext } from "../hooks/useAuthenticationContext";
import { Navigate } from "react-router";

interface AuthenticatedOptions {
  errorElement?: JSX.Element;
  redirectUrl?: string;
  withCallback?: boolean;
}

interface IAuthenticatedProps {
  children: React.ReactNode;
  options?: AuthenticatedOptions;
}

export default function IsAuthenticated({
  children,
  options,
}: IAuthenticatedProps): JSX.Element {
  const authentiationContext = useAuthenticationContext();
  const { errorElement, redirectUrl, withCallback } = options ?? {};
  if (authentiationContext.account.isAuthenticated === false) {
    if (redirectUrl === undefined && errorElement !== undefined) {
      return errorElement;
    }
    let url = redirectUrl ?? "/login";
    if (withCallback !== false) url += `?redirect=${window.location.pathname}`;
    return <Navigate to={url} replace />;
  }
  return <>{children}</>;
}
