import React, { Suspense } from "react";
import { Outlet } from "react-router-dom";
import CenteredSpinner from "./components/UI/CenteredSpinner";
import Navbar from "./components/UI/Navbar";

interface Props {}

const Root: React.FC<Props> = () => {
  return (
    <div>
      <Navbar />
      <div className="h-24" />
      <div className="px-4 py-4">
        <Suspense fallback={<CenteredSpinner />}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
};

export default Root;
