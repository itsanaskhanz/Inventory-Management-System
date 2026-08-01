import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import clsx from "clsx";
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

const Table = <TData,>({ className, data, columns }: TableProps<TData>) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const rows = table.getRowModel().rows;

  return (
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
  );
};

export default Table;
