export interface HierarchicalItem {
  id: string;
  name: string;
  children?: HierarchicalItem[];
}

export interface DropdownProps {
  options: HierarchicalItem[];
  onSelect: (option: HierarchicalItem) => void;
  placeholder?: string;
  value?: HierarchicalItem | null;
  maxWidth?: string;
}
