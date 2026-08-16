import clsx from "clsx";
import { Button } from "../Button";
import { Icon } from "../Icon";
import { Input } from "../Input";
import { SearchBarProps } from "./SearchBar.types";

const SearchBar = ({ value, onChange, onSearch, placeholder, className }: SearchBarProps) => {
  return (
    <div className={clsx("flex gap-2", className)}>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        fullWidth
        leftIcon="Search"
      />
      <Button onClick={onSearch} variant="secondary">
        <Icon name="Search" size="sm" />
        Search
      </Button>
    </div>
  );
};

SearchBar.displayName = "SearchBar";

export default SearchBar;
