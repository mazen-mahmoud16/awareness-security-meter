import { useAtom } from "jotai";
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { userAtom } from "../../../atoms/user";
import CenteredSpinner from "../../UI/CenteredSpinner";

interface Props {
  children: React.ReactNode;
}

const RedirectFromLogin: React.FC<Props> = ({ children }) => {
  const [{ user, loading }] = useAtom(userAtom);
  const location = useLocation();

  if (loading) return <CenteredSpinner />;

  if (user) return <Navigate to="/" state={{ from: location }} replace />;

  return <>{children}</>;
};

export default RedirectFromLogin;
