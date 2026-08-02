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
      className={clsx("flex gap-2 mx-auto mt-4", className)}
    >
      <Button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        variant="secondary"
      >
        Back
      </Button>

      {pageItems.map((value, index) =>
        value === "..." ? (
          <span
            key={`ellipsis-${index}`}
            className="flex items-center px-2 text-foreground-secondary"
          >
            …
          </span>
        ) : (
          <Button
            key={value}
            onClick={() => onPageChange(value)}
            variant={value === page ? "primary" : "secondary"}
            aria-current={value === page ? "page" : undefined}
          >
            {value}
          </Button>
        ),
      )}

      <Button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        variant="secondary"
      >
        Next
      </Button>
    </nav>
  );
};

Pagination.displayName = "Pagination";

export default Pagination;
