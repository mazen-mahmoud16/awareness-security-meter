import React, { Fragment } from "react";

interface Props {
  data: any[];
  headers: string[];
  fields: string[];
  onRowClick?(row: any): void;
  customRender?: {
    [field: string]: (row: any) => React.ReactNode;
  };
}

const Table: React.FC<Props> = ({
  data,
  headers,
  onRowClick,
  fields,
  customRender,
}) => {
  return (
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
            onClick={() => {
              if (onRowClick) onRowClick(row);
            }}
            className="border-b border-b-gray-600 border-opacity-30 cursor-pointer hover:bg-black hover:bg-opacity-08 transition-colors"
            key={row.id}
          >
            {fields.map((field) => (
              <Fragment key={field}>
                {customRender && customRender[field] ? (
                  customRender[field](row)
                ) : (
                  <td key={field} className="py-3">
                    {row[field]}
                  </td>
                )}
              </Fragment>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
