"use client";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Modal } from "@/components/ui/Modal";
import appConfig from "@/config/app.config";
import { useCreateCustomerMutation, useSearchCustomersQuery } from "@/lib/api/customerApi";
import { getApiErrorMessage } from "@/lib/errorHandling";
import { useDebouncedValue } from "@/lib/useDebounce";
import { Customer } from "@/types/customer.types";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

interface CustomerPickerProps {
  value: Customer | null;
  onChange: (customer: Customer | null) => void;
}

const fieldStyles =
  "w-full bg-background-secondary border border-border text-foreground placeholder:text-foreground-tertiary " +
  "transition-colors duration-200 shadow-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg text-sm";

const getInitials = (customer: Customer) => {
  const name = customer.name?.trim();
  if (name) {
    const initials = name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => Array.from(part)[0]?.toUpperCase() ?? "")
      .join("");
    if (initials) return initials;
  }
  if (customer.phone?.trim()) {
    return Array.from(customer.phone.trim())[0]?.toUpperCase() ?? "?";
  }
  return "?";
};

const CustomerPicker = ({ value, onChange }: CustomerPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedQuery = useDebouncedValue(query, 250);
  const { data: customersData, isLoading } = useSearchCustomersQuery(debouncedQuery, 1, appConfig.maxFetchLimit);
  const customers = customersData?.data?.customers || [];

  const { mutate: createCustomer, isPending: isCreatingCustomer } = useCreateCustomerMutation();

  const selectedLabel = value?.name?.trim() || value?.phone || "";

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsCreating(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        setIsCreating(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const openDropdown = () => {
    setIsOpen(true);
    setHighlightedIndex((prev) => (prev === -1 ? 0 : prev));
  };

  const selectCustomer = (customer: Customer) => {
    onChange(customer);
    setQuery("");
    setIsOpen(false);
    setIsCreating(false);
    setHighlightedIndex(-1);
  };

  const clearSelection = () => {
    onChange(null);
    setQuery("");
    setHighlightedIndex(0);
    setIsOpen(true);
    setIsCreating(false);
    inputRef.current?.focus();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    setQuery(next);
    if (value) onChange(null);
    setIsOpen(true);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      openDropdown();
      setHighlightedIndex((prev) => Math.min(prev + 1, Math.max(customers.length - 1, 0)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIsOpen(true);
      setHighlightedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter") {
      if (isCreating) return;
      e.preventDefault();
      const target = highlightedIndex >= 0 ? customers[highlightedIndex] : customers[0];
      if (target) selectCustomer(target);
    }
  };

  const handleCreateCustomer = () => {
    const name = newName.trim();
    const phone = newPhone.trim();
    if (!name && !phone) {
      toast.warn("Please provide at least a name or phone number");
      return;
    }
    createCustomer(
      { name: name || undefined, phone: phone || undefined },
      {
        onSuccess: (created) => {
          toast.success("Customer created successfully");
          setNewName("");
          setNewPhone("");
          setIsCreating(false);
          setQuery("");
          if (created) {
            onChange(created);
            setIsOpen(false);
            setHighlightedIndex(-1);
          }
        },
        onError: (error) => toast.error(getApiErrorMessage(error, "Failed to create customer")),
      },
    );
  };

  return (
    <div ref={rootRef} className="relative w-full">
      <div className="relative">
        <Icon
          name="Search"
          size="sm"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-tertiary pointer-events-none"
        />
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-autocomplete="list"
          aria-controls="customer-picker-listbox"
          value={value ? selectedLabel : query}
          onChange={handleInputChange}
          onFocus={openDropdown}
          onKeyDown={handleKeyDown}
          placeholder="Search by name or phone..."
          className={clsx(fieldStyles, "py-2.5 pl-10 pr-9")}
        />
        {value ? (
          <button
            type="button"
            aria-label="Clear selected customer"
            onClick={clearSelection}
            onMouseDown={(e) => e.stopPropagation()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-foreground-tertiary hover:text-foreground rounded-md cursor-pointer"
          >
            <Icon name="X" size="sm" />
          </button>
        ) : (
          <Icon
            name="ChevronDown"
            size="sm"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-foreground-tertiary pointer-events-none"
          />
        )}
      </div>

      {value && !isOpen && (
        <div className="mt-1.5 flex items-center gap-1.5 text-xs text-success">
          <Icon name="Check" size="sm" />
          <span className="truncate">{value.phone ? `${selectedLabel} · ${value.phone}` : selectedLabel}</span>
        </div>
      )}

      {isOpen && (
        <div
          role="listbox"
          id="customer-picker-listbox"
          className="absolute z-40 mt-1.5 w-full rounded-xl border border-border bg-background shadow-lg overflow-hidden animate-fade-in"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 py-6 text-sm text-foreground-secondary">
              <Icon name="Loader" size="sm" className="animate-spin" />
              Searching...
            </div>
          ) : customers.length > 0 ? (
            <ul className="max-h-64 overflow-y-auto py-1">
              {customers.map((customer, index) => {
                const isSelected = value?.id === customer.id;
                return (
                  <li key={customer.id}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => selectCustomer(customer)}
                      onMouseEnter={() => setHighlightedIndex(index)}
                      className={clsx(
                        "w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors",
                        isSelected
                          ? "bg-primary/10"
                          : highlightedIndex === index
                            ? "bg-background-tertiary"
                            : "hover:bg-background-tertiary",
                      )}
                    >
                      <div className="h-8 w-8 shrink-0 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                        <span className="text-xs font-semibold">{getInitials(customer)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {customer.name?.trim() || "Unnamed"}
                        </p>
                        {customer.phone && (
                          <p className="text-xs text-foreground-secondary truncate">{customer.phone}</p>
                        )}
                      </div>
                      {isSelected && <Icon name="Check" size="sm" className="shrink-0 text-primary" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="flex flex-col items-center gap-1 py-5 px-4 text-center">
              <Icon name="User" size="sm" className="text-foreground-tertiary opacity-60" />
              <p className="text-sm text-foreground-secondary">No customers found for &quot;{query.trim()}&quot;</p>
            </div>
          )}

          <div className="border-t border-border bg-background-secondary/60">
            <button
              type="button"
              onClick={() => setIsCreating(true)}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-sm text-primary hover:bg-background-tertiary transition-colors cursor-pointer"
            >
              <Icon name="UserPlus" size="sm" />
              Add new customer
            </button>
          </div>
        </div>
      )}

      <Modal
        isOpen={isCreating}
        onClose={() => setIsCreating(false)}
        title="Add new customer"
        description="Create a new customer and it will be selected automatically."
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCreateCustomer();
          }}
          className="flex flex-col gap-2.5"
        >
          <input
            type="text"
            autoFocus
            placeholder="Customer name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className={clsx(fieldStyles, "px-3 py-2")}
          />
          <input
            type="tel"
            placeholder="Phone (optional)"
            value={newPhone}
            onChange={(e) => setNewPhone(e.target.value)}
            className={clsx(fieldStyles, "px-3 py-2")}
          />
          <div className="flex justify-end gap-2 pt-1">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsCreating(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isCreatingCustomer}>
              {isCreatingCustomer ? "Creating..." : "Create & Select"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CustomerPicker;
