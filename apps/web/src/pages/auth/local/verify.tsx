import { useMutation } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Response } from "../../../api";
import { verifyToken } from "../../../api/auth";
import Button from "../../../components/UI/Button";
import Input from "../../../components/UI/Input";
import InputLabel from "../../../components/UI/InputLabel";

interface Props {}

const VerifyLocalAuth: React.FC<Props> = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;
  const {
    formState: { errors },
    register,
    setError,
    handleSubmit,
  } = useForm<{ token: string }>();

  const { mutate, isLoading } = useMutation(
    async (token: string) => await verifyToken(email, token),
    {
      onSuccess({ result }, token) {
        navigate("/auth/login/local/register", { state: { email, token } });
      },
      onError(e: Response) {
        if (!Array.isArray(e.error)) {
          for (var key in e.error) {
            setError(key as "token", { message: e.error[key] });
          }
        }
      },
    }
  );

  useEffect(() => {
    if (!email) navigate("/auth/login");
  }, [email]);

  const onSubmit = ({ token }: { token: string }) => {
    mutate(token);
  };

  return (
    <>
      <Helmet>
        <title>Login | Verfiy</title>
      </Helmet>
      <h1 className="font-semibold text-xl">
        A token has been sent to{" "}
        <span className="font-light opacity-80 text-sm inline">{email}</span>
      </h1>
      <Link to="/auth/login">
        <span className="text-primary-500 hover:underline opacity-80 text-sm">
          Click here if you want to change your email
        </span>
      </Link>
      <div className="h-6"></div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <InputLabel>Token</InputLabel>
          <Input
            placeholder="Enter Token"
            willError={true}
            errorMessage={errors.token?.message}
            isError={!!errors.token}
            {...register("token")}
          />
        </div>
        <div className="h-5"></div>
        <Button isLoading={isLoading} className="float-right">
          Verify
        </Button>
      </form>
    </>
  );
};

export default VerifyLocalAuth;
