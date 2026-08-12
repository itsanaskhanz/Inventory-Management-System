export interface TabItem<T extends string = string> {
  value: T;
  label: string;
}

export interface TabsProps<T extends string = string> {
  value: T;
  onValueChange: (value: T) => void;
  tabs: TabItem<T>[];
}