import { Navigate } from "react-router-dom";
import { useSigninCheck } from "reactfire";
import { Loader } from "./Loader";

export function RequireAuth({ children, redirectTo }) {
  const { status, data: signInCheckResult } = useSigninCheck();

  if (status === "loading") {
    return <Loader />;
  }

  if (signInCheckResult?.signedIn === true) {
    return <Navigate to={redirectTo} />;
  }
  return children;
}
