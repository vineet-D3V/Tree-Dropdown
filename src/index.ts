export { default as HierarchicalDropdown } from './components/HierarchicalDropdown';
export type { HierarchicalItem, DropdownProps as HierarchicalDropdownProps } from './types/dropdown';
export { 
  flattenOptions as flattenHierarchy, 
  filterOptions as filterHierarchy,
  isLeafNode,
  highlightMatch
} from './utils/dropdown';
