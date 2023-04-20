import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { Provider, useMemo, useState } from "react";
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
import ButtonWithModal from "../../../../components/UI/ButtonWithModal";

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
  id: string;
  provider: {
    id: string;
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

const EditTenantAuthProvider: React.FC<Props> = () => {
  const aid = useParams().aid!;
  const { data, isLoading } = trpc.admin.tenant.provider.useQuery(aid);

  const Form: React.FC<ProviderInput["provider"] & { id: string }> = (
    defaultData
  ) => {
    const queryClient = useQueryClient();
    const id = useParams().id!;
    const { setValue, register, watch, handleSubmit } = useForm<ProviderInput>({
      defaultValues: { id: defaultData.id, provider: defaultData },
    });
    const navigate = useNavigate();
    const tenantData = queryClient.getQueryData<TenantResponse>(["tenant", id]);
    const [uploadModal, setUploadModal] = useState(false);
    const { mutate, isLoading } = trpc.admin.tenant.editProvider.useMutation({
      onSuccess(data) {
        navigate(`/tenants/${id}/auth/`);
      },
      onError(e) {
        console.log(e);
      },
    });

    const { mutate: deleteMutate } =
      trpc.admin.tenant.deleteProvider.useMutation({
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
    ) as any;

    return (
      <div className="pt-4">
        <Helmet>
          <title>{tenantData?.result.name || ""} | Edit Provider</title>
        </Helmet>
        <div className="flex justify-between items-center">
          <h1 className="font-bold text-3xl pb-4">Edit Provider</h1>
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
            value={{ label: type, value: type }}
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
          <div className="flex justify-end">
            <ButtonWithModal
              onClick={(e) => {
                deleteMutate(aid);
              }}
              className="bg-red-400 hover:bg-red-500"
            >
              Delete
            </ButtonWithModal>
            <div className="w-4"></div>
            <Button className=" bg-green-700 hover:bg-green-800">Save</Button>
          </div>
        </form>

        {isLoading && <CenteredSpinner />}
      </div>
    );
  };

  return (
    <>
      {isLoading && <CenteredSpinner />}
      {data && <Form {...data} />}
    </>
  );
};

export default EditTenantAuthProvider;
