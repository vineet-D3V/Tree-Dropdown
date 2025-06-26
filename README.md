# Hierarchical Dropdown Component

A reusable React component for rendering hierarchical (tree) data in a searchable dropdown.

## Features

- Tree view with expandable/collapsible parent nodes
- Search functionality with path display
- Only leaf nodes are selectable
- Keyboard navigation support
- Customizable styling
- TypeScript support

## Installation

```bash
npm install sc-hierarchical-dropdown
# or
yarn add sc-hierarchical-dropdown
```

## Usage

```tsx
import React, { useState } from 'react';
import { HierarchicalDropdown } from 'sc-hierarchical-dropdown';
import type { HierarchicalItem } from 'sc-hierarchical-dropdown';
import 'sc-hierarchical-dropdown/dist/index.esm.css';  // Import styles

const App = () => {
  const [selectedItem, setSelectedItem] = useState<HierarchicalItem | null>(null);
  
  // Example data
  const data: HierarchicalItem[] = [
    {
      id: '1',
      name: 'Category A',
      children: [
        { id: '1-1', name: 'Item 1', children: [] },
        { id: '1-2', name: 'Item 2', children: [] }
      ]
    },
    {
      id: '2',
      name: 'Category B',
      children: [
        { 
          id: '2-1', 
          name: 'Subcategory 1',
          children: [
            { id: '2-1-1', name: 'Item 3', children: [] }
          ]
        }
      ]
    }
  ];

  const handleSelect = (item: HierarchicalItem) => {
    setSelectedItem(item);
  };

  return (
    <div>
      <HierarchicalDropdown
        options={data}
        onSelect={handleSelect}
        value={selectedItem}
        placeholder="Select an item..."
      />
      {selectedItem && (
        <div>Selected: {selectedItem.name}</div>
      )}
    </div>
  );
};

export default App;
```

## API Reference

### HierarchicalItem

```typescript
interface HierarchicalItem {
  id: string;
  name: string;
  children?: HierarchicalItem[];
}
```

### HierarchicalDropdownProps

```typescript
interface HierarchicalDropdownProps {
  options: HierarchicalItem[];
  onSelect: (option: HierarchicalItem) => void;
  placeholder?: string;
  value?: HierarchicalItem | null;
}
```

## Utility Functions

The package also exports utility functions for working with hierarchical data:

```typescript
// Flatten a hierarchical structure into a flat array with paths
const flatItems = flattenHierarchy(items);

// Filter items based on a search term
const filteredItems = filterHierarchy(items, 'search term');

// Check if an item is a leaf node
const isLeaf = isLeafNode(item);

// Highlight search matches in text
const highlightedText = highlightMatch('Some text', 'some');
```

## License

MIT
