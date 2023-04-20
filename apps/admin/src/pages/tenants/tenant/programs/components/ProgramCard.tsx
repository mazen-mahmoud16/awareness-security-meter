import { useQueryClient } from "@tanstack/react-query";
import { MdCheck, MdClose, MdDelete, MdEdit } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import {
  deleteTenantProgram,
  TenantProgram,
} from "../../../../../api/tenant/program";
import Button from "../../../../../components/UI/Button";
import ButtonWithModal from "../../../../../components/UI/ButtonWithModal";

const ProgramCard: React.FC<TenantProgram> = ({
  program,
  showInLibrary,
  disabled,
  showModulesInLibrary,
  id,
}) => {
  const tId = useParams().id!;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return (
    <div className="py-4 px-4 rounded-md border border-gray-300 border-opacity-30 shadow-md mb-4 flex justify-between">
      <div>
        <h1 className="text-xl font-bold">{program.name}</h1>
        <div className="">
          <p className="line-clamp-2 opacity-80">{program.description}</p>
          <div className="flex items-center">
            <p className="text-sm mr-2 font-semibold text-blue-300">
              Shown in Library
            </p>
            {showInLibrary ? <MdCheck /> : <MdClose />}
          </div>
          <div className="flex items-center">
            <p className="text-sm mr-2 font-semibold text-blue-300">
              Modules Shown in Library
            </p>
            {showModulesInLibrary ? <MdCheck /> : <MdClose />}
          </div>
          <div className="flex items-center">
            <p className="text-sm mr-2 font-semibold text-blue-300">Enabled</p>
            {!disabled ? <MdCheck /> : <MdClose />}
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <div className="flex items-center mb-3">
          <Button onClick={() => navigate(`edit/${id}`)}>
            <MdEdit />
          </Button>
          <div className="w-3" />
          <ButtonWithModal
            onClick={async () => {
              await deleteTenantProgram(tId, id);
              await queryClient.invalidateQueries(["tenant-programs"]);
            }}
            className="bg-red-400 hover:bg-red-500"
          >
            <MdDelete />
          </ButtonWithModal>
        </div>
        <Button
          onClick={() => navigate(`/programs/edit/${program.id}`)}
          className="bg-primary-600 hover:bg-primary-700"
        >
          Program
        </Button>
      </div>
    </div>
  );
};

export default ProgramCard;
