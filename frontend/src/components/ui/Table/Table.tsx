import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import clsx from "clsx";
import { Pagination } from "../Pagination";
import {
  baseStyles,
  cellStyles,
  containerStyles,
  emptyStateStyles,
  headerCellStyles,
  headerStyles,
  rowStyles,
} from "./Table.styles";
import { TableProps } from "./Table.types";

const Table = <TData,>({
  className,
  data,
  columns,
  page,
  setPage,
  totalPages,
}: TableProps<TData>) => {
  // eslint-disable-next-line react-hooks/incompatible-library -- TanStack Table's API returns non-memoizable functions; React Compiler safely skips memoizing this hook
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const rows = table.getRowModel().rows;

  return (
    <div className="flex flex-col gap-6">
      <div className={clsx(containerStyles)}>
        <table className={clsx(baseStyles, className)}>
          <thead className={clsx(headerStyles)}>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className={clsx(headerCellStyles)}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {rows.length ? (
              rows.map((row) => (
                <tr key={row.id} className={clsx(rowStyles)}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className={clsx(cellStyles)}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={table.getVisibleFlatColumns().length}
                  className={clsx(emptyStateStyles)}
                >
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination  */}
      <Pagination
        page={page}
        totalPages={totalPages || 0}
        onPageChange={setPage}
      />
    </div>
  );
};

export default Table;
