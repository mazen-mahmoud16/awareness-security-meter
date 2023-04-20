import { useQuery } from "@tanstack/react-query";
import { atom, useAtom } from "jotai";
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { MdOutlineAdd } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { Tenant, tenantsQuery } from "../../api/tenant";
import AuthenticatedImage from "../../components/file/AuthenticatedImage";
import EmptyListMessage from "../../components/UI/EmptyListMessage";
import FloatingActionButton from "../../components/UI/FloatingActionButton";
import Modal from "../../components/UI/Modal";
import CreateTenant from "./create";

interface Props {}

const headers = ["Logo", "Name", "Provider"];

const searchAtom = atom("");
const pageAtom = atom(0);

const Tenants: React.FC<Props> = () => {
  const [search] = useAtom(searchAtom);
  const [page] = useAtom(pageAtom);
  const { data } = useQuery(tenantsQuery());
  const [modal, setModal] = useState(false);

  return (
    <div className="px-6 py-6">
      <Helmet>
        <title>Awareness Admin | Tenants</title>
      </Helmet>
      <h1 className="font-bold text-3xl">Tenants</h1>
      <div className="h-4"></div>
      {data && <Table data={data?.result!} />}

      {data && data.result.length === 0 && (
        <div className="py-2">
          <EmptyListMessage entity="Tenant" />
        </div>
      )}
      <FloatingActionButton
        onClick={() => {
          setModal(true);
        }}
        icon={MdOutlineAdd}
      />
      <Modal
        isOpen={modal}
        onRequestClose={() => {
          setModal(false);
        }}
      >
        <CreateTenant close={() => setModal(false)} />
      </Modal>
    </div>
  );
};

const Table: React.FC<{
  data: Tenant[];
}> = ({ data }) => {
  const navigate = useNavigate();

  return (
    <div>
      <table className="border-collapse w-full">
        <thead>
          <tr className="p-4">
            {headers.map((header) => (
              <th
                className="w-1/3 font-light py-2 border-b border-b-gray-500 border-opacity-30 text-left"
                key={header}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              onClick={() => navigate(`${row.id}`)}
              className="border-b border-b-gray-600 border-opacity-30 cursor-pointer hover:bg-black hover:bg-opacity-08 transition-colors"
              key={row.id}
            >
              <td className="py-2">
                <AuthenticatedImage
                  className="max-h-10 rounded-full"
                  src={"/admin/content/images/" + (row.darkLogo || row.logo)}
                />
              </td>
              <td className="py-4 h-12">{row.name}</td>
              <td className="py-4 h-12">{row.provider}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="h-2"></div>
    </div>
  );
};

export default Tenants;
