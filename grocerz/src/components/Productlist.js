import React, { useState, useEffect } from 'react';
import { useParams, Link ,useNavigate} from 'react-router-dom';
import axios from 'axios';
import temp_product_image from '../assets/products/p-img-29.webp';
// import Loader from './loader/Loader';
import loaderGif from '../assets/images/loader.gif'
import {  toast } from 'react-toastify';
import Discount from './shared/Discount_tag';
import ProductCard from './ProductCard';
import ErrorRedirectPage from './ErrorRedirectPage';
const Productlist = () => {
 const { categoryname, category_id } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [message, setMessage] = useState('');
  const [subcategoryName, setSubcategoryName] = useState('');
  const userid = localStorage.getItem('userid');
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [orderIDs, setOrderIDs] = useState([]);
  const [selectedorderIDs, setselectedOrderIDs] = useState();
  const [singleProduct, setSingleProduct] = useState();
  const usertype = localStorage.getItem('usertype');
  const [cart, setCart] = useState([]);
  const [productQuantity, setProductQuantity] = useState(0)
  const [error, setError] = useState('');  
  const[loadingSubcategory, setLoadingSubcategory] = useState(false);

  const formatUrlName = name => {
    if (!name) return '';
    return name.replace(/&/g, 'and').replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, '-').toLowerCase();
  };
  
  useEffect(() => {
    // Fetch the cart from local storage when the component mounts
    const storedCart =JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(storedCart);
  }, []);

  useEffect(() => {
    if (category_id) {
      fetchSubcategories(category_id);
    }
  }, [category_id]);

  const storeSelectedSubcategory = firstSubcategoryId => {
    // console.log('setting sub category id')
    setSelectedSubcategory(firstSubcategoryId);
    window.localStorage.setItem('selectedSubcategory', firstSubcategoryId);
  };

  const fetchSubcategories = async categoryId => {
    setLoadingSubcategory(true);
    setError(''); 
    setProducts(null); 
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}subCategory/categoryid/${categoryId}`
      );
      //console.log('Subcategories response:', response.data);
      setSubcategories(response.data);
      if (response.data.length > 0) {
        let subcategories = response.data.map(item => item.subcategory_id);
        let storedsubcategory = window.localStorage.getItem(
          'selectedSubcategory'
        );
        //console.log('subcategories', subcategories)
        //console.log('storedsubcategory', storedsubcategory)
        if (subcategories.indexOf(storedsubcategory) > -1) {
          //console.log('inside if', storedsubcategory)
          storeSelectedSubcategory(storedsubcategory);
          fetchProducts(categoryId, storedsubcategory);
          //setSubcategoryName(response.data[0].subcategoryname);
        } else {
          //console.log('inside else')
          const firstSubcategoryId = response.data[0].subcategory_id;
          storeSelectedSubcategory(firstSubcategoryId);
          fetchProducts(categoryId, firstSubcategoryId);
          //setSubcategoryName(response.data[0].subcategoryname);
        }
        // const firstSubcategoryId = response.data[0].subcategory_id;
        // storeSelectedSubcategory(firstSubcategoryId);
        // fetchProducts(categoryId, firstSubcategoryId);
        //setSubcategoryName(response.data[0].subcategoryname);
      } else {
        setProducts([]);
        //setSubcategoryName('');
      }
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      setError('Failed to load products. Please try again.');
      setProducts([]); 
    }
    setLoadingSubcategory(false);
  };

  const fetchProducts = async (categoryId, subcategoryId) => {
    setLoading(true);
    setError(''); 
    setProducts(null); 
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}products/bySubCategory`,
        {
          category: categoryId,
          subcategory: subcategoryId,
        }
      );
      // console.log('Products response:', response.data);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products. Please try again.');
      setProducts([]); 
    }
    setLoading(false);
  };
  const fetchOrderIDs = async () => {
    setLoading(true);
    try {
      const url = process.env.REACT_APP_API_URL + 'orders/allorderIDs';
      const response = await axios.get(url);
      // console.log('orderIds response:', response.data);
      setOrderIDs(response.data);
    } catch (error) {
      console.error('Error fetching orderIDs:', error);
    }
    setLoading(false);
  };
  useEffect(() => {
    if (selectedSubcategory) {
      fetchProducts(category_id, selectedSubcategory);
    }
  }, [selectedSubcategory]);

  useEffect(() => {
    setSelectedSubcategory(window.localStorage.getItem('selectedSubcategory'));
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    fetchOrderIDs();
  }, [showPopup]);

  const handleCartUpdate = (updatedCart) => {
    setCart(updatedCart);
  };

  const handleAddToCart = async product => {
    setLoading(true);
    const { productid, prod_name, price, image, discount } = product;
    try {
      const quantity = 1;
      if (userid) {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}cart/addToCart`,
          {
            userid,
            productid,
            quantity,
          }
        );
        if (response.status === 200) {
          let cart = localStorage.getItem('cart').length
            ? JSON.parse(localStorage.getItem('cart'))
            : [];
          cart.push({ productid, prod_name, price, image, discount, quantity });
          localStorage.setItem('cart', JSON.stringify(cart));
          toast.success('Product added to cart successfully');
        } else {
          toast.error('Failed to add product to cart');
        }
      } else {
        let cart = localStorage.getItem('cart')
          ? JSON.parse(localStorage.getItem('cart'))
          : [];
        const existingProduct = cart.find(item => item.productid === productid);
        if (existingProduct) {
          existingProduct.quantity += quantity;
        } else {
          cart.push({ productid, prod_name, price, image, discount, quantity });
        }
        // Save the updated cart back to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        toast.success('Product added to cart successfully');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
    setLoading(false);
  };

  const addToWishlist = async productid => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}wishlist/addToWishlist`,
        {
          userid,
          productid,
        }
      );
      if (response.status === 200) {
        toast.success('Product added to wishlist successfully');
      } else {
        toast.error('Failed to add product to cart');
      }
      // setMessage(response.data.message || 'Added to wishlist');
    } catch (error) {
      setMessage('There was an error adding the product to the wishlist!');
      console.error('Error adding to wishlist:', error);
    }
    setLoading(false);
  };
  const handleAddProduct = async productid => {
    try {
      setLoading(true);
      const url = `${process.env.REACT_APP_API_URL}orderdetails/addProductInToOrder/${selectedorderIDs}`;
      // await axios.post(url, singleProduct);
      await axios.post(url, { ...singleProduct, quantity: productQuantity });
      setShowPopup(false);
    } catch (error) {
      console.error('Error adding product to order:', error);
    }
    setLoading(false);
  };

  const connectwhatsapp = () => {
    const phoneNumber = '+918757499345';
    const message = `Hi. I want to place an order.`;
    const whatsappLink = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
    window.open(whatsappLink, '_blank').focus();
  };

  const isInCart = productid => {
    return cart.some(item => item.productid === productid);
  };

  // if (loading) {
  //   return (
  //           <div style={{
  //             width: '100%',
  //             display: 'flex',
  //             justifyContent: 'center',
  //             alignItems: 'center',
  //           }} className='loader-div'>
  //             <img className='loader-img'
  //               src={loaderGif}
  //               alt='Loading...'
  //               style={{ width: '80px', height: '80px' }}
  //             />
  //           </div>
  //   );
  // }

  if (error) {
    return <ErrorRedirectPage/>

  }


  // if (products === null) {
  //   return  (
  //           <div style={{
  //              width: '100%', 
  //             display: 'flex',
  //             justifyContent: 'center',
  //             alignItems: 'center',
  //           }} className='loader-div'>
  //             <img className='loader-img'
  //               src={loaderGif}
  //               alt='Loading...'
  //               style={{ width: '80px', height: '80px' }}
  //             />
  //           </div>)
  // }


  return (
    <>
      {/* <div className="breadcrumb-option">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="breadcrumb__links">
                <Link to="/home"><i className="fa fa-home"></i> Home</Link>
                <span><h2>{subcategoryName || 'Shop'}</h2></span>
              </div>
            </div>
          </div>
        </div>
      </div> */}
      
      <section className='shop spad product product-sidebar footer-padding'>
        <div className='container'>
          
          <div className='row'>
            <div className='col-lg-3'>
              {/* <div className='sidebar' data-aos='fade-right'>
                <div className='sidebar-section box-shadows'>
                  {subcategories.length > 0 && (
                    <div className='sidebar-wrapper'>
                      <h3 className='wrapper-heading'>Subcategories</h3>
                      <div className='sidebar-item'>
                        <ul className='sidebar-list'>
                          {subcategories.map(subcategory => (
                            <li key={subcategory.subcategory_id}>
                              <input
                                type='radio'
                                id={`subcategory-${subcategory.subcategory_id}`}
                                name='subcategory'
                                checked={
                                  selectedSubcategory ===
                                  subcategory.subcategory_id
                                }
                                onChange={() => {
                                  storeSelectedSubcategory(
                                    subcategory.subcategory_id
                                  );
                                  //setSubcategoryName(subcategory.subcategoryname);
                                  fetchProducts(
                                    category_id,
                                    subcategory.subcategory_id
                                  );
                                }}
                              />
                              <label
                                htmlFor={`subcategory-${subcategory.subcategory_id}`}
                              >
                                {subcategory.subcategoryname}
                              </label>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div> */}

              {loadingSubcategory === true ?
              <div style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }} className='loader-div'>
              <img className='loader-img'
                src={loaderGif}
                alt='Loading...'
                style={{ width: '80px', height: '80px' }}
              />
            </div> :
              <div className='sidebar'>
                <div className='sidebar-section box-shadows'>
                  {subcategories.length > 0 && (
                    <div className='sidebar-wrapper text-custom-font-1'>
                      <h3 className='wrapper-heading'>Subcategories</h3>
                      <div className='sidebar-item'>
                        {/* <ul className='sidebar-list'> */}
                        {subcategories.map(subcategory => (
                          <div
                            key={subcategory.subcategory_id}
                            type='radio'
                            id={`subcategory-${subcategory.subcategory_id}`}
                            name='subcategory'
                            className={selectedSubcategory ===
                              subcategory.subcategory_id ? 'sidebar-sub-category sidebar-sub-category-selected' : 'sidebar-sub-category'}
                            checked={
                              selectedSubcategory ===
                              subcategory.subcategory_id
                            }
                            onClick={() => { storeSelectedSubcategory(subcategory.subcategory_id);
                              navigate(`/category/${categoryname}/${category_id}/${formatUrlName(subcategory.subcategoryname)}/${subcategory.subcategory_id}`);}}
                          >
                            <label
                              htmlFor={`subcategory-${subcategory.subcategory_id}`}
                            >
                              {subcategory.subcategoryname}
                            </label>
                          </div>
                        ))}
                        {/* </ul> */}
                      </div>
                    </div>
                  )}
                </div>
              </div>
  }
              <div class='login-btn'>
                <button
                  onClick={connectwhatsapp}
                  class='shop-btn shop-btn-full wa-button-list-page'
                >
                  If your product is not listed<br></br>Order on WhatsApp
                </button>
              </div>
            </div>

            <div className='col-lg-9 col-md-9 d-flex justify-content-center'>
              <div className='row w-100'>
              {loading || !products? (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }} className='loader-div'>
              <img className='loader-img'
                src={loaderGif}
                alt='Loading...'
                style={{ width: '80px', height: '80px' }}
              />
            </div> ) : (
              <>
                {products.length > 0 ? (
                  products.map(product => (
                   <ProductCard product={product} isInCart={isInCart} onCartUpdate={handleCartUpdate}/>
                  ))
                ) : (
                  <div className='shadow rounded col-lg-12 d-flex justify-content-center align-items-center vh-80'>
                  <p>No products available for this subcategory</p>
                 </div>

                )}
                </>
               )} </div> 
            </div>
          </div>
        </div>
      </section>

      {message && (
        <div className='message'>
          <p>{message}</p>
        </div>
      )}
    </>
  );
};

export default Productlist;
