import { useQueryClient } from "@tanstack/react-query";
import { lazy, Suspense, useMemo } from "react";
import { createBrowserRouter, Outlet } from "react-router-dom";
import RedirectFromLogin from "./components/auth/RedirectFromLogin";
import RedirectToLogin from "./components/auth/RedirectToLogin";
import CenteredSpinner from "./components/UI/CenteredSpinner";
import AuthCallback from "./pages/auth/callback";
import { ErrorPage } from "./pages/ErrorPage";
import Root from "./root";
const Settings = lazy(() => import("./pages/settings"));
const Program = lazy(() => import("./pages/programs/program"));
const Programs = lazy(() => import("./pages/programs"));
const Home = lazy(() => import("./pages/home"));
const Login = lazy(() => import("./pages/auth/login"));
const LocalAuth = lazy(() => import("./pages/auth/local"));
const LoginLocalAuth = lazy(() => import("./pages/auth/local/login"));
const RegisterLocalAuth = lazy(() => import("./pages/auth/local/register"));
const VerifyLocalAuth = lazy(() => import("./pages/auth/local/verify"));
const Modules = lazy(() => import("./pages/modules"));
const Module = lazy(() => import("./pages/modules/module"));
const ModuleResults = lazy(() => import("./pages/modules/module/results"));
const ModuleSession = lazy(() => import("./pages/modules/module/session"));
const ProgramSession = lazy(() => import("./pages/programs/program/session"));
const CompletedProgram = lazy(
  () => import("./pages/programs/program/session/completed")
);
const ProgramNextUp = lazy(
  () => import("./pages/programs/program/session/next")
);
const ProgramSessionRoot = lazy(
  () => import("./pages/programs/program/session/root")
);

const useRouter = () => {
  const queryClient = useQueryClient();

  const router = useMemo(
    () =>
      createBrowserRouter([
        {
          path: "/",
          element: (
            <RedirectToLogin>
              <Root />
            </RedirectToLogin>
          ),
          errorElement: <ErrorPage />,
          children: [
            { index: true, element: <Home /> },
            {
              path: "modules",
              element: <Outlet />,
              children: [
                { index: true, element: <Modules /> },
                {
                  path: ":slug",
                  element: <Outlet />,
                  children: [
                    { index: true, element: <Module /> },
                    {
                      path: "session",
                      element: <ModuleSession />,
                    },
                    {
                      path: "results",
                      element: <ModuleResults />,
                    },
                  ],
                },
              ],
            },
            {
              path: "programs",
              children: [
                { index: true, element: <Programs /> },
                {
                  path: ":slug",
                  element: <Outlet />,
                  children: [
                    {
                      index: true,
                      element: <Program />,
                    },
                    {
                      path: "session",
                      element: <ProgramSessionRoot />,
                      children: [
                        {
                          index: true,
                          element: <ProgramSession />,
                        },
                        {
                          path: "next",
                          element: <ProgramNextUp />,
                        },
                      ],
                    },
                    {
                      path: "completed",
                      element: <CompletedProgram />,
                    },
                  ],
                },
              ],
            },
            {
              path: "settings",
              element: <Settings />,
            },
          ],
        },
        {
          path: "auth",
          element: (
            <Suspense fallback={<CenteredSpinner />}>
              <Outlet />
            </Suspense>
          ),
          children: [
            {
              path: "login",
              element: (
                <RedirectFromLogin>
                  <Login />
                </RedirectFromLogin>
              ),
            },
            {
              path: "login/local/",
              element: (
                <RedirectFromLogin>
                  <LocalAuth />
                </RedirectFromLogin>
              ),
              children: [
                {
                  path: "verify",
                  element: <VerifyLocalAuth />,
                },
                {
                  path: "register",
                  element: <RegisterLocalAuth />,
                },
                {
                  index: true,
                  element: <LoginLocalAuth />,
                },
              ],
            },
            {
              path: "callback",
              element: <AuthCallback />,
            },
          ],
        },
      ]),
    [queryClient]
  );

  return router;
};

export default useRouter;
