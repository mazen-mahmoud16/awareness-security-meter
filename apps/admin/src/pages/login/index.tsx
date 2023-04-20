import { useMutation } from "@tanstack/react-query";
import { useAtom } from "jotai";
import React from "react";
import { Helmet } from "react-helmet";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Response } from "../../api";
import { login, LoginParams } from "../../api/auth";
import { userAtom } from "../../atoms/user";
import Input from "../../components/UI/Input";

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
  } = useForm<LoginParams>();
  const [user, setUser] = useAtom(userAtom);

  const { isLoading, mutate } = useMutation(login, {
    onSuccess({ result }) {
      setUser({ ...user, user: result.user });
      navigate("/");
    },
    onError({ error }: Response) {
      if (!Array.isArray(error)) {
        for (var key in error) {
          setError(key as "password", { message: error[key] });
        }
      }
    },
  });

  const onSubmit: SubmitHandler<LoginParams> = async (data) => {
    mutate(data);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <Helmet>
        <title>Awareness Admin | Login</title>
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
          <form
            className="space-y-4 md:space-y-6"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Your email
              </label>
              <Input
                type="email"
                placeholder="johndoe@example.com"
                className={`${
                  errors.password ? "border-red-400 dark:border-red-400" : ""
                }`}
                {...register("email")}
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Password
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                className={`${
                  errors.password ? "border-red-400 dark:border-red-400" : ""
                }`}
                {...register("password")}
              />
            </div>
            <div className="flex justify-between">
              <p className="text-red-400 max-h-1 text-sm">
                {errors.password?.message}
              </p>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >
              {isLoading && (
                <svg
                  role="status"
                  className="inline mr-3 w-4 h-4 text-white animate-spin"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="#E5E7EB"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentColor"
                  />
                </svg>
              )}
              Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
