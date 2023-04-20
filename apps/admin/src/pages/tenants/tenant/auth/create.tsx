import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import { providersQuery } from "../../../../api/meta";
import { TenantResponse } from "../../../../api/tenant";
import { trpc } from "../../../../api/trpc";
import CenteredSpinner from "../../../../components/UI/CenteredSpinner";
import InputLabel from "../../../../components/UI/InputLabel";
import Input from "../../../../components/UI/Input";
import Button from "../../../../components/UI/Button";
import Modal from "../../../../components/UI/Modal";
import UploadComponent from "../../../../components/file/UploadComponent";

interface Props {}

const convertBase64 = (file: File): Promise<string | ArrayBuffer | null> => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result);
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
  });
};

interface ProviderInput {
  tenant: string;
  provider: {
    name: string;
    type: "microsoft" | "microsoft-saml" | "google" | "local";
    options?: (
      | {
          issuer: string;
          cert: string;
          entryPoint: string;
        }
      | {
          clientSecret: string;
          clientId: string;
        }
    ) & { redirectUrl?: string };
  };
}

const CreateTenantAuthProvider: React.FC<Props> = () => {
  const queryClient = useQueryClient();
  const id = useParams().id!;
  const { setValue, register, watch, handleSubmit } = useForm<ProviderInput>({
    defaultValues: { tenant: id },
  });
  const navigate = useNavigate();
  const tenantData = queryClient.getQueryData<TenantResponse>(["tenant", id]);
  const [uploadModal, setUploadModal] = useState(false);
  const { mutate, isLoading } = trpc.admin.tenant.addProvider.useMutation({
    onSuccess(data) {
      navigate(`/tenants/${id}/auth/`);
    },
    onError(e) {
      console.log(e);
    },
  });
  const type = watch("provider.type");

  const { data: providerData } = useQuery(providersQuery());
  const options = useMemo(
    () => providerData?.result.map((p) => ({ label: p, value: p })),
    [providerData]
  );

  return (
    <div className="pt-4">
      <Helmet>
        <title>{tenantData?.result.name || ""} | Create Provider</title>
      </Helmet>
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-3xl pb-4">Create Provider</h1>
      </div>
      <form onSubmit={handleSubmit((d) => mutate(d))}>
        <InputLabel>Name</InputLabel>
        <Input placeholder="Name" {...register("provider.name")}></Input>

        <div className="h-4"></div>
        <InputLabel>Type</InputLabel>
        <Select
          placeholder="Select Provider"
          options={options}
          isLoading={isLoading}
          name="provider"
          className="my-react-select-container"
          classNamePrefix="my-react-select"
          onChange={(e) => {
            setValue("provider.type", e?.value! as any);
            setValue("provider.options", undefined);
          }}
        />
        <div className="h-4"></div>
        {type === "microsoft-saml" && (
          <div>
            <InputLabel>Issuer</InputLabel>
            <Input
              placeholder="Issuer"
              {...register("provider.options.issuer")}
            ></Input>
            <div className="h-4"></div>
            <InputLabel>Entry Point</InputLabel>
            <Input
              placeholder="Entry Point"
              {...register("provider.options.entryPoint")}
            ></Input>
            <div className="h-4"></div>
            <InputLabel>Redirect URL</InputLabel>
            <Input
              placeholder="Leave this empty for default value"
              {...register("provider.options.redirectUrl")}
            ></Input>
            <div className="h-4"></div>
            <InputLabel>Certificate</InputLabel>
            <Button
              onClick={(e) => {
                e.preventDefault();
                setUploadModal(true);
              }}
            >
              Upload
            </Button>
            <Modal
              isOpen={uploadModal}
              onRequestClose={() => {
                setUploadModal(false);
              }}
            >
              <UploadComponent
                allowedTypes={{}}
                uploadFieldname="cert"
                onUpload={async (files) => {
                  const data = (await convertBase64(files[0]))
                    ?.toString()
                    .split(";base64,")
                    .at(-1);
                  setValue("provider.options.cert", data!);
                }}
                onClose={() => {
                  setUploadModal(false);
                }}
              />
            </Modal>
            <div className="h-4"></div>
          </div>
        )}
        {type === "google" && (
          <>
            <InputLabel>Client ID</InputLabel>
            <Input
              placeholder="Client ID"
              {...register("provider.options.clientId")}
            ></Input>
            <div className="h-4"></div>
            <InputLabel>Client Secret</InputLabel>
            <Input
              placeholder="Client Secret"
              {...register("provider.options.clientSecret")}
            ></Input>
            <div className="h-4"></div>
            <InputLabel>Redirect URL</InputLabel>
            <Input
              placeholder="Leave this empty for default value"
              {...register("provider.options.redirectUrl")}
            ></Input>
            <div className="h-4"></div>
          </>
        )}
        {type === "microsoft" && <>Coming Soon</>}
        <div className="h-2"></div>
        <Button className="float-right bg-green-700 hover:bg-green-800">
          Create
        </Button>
      </form>

      {isLoading && <CenteredSpinner />}
    </div>
  );
};

export default CreateTenantAuthProvider;
