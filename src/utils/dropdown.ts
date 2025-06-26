import React from 'react';
import { HierarchicalItem } from '../types/dropdown';

export const flattenOptions = (
  options: HierarchicalItem[],
  parent: HierarchicalItem | null = null,
  path: string[] = []
): Array<{ option: HierarchicalItem; path: string[] }> => {
  const result: Array<{ option: HierarchicalItem; path: string[] }> = [];

  options.forEach((option) => {
    const currentPath = parent ? [...path, parent.name] : path;
    result.push({ option, path: currentPath });

    if (option.children && option.children.length > 0) {
      result.push(...flattenOptions(option.children, option, currentPath));
    }
  });

  return result;
};

export const filterOptions = (
  options: HierarchicalItem[],
  searchTerm: string
): Array<{ option: HierarchicalItem; path: string[] }> => {
  if (!searchTerm.trim()) return [];

  const flattened = flattenOptions(options);
  return flattened.filter(({ option, path }) => {
    // Only include leaf nodes (nodes without children or with empty children array)
    const isLeaf = !option.children || option.children.length === 0;
    if (!isLeaf) return false;
    
    const fullPath = [...path, option.name].join(' ').toLowerCase();
    return fullPath.includes(searchTerm.toLowerCase());
  });
};

export const isLeafNode = (item: HierarchicalItem): boolean => {
  return !item.children || item.children.length === 0;
};

export const highlightMatch = (text: string, searchTerm: string): React.ReactNode => {
  if (!searchTerm) return text;
  
  const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
  return parts.map((part, i) => 
    part.toLowerCase() === searchTerm.toLowerCase() ? 
      React.createElement('strong', { key: i, style: { fontWeight: 600 }}, part)
      : part
  );
};
