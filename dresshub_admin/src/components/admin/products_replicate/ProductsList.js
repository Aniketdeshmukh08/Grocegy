import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import Loader from '../../loader/Loader';
import { ConfirmationModal } from '../../shared/ConfirmationModal';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Dropdown } from 'react-bootstrap';


const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryid, setCategoryid] = useState(null);
  const [editingProductId, setEditingProductId] = useState(null);
  const [editedValues, setEditedValues] = useState({});
  const [productToDelete, setProductToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [btnAll, setBtnAll] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showSelection, setShowSelection] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [modalShow, setModalShow] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Search state
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const url = process.env.REACT_APP_API_URL + 'category/allCategory';
      const response = await axios.get(url);
      setCategories(response.data);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };


  const fetchProductsList = async categoryname => {
    setLoading(true);
    try {
      if (categoryname) {
        const url =
          process.env.REACT_APP_API_URL +
          `products/allProductsByCategory?categoryid=${encodeURIComponent(categoryname)}`;
        const response = await axios.get(url);
        setProducts(response.data);
        setFilteredProducts(response.data);
        setCurrentPage(1);
        setSearchTerm('');
      } else {
        setProducts([]);
        setFilteredProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products by category:', error);
      toast.error('Failed to fetch products for this category');
      setProducts([]);
      setFilteredProducts([]);
    }
    setLoading(false);
  };

  const handleCategoryClick = categoryid => {
    setCategoryid(categoryid);
    window.localStorage.setItem('admin_categoryid', categoryid);
    if (categoryid === "all") {
      handleAllCategoriesClick();
      setBtnAll(true);
    } else {
      fetchProductsList(categoryid);
      setBtnAll(false);
    }
    setSelectedProducts([]);
    setSelectAll(false);
  };

  const handleSelectProduct = (productid) => {
    setSelectedProducts((prevSelected) => {
      const updatedSelected = prevSelected.includes(productid)
        ? prevSelected.filter((id) => id !== productid)
        : [...prevSelected, productid];
      return updatedSelected;
    });
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedProducts([]);
    } else {
      const selectedProductIds = currentProducts.map((product) => product.productid);
      setSelectedProducts(selectedProductIds);
    }
    setSelectAll(!selectAll);
  };

  const handleShowSelection = () => {
    setShowSelection(prevShowSelection => !prevShowSelection);
    if (showSelection) {
      // When closing, reset selections
      setSelectAll(false);
      setSelectedProducts([]);
    }
  };

  const handleBulkOutOfStock = async () => {
    if (selectedProducts.length > 0) {
      try {
        const url = process.env.REACT_APP_API_URL + `products/setstocktozero`;
        await axios.put(url, { productIds: selectedProducts });
        toast.success('Selected products set to out of stock!');
        setSelectedProducts([]);
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } catch (error) {
        toast.error('Failed to set selected products to out of stock.');
        console.error(error);
      }
    } else {
      toast.error('Please select products to set to out of stock.');
    }
  };

  const handleAllOutOfStock = async () => {
    if (selectAll) {
      try {
        const url = process.env.REACT_APP_API_URL + `products/setstocktozero`;
        const allProductIds = currentProducts.map(product => product.productid);
        await axios.put(url, { productIds: allProductIds });
        toast.success('All products on this page set to out of stock!');
        setSelectedProducts([]);
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } catch (error) {
        toast.error('Failed to set all products to out of stock.');
        console.error(error);
      }
    } else {
      toast.error('Please select the "Select All" checkbox first.');
    }
  };


  const switchVisibility = async (productid, isVisible) => {
    setLoading(true);
    try {
      const url = process.env.REACT_APP_API_URL + `products/updateProduct/${productid}`;
      const updatedData = isVisible ? { stock_quantity: 100, isactive: 1 } : { isactive: -1 };

      await axios.put(url, updatedData);

      toast.success(isVisible ? 'Product is now visible!' : 'Product is now hidden!');

      setProducts(prevProducts =>
        prevProducts.map(product =>
          product.productid === productid
            ? { ...product, stock_quantity: updatedData.stock_quantity, isactive: updatedData.isactive }
            : product
        )
      );
      setFilteredProducts(prevProducts =>
        prevProducts.map(product =>
          product.productid === productid
            ? { ...product, stock_quantity: updatedData.stock_quantity, isactive: updatedData.isactive }
            : product
        )
      );
    } catch (error) {
      console.error('Error toggling product visibility:', error);
      toast.error('Failed to update product visibility.');
    }
    setLoading(false);
  };


  const handleAllCategoriesClick = async () => {
    setLoading(true);
    try {
      const url = process.env.REACT_APP_API_URL + `products/productList`;
      const response = await axios.get(url);
      setProducts(response.data);
      setFilteredProducts(response.data);
      setCurrentPage(1);
      setSearchTerm('');
      setBtnAll(true);
    } catch (error) {
      console.error('Error fetching all products:', error);
      toast.error('Failed to fetch all products');
      setProducts([]);
      setFilteredProducts([]);
    }
    setLoading(false);
  };

  const deleteProduct = async productid => {
    setLoading(true);
    try {
      const url =
        process.env.REACT_APP_API_URL + 'products/removeProduct/' + productid;
      const response = await axios.put(url);
      toast.success('Product deleted successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      fetchProductsList(categoryid);
      if (Array.isArray(response.data)) {
        const sortedProducts = response.data.sort((a, b) => b.srno - a.srno);
        setProducts(sortedProducts);
        setFilteredProducts(sortedProducts);
      } else {
        setProducts([]);
        setFilteredProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
      setFilteredProducts([]);
    }
    setLoading(false);
  };

  const handleEditClick = (productid, field, value) => {
    const temp = {
      price: editedValues.price || products.find(p => p.productid === productid).price,
      stock_quantity: editedValues.stock_quantity || products.find(p => p.productid === productid).stock_quantity,
      discount: editedValues.discount || products.find(p => p.productid === productid).discount,
    };
    setEditingProductId(productid);
    setEditedValues({
      ...temp,
      [field]: value,
    });
  };

  const handleStockClick = async (id, stock) => {
    try {
      (stock < 1) ? await axios.put(process.env.REACT_APP_API_URL + `products/updateStockQuantity/${id}/100`)
        : await axios.put(process.env.REACT_APP_API_URL + `products/updateStockQuantity/${id}/0`);
      toast.success('Product Stock updated successfully!');
    } catch (error) {
      toast.error('Failed to update the Stock Quantity.');
    }
  };

  const handleValueChange = (productid, field, value) => {
    if (editingProductId === productid) {
      if (value === '' && typeof editedValues[field] !== 'number') {
        delete editedValues[field];
      } else {
        setEditedValues({ ...editedValues, [field]: value });
      }
    }
  };

  const handleSaveClick = async productid => {
    setLoading(true);
    try {
      const url =
        process.env.REACT_APP_API_URL + `products/updateProduct/${productid}`;
      await axios.put(url, editedValues);
      toast.success('Product updated successfully!');
      setEditingProductId(null);
      if (categoryid === "all") {
        handleAllCategoriesClick()
      } else {
        fetchProductsList(categoryid);
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update the product.');
    }
    setLoading(false);
  };

  // Search functionality
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    setCurrentPage(1);

    if (!value.trim()) {
      setFilteredProducts(products);
      return;
    }

    const filtered = products.filter(product =>
      product.prod_name?.toLowerCase().includes(value) ||
      product.productid?.toString().toLowerCase().includes(value) ||
      product.brand?.toLowerCase().includes(value) ||
      product.brand_name?.toLowerCase().includes(value) ||
      product.category?.toLowerCase().includes(value) ||
      product.categoryname?.toLowerCase().includes(value) ||
      product.subcategory?.toLowerCase().includes(value) ||
      product.subcategoryname?.toLowerCase().includes(value)
    );
    setFilteredProducts(filtered);
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts?.slice(indexOfFirstItem, indexOfLastItem) || [];
  const totalPages = Math.ceil((filteredProducts?.length || 0) / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  useEffect(() => {
    const initializeProducts = async () => {
      await fetchCategories();
      let admin_categoryid = localStorage.getItem('admin_categoryid');

      // If no category is stored or it's "all", load all products by default
      if (!admin_categoryid || admin_categoryid === "all" || admin_categoryid === "null") {
        setCategoryid("all");
        await handleAllCategoriesClick();
      } else {
        setCategoryid(admin_categoryid);
        await fetchProductsList(admin_categoryid);
      }
    };

    initializeProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='container mt-4'>
      {/* Header with Title and Create Button */}
      <div className='d-flex justify-content-between align-items-center mb-3'>
        <h2 className='text-success fw-bold mb-0'>Products List</h2>
        <Dropdown>
          <Dropdown.Toggle variant="success" id="dropdown-create">
            ➕ Create / Upload
          </Dropdown.Toggle>
          <Dropdown.Menu align="end" className='shadow-sm'>
            <Dropdown.Item as={Link} to='/productadd' className='py-2'>
              <span className='me-2'>📝</span> Create New Product
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item as={Link} to='/bulkqsadd' className='py-2'>
              <span className='me-2'>📤</span> Bulk Products Upload
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      {/* Filters and Search Bar - All in One Card */}
      <div className='card shadow-sm mb-3'>
        <div className='card-body'>
          <div className='row g-3 align-items-end'>
            {/* Category Filter Dropdown */}
            <div className='col-md-3'>
              <label className='form-label mb-1 small fw-semibold text-muted'>Category</label>
              <select
                className='form-select'
                value={categoryid || "all"}
                onChange={(e) => handleCategoryClick(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category.category_id} value={category.category_id}>
                    {category.categoryname}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Bar */}
            <div className='col-md-5'>
              <label className='form-label mb-1 small fw-semibold text-muted'>Search</label>
              <div className='input-group'>
                <span className='input-group-text bg-white'>🔍</span>
                <input
                  type='text'
                  className='form-control'
                  placeholder='Search by name, ID, brand...'
                  value={searchTerm}
                  onChange={handleSearch}
                />
                {searchTerm && (
                  <button
                    className='btn btn-outline-secondary'
                    type='button'
                    onClick={() => {
                      setSearchTerm('');
                      setFilteredProducts(products);
                    }}
                  >
                    ✖
                  </button>
                )}
              </div>
            </div>

            {/* Items Per Page */}
            <div className='col-md-2'>
              <label className='form-label mb-1 small fw-semibold text-muted'>Per Page</label>
              <select
                className='form-select'
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>

            {/* Product Count */}
            <div className='col-md-2 text-center'>
              <label className='form-label mb-1 small fw-semibold text-muted'>Products</label>
              <div className='fw-bold text-success fs-5'>
                {filteredProducts?.length || 0} / {products?.length || 0}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Selection Actions */}
      {showSelection && (
        <div className='alert alert-success shadow-sm mb-3 border-success' role='alert'>
          <div className='d-flex flex-wrap align-items-center justify-content-between gap-3'>
            <div className='d-flex flex-wrap align-items-center gap-3'>
              <div className='form-check mb-0'>
                <input
                  type='checkbox'
                  className='form-check-input'
                  id='selectAllCheckbox'
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
                <label className='form-check-label fw-semibold' htmlFor='selectAllCheckbox'>
                  Select All (on this page)
                </label>
              </div>
              <div className='vr' style={{ height: '30px' }}></div>
              <button
                onClick={handleBulkOutOfStock}
                disabled={!selectedProducts.length || selectAll}
                className="btn btn-danger"
              >
                🚫 Bulk Out of Stock
              </button>
              <button
                onClick={handleAllOutOfStock}
                disabled={!selectAll}
                className="btn btn-warning"
              >
                ⚠️ All Out of Stock
              </button>
              {selectedProducts.length > 0 && (
                <span className='badge bg-dark' style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>
                  ✓ {selectedProducts.length} Selected
                </span>
              )}
            </div>
            <button
              className='btn btn-outline-danger'
              onClick={handleShowSelection}
              title='Close bulk selection'
            >
              ✖ Close
            </button>
          </div>
        </div>
      )
      }

      {/* Enable Selection Button */}
      {
        !showSelection && (
          <div className='mb-3'>
            <button
              className='btn btn-success'
              onClick={handleShowSelection}
            >
              ☑ Enable Bulk Selection
            </button>
          </div>
        )
      }

      {/* Products Table */}
      {
        loading ? (<Loader />) : (
          <>
            <div className='table-responsive'>
              <table className='table table-bordered table-hover align-middle'>
                <thead className='table-success text-center'>
                  <tr>
                    {showSelection && <th style={{ width: '50px' }}>Select</th>}
                    <th style={{ width: '60px' }}>Sr No</th>
                    <th>Product ID</th>
                    <th>Product Name</th>
                    <th>Category</th>
                    <th>SubCategory</th>
                    <th>Brand</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Discount</th>
                    <th style={{ minWidth: '500px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentProducts && currentProducts.length > 0 ? (
                    currentProducts.map((temp, index) => (
                      <tr key={temp.productid}>
                        {showSelection && (
                          <td className='text-center'>
                            <input
                              type='checkbox'
                              className='form-check-input'
                              checked={selectedProducts.includes(temp.productid)}
                              onChange={() => handleSelectProduct(temp.productid)}
                            />
                          </td>
                        )}
                        <td className='text-center'>{indexOfFirstItem + index + 1}</td>
                        <td className='text-center'>{temp.productid}</td>
                        <td>{temp.prod_name}</td>
                        <td className='text-center'>{temp.categoryname || temp.category}</td>
                        <td className='text-center'>{temp.subcategoryname || temp.subcategory}</td>
                        <td className='text-center'>{temp.brand_name || temp.brand}</td>
                        <td className='text-center'>
                          <div className='d-flex align-items-center justify-content-center gap-1'>
                            {editingProductId === temp.productid ? (
                              <input
                                type='number'
                                value={editedValues.price}
                                onChange={e => handleValueChange(temp.productid, 'price', e.target.value)}
                                className='form-control form-control-sm'
                                style={{ width: '70px' }}
                              />
                            ) : (
                              <span className='fw-semibold'>₹{temp.price}</span>
                            )}
                            <button
                              onClick={() =>
                                handleEditClick(temp.productid, 'price', temp.price)
                              }
                              className='btn btn-sm btn-outline-success'
                              style={{ padding: '2px 6px', fontSize: '0.75rem' }}
                              title='Edit Price'
                            >
                              ✏
                            </button>
                          </div>
                        </td>
                        <td className='text-center'>
                          <div className='d-flex align-items-center justify-content-center gap-1'>
                            {editingProductId === temp.productid ? (
                              <input
                                type='number'
                                value={editedValues.stock_quantity}
                                onChange={e =>
                                  handleValueChange(temp.productid, 'stock_quantity', e.target.value)
                                }
                                className='form-control form-control-sm'
                                style={{ width: '60px' }}
                              />
                            ) : (
                              <span className={`fw-semibold ${temp.stock_quantity === 0 ? 'text-danger' : 'text-success'}`}>
                                {temp.stock_quantity}
                              </span>
                            )}
                            <button
                              onClick={() =>
                                handleEditClick(
                                  temp.productid,
                                  'stock_quantity',
                                  temp.stock_quantity
                                )
                              }
                              className='btn btn-sm btn-outline-success'
                              style={{ padding: '2px 6px', fontSize: '0.75rem' }}
                              title='Edit Stock'
                            >
                              ✏
                            </button>
                          </div>
                        </td>
                        <td className='text-center'>
                          <div className='d-flex align-items-center justify-content-center gap-1'>
                            {editingProductId === temp.productid ? (
                              <input
                                type='number'
                                value={editedValues.discount}
                                onChange={e =>
                                  handleValueChange(temp.productid, 'discount', e.target.value)
                                }
                                className='form-control form-control-sm'
                                style={{ width: '60px' }}
                              />
                            ) : (
                              <span className='fw-semibold'>{temp.discount}%</span>
                            )}
                            <button
                              onClick={() =>
                                handleEditClick(temp.productid, 'discount', temp.discount)
                              }
                              className='btn btn-sm btn-outline-success'
                              style={{ padding: '2px 6px', fontSize: '0.75rem' }}
                              title='Edit Discount'
                            >
                              ✏
                            </button>
                          </div>
                        </td>
                        <td className='text-center'>
                          <div className='d-flex gap-1 justify-content-center align-items-center'>
                            {editingProductId === temp.productid && (
                              <button
                                onClick={() => handleSaveClick(temp.productid)}
                                className='btn btn-success btn-sm'
                                title='Save Changes'
                              >
                                💾 Save
                              </button>
                            )}
                            <Link
                              to={`/productview/${temp.productid}`}
                              className='btn btn-primary btn-sm'
                              title='View Product'
                            >
                              👁 View
                            </Link>
                            <Link
                              to={`/productedit/${temp.productid}`}
                              className='btn btn-warning btn-sm'
                              title='Edit Product'
                            >
                              ✏ Edit
                            </Link>
                            <button
                              onClick={() => switchVisibility(temp.productid, temp.isactive === -1)}
                              className={temp.isactive === -1 ? "btn btn-success btn-sm" : "btn btn-secondary btn-sm"}
                              title={temp.isactive === -1 ? 'Show Product' : 'Hide Product'}
                            >
                              {temp.isactive === -1 ? '👁 Show' : '🔒 Hide'}
                            </button>
                            <Link
                              to={`/productcopy/${temp.productid}`}
                              className='btn btn-info btn-sm'
                              title='Copy Product'
                            >
                              📋 Copy
                            </Link>
                            <button
                              onClick={() => {
                                setModalShow(true);
                                setProductToDelete(temp.productid);
                              }}
                              className='btn btn-danger btn-sm'
                              title='Delete Product'
                            >
                              🗑 Delete
                            </button>
                            <button
                              onClick={() => {
                                handleStockClick(temp.productid, temp.stock_quantity);
                              }}
                              className={temp.stock_quantity === 0 ? 'btn btn-success btn-sm' : 'btn btn-danger btn-sm'}
                              title={temp.stock_quantity === 0 ? 'Mark In Stock' : 'Mark Out of Stock'}
                            >
                              {temp.stock_quantity === 0 ? "📦 In Stock" : "❌ Out of Stock"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={showSelection ? "11" : "10"} className='text-center py-5'>
                        <div className='text-muted'>
                          <h5>No products found</h5>
                          <p className='mb-0'>Try adjusting your filters or search criteria</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredProducts && filteredProducts.length > 0 && (
              <div className='d-flex justify-content-between align-items-center mt-3 mb-4'>
                <div className='text-muted small'>
                  Showing <strong>{indexOfFirstItem + 1}</strong> to <strong>{Math.min(indexOfLastItem, filteredProducts.length)}</strong> of <strong>{filteredProducts.length}</strong> products
                </div>
                <nav>
                  <ul className='pagination mb-0'>
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button
                        className='page-link'
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </button>
                    </li>

                    {[...Array(totalPages)].map((_, index) => {
                      const pageNumber = index + 1;
                      if (
                        pageNumber === 1 ||
                        pageNumber === totalPages ||
                        (pageNumber >= currentPage - 2 && pageNumber <= currentPage + 2)
                      ) {
                        return (
                          <li
                            key={pageNumber}
                            className={`page-item ${currentPage === pageNumber ? 'active' : ''}`}
                          >
                            <button
                              className='page-link'
                              onClick={() => handlePageChange(pageNumber)}
                            >
                              {pageNumber}
                            </button>
                          </li>
                        );
                      } else if (
                        pageNumber === currentPage - 3 ||
                        pageNumber === currentPage + 3
                      ) {
                        return <li key={pageNumber} className='page-item disabled'><span className='page-link'>...</span></li>;
                      }
                      return null;
                    })}

                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                      <button
                        className='page-link'
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            )}
          </>
        )
      }

      <ConfirmationModal
        show={modalShow}
        modalMessage="you really want to delete this Product"
        onHide={() => setModalShow(false)}
        confirmation={() => {
          if (productToDelete) {
            deleteProduct(productToDelete);
            setModalShow(false);
          }
        }}
        operationType="Delete"
        wantToAddData={true}
      />
    </div >
  );
};



export default ProductsList;
