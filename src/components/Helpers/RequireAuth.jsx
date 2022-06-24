import { Navigate } from "react-router-dom";
import { useSigninCheck } from "reactfire";
import { Loader } from "./Loader";
// import { useReactiveVar } from '@apollo/client';
// import { reactiveVarToken } from '../../GraphQLApp/reactiveVars';

export function RequireAuth({ children, redirectTo }) {
  const { status, data: signInCheckResult } = useSigninCheck();
  const sessionStorageDataJSON = sessionStorage.getItem("storageData");
  // const token = useReactiveVar(reactiveVarToken);

  if (status === "loading") {
    return <Loader />;
  }

  console.log(signInCheckResult);

  if (signInCheckResult?.signedIn === true) {
    return <Navigate to={redirectTo} />;
  }
  return children;
}
