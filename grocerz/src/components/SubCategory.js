import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const Subcategory = () => {
  const { subcategory_id } = useParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(
    subcategory_id || null
  );
  const [message, setMessage] = useState('');
  const [subcategoryName, setSubcategoryName] = useState('');
  const userid = localStorage.getItem('userid');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}category/allCategory`
        );
        setCategories(response.data);
        if (!selectedCategory && response.data.length > 0) {
          const firstCategoryId = response.data[0].category_id; // Fix here: category_id instead of subcategory_id
          setSelectedCategory(firstCategoryId);
          fetchProducts(firstCategoryId);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, [selectedCategory]); // Fix here: add selectedCategory dependency

  useEffect(() => {
    const fetchSubcategory = async () => {
      if (subcategory_id) {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_API_URL}subCategory/subCategoryById/${subcategory_id}`
          );
          if (response.data.length > 0) {
            setSubcategoryName(response.data[0].subcategoryname);
          } else {
            console.warn('Subcategory not found');
          }
        } catch (error) {
          console.error('Error fetching subcategory:', error);
        }
      }
    };

    fetchSubcategory();
  }, [subcategory_id]);

  const fetchProducts = async categoryId => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}products/bySubCategoryId/${categoryId}`
      );
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    if (selectedCategory) {
      fetchProducts(selectedCategory);
    }
  }, [selectedCategory]);

  const handleAddToCart = async productid => {
    try {
      const quantity = 1;
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}cart/addToCart`,
        {
          userid,
          productid,
          quantity,
        }
      );
      setMessage(response.data.message || 'Added to cart');
    } catch (error) {
      setMessage('There was an error adding the product to the cart!');
      console.error('Error adding to cart:', error);
    }
  };

  const addToWishlist = async productid => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}wishlist/addToWishlist`,
        {
          userid,
          productid,
        }
      );
      setMessage(response.data.message || 'Added to wishlist');
    } catch (error) {
      setMessage('There was an error adding the product to the wishlist!');
      console.error('Error adding to wishlist:', error);
    }
  };

  return (
    <>
      {/* Breadcrumb navigation */}
      <div className='breadcrumb-option'>
        <div className='container'>
          <div className='row'>
            <div className='col-lg-12'>
              <div className='breadcrumb__links'>
                <Link to='/home'>
                  <i className='fa fa-home'></i> Home
                </Link>
                <span>{subcategoryName || 'Shop'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products grid */}
      <section className='shop spad'>
        <div className='container'>
          <div className='row'>
            <div className='col-lg-3'>
              <div className='sidebar' data-aos='fade-right'>
                <div className='sidebar-section box-shadows'>
                  {/* Categories Section */}
                  <div className='sidebar-wrapper'>
                    <h3 className='wrapper-heading'>Categories</h3>
                    <div className='sidebar-item'>
                      <ul className='sidebar-list'>
                        {categories.map(category => (
                          <li key={category.category_id}>
                            <input
                              type='radio'
                              id={category.category_id}
                              name='category'
                              checked={
                                selectedCategory === category.category_id
                              }
                              onChange={() =>
                                setSelectedCategory(category.category_id)
                              }
                            />
                            <label htmlFor={category.category_id}>
                              {category.categoryname}
                            </label>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  {/* Add other sidebar sections here */}
                </div>
              </div>
            </div>

            <div className='col-lg-9 col-md-9'>
              <div className='row'>
                {products.length > 0 ? (
                  products.map(product => (
                    <div
                      className='col-xl-4 col-sm-6 mb-4'
                      key={product.productid}
                    >
                      <div className='product-wrapper' data-aos='fade-up'>
                        <div className='product-img'>
                          <img
                            draggable='false'
                            src='assets/images/homepage-one/product-img/p-img-1.webp'
                            alt={product.name}
                            className='product-img__img'
                          />
                        </div>
                        <div
                          className='product-content'
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                          }}
                        >
                          <h1
                            className='product-title'
                            style={{ margin: '5px 0' }}
                          >
                            {product.prod_name}
                          </h1>
                          <p
                            className='product-price'
                            style={{ margin: '5px 0' }}
                          >
                            ${product.price}
                          </p>
                          <button
                            onClick={() => handleAddToCart(product.productid)}
                            className='btn btn-primary'
                            style={{ margin: '10px 0' }}
                          >
                            Add to Cart
                          </button>
                          <button
                            onClick={() => addToWishlist(product.productid)}
                            className='btn btn-secondary'
                            style={{ margin: '10px 0' }}
                          >
                            Add to Wishlist
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className='col-lg-12'>
                    <p>No products available for this category</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Message display */}
      {message && (
        <div className='message'>
          <p>{message}</p>
        </div>
      )}
    </>
  );
};

export default Subcategory;
