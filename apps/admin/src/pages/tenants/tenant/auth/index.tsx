import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import { Helmet } from "react-helmet";
import { FaCheck } from "react-icons/fa";
import { MdCheck, MdOutlineAdd } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { TenantResponse } from "../../../../api/tenant";
import { trpc } from "../../../../api/trpc";
import CenteredSpinner from "../../../../components/UI/CenteredSpinner";
import EmptyListMessage from "../../../../components/UI/EmptyListMessage";
import FloatingActionButton from "../../../../components/UI/FloatingActionButton";

interface Props {}

const TenantAuthProviders: React.FC<Props> = () => {
  const id = useParams().id!;
  const queryClient = useQueryClient();
  const { data, isLoading } = trpc.admin.tenant.providers.useQuery(id);
  const { data: defaultProvider } =
    trpc.admin.tenant.defaultProvider.useQuery(id);
  const context = trpc.useContext();
  const { mutate } = trpc.admin.tenant.setDefaultProvider.useMutation({
    async onSuccess(data, vars) {
      context.admin.tenant.defaultProvider.setData(id, () => vars.provider);
      await context.admin.tenant.defaultProvider.invalidate(id);
    },
  });
  const tenantData = queryClient.getQueryData<TenantResponse>(["tenant", id]);
  const navigate = useNavigate();
  return (
    <div className="pt-4">
      <Helmet>
        <title>{tenantData?.result.name || ""} | Providers</title>
      </Helmet>
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-3xl pb-4">Authentication Providers</h1>
      </div>
      {isLoading && <CenteredSpinner />}
      {data?.length === 0 && (
        <EmptyListMessage entity="Authentications Providers" />
      )}
      <div className="flex flex-col">
        {data?.map((m) => (
          <div
            key={m.id}
            className="flex border-b border-gray-400 border-opacity-30 p-2 cursor-pointer justify-between hover:bg-gray-800 rounded-md transition-all"
            onClick={() => {
              navigate(`edit/${m.id}`);
            }}
          >
            <div className="flex space-x-2 items-center">
              <div
                className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center"
                onClick={(e) => {
                  e.stopPropagation();
                  mutate({
                    provider: defaultProvider === m.id ? undefined : m.id,
                    tenant: id,
                  });
                }}
              >
                {defaultProvider === m.id && (
                  <MdCheck className="text-green-400" />
                )}
              </div>
              <div className="text-xl font-semibold">{m.name}</div>
            </div>
            <div className="text-xl font-semibold">{m.type}</div>
          </div>
        ))}
      </div>
      <FloatingActionButton
        onClick={() => {
          navigate("create");
        }}
        icon={MdOutlineAdd}
      />
    </div>
  );
};

export default TenantAuthProviders;
