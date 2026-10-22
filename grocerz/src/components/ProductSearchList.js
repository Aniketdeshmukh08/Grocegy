import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import temp_product_image from '../assets/products/p-img-29.webp';
// import Loader from './loader/Loader';
import loaderGif from '../assets/images/loader.gif'
import { toast } from 'react-toastify';
import Discount from './shared/Discount_tag';
import ProductCard from './ProductCard';
const ProductSearchList = () => {
  const location = useLocation();
  const [searchedProducts, setSearchProducts] = useState([]);
  const [message, setMessage] = useState('');
  const userid = localStorage.getItem('userid');
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [orderIDs, setOrderIDs] = useState([]);
  const [selectedorderIDs, setselectedOrderIDs] = useState();
  const [singleProduct, setSingleProduct] = useState();
  const usertype = localStorage.getItem('usertype');
  const [cart, setCart] = useState([]);

  useEffect(() => {
    // Fetch the cart from local storage when the component mounts
    const storedCart =
      (localStorage.getItem('cart') &&
        JSON.parse(localStorage.getItem('cart'))) ||
      [];
    setCart(storedCart);
  }, []);

  const query = new URLSearchParams(location.search);
  useEffect(() => {
    fetchSearchedProducts();
  }, [query.get('q')]);

  const fetchSearchedProducts = async categoryId => {
    setLoading(true);
    try {
      const searchTerm = query.get('q');
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}products/search?q=${encodeURIComponent(searchTerm)}`
      );
      setSearchProducts(response.data);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
    setLoading(false);
  };

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
        let cart = localStorage.getItem('cart').length
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
      // setMessage(response.data.message || 'Added to wishlist');
      if (response.status === 200) {
        toast.success('Product added to wishlist successfully');
      } else {
        toast.error('Failed to add product to cart');
      }
    } catch (error) {
      setMessage('There was an error adding the product to the wishlist!');
      console.error('Error adding to wishlist:', error);
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
  const handleAddProduct = async productid => {
    try {
      setLoading(true);
      const url = `${process.env.REACT_APP_API_URL}orderdetails/addProductInToOrder/${selectedorderIDs}`;
      await axios.post(url, singleProduct);
      setShowPopup(false);
    } catch (error) {
      console.error('Error adding product to order:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrderIDs();
  }, [showPopup]);

  const connectwhatsapp = () => {
    const phoneNumber = '+918757499345';
    const message = `Hi. I want to place an order.`;
    const whatsappLink = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
    window.open(whatsappLink, '_blank').focus();
  };
  const isInCart = productid => {
    return cart.some(item => item.productid === productid);
  };
  return (
    <>
      
      <section className='shop spad product product-sidebar footer-padding'>
        <div className='container'>
          {loading && 
            <div className='loader-div'>
            <img className='loader-img'
              src={loaderGif}
              alt='Loading...'/>
          </div>
          }
          <div className='col-lg-12 col-md-12 mx-auto'>
            <div className='row g-4'>
              {' '}
              {/* Added g-4 class for gutter spacing */}
              {searchedProducts.length > 0 ? (
                searchedProducts.map(product => (
                 <ProductCard product={product} isInCart={isInCart} onCartUpdate={handleCartUpdate}/>
                ))
              ) : (
                <div className='col-lg-12'>
                  <p>No any product available!</p>
                </div>
              )}
            </div>
          </div>

          <div class='login-btn'>
            <button onClick={connectwhatsapp} class='shop-btn shop-btn-full'>
              If your product is not listed<br></br>Order on WhatsApp
            </button>
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

export default ProductSearchList;
