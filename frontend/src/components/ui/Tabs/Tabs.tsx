import { Button } from "../Button";
import { TabItem, TabsProps } from "./Tabs.types";

const Tabs = <T extends string = string>({ value, onValueChange, tabs }: TabsProps<T>) => {
  return (
    <div className="flex gap-2">
      {tabs.map((tab: TabItem<T>) => {
        const isActive = tab.value === value;
        return (
          <Button
            key={tab.value}
            variant={isActive ? "primary" : "secondary"}
            // fullWidth
            onClick={() => onValueChange(tab.value)}
          >
            {tab.label}
          </Button>
        );
      })}
    </div>
  );
};

export default Tabs;
