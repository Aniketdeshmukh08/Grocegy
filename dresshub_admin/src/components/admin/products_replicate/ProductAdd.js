import React, { useEffect, useState } from 'react';
import { Formik, Field, Form } from 'formik';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { ConfirmationModal } from '../../shared/ConfirmationModal';
import JoditEditor from 'jodit-react';
import { toast } from 'react-toastify';


const ProductAdd = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [brands, setBrands] = useState([]);
  const [discountAmount, setDiscountAmount] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [modalShow, setModalShow] = useState(false)
  const [formValue, setFormValue] = useState([{}]);

  const navigate = useNavigate();

  const initialFormValues = {
    prod_name: '',
    category: '',
    subcategory: '',
    price: '',
    stock_quantity: '',
    brand: '',
    discount: '',
    prod_desc: '',
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const url = process.env.REACT_APP_API_URL + 'category/allCategory';
        const response = await axios.get(url);
        setCategories(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryChange = async categoryId => {
    try {
      setLoadingCategories(true); // Show loader
      const subcategoryUrl =
        process.env.REACT_APP_API_URL + 'subCategory/allSubCategory';
      const subcategoryResponse = await axios.get(subcategoryUrl);
      setSubcategories(
        subcategoryResponse.data.filter(
          subcategory => subcategory.category_id === categoryId
        )
      );

      const brandUrl =
        process.env.REACT_APP_API_URL + `brand/brandbycategoryid/${categoryId}`;
      const brandResponse = await axios.get(brandUrl);
      setBrands(brandResponse.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingCategories(false);
    }
  };

  const addNewProduct = values => {
    const formData = new FormData();
    const productid = parseInt(Math.random() * 10000000000);
    const datestamp = Date.now();
    // const changedSubcategory = selectedCategory.join('#');

    formData.append('prod_name', values.prod_name);
    formData.append('category', values.category);
    formData.append('subcategory', values.subcategory);
    // formData.append('subcategory', changedSubcategory);
    formData.append('price', values.price);
    formData.append('stock_quantity', values.stock_quantity);
    if (values.brand) {
      formData.append('brand', values.brand); //only if brand is selected
    }
    formData.append('discount', values.discount);
    formData.append('prod_desc', values.prod_desc);
    formData.append('image', imageFile);
    formData.append('productid', productid);
    formData.append('datestamp', datestamp);
    setFormValue(formData);
    setModalShow(true);
    setLoading(false)
  };

  const confirmSubmittedProduct = async () => {
    try {
      const url = process.env.REACT_APP_API_URL + 'products/addProduct';
      const response = await axios.post(url, formValue, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);
      setModalShow(false)
      toast.success('Product Added Successfully');
      if (formValue.resetForm) formValue.resetForm();
      setTimeout(() => {
        navigate('/productslist');
      }, 500);
      // navigate('/productslist'); // Redirect on successful response
    } catch (error) {
      console.error(error);
      setError('Failed to add product. Please try again.'); // Show error message on failure
    } finally {
      setLoading(false); // Stop the loader
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

  return (
    <div className='container mt-4'>
      {/* Header */}
      <div className='d-flex justify-content-between align-items-center mb-4'>
        <h2 className='text-success fw-bold mb-0'>📝 Add New Product</h2>
        <Link to='/productslist' className='btn btn-outline-secondary'>
          ← Back to List
        </Link>
      </div>

      <div className='card shadow-sm border-0'>
        <div className='card-body p-4'>
          <Formik
            initialValues={initialFormValues}
            onSubmit={async (values, { resetForm }) => {
              setLoading(true);
              setError('');
              await addNewProduct(values);
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
                        setFieldValue('subcategory', '');
                        setFieldValue('brand', '');
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

                  {/* Subcategory */}
                  <div className='col-12'>
                    <label htmlFor='subcategory' className='form-label fw-semibold'>
                      Subcategory <span className='text-danger'>*</span>
                    </label>
                    {loadingCategories ? (
                      <div className='form-control text-muted'>
                        <span className='spinner-border spinner-border-sm me-2'></span>
                        Loading subcategories...
                      </div>
                    ) : (
                      <Field
                        name='subcategory'
                        as='select'
                        className='form-select'
                        disabled={!values.category}
                        required
                      >
                        <option value=''>
                          {values.category ? 'Select a subcategory' : 'Select category first'}
                        </option>
                        {subcategories.map(subcategory => (
                          <option
                            key={subcategory.subcategory_id}
                            value={subcategory.subcategory_id}
                          >
                            {subcategory.subcategoryname}
                          </option>
                        ))}
                      </Field>
                    )}
                  </div>

                  {/* Brand */}
                  <div className='col-12'>
                    <label htmlFor='brand' className='form-label fw-semibold'>
                      Brand <span className='text-muted small'>(Optional)</span>
                    </label>
                    {loadingCategories ? (
                      <div className='form-control text-muted'>
                        <span className='spinner-border spinner-border-sm me-2'></span>
                        Loading brands...
                      </div>
                    ) : (
                      <Field
                        name='brand'
                        as='select'
                        className='form-select'
                        disabled={!values.category}
                      >
                        <option value=''>
                          {values.category ? 'Select a brand (optional)' : 'Select category first'}
                        </option>
                        {brands.map(brand => (
                          <option key={brand.brand_id} value={brand.brand_id}>
                            {brand.brand_name}
                          </option>
                        ))}
                      </Field>
                    )}
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
                      Product Image <span className='text-danger'>*</span>
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
                      required
                    />
                    {imageFile && (
                      <small className='text-success mt-1 d-block'>
                        ✓ {imageFile.name}
                      </small>
                    )}
                  </div>

                  {/* Discount Section */}
                  <div className='col-12'>
                    <div className='card bg-light border-0'>
                      <div className='card-body'>
                        <h6 className='fw-semibold mb-3'>💰 Discount (Optional)</h6>
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
                      value={values.prod_desc}
                      onChange={content => setFieldValue('prod_desc', content)}
                    />
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className='col-12'>
                      <div className='alert alert-danger d-flex align-items-center' role='alert'>
                        <span className='me-2'>⚠️</span>
                        <div>{error}</div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className='col-12'>
                    <div className='d-flex justify-content-center gap-3 pt-3 border-top'>
                      <button
                        type='submit'
                        className='btn btn-success px-5 py-2'
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className='spinner-border spinner-border-sm me-2'></span>
                            Adding Product...
                          </>
                        ) : (
                          <>✓ Add Product</>
                        )}
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
        modalMessage="You Want to Add the New Product"
        onHide={() => setModalShow(false)}
        confirmation={confirmSubmittedProduct}
        operationType="Add"
        wantToAddData={true}
      />
    </div>
  );
};

export default ProductAdd;
