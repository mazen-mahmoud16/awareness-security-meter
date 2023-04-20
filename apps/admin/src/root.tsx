import React, { Suspense } from "react";
import { Outlet } from "react-router-dom";
import CenteredSpinner from "./components/UI/CenteredSpinner";
import Navbar from "./components/UI/Navbar";

interface Props {}

const Root: React.FC<Props> = () => {
  return (
    <div>
      <Navbar />
      <Suspense fallback={<CenteredSpinner />}>
        <Outlet />
      </Suspense>
    </div>
  );
};

export default Root;
