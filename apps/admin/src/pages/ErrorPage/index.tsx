import React from "react";
import { Helmet } from "react-helmet";
import { MdRefresh } from "react-icons/md";
import { Link, useNavigate, useRouteError } from "react-router-dom";
import Button from "../../components/UI/Button";

interface Props {
  message?: string;
  outsideRouter?: boolean;
}

const ErrorDisplay: React.FC<Props> = ({ message, outsideRouter }) => {
  const navigate = useNavigate();
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center">
      <Helmet>
        <title>Awareness Admin | Oops!</title>
      </Helmet>
      <h1 className="text-4xl pb-3 font-extrabold">Oops!</h1>
      <p className="text-lg pb-2">Sorry, an unexpected error has occurred.</p>
      {!outsideRouter && (
        <Link to="/" className="text-blue-400 pb-2">
          Home
        </Link>
      )}
      <p className="opacity-60 font-light">{message}</p>
      <Button
        className="mt-4 flex items-center"
        onClick={() => {
          navigate(0);
        }}
      >
        <MdRefresh className="mr-2" />
        Refresh
      </Button>
    </div>
  );
};

export default ErrorDisplay;

export const ErrorPage = () => {
  const error = useRouteError() as { statusText?: string; message?: string };

  return <ErrorDisplay message={error.statusText || error.message} />;
};
