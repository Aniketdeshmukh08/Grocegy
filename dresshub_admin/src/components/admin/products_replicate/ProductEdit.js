import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Formik, Field, Form } from 'formik';
import JoditEditor from 'jodit-react';
import { ConfirmationModal } from '../../shared/ConfirmationModal';
import { toast } from 'react-toastify';
const ProductEdit = () => {
  const { productid } = useParams();
  const navigate = useNavigate();
  const editor = useRef(null);
  const [product, setProduct] = useState({});
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [brands, setBrands] = useState([]);
  const [discountAmount, setDiscountAmount] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState('');
  const [modalShow, setModalShow] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [formValuesChanged, setFormValuesChanged] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductById = async id => {
      try {
        setLoading(true);
        const url =
          process.env.REACT_APP_API_URL + 'products/productById/' + id;
        const response = await axios.get(url);

        if (response.data && Object.keys(response.data).length > 0) {
          setProduct(response.data);
          setImageFile(null);
          handleCategoryChange(response.data.category);

          if (response.data.subcategory) {
            setSelectedCategory(response.data.subcategory.split('#'));
          }

          const calculatedDiscountPercentage =
            (response.data.discount / response.data.price) * 100;
          setDiscountAmount(response.data.discount);
          setDiscountPercentage(calculatedDiscountPercentage.toFixed(2));
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const url = process.env.REACT_APP_API_URL + 'category/allCategory';
        const response = await axios.get(url);
        setCategories(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProductById(productid);
    fetchCategories();
  }, [productid]);

  const handleCategoryChange = async categoryId => {
    try {
      const subcategoryUrl =
        process.env.REACT_APP_API_URL + 'subCategory/allSubCategory';
      const subcategoryResponse = await axios.get(subcategoryUrl);
      setSubcategories(
        subcategoryResponse.data.filter(
          subcategory => subcategory.category_id === categoryId
        )
      );

      const brandUrl = `${process.env.REACT_APP_API_URL}brand/brandbycategoryid/${categoryId}`;
      const brandResponse = await axios.get(brandUrl);
      setBrands(brandResponse.data);
    } catch (error) {
      console.log(error);
    }
  };

  const editProduct = values => {
    try {
      const isUnchanged = Object.keys(product).every(
        key => product[key] === values[key]
      );
      if (isUnchanged) {
        setModalMessage('No changes were made. Nothing to update.');
      } else {
        setModalMessage('Do you want to update the product.');
        setFormValuesChanged(true)
        setProduct(values);
      }
      setModalShow(true)
    } catch (error) {
      console.log(error)
    }
  };

  const confirmUpdateProduct = async () => {
    try {
      const formData = new FormData();
      const { category, subcategory, ...otherValues } = product;
      const categoryObject = categories.find(
        cat => cat.category_id === category
      );
      // const subcategoryObject = subcategories.find(subcat => subcat.subcategory_id === subcategory);
      const changedSubcategory = selectedCategory.join('#');
      formData.append('prod_name', product.prod_name);
      formData.append(
        'category',
        categoryObject ? categoryObject.category_id : ''
      );
      // formData.append('subcategory', subcategoryObject ? subcategoryObject.subcategory_id : '');
      formData.append('subcategory', changedSubcategory);
      formData.append('price', product.price);
      formData.append('stock_quantity', product.stock_quantity);
      formData.append('brand', product.brand);
      formData.append('discount', product.discount);
      formData.append('productid', productid);
      if (imageFile) {
        formData.append('image', imageFile);
      } else {
        formData.append('image', 'true');
      }
      if (product.prod_desc) {
        formData.append('prod_desc', product.prod_desc);
      }
      const url =
        process.env.REACT_APP_API_URL + 'products/updateProduct/' + productid;
      const response = await axios.put(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        const updatedProductUrl =
          process.env.REACT_APP_API_URL + 'products/productById/' + productid;
        const updatedProductResponse = await axios.get(updatedProductUrl);
        setProduct(updatedProductResponse.data);
        setModalShow(false)
        toast.success("Product Updated Successfully")
        navigate('/productslist');
      }
      console.log(changedSubcategory);
    } catch (error) {
      console.log(error);
    }
  }

  const handleDiscountPercentageChange = (
    percentage,
    setFieldValue,
    values
  ) => {
    setDiscountPercentage(percentage);
    const calculatedDiscount = (values.price * percentage) / 100;
    setDiscountAmount(calculatedDiscount.toFixed(2));
    setFieldValue('discount', calculatedDiscount.toFixed(2));
  };

  const handleDiscountAmountChange = (amount, setFieldValue, values) => {
    setDiscountAmount(amount);
    setFieldValue('discount', amount);
    const calculatedPercentage = (amount / values.price) * 100;
    setDiscountPercentage(calculatedPercentage.toFixed(2));
  };

  const handleCheck = e => {
    const { checked, value } = e.target;
    if (checked) {
      setSelectedCategory([...selectedCategory, value]);
    } else {
      setSelectedCategory(
        selectedCategory.filter(category => category !== value)
      );
    }
  };

  if (loading) {
    return (
      <div className='container mt-4'>
        <div className='text-center py-5'>
          <div className='spinner-border text-success' role='status'>
            <span className='visually-hidden'>Loading...</span>
          </div>
          <p className='mt-3 text-muted'>Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!loading && (!product || Object.keys(product).length === 0)) {
    return (
      <div className='container mt-4'>
        <div className='alert alert-warning text-center'>
          <h5>Product not found</h5>
          <Link to='/productslist' className='btn btn-primary mt-3'>
            ← Back to List
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='container mt-4'>
      {/* Header */}
      <div className='d-flex justify-content-between align-items-center mb-4'>
        <h2 className='text-success fw-bold mb-0'>✏ Edit Product</h2>
        <Link to='/productslist' className='btn btn-outline-secondary'>
          ← Back to List
        </Link>
      </div>

      <div className='card shadow-sm border-0'>
        <div className='card-body p-4'>
          <Formik
            enableReinitialize={true}
            initialValues={product}
            onSubmit={(values, { resetForm }) => {
              editProduct(values);
              resetForm();
            }}
          >
            {({ values, setFieldValue }) => (
              <Form>
                <div className='row g-3'>
                  {/* Product Name */}
                  <div className='col-12'>
                    <label htmlFor='prod_name' className='form-label fw-semibold'>
                      Product Name <span className='text-danger'>*</span>
                    </label>
                    <Field
                      name='prod_name'
                      type='text'
                      className='form-control'
                      placeholder='Enter product name'
                      required
                    />
                  </div>

                  {/* Category */}
                  <div className='col-12'>
                    <label htmlFor='category' className='form-label fw-semibold'>
                      Category <span className='text-danger'>*</span>
                    </label>
                    <Field
                      name='category'
                      as='select'
                      className='form-select'
                      onChange={e => {
                        setFieldValue('category', e.target.value);
                        handleCategoryChange(e.target.value);
                      }}
                      required
                    >
                      <option value=''>Select a category</option>
                      {categories.map(category => (
                        <option
                          key={category.category_id}
                          value={category.category_id}
                        >
                          {category.categoryname}
                        </option>
                      ))}
                    </Field>
                  </div>

                  {/* Subcategories (Checkboxes) */}
                  {subcategories.length > 0 && (
                    <div className='col-12'>
                      <label className='form-label fw-semibold'>
                        Subcategories <span className='text-danger'>*</span>
                      </label>
                      <div className='card bg-light border-0'>
                        <div className='card-body'>
                          <div className='row g-2'>
                            {subcategories.map(subcategory => (
                              <div key={subcategory.subcategory_id} className='col-md-4'>
                                <div className='form-check'>
                                  <input
                                    className='form-check-input'
                                    type='checkbox'
                                    id={`subcat-${subcategory.subcategory_id}`}
                                    value={subcategory.subcategory_id}
                                    onChange={e => handleCheck(e)}
                                    checked={selectedCategory.includes(
                                      subcategory.subcategory_id
                                    )}
                                  />
                                  <label
                                    className='form-check-label'
                                    htmlFor={`subcat-${subcategory.subcategory_id}`}
                                  >
                                    {subcategory.subcategoryname}
                                  </label>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Brand */}
                  <div className='col-12'>
                    <label htmlFor='brand' className='form-label fw-semibold'>
                      Brand <span className='text-danger'>*</span>
                    </label>
                    <Field name='brand' as='select' className='form-select' required>
                      <option value=''>Select a brand</option>
                      {brands.map(brand => (
                        <option key={brand.brand_id} value={brand.brand_id}>
                          {brand.brand_name}
                        </option>
                      ))}
                    </Field>
                  </div>

                  {/* Price */}
                  <div className='col-12'>
                    <label htmlFor='price' className='form-label fw-semibold'>
                      Price (₹) <span className='text-danger'>*</span>
                    </label>
                    <Field
                      name='price'
                      type='number'
                      className='form-control'
                      placeholder='0.00'
                      min='0'
                      step='0.01'
                      onChange={e => {
                        setFieldValue('price', e.target.value);
                        handleDiscountPercentageChange(
                          discountPercentage,
                          setFieldValue,
                          { price: e.target.value }
                        );
                      }}
                      required
                    />
                  </div>

                  {/* Stock Quantity */}
                  <div className='col-12'>
                    <label htmlFor='stock_quantity' className='form-label fw-semibold'>
                      Stock Quantity <span className='text-danger'>*</span>
                    </label>
                    <Field
                      name='stock_quantity'
                      type='number'
                      className='form-control'
                      placeholder='0'
                      min='0'
                      required
                    />
                  </div>

                  {/* Image */}
                  <div className='col-12'>
                    <label htmlFor='image' className='form-label fw-semibold'>
                      Product Image
                    </label>
                    <input
                      name='image'
                      type='file'
                      className='form-control'
                      accept='image/*'
                      onChange={e => {
                        setImageFile(e.target.files[0]);
                        setFieldValue('image', e.target.files[0]);
                      }}
                    />
                    {imageFile ? (
                      <small className='text-success mt-1 d-block'>
                        ✓ New image: {imageFile.name}
                      </small>
                    ) : (
                      <small className='text-muted mt-1 d-block'>
                        Leave empty to keep current image
                      </small>
                    )}
                  </div>

                  {/* Discount Section */}
                  <div className='col-12'>
                    <div className='card bg-light border-0'>
                      <div className='card-body'>
                        <h6 className='fw-semibold mb-3'>💰 Discount</h6>
                        <div className='row g-3'>
                          <div className='col-md-6'>
                            <label htmlFor='discount' className='form-label'>
                              Discount Amount (₹)
                            </label>
                            <Field
                              name='discount'
                              type='number'
                              className='form-control'
                              placeholder='0.00'
                              min='0'
                              step='0.01'
                              value={discountAmount}
                              onChange={e => {
                                handleDiscountAmountChange(
                                  e.target.value,
                                  setFieldValue,
                                  values
                                );
                              }}
                            />
                          </div>
                          <div className='col-md-6'>
                            <label htmlFor='discount_percentage' className='form-label'>
                              Discount Percentage (%)
                            </label>
                            <Field
                              name='discount_percentage'
                              type='number'
                              className='form-control'
                              placeholder='0'
                              min='0'
                              max='100'
                              step='0.01'
                              value={discountPercentage}
                              onChange={e => {
                                handleDiscountPercentageChange(
                                  e.target.value,
                                  setFieldValue,
                                  values
                                );
                              }}
                            />
                          </div>
                          {discountAmount > 0 && (
                            <div className='col-12'>
                              <div className='alert alert-success mb-0 py-2'>
                                <small>
                                  Final Price: ₹{(values.price - discountAmount).toFixed(2)}
                                  {' '}(Save ₹{discountAmount})
                                </small>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className='col-12'>
                    <label htmlFor='prod_desc' className='form-label fw-semibold'>
                      Product Description
                    </label>
                    <JoditEditor
                      ref={editor}
                      value={values.prod_desc || ''}
                      onChange={newContent => {
                        setFieldValue('prod_desc', newContent);
                      }}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className='col-12'>
                    <div className='d-flex justify-content-center gap-3 pt-3 border-top'>
                      <button
                        type='submit'
                        className='btn btn-success px-5 py-2'
                      >
                        ✓ Update Product
                      </button>
                      <Link
                        to='/productslist'
                        className='btn btn-outline-secondary px-5 py-2'
                      >
                        ✖ Cancel
                      </Link>
                    </div>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>

      <ConfirmationModal
        show={modalShow}
        modalMessage={modalMessage}
        onHide={() => setModalShow(false)}
        confirmation={confirmUpdateProduct}
        operationType="Update"
        wantToAddData={formValuesChanged}
      />
    </div>
  );
};

export default ProductEdit;
