import { useAtom } from "jotai";
import React from "react";
import { Navigate } from "react-router-dom";
import { userAtom } from "../../../stores/user";
import CenteredSpinner from "../../UI/CenteredSpinner";

interface Props {
  children: React.ReactNode;
}

const RedirectToLogin: React.FC<Props> = ({ children }) => {
  const [{ user, loading }] = useAtom(userAtom);

  if (loading) return <CenteredSpinner />;

  if (user) return <>{children}</>;

  return <Navigate to="/auth/login" />;
};

export default RedirectToLogin;
