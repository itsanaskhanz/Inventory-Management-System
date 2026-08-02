import { ColumnDef } from "@tanstack/react-table";

export interface TableProps<TData> {
  className?: string;
  data: TData[];
  columns: ColumnDef<TData>[];
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
}
