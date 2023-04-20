import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "../../../components/UI/Spinner";

interface Props {}

const AuthCallback: React.FC<Props> = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.invalidateQueries(["user-auth"]).then(() => {
      setTimeout(() => {
        navigate("/");
      }, 50);
    });
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center">
      <h1 className="text-lg font-bold">Retrieving User Info...</h1>
      <div className="h-4" />
      <Spinner />
    </div>
  );
};

export default AuthCallback;
