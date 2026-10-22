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
  const [modalShow,setModalShow] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [formValuesChanged ,setFormValuesChanged] = useState(false)

  useEffect(() => {
    const fetchProductById = async id => {
      try {
        const url =
          process.env.REACT_APP_API_URL + 'products/productById/' + id;
        const response = await axios.get(url);
        setProduct(response.data);
        setImageFile(null); // Clear the imageFile state when fetching product
        handleCategoryChange(response.data.category);
        setSelectedCategory(response.data.subcategory.split('#'));

        const calculatedDiscountPercentage =
          (response.data.discount / response.data.price) * 100;
        setDiscountAmount(response.data.discount);
        setDiscountPercentage(calculatedDiscountPercentage.toFixed(2));
      } catch (error) {
        console.log(error);
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

  const editProduct =  values => {
    try{
      const isUnchanged = Object.keys(product).every(
        key => product[key] === values[key]
      );
      if (isUnchanged) {
        setModalMessage('No changes were made. Nothing to update.');
      }else{
        setModalMessage('Do you want to update the product.');
        setFormValuesChanged(true)
        setProduct(values);
      }
      setModalShow(true)
    }catch(error){
      console.log(error)
    }
  };

  const confirmUpdateProduct = async()=>{
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

  return (
    <>
    
    <div>
      <h2>Products Edit</h2>

      <Formik
        enableReinitialize={true}
        initialValues={product}
        onSubmit={(values, { resetForm }) => {
          editProduct(values);
          resetForm();
        }}
      >
        {({ values, setFieldValue }) => (
          <Form className='examAddForm'>
            <div className='row'>
              <label htmlFor='name' className='col-4 my-2'>
                Product Name:
              </label>
              <Field name='prod_name' type='text' className='col-8' required />
            </div>

            <div className='row'>
              <label htmlFor='category' className='col-4 my-2'>
                Category
              </label>
              <Field
                name='category'
                as='select'
                className='col-8'
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

            {/* <div className='row'>
                            <label htmlFor="subcategory" className='col-4 my-2'>Subcategory:</label>
                            <Field
                                name="subcategory"
                                as="select"
                                className='col-8'
                                required
                            >
                                <option value="">Select a subcategory</option>
                                {subcategories.map(subcategory => (
                                    <option key={subcategory.subcategory_id} value={subcategory.subcategory_id}>{subcategory.subcategoryname}</option>
                                ))}
                            </Field>
                        </div> */}

            <div className='row'>
              {/* <label htmlFor="subcategory" className='col-4 my-2'></label> */}
              {subcategories.map(subcategory => (
                <div
                  key={subcategory.subcategory_id}
                  style={{ paddingLeft: '49.5%' }}
                >
                  <input
                    style={{ width: '5%' }}
                    type='checkbox'
                    name='subcategory'
                    value={subcategory.subcategory_id}
                    onChange={e => handleCheck(e)}
                    checked={selectedCategory.includes(
                      subcategory.subcategory_id
                    )}
                  />

                  <label htmlFor='subcategory'>
                    {subcategory.subcategoryname}
                  </label>
                </div>
              ))}
            </div>

            <div className='row'>
              <label htmlFor='price' className='col-4 my-2'>
                Price:
              </label>
              <Field
                name='price'
                type='number'
                className='col-8'
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

            <div className='row'>
              <label htmlFor='stock_quantity' className='col-4 my-2'>
                Quantity
              </label>
              <Field
                name='stock_quantity'
                type='number'
                className='col-8'
                required
              />
            </div>

            <div className='row'>
              <label htmlFor='image' className='col-4 my-2'>
                Image:
              </label>
              <input
                name='image'
                type='file'
                className='col-8'
                onChange={e => {
                  setImageFile(e.target.files[0]);
                  setFieldValue('image', e.target.files[0]);
                }}
              />
            </div>

            <div className='row'>
              <label htmlFor='brand' className='col-4 my-2'>
                Brand:
              </label>
              <Field name='brand' as='select' className='col-8' required>
                <option value=''>Select a brand</option>
                {brands.map(brand => (
                  <option key={brand.brand_id} value={brand.brand_id}>
                    {brand.brand_name}
                  </option>
                ))}
              </Field>
            </div>

            <div className='row'>
              <label htmlFor='discount' className='col-4 my-2'>
                Discount:
              </label>
              <div className='col-8'>
                <div className='row'>
                  <div className='col'>
                    <Field
                      name='discount'
                      type='number'
                      placeholder='Amount'
                      className='col-8'
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
                  <div className='col'>
                    <Field
                      name='discount_percentage'
                      type='number'
                      placeholder='Percentage'
                      className='col-8'
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
                </div>
              </div>
            </div>

            <div className='row'>
              <label htmlFor='prod_desc' className='col-4 my-2'>
                Product Description
              </label>
              <div className='col-8'>
                <JoditEditor
                  ref={editor}
                  value={values.prod_desc || ''}
                  onChange={newContent => {
                    setFieldValue('prod_desc', newContent);
                  }}
                />
              </div>
            </div>

            <div className='row'>
              <div className='col-12 text-center'>
                <button type='submit' className='btn btn-primary'>
                  Update Product
                </button>
                <Link to='/productslist' className='btn btn-secondary ml-2'>
                  Back to Product List
                </Link>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>

    <ConfirmationModal
        show={modalShow}
        modalMessage = {modalMessage}
        onHide={() => setModalShow(false)}
        confirmation ={confirmUpdateProduct}
        operationType = "Update"
        wantToAddData = {formValuesChanged}
      />
    </>
  );
};

export default ProductEdit;
