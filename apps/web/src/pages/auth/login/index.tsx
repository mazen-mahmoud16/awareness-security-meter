import { useMutation } from "@tanstack/react-query";
import React from "react";
import { Helmet } from "react-helmet";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Response } from "../../../api";
import { generateToken, whoami, WhoAmIParams } from "../../../api/auth";
import Button from "../../../components/UI/Button";
import Input from "../../../components/UI/Input";
import InputLabel from "../../../components/UI/InputLabel";

interface Props {}

const Login: React.FC<Props> = () => {
  const location = useLocation();
  const navigate = useNavigate();
  let from = (location.state as any)?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<WhoAmIParams>();

  const { mutate: generateTokenMutate, isLoading: isLoadingGenerateToken } =
    useMutation(async (email: string) => await generateToken(email), {
      onSuccess({ result }, email) {
        navigate("local/verify", { state: { email } });
      },
    });

  const { isLoading, mutate } = useMutation(whoami, {
    onSuccess({ result }, { email }) {
      if (result.provider === "local") {
        if (result.isNew) generateTokenMutate(result.email);
        else navigate("local", { state: { email: result.email } });
      } else {
        window.location.href = window.origin + result.redirect;
      }
    },
    onError({ error }: Response) {
      if (!Array.isArray(error)) {
        for (var key in error) {
          setError(key as "email", { message: error[key] });
        }
      }
    },
  });

  const onSubmit: SubmitHandler<WhoAmIParams> = async (data) => {
    mutate(data);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <Helmet>
        <title>Login</title>
      </Helmet>
      <Link
        to="/"
        className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
      >
        <h1 className="font-bold text-3xl">Awareness Platform</h1>
      </Link>
      <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Sign in to your account
          </h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <InputLabel htmlFor="email">Email</InputLabel>
            <Input
              type="email"
              placeholder="Enter your email"
              isError={!!errors.email}
              {...register("email")}
              willError={true}
              errorMessage={errors.email?.message}
            />
            <div className="h-2" />
            <Button
              type="submit"
              disabled={isLoading || isLoadingGenerateToken}
              isLoading={isLoading || isLoadingGenerateToken}
              className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >
              Sign in
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
