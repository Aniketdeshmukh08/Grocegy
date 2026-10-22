import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import temp_product_image from '../assets/products/p-img-29.webp';
import ProductCard from './ProductCard';

const SimilarProducts = () => {
  const userid = localStorage.getItem('userid');
  const usertype = localStorage.getItem('usertype');
  const { productid } = useParams();
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [orderIDs, setOrderIDs] = useState([]);
  const [selectedorderIDs, setselectedOrderIDs] = useState();
  const [showPopup, setShowPopup] = useState(false);
  const [singleProduct, setSingleProduct] = useState();
  const [cart, setCart] = useState([]);
  const [message, setMessage] = useState('');
  const [showAll, setShowAll] = useState(false);

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
        const existingProduct = cart.find(product => product.productid === productid);
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
      await axios.post(url, singleProduct);
      setShowPopup(false);
    } catch (error) {
      console.error('Error adding product to order:', error);
    }
    setLoading(false);
  };

  const isInCart = productid => {
    return cart.some(product => product.productid === productid);
  };

  useEffect(() => {
    const fetchSimilarProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}products/similar/${productid}`
        );
        setSimilarProducts(response.data);
      } catch (error) {
        console.error('Error fetching similar products:', error);
      }
      setLoading(false);
    };

    if (productid) {
      fetchSimilarProducts();
    }
  }, [productid]);

  const productsToDisplay = showAll ? similarProducts : similarProducts.slice(0, 6);

  return (
    <div className='container'>
      <div className='similar-products'>
      <h5>Similar Products</h5>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className='row'>
          {similarProducts.length > 0 ? (
            productsToDisplay.map((product) => (
                <ProductCard product={product} isInCart={isInCart} onCartUpdate={handleCartUpdate}/>
            ))
          ) : (
            <p>No similar products found</p>
          )}
        </div>
      )}
      {!showAll && similarProducts.length > 6 && (
        <div className='text-center'>
        <button
          className='shop-btn'
          onClick={() => setShowAll(true)}
        >
          Show All
        </button>
      </div>
      )}
    </div>
    </div>
  );
};

export default SimilarProducts;