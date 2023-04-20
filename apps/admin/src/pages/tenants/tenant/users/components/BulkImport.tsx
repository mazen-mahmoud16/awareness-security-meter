import React, { useState } from "react";
import { useParams } from "react-router-dom";
import UploadComponent from "../../../../../components/file/UploadComponent";
import Button from "../../../../../components/UI/Button";
import Modal from "../../../../../components/UI/Modal";

interface Props {
  close(): void;
}

const IMPORT_USERS_PATH = (id: string) => `/admin/tenants/${id}/users/import`;

const BulkImport: React.FC<Props> = ({ close }) => {
  const id = useParams().id!;
  const [modal, setModal] = useState(false);

  return (
    <>
      <Button
        onClick={() => {
          setModal(true);
        }}
      >
        Bulk Import Users
      </Button>
      <Modal isOpen={modal} onRequestClose={() => setModal(false)}>
        <UploadComponent
          onClose={(id) => {
            close();
            setModal(false);
          }}
          allowedTypes={{ "text/csv": [".csv"] }}
          uploadFieldname="csv"
          uploadPath={IMPORT_USERS_PATH(id)}
        />
      </Modal>
    </>
  );
};

export default BulkImport;
