import React, { useEffect, useRef, useState } from "react";
import { useField, useFormikContext } from "formik";
import useFetch from "../../hooks/useFetch";

const BrandSearchDropdown = ({ name, label }) => {
  const [field, meta] = useField(name);
  const { setFieldValue, values } = useFormikContext();

  const dropdownRef = useRef(null);

  const [filteredBrands, setFilteredBrands] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState(null);

  const { data, loading, error } = useFetch("brand/allbrands");

  const brands = Array.isArray(data) ? data : [];

  // Sync selected brand when editing
  useEffect(() => {
    if (!brands.length) return;

    setFilteredBrands(brands);

    const currentBrandId = values[name];
    if (currentBrandId) {
      const matched = brands.find(
        (b) => b.brand_id === Number(currentBrandId)
      );
      if (matched) {
        setSelectedBrand(matched);
        setSearchTerm(matched.brand_name);
      }
    }
  }, [brands, values, name]);

  // Filter brands
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredBrands(brands);
    } else {
      setFilteredBrands(
        brands.filter((brand) =>
          brand.brand_name
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, brands]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    setIsOpen(true);

    if (
      selectedBrand &&
      e.target.value !== selectedBrand.brand_name
    ) {
      setSelectedBrand(null);
      setFieldValue(name, "");
    }
  };

  const handleSelectBrand = (brand) => {
    setSelectedBrand(brand);
    setSearchTerm(brand.brand_name);
    setIsOpen(false);
    setFieldValue(name, brand.brand_id);
  };

  return (
    <div className="form-group mb-3 position-relative" ref={dropdownRef}>
      {label && <label className="form-label">{label}</label>}

      <input
        type="text"
        className="form-control"
        placeholder="Search brand..."
        value={searchTerm}
        onChange={handleInputChange}
        onClick={() => setIsOpen(true)}
        autoComplete="off"
      />

      {isOpen && (
        <div
          className="position-absolute w-100 bg-white border mt-1 shadow rounded"
          style={{ maxHeight: "200px", overflowY: "auto", zIndex: 1000 }}
        >
          {loading ? (
            <div className="text-center py-2">
              Loading brands...
            </div>
          ) : error ? (
            <div className="text-center text-danger py-2">
              Failed to load brands
            </div>
          ) : filteredBrands.length > 0 ? (
            filteredBrands.map((brand) => (
              <button
                key={brand.brand_id}
                type="button"
                className="dropdown-item text-start w-100"
                onClick={() => handleSelectBrand(brand)}
              >
                {brand.brand_name}
              </button>
            ))
          ) : (
            <div className="text-center py-2">
              No brands found
            </div>
          )}
        </div>
      )}

      {meta.touched && meta.error && (
        <div className="invalid-feedback d-block">
          {meta.error}
        </div>
      )}
    </div>
  );
};

export default BrandSearchDropdown;