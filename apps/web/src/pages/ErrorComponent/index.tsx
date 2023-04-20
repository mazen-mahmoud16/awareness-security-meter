import React from "react";
import { MdRefresh } from "react-icons/md";
import { Link } from "react-router-dom";
import Button from "../../components/UI/Button";

interface Props {
  message?: string;
  to?: string;
  toMessage?: string;
  code?: string | number;
}

const ErrorComponent: React.FC<Props> = ({
  message,
  to,
  toMessage,
  code = 404,
}) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-4xl pb-3 font-extrabold">{code}</h1>
      <p className="text-lg pb-2">{message}</p>
      <Link to={to || "/"} className="text-blue-400 pb-2">
        {toMessage || "Home"}
      </Link>
      <p className="opacity-60 font-light">{message}</p>
      <Button
        className="mt-4 flex items-center"
        onClick={() => {
          location.reload();
        }}
      >
        <MdRefresh className="mr-2" />
        Refresh
      </Button>
    </div>
  );
};

export default ErrorComponent;
