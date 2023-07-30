import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import { TenantResponse } from "../../../../api/tenant";
import { useQueryClient } from "@tanstack/react-query";
import { trpc } from "../../../../api/trpc";
import CenteredSpinner from "../../../../components/UI/CenteredSpinner";
import Button from "../../../../components/UI/Button";
import Modal from "../../../../components/UI/Modal";
import Input from "../../../../components/UI/Input";
import ButtonWithModal from "../../../../components/UI/ButtonWithModal";
import { MdDelete, MdDownload } from "react-icons/md";
import moment from "moment";
import { ClipLoader } from "react-spinners";

const Reports: React.FC = () => {
  const id = useParams().id!;
  const queryClient = useQueryClient();
  const { data, isLoading } = trpc.admin.tenant.reports.list.useQuery(id, {
    refetchInterval: 1000,
  });
  const context = trpc.useContext();
  const tenantData = queryClient.getQueryData<TenantResponse>(["tenant", id]);
  const { mutate } = trpc.admin.tenant.reports.create.useMutation({
    onSuccess: () => {
      void context.admin.tenant.reports.list.invalidate(id);
    },
  });
  const { mutate: deleteReport } = trpc.admin.tenant.reports.delete.useMutation(
    {
      onSuccess: () => {
        void context.admin.tenant.reports.list.invalidate(id);
      },
    }
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");

  const onGenerateReport = () => {
    mutate({ id, title });
    setTitle("");
  };
  console.log(data);
  return (
    <div className="pt-4">
      <Helmet>
        <title>{tenantData?.result.name || ""} | Providers</title>
      </Helmet>
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-3xl pb-4">Reports</h1>
      </div>
      {isLoading && <CenteredSpinner />}
      {data?.length === 0 && (
        <div className="flex items-start justify-center flex-col space-y-2">
          <p className="opacity-60 font-light text-center">No Reports yet</p>
        </div>
      )}
      <div className="h-2"></div>
      <Button
        onClick={() => {
          setIsModalOpen(true);
        }}
        className="bg-primary-600 hover:bg-primary-700"
      >
        Generate Report
      </Button>
      <div className="h-4"></div>
      <div className="flex flex-col ">
        {data?.map((m) => (
          <div
            key={m.id}
            className="flex border-b border-gray-400 border-opacity-30 p-2 cursor-pointer justify-between hover:bg-gray-800  transition-all items-start"
          >
            <div>
              <div className="flex space-x-3 items-center">
                <div>
                  {m.status === "pending" ? (
                    <ClipLoader color="white" size={18} />
                  ) : m.status === "completed" ? (
                    "✅"
                  ) : (
                    "❌"
                  )}
                </div>
                <div className="text-xl font-semibold">{m.title}</div>
              </div>
              <p className="opacity-80 text-sm">
                {moment(m.createdAt).format("dddd DD/MM/YYYY")}
              </p>
            </div>
            <div className="flex space-x-2">
              <a
                href={`/api/admin/tenants/${id}/stats/reports/${m.id}`}
                download={`${
                  m.title || moment(m.createdAt).format("DD-MM-YY")
                }-Tenant-Report.csv`}
              >
                <Button>
                  <MdDownload />
                </Button>
              </a>
              <ButtonWithModal
                onClick={() => deleteReport(m.id)}
                className="bg-red-400 hover:bg-red-500"
              >
                <MdDelete />
              </ButtonWithModal>
            </div>
          </div>
        ))}
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => {
          setIsModalOpen(false);
        }}
      >
        <h1 className="font-bold text-3xl pb-4">Generate Report</h1>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col space-y-2">
            <label htmlFor="title">Title</label>
            <Input
              placeholder="Title"
              onChange={(event) => {
                setTitle(event.target.value);
              }}
              value={title}
            />
            <Button
              className="bg-primary-600 hover:bg-primary-700"
              onClick={() => {
                onGenerateReport();
                setIsModalOpen(false);
              }}
            >
              Generate
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Reports;
