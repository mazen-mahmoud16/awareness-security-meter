import { useQueryClient } from "@tanstack/react-query";
import { lazy, Suspense, useMemo } from "react";
import { createBrowserRouter, Outlet } from "react-router-dom";
import RedirectFromLogin from "./components/auth/RedirectFromLogin";
import RedirectToLogin from "./components/auth/RedirectToLogin";
import CenteredSpinner from "./components/UI/CenteredSpinner";
import { ErrorPage } from "./pages/ErrorPage";
import ProgramStats from "./pages/tenants/tenant/programs/stats";
import Root from "./root";
import Reports from "./pages/tenants/tenant/reports";
const Login = lazy(() => import("./pages/login"));
const Modules = lazy(() => import("./pages/modules/"));
const CreateModule = lazy(() => import("./pages/modules/create"));
const EditModule = lazy(() => import("./pages/modules/edit"));
const ModuleStats = lazy(() => import("./pages/tenants/tenant/modules/stats"));
const Programs = lazy(() => import("./pages/programs"));
const CreateProgram = lazy(() => import("./pages/programs/create"));
const EditProgram = lazy(() => import("./pages/programs/edit"));
const Tenants = lazy(() => import("./pages/tenants"));
const Tenant = lazy(() => import("./pages/tenants/tenant"));
const EditTenant = lazy(() => import("./pages/tenants/tenant/edit"));
const TenantModules = lazy(() => import("./pages/tenants/tenant/modules"));
const TenantAuthProviders = lazy(() => import("./pages/tenants/tenant/auth"));
const CreateTenantAuthProvider = lazy(
  () => import("./pages/tenants/tenant/auth/create")
);
const EditTenantAuthProvider = lazy(
  () => import("./pages/tenants/tenant/auth/edit")
);
const CreateModuleInTenant = lazy(
  () => import("./pages/tenants/tenant/modules/create")
);
const EditTenantModule = lazy(
  () => import("./pages/tenants/tenant/modules/edit")
);
const ExposeModule = lazy(
  () => import("./pages/tenants/tenant/modules/expose")
);
const TenantPrograms = lazy(() => import("./pages/tenants/tenant/programs"));
const CreateProgramInTenant = lazy(
  () => import("./pages/tenants/tenant/programs/create")
);
const EditTenantProgram = lazy(
  () => import("./pages/tenants/tenant/programs/edit")
);
const ExposeProgram = lazy(
  () => import("./pages/tenants/tenant/programs/expose")
);
const TenantRoot = lazy(() => import("./pages/tenants/tenant/root"));
const Users = lazy(() => import("./pages/tenants/tenant/users"));
const User = lazy(() => import("./pages/tenants/tenant/users/user"));
const EditUser = lazy(() => import("./pages/tenants/tenant/users/user/edit"));
const Home = lazy(() => import("./pages/home"));
const Settings = lazy(() => import("./pages/settings"));

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
            {
              index: true,
              element: <Home />,
            },
            {
              path: "tenants",
              element: <Tenants />,
            },
            {
              path: "settings",
              element: <Settings />,
            },
            {
              path: "tenants/:id",
              element: <TenantRoot />,
              children: [
                {
                  index: true,
                  element: <Tenant />,
                },
                {
                  path: "users",
                  children: [
                    {
                      index: true,
                      element: <Users />,
                    },
                    {
                      path: ":uid",
                      element: <User />,
                    },
                    {
                      path: ":uid/edit",
                      element: <EditUser />,
                    },
                  ],
                },
                {
                  path: "modules",
                  children: [
                    {
                      index: true,
                      element: <TenantModules />,
                    },
                    {
                      path: "stats/:mid",
                      element: <ModuleStats />,
                    },
                    {
                      path: "expose",
                      element: <ExposeModule />,
                    },
                    {
                      path: "create",
                      element: <CreateModuleInTenant />,
                    },
                    {
                      path: "edit/:mid",
                      element: <EditTenantModule />,
                    },
                  ],
                },
                {
                  path: "programs",
                  children: [
                    { index: true, element: <TenantPrograms /> },
                    {
                      path: "create",
                      element: <CreateProgramInTenant />,
                    },
                    {
                      path: "stats/:pid",
                      element: <ProgramStats />,
                    },
                    { path: "expose", element: <ExposeProgram /> },
                    { path: "edit/:pid", element: <EditTenantProgram /> },
                  ],
                },
                {
                  path: "auth",
                  children: [
                    { index: true, element: <TenantAuthProviders /> },
                    {
                      path: "create",
                      element: <CreateTenantAuthProvider />,
                    },
                    { path: "edit/:aid", element: <EditTenantAuthProvider /> },
                  ],
                },
                {
                  path: "edit",
                  element: <EditTenant />,
                },
                {
                  path: "reports",
                  element: <Reports />,
                },
              ],
            },
            {
              path: "modules",
              element: <Outlet />,
              children: [
                { index: true, element: <Modules /> },
                {
                  path: "create",
                  element: <CreateModule />,
                },

                {
                  path: "edit/:id",
                  element: <EditModule />,
                },
              ],
            },
            {
              path: "programs",
              element: <Outlet />,
              children: [
                { index: true, element: <Programs /> },
                {
                  path: "create",
                  element: <CreateProgram />,
                },
                {
                  path: "edit/:id",
                  element: <EditProgram />,
                },
              ],
            },
          ],
        },
        {
          path: "/auth/login",
          element: (
            <RedirectFromLogin>
              <Suspense fallback={<CenteredSpinner />}>
                <Login />
              </Suspense>
            </RedirectFromLogin>
          ),
        },
      ]),
    [queryClient]
  );

  return router;
};

export default useRouter;
