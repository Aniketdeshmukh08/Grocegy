import React, { useState, useEffect, useContext } from 'react';
import temp_product_image from '../assets/products/p-img-29.webp';
import {  toast } from 'react-toastify';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Discount from './shared/Discount_tag';
import AddToPendingOrders from './AddToPendingOrders';
import { DataAppContext } from '../DataContext';

  const ProductCard = ({ product, isInCart, onCartUpdate }) => {
  const userid = localStorage.getItem('userid');
  const usertype = localStorage.getItem('usertype');
  const [loading, setLoading] = useState(false);
  const [singleProduct, setSingleProduct] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const { updateWishlistCount, updateCartCount } = useContext(DataAppContext);
  const [inCart, setInCart] = useState(false);
useEffect(() => {
  setInCart(isInCart(product.productid));
}, [product.productid, isInCart]);

  
  const handleAddToCart = async product => {
    setLoading(true);
    const { productid, prod_name, price, image, discount } = product;
    let cart = localStorage.getItem('cart')
    ? JSON.parse(localStorage.getItem('cart'))
    : [];
    const existingProduct = cart.find(item => item.productid === productid);
    if (existingProduct) {
      toast.info('Product is already in the cart.');
      setLoading(false);
      return;
    }
    
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
            cart.push({ productid, prod_name, price, image, discount, quantity });
            updateCartCount(prevCount => prevCount + 1);
          localStorage.setItem('cart', JSON.stringify(cart));
          if (onCartUpdate) {
            onCartUpdate(cart);
          }
          toast.success('Product added to cart successfully');
          setInCart(true);
        } else {
          toast.error('Failed to add product to cart');
        }
      } else {
          cart.push({ productid, prod_name, price, image, discount, quantity });
          updateCartCount(prevCount => prevCount + 1);
        localStorage.setItem('cart', JSON.stringify(cart));
         if (onCartUpdate) {
            onCartUpdate(cart);
          }
        toast.success('Product added to cart successfully');
        setInCart(true);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add product to cart');
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
        updateWishlistCount(prevCount => prevCount + 1);
      } else {
        toast.error('Failed to add product to cart');
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast.error('Failed to add product to wishlist');
    }
    setLoading(false);
  };

  /*const compressesProductName = (name) => {
    let shortedName = name.split(' ').slice(0, 3);
    return shortedName.join("_");
  };*/

  const compressesProductName = (name) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .split("-")
    .slice(0, 3)
    .join("-");
};
  return (
    <div className='col-6 col-md-6 col-lg-6 col-xl-4 ' key={product.productid}>
      <div className='product-wrapper m-2' data-aos='fade-up'>
        {
          product.discount > 0 && 
          (<Discount price={product.price} discountedPrice={product.price - product.discount} />)
        }
        <Link to={`/product/${compressesProductName(product.prod_name)}/${product.productid}`}>
          <div
            className="p-3 rounded mt-2 mb-2 mx-2 d-flex justify-content-center align-items-center custom-card"
          >
            {product.image ? (
              <img
                src={`${process.env.REACT_APP_IMAGE_URL}${product.image}`}
                alt={product.prod_name}
                className="img-fluid"
              />
            ) : (
              <div
                className="no-image-box d-flex justify-content-center align-items-center shadow-sm rounded"
              >
                <span className="text-muted text-center">
                  {product.prod_name}
                </span>
              </div>
            )}
          </div>
        </Link>
        <div className='product-info '>
          <div className='product-description '>
            <div className='product-details'
                 style={{
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  padding: '0 3px',
                  minHeight: '2.4em', 
                  lineHeight: '1.2em', }}>
              {product.prod_name}
            </div>
            <div className='price'
                 style={{
                   whiteSpace: 'nowrap',
                   overflow: 'hidden',
                   fontSize: 'clamp(0.9rem, 3.5vw, 1rem)',
                 }}>
              {product.discount !== 0 && (
                <span className='price-cut text-decoration-line-through me-1'>
                  &#8377; &nbsp;{product.price}
                </span>
              )}
              <span className='new-price fw-bold'>
                &#8377; &nbsp;{product.price - product.discount}
              </span>`
            </div>
          </div>
          {product.stock_quantity <= 0 && (
            <p className='out-of-stock'>Out of Stock</p>
          )}
          {product.stock_quantity > 0 && (
            <div className='product-cart-btn'>
              <div className='row'>
                <div className={userid ? 'col-6 w-75' : 'col-12'}>
                 {inCart ? (

                    <Link
                      to={'/cart'}
                      className='product-btn mb-2 text-nowrap'
                      type='button'
                    > 
                      Go to Cart
                    </Link>
                  ) : (
                    <button
                      onClick={() => handleAddToCart(product)}
                      className='product-btn text-nowrap mb-2'
                      type='button'
                    >
                      <span style={{position: 'relative', left: window.innerWidth <= 576 ? '-4px' : 0}}>
                        Add to Cart
                      </span>
                    </button>
                  )}
                </div>
                <div className='col-6 w-25'>
                  {userid && (
                    <button
                      onClick={() =>
                        addToWishlist(product.productid)
                      }
                      className='product-btn mb-2'
                      type='button'
                    >
                      <span>
                        <svg
                          width='28'
                          height='23'
                          viewBox='0 0 28 23'
                          fill='none'
                          xmlns='http://www.w3.org/2000/svg'
                        >
                          <path
                            d='M4.97214 5.02422C3.71435 5.18246 2.6616 5.7007 1.7705 6.60267C0.970091 7.40971 0.489057 8.26421 0.213053 9.37586C-0.275867 11.3024 0.0789948 13.2013 1.25398 14.9855C2.00708 16.1288 2.98097 17.1772 4.76711 18.7754C5.90266 19.7921 9.36848 22.7591 9.53802 22.858C9.69574 22.953 9.75488 22.9648 10.09 22.9648C10.4252 22.9648 10.4843 22.953 10.642 22.858C10.8116 22.7591 14.2853 19.7881 15.413 18.7754C17.207 17.1692 18.173 16.1249 18.9261 14.9855C20.1011 13.2013 20.4559 11.3024 19.967 9.37586C19.691 8.26421 19.21 7.40971 18.4096 6.60267C17.6131 5.7996 16.7614 5.33674 15.6456 5.09938C15.0857 4.9807 14.0526 4.96883 13.5637 5.0796C12.1995 5.3763 11.1546 6.0607 10.2004 7.27916L10.09 7.41762L9.98357 7.27916C9.04122 6.08443 8.01212 5.40004 6.69913 5.09938C6.30878 5.00839 5.4098 4.96883 4.97214 5.02422ZM6.28907 6.23081C7.40885 6.42861 8.37487 7.0774 9.13979 8.14948C9.26991 8.33542 9.43156 8.55696 9.49465 8.64795C9.78643 9.05937 10.3936 9.05937 10.6854 8.64795C10.7485 8.55696 10.9102 8.33542 11.0403 8.14948C12.0851 6.68575 13.5401 5.9974 15.1251 6.21498C16.8837 6.4563 18.2558 7.69058 18.7802 9.50641C19.1942 10.9424 19.0128 12.4497 18.2597 13.8066C17.6289 14.942 16.5761 16.1328 14.7427 17.7824C13.8555 18.5776 10.1255 21.7978 10.09 21.7978C10.0506 21.7978 6.33638 18.5895 5.4374 17.7824C2.61823 15.2466 1.50633 13.6642 1.23821 11.8088C1.06472 10.6101 1.31312 9.32047 1.91639 8.30377C2.82326 6.77278 4.58968 5.9341 6.28907 6.23081Z'
                            fill='black'
                          />
                        </svg>
                      </span>
                    </button>
                  )}
                </div>
              </div>
              {usertype == 'admin' && (
                <button
                  className='product-btn pending-add-btn col-6'
                  type='button'
                  onClick={() => {
                    setSingleProduct(product);
                    setShowPopup(true);
                  }}
                >
                  Add to Pending Orders
                </button>
              )}
              {/* <Link to='/checkout' state={{ product: product }} className='shop-btn w-100 mt-2'>
                Buy Now
              </Link> */}
              {showPopup === true && singleProduct && <AddToPendingOrders singleProduct={singleProduct} setShowPopup={setShowPopup} />}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductCard;