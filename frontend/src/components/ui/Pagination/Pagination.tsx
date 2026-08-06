import clsx from "clsx";
import { Button } from "../Button";
import { PaginationProps } from "./Pagination.types";

const WINDOW_SIZE = 2;

const getPageItems = (page: number, totalPages: number): (number | "...")[] => {
  const items: (number | "...")[] = [];
  const start = Math.max(2, page - WINDOW_SIZE);
  const end = Math.min(totalPages - 1, page + WINDOW_SIZE);

  if (totalPages <= 1) return [1];

  items.push(1);
  if (start > 2) items.push("...");
  for (let i = start; i <= end; i++) items.push(i);
  if (end < totalPages - 1) items.push("...");
  if (totalPages > 1) items.push(totalPages);

  return items;
};

const Pagination = ({
  page,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) => {
  if (totalPages <= 1) return null;

  const pageItems = getPageItems(page, totalPages);

  return (
    <nav
      aria-label="Pagination"
      className={clsx(
        "flex items-center gap-1.5 justify-center mt-4 rounded-xl border border-border bg-background px-2 py-1.5 shadow-sm w-fit mx-auto",
        className,
      )}
    >
      <Button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        variant="ghost"
        size="sm"
      >
        Back
      </Button>

      {pageItems.map((value, index) =>
        value === "..." ? (
          <span
            key={`ellipsis-${index}`}
            className="flex items-center px-1.5 text-foreground-tertiary"
          >
            …
          </span>
        ) : (
          <Button
            key={value}
            onClick={() => onPageChange(value)}
            variant={value === page ? "primary" : "ghost"}
            size="sm"
            aria-current={value === page ? "page" : undefined}
            className="min-w-9 px-2"
          >
            {value}
          </Button>
        ),
      )}

      <Button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        variant="ghost"
        size="sm"
      >
        Next
      </Button>
    </nav>
  );
};

Pagination.displayName = "Pagination";

export default Pagination;
