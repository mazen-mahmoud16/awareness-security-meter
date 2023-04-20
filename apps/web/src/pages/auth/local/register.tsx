import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { Response } from "../../../api";
import { register as registerUser } from "../../../api/auth";
import Button from "../../../components/UI/Button";
import Input from "../../../components/UI/Input";
import InputLabel from "../../../components/UI/InputLabel";

interface Props {}

const RegisterLocalAuth: React.FC<Props> = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;
  const token = location.state?.token;
  const queryClient = useQueryClient();

  const {
    formState: { errors },
    register,
    setError,
    handleSubmit,
  } = useForm<{ password: string }>();

  const { mutate, isLoading } = useMutation(
    async (password: string) => await registerUser(email, password, token),
    {
      async onSuccess({ result }, token) {
        await queryClient.invalidateQueries(["user-auth"]);
        navigate("/");
      },
      onError(e: Response) {
        if (!Array.isArray(e.error)) {
          for (var key in e.error) {
            if (key === "token") navigate("/auth/login");
            setError(key as "password", { message: e.error[key] });
          }
        }
      },
    }
  );

  useEffect(() => {
    if (!email || !token) navigate("/auth/login");
  }, [email, token]);

  const onSubmit = ({ password }: { password: string }) => {
    mutate(password);
  };

  return (
    <>
      <Helmet>
        <title>Register</title>
      </Helmet>
      <h1 className="font-semibold text-xl">Set your new Password</h1>
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
          Register
        </Button>
      </form>
    </>
  );
};

export default RegisterLocalAuth;
