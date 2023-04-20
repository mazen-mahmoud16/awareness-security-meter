import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Helmet } from "react-helmet";
import { MdDelete } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { deleteTenant, deleteUsers, tenantQuery } from "../../../api/tenant";
import { tenantAvgScoreQuery } from "../../../api/tenant/stats";
import Button from "../../../components/UI/Button";
import ButtonWithModal from "../../../components/UI/ButtonWithModal";
import CenteredSpinner from "../../../components/UI/CenteredSpinner";
import Divider from "../../../components/UI/Divider";
import ScoreCircle from "../../../components/UI/ScoreCircle";

interface Props {}

const Tenant: React.FC<Props> = () => {
  const navigate = useNavigate();
  const id = useParams().id!;
  const { data, isLoading } = useQuery(tenantQuery(id));
  const { data: avgScoreData, isLoading: isLoadingAvgScore } = useQuery(
    tenantAvgScoreQuery(id)
  );

  if (isLoading) return <CenteredSpinner />;

  if (!data) return <></>;

  return (
    <div className="pt-4">
      <Helmet>
        <title>Tenant | {data.result.name || ""}</title>
      </Helmet>
      <h2 className="font-semibold text-xl">Domain</h2>
      <div className="opacity-70">{data.result.domain}</div>
      {data.result.departments?.length > 0 && (
        <>
          <div className="h-3"></div>
          <h2 className="font-semibold text-xl">Departments</h2>
          <div className="opacity-70">
            {data.result.departments.slice(0, 10).map((department) => (
              <div key={department}>{department}</div>
            ))}
            {data.result.departments.length > 10 && <p>...</p>}
          </div>
        </>
      )}
      <Divider />
      <div>
        <h2 className="font-semibold text-2xl">Stats</h2>
        <div className="h-4"></div>
        {isLoadingAvgScore ? (
          <CenteredSpinner />
        ) : (
          <div className="p-6 border rounded-md border-gray-400 border-opacity-30 flex flex-col items-center">
            <h1 className="font-bold text-3xl">Average Score</h1>
            <div className="h-6"></div>
            <ScoreCircle percentage={avgScoreData?.result!} />
          </div>
        )}
        <div className="h-4"></div>
        <a href={`/api/admin/tenants/${id}/stats/report`}>
          <Button>Download Tenant Report</Button>
        </a>
      </div>
      <Divider />
      <div>
        <h2 className="font-semibold text-red-300 text-2xl">
          Dangerous Section
        </h2>
        <div className="h-4"></div>
        <div className="flex">
          <ButtonWithModal
            onClick={async () => {
              await deleteTenant(id);
              navigate("/tenants");
            }}
            className="flex items-center px-3 py-2 rounded-md bg-red-400 hover:bg-red-500 transition-all"
          >
            <MdDelete className="mr-2" />
            Delete
          </ButtonWithModal>
          <div className="w-4 "></div>
          <ButtonWithModal
            onClick={async () => {
              await deleteUsers(id);
            }}
            className="flex items-center px-3 py-2 rounded-md bg-red-400 hover:bg-red-500 transition-all"
          >
            <MdDelete className="mr-2" />
            Delete Users
          </ButtonWithModal>
        </div>
      </div>
    </div>
  );
};

export default Tenant;
