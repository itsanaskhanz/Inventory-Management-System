import { Button } from "../Button";
import { CategoryFilterProps } from "./CategoryFilter.types";
import { Typography } from "../Typography";

const ALL = "All";

const CategoryFilter = ({
  categories,
  selected,
  onSelect,
  className,
}: CategoryFilterProps) => {
  return (
    <div className={className ? `flex gap-2 flex-wrap ${className}` : "flex gap-2 flex-wrap"}>
      <Button
        variant={selected === ALL ? "primary" : "secondary"}
        size="sm"
        onClick={() => onSelect(ALL)}
      >
        {ALL}
      </Button>
      {categories && categories.length === 0 ? (
        <div className="flex items-center">
          <Typography variant="body2" color="secondary">
            No categories found
          </Typography>
        </div>
      ) : (
        categories &&
        categories.map((cat) => (
          <Button
            key={cat.id}
            variant={selected === cat.id ? "primary" : "secondary"}
            size="sm"
            onClick={() => onSelect(cat.id)}
          >
            {cat.name}
          </Button>
        ))
      )}
    </div>
  );
};

CategoryFilter.displayName = "CategoryFilter";

export default CategoryFilter;