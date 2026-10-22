import React, { useState, useEffect } from "react";
import useDebounce from "../../hooks/useDebounce";

/**
 * Reusable SearchBox component with debounced search
 * @param {Object} props
 * @param {string} props.placeholder - Placeholder text for the search input
 * @param {Function} props.onSearch - Callback function triggered when search value changes (after debounce)
 * @param {number} props.delay - Debounce delay in milliseconds (default: 500)
 * @param {string} props.className - Additional CSS classes for the search box container
 * @param {string} props.inputClassName - Additional CSS classes for the input element
 */
const SearchBox = ({
    placeholder = "Search...",
    onSearch,
    delay = 500,
    className = "",
    inputClassName = "",
}) => {
    const [value, setValue] = useState("");
    const debouncedValue = useDebounce(value, delay);

    useEffect(() => {
        onSearch(debouncedValue.trim());
    }, [debouncedValue, onSearch]);

    const handleClear = () => {
        setValue("");
    };

    return (
        <div className={`d-flex ${className}`}>
            <div
                className="position-relative w-100"
                style={{ maxWidth: "420px" }}
            >

                <input
                    type="text"
                    className={`form-control ps-5 pe-5 py-2 rounded-pill border-success shadow-sm ${inputClassName}`}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    style={{
                        transition: "all 0.2s ease",
                    }}
                />

                {value && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="btn btn-sm position-absolute top-50 end-0 translate-middle-y me-2 rounded-circle d-flex align-items-center justify-content-center"
                        style={{ width: "28px", height: "28px" }}
                        aria-label="Clear search"
                    >
                        ❌
                    </button>
                )}
            </div>
        </div>
    );
};

export default SearchBox;
