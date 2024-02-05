import { useAuthContext } from "../../../hooks";
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
  const authentiationContext = useAuthContext();
  const { errorElement, redirectUrl, withCallback } = options ?? {};
  if (authentiationContext.auth == null) {
    if (redirectUrl === undefined && errorElement !== undefined) {
      return errorElement;
    }
    let url = redirectUrl ?? "/signin";
    if (withCallback !== false)
      url += `?redirect=${location.pathname + location.search}`;
    return <Navigate to={url} replace />;
  }
  return <>{children}</>;
}
