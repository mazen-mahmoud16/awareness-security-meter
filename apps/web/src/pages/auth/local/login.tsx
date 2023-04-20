import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { Response } from "../../../api";
import { localLogin } from "../../../api/auth";
import Button from "../../../components/UI/Button";
import Input from "../../../components/UI/Input";
import InputLabel from "../../../components/UI/InputLabel";

interface Props {}

const LoginLocalAuth: React.FC<Props> = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;
  const queryClient = useQueryClient();

  const {
    register,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm<{ password: string }>();

  const { mutate, isLoading } = useMutation(
    async (password: string) => await localLogin(email, password),
    {
      async onSuccess({ result }, token) {
        await queryClient.invalidateQueries(["user-auth"]);
        navigate("/");
      },
      onError(e: Response) {
        if (!Array.isArray(e.error)) {
          for (var key in e.error) {
            setError(key as "password", { message: e.error[key] });
          }
        }
      },
    }
  );

  useEffect(() => {
    if (!email) navigate("/auth/login");
  }, [email]);

  const onSubmit = ({ password }: { password: string }) => {
    mutate(password);
  };

  return (
    <>
      <Helmet>
        <title>Login</title>
      </Helmet>
      <h1 className="font-semibold text-xl">Login</h1>
      <div className="h-6"></div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <InputLabel>Password</InputLabel>
          <Input
            placeholder="Enter your Password"
            type="password"
            {...register("password")}
            willError={true}
            errorMessage={errors.password?.message}
            isError={!!errors.password}
          />
        </div>
        <Button isLoading={isLoading} className="float-right">
          Login
        </Button>
      </form>
    </>
  );
};

export default LoginLocalAuth;
