import React from "react";
import { userAtom } from "../../../stores/user";
import { useAtom } from "jotai";
import Spinner from "../../UI/Spinner";
import { Navigate, Outlet, useLocation } from "react-router-dom";
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
