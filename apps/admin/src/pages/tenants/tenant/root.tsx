import { useQuery } from "@tanstack/react-query";
import React, { Suspense } from "react";
import { MdEdit } from "react-icons/md";
import { Link, Outlet, useParams } from "react-router-dom";
import { tenantQuery } from "../../../api/tenant";
import AuthenticatedImage from "../../../components/file/AuthenticatedImage";
import Button from "../../../components/UI/Button";
import CenteredSpinner from "../../../components/UI/CenteredSpinner";
import Sidebar from "./Sidebar";

interface Props {}

const TenantRoot: React.FC<Props> = () => {
  const id = useParams().id!;
  const { data } = useQuery(tenantQuery(id));

  return (
    <div>
      <Sidebar />
      <div className="pl-0 lg:pl-52">
        <div className="px-6 py-6">
          <div className="flex justify-between border-b border-b-gray-500 border-opacity-40 pb-4">
            <div className="flex items-center">
              {data?.result.logo && (
                <AuthenticatedImage
                  className="max-w-[60px] max-h-[40px]"
                  src={`/admin/content/images/${
                    data.result.darkLogo || data.result.logo
                  }`}
                />
              )}
              <div className="w-6"></div>
              <h1 className="font-bold text-3xl">{data?.result.name}</h1>
            </div>
            <Link to={`/tenants/${id}/edit`} className="flex items-stretch">
              <Button>
                <MdEdit />
              </Button>
            </Link>
          </div>
          <Suspense fallback={<CenteredSpinner />}>
            <Outlet />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default TenantRoot;
