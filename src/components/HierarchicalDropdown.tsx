import React, { useState, useRef, useEffect } from 'react';
import { HierarchicalItem, DropdownProps } from '../types/dropdown';
import { filterOptions, highlightMatch } from '../utils/dropdown';
import styles from './HierarchicalDropdown.module.css';
const HierarchicalDropdown: React.FC<DropdownProps> = ({
  options,
  onSelect,
  placeholder = "Select an option...",
  value = null,
  maxWidth = '400px',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const toggleExpanded = (itemId: string, event: React.MouseEvent) => {
    if (event.stopPropagation) {
      event.stopPropagation();
    }
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const handleSelect = (option: HierarchicalItem) => {
    onSelect(option);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleDropdownClick = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchTerm('');
    }
  };

  const clearSearch = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSearchTerm('');
    searchInputRef.current?.focus();
  };

  const isLeafNode = (item: HierarchicalItem): boolean => {
    return !item.children || item.children.length === 0;
  };

  const renderHierarchicalOptions = (items: HierarchicalItem[], level = 0) => {
    return items.map((item) => {
      const hasChildren = item.children && item.children.length > 0;
      const isExpanded = expandedItems.has(item.id);
      const isSelected = value?.id === item.id;

      const handleItemClick = () => {
        if (hasChildren) {
          toggleExpanded(item.id, {} as React.MouseEvent);
        } else {
          handleSelect(item);
        }
      };

      return (
        <div key={item.id}>
          <div
            className={`${styles['dropdown-option']} ${isSelected ? styles.selected : ''}`}
            onClick={handleItemClick}
            style={{ paddingLeft: `${16 + level * 20}px` }}
          >
            <div className={styles['dropdown-option-content']}>
              {hasChildren && (
                <span
                  className={`${styles['dropdown-expand-icon']} ${isExpanded ? styles.expanded : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleExpanded(item.id, e);
                  }}
                >
                  <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
              )}
              {!hasChildren && <span style={{ width: '24px' }}></span>}
              <span className={styles['dropdown-option-name']}>{item.name}</span>
            </div>
          </div>
          {hasChildren && isExpanded && (
            <div className={styles['dropdown-children']}>
              {renderHierarchicalOptions(item.children!, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  const highlightMatch = (text: string, searchTerm: string) => {
    if (!searchTerm) return text;
    
    const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === searchTerm.toLowerCase() ? 
        <strong key={i} style={{ fontWeight: 600 }}>{part}</strong> : part
    );
  };

  const renderSearchResults = () => {
    const filteredOptions = filterOptions(options, searchTerm);

    if (filteredOptions.length === 0) {
      return (
        <div className={styles['dropdown-no-results']}>
          No results found for "{searchTerm}"
        </div>
      );
    }

    return filteredOptions.map(({ option, path }) => {
      const isSelected = value?.id === option.id;
      const hasChildren = option.children && option.children.length > 0;
      
      const handleItemClick = () => {
        if (!hasChildren) {
          handleSelect(option);
        }
      };
      // Show the full path with the current item name
      const displayPath = path.length > 0 ? `${path.join(' / ')} / ${option.name}` : option.name;

      return (
        <div
          key={option.id}
          className={`${styles['dropdown-option']} ${isSelected ? styles.selected : ''} ${hasChildren ? styles['disabled-option'] : ''}`}
          onClick={handleItemClick}
        >
          <div className={styles['dropdown-option-content']}>
            <span className={styles['dropdown-option-path']}>
              {highlightMatch(displayPath, searchTerm)}
            </span>
          </div>
        </div>
      );
    });
  };

  // Create container style with custom max-width
  const containerStyle = { maxWidth };

  return (
    <div className={styles['dropdown-container']} ref={dropdownRef} style={containerStyle}>
      <div className={styles['dropdown-search-container']}>
        <input
          ref={searchInputRef}
          type="text"
          placeholder={value ? value.name : placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onClick={() => !isOpen && setIsOpen(true)}
          className={styles['dropdown-search-input']}
        />
        {isOpen && !searchTerm && (
          <span className={styles['dropdown-search-icon']}>
            <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </span>
        )}
        {searchTerm && (
          <span className={styles['dropdown-clear-icon']} onClick={clearSearch}>
            <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </span>
        )}
        <div 
          className={`${styles['dropdown-arrow']} ${isOpen ? styles.open : ''}`}
          onClick={handleDropdownClick}
        ></div>
      </div>

      {isOpen && (
        <div className={styles['dropdown-menu']}>
          <div className={styles['dropdown-options']}>
            {searchTerm.trim() ? renderSearchResults() : renderHierarchicalOptions(options)}
          </div>
        </div>
      )}
    </div>
  );
};

export default HierarchicalDropdown;
