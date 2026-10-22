import React, { useState, useEffect } from "react";
import styles from "./searchBar.module.css";

interface SearchBarProps {
  placeholder: string;
  searchValueFn: (value: string) => void;
  resetSignal?: boolean;
  onClear?: () => void; // NEW PROP
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder,
  searchValueFn,
  resetSignal,
  onClear,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [showClear, setShowClear] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim() !== "") {
      searchValueFn(searchValue);
      setShowClear(true);
    }
  };

  const handleClear = () => {
    setSearchValue("");
    setShowClear(false);
    searchValueFn(""); // inform parent to clear search results
    if (onClear) onClear(); // signal parent to reload full list
  };

  useEffect(() => {
    if (resetSignal) {
      setSearchValue("");
      setShowClear(false);
    }
  }, [resetSignal]);

  return (
    <div className={styles.searchBar}>
      <form onSubmit={handleSearch} className={styles.searchForm}>
        <input
          type="text"
          value={searchValue}
          onChange={handleChange}
          placeholder={placeholder}
          className={styles.searchInput}
        />
        <button type="submit" className={styles.searchButton}>
          Search
        </button>

        {showClear && (
          <button
            type="button"
            onClick={handleClear}
            className={styles.clearButton}
          >
            Clear
          </button>
        )}
      </form>
    </div>
  );
};

export default SearchBar;
