import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Formik, Field, Form } from 'formik';
import JoditEditor from 'jodit-react';

const ProductCopy = () => {
  const { productid } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({});
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    const fetchProductById = async id => {
      try {
        const url =
          process.env.REACT_APP_API_URL + 'products/productById/' + id;
        const response = await axios.get(url);
        setProduct(response.data);
        handleCategoryChange(response.data.category);
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
      const url = process.env.REACT_APP_API_URL + 'subCategory/allSubCategory';
      const response = await axios.get(url);
      setSubcategories(
        response.data.filter(
          subcategory => subcategory.category_id === categoryId
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  const copyProduct = async values => {
    const formData = new FormData();
    const productid = parseInt(Math.random() * 10000000000);
    // const datestamp = Date.now();

    formData.append('prod_name', values.prod_name);
    formData.append('category', values.category);
    formData.append('subcategory', values.subcategory);
    formData.append('price', values.price);
    formData.append('stock_quantity', values.stock_quantity);
    formData.append('brand', values.brand);
    formData.append('discount', values.discount);
    formData.append('prod_desc', values.prod_desc);
    
    if(imageFile){
    formData.append('image', imageFile);
    }else{
      formData.append('image','product.image');
    }
    
    formData.append('productid', productid);
    // formData.append('datestamp', datestamp);

    try {
      const url = process.env.REACT_APP_API_URL + 'products/copyProuduct';
      const response = await axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);
      navigate('/productslist'); // Redirect on successful response
    } catch (error) {
      console.error(error);
      setError('Failed to add product. Please try again.'); // Show error message on failure
    } finally {
      setLoading(false); // Stop the loader
    }
  };

  return (
    <div>
      <h2>Products Copy</h2>

      <Formik
        enableReinitialize={true}
        initialValues={product}
        onSubmit={async (values, { resetForm }) => {
          await copyProduct(values);
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

            <div className='row'>
              <label htmlFor='subcategory' className='col-4 my-2'>
                Subcategory:
              </label>
              <Field name='subcategory' as='select' className='col-8' required>
                <option value=''>Select a subcategory</option>
                {subcategories.map(subcategory => (
                  <option
                    key={subcategory.subcategory_id}
                    value={subcategory.subcategory_id}
                  >
                    {subcategory.subcategoryname}
                  </option>
                ))}
              </Field>
            </div>

            <div className='row'>
              <label htmlFor='price' className='col-4 my-2'>
                Price:
              </label>
              <Field name='price' type='number' className='col-8' required />
            </div>

            <div className='row'>
              <label htmlFor='image' className='col-4 my-2'>
                Image:
              </label>
              <div className='col-8'>
                {product.image && (
                  <div className='mb-2'>
                    <img
                      src={`${process.env.REACT_APP_IMAGE_URL}${product.image}`}
                      alt='Current Product'
                      style={{
                        maxWidth: '150px',
                        height: 'auto',
                        border: '1px solid #ddd',
                      }}
                    />
                    <p className='mt-1 text-muted' style={{ fontSize: '0.9rem' }}>
                      Current image shown above. You can upload a new image to replace it.
                    </p>
                  </div>
                )}
                <input
                  name='image'
                  type='file'
                  accept='image/*'
                  className='form-control'
                  onChange={e => {
                    setImageFile(e.currentTarget.files[0]);
                    setFieldValue('image', e.currentTarget.files[0]);
                  }}
                />
              </div>
            </div>

            <div className='row'>
              <label htmlFor='brand' className='col-4 my-2'>
                Brand:
              </label>
              <Field name='brand' type='text' className='col-8' required />
            </div>

            <div className='row'>
              <label htmlFor='discount' className='col-4 my-2'>
                Discount:
              </label>
              <Field name='discount' type='number' className='col-8' required />
            </div>

            <div className='row'>
              <label htmlFor='prod_desc' className='col-4 my-2'>
                Description:
              </label>
              <div className='col-8'>
                <JoditEditor
                  value={values.prod_desc}
                  onChange={content => setFieldValue('prod_desc', content)}
                />
              </div>
            </div>

            <div className='row'>
              <div className='text-center my-4'>
                <button
                  type='submit'
                  className='btn btn-dark'
                  disabled={loading}
                >
                  {loading ? 'Adding...' : 'Copy Product'}
                </button>
              </div>
            </div>
            {error && (
              <div className='row'>
                <div className='col-12 my-2'>
                  <p style={{ color: 'red' }}>{error}</p>
                </div>
              </div>
            )}
          </Form>
        )}
      </Formik>

      <div className='row'>
        <div className='text-center my-4'>
          <Link to='/productslist' className='btn btn-primary'>
            Back to Product List
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCopy;
