import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import temp_product_image from '../assets/products/p-img-29.webp';
// import Loader from './loader/Loader';
// import loaderGif from '../assets/images/loaderGif'
import loaderGif from '../assets/images/loader.gif'
import {  toast } from 'react-toastify';
import Discount from './shared/Discount_tag';
import ProductCard from './ProductCard';

const ShopByBrand = () => {
  const { brand_id } = useParams();
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState([]);
  const userid = localStorage.getItem('userid');
  const usertype = localStorage.getItem('usertype');
  const [showPopup, setShowPopup] = useState(false);
  const [orderIDs, setOrderIDs] = useState([]);
  const [selectedorderIDs, setselectedOrderIDs] = useState();
  const [singleProduct, setSingleProduct] = useState();
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [productFetching, setProductFetching] = useState(false);

  useEffect(() => {
    const storedCart =
      (localStorage.getItem('cart') &&
        JSON.parse(localStorage.getItem('cart'))) ||
      [];
    setCart(storedCart);
  }, []);

  useEffect(() => {
    fetchBrands();
  }, []);

  const connectwhatsapp = () => {
    const phoneNumber = '+918757499345';
    const message = `Hi. I want to place an order.`;
    const whatsappLink = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
    window.open(whatsappLink, '_blank').focus();
  };

  useEffect(() => {
    if (brand_id) {
      fetchProducts(brand_id);
    }
  }, [brand_id]);

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}products/allBrandsByOrders`
      );
      setBrands(
        response.data.sort((a, b) => a.brand_name.localeCompare(b.brand_name))
      );
      if (response.data.length > 0) {
        const firstbrand_id = response.data[1].brand_id;
        setSelectedBrand(firstbrand_id);
        fetchProducts(firstbrand_id);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
    setLoading(false);
  };

  const fetchProducts = async (brand_id) => {
      setLoading(true);
      setProductFetching(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}products/brand/${brand_id}`);
        setProducts(prev => response.data);
        setProductFetching(false);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
        setProductFetching(false);
      }
  };

  const handleCartUpdate = (updatedCart) => {
    setCart(updatedCart);
  };
  
  const handleAddToCart = async (product) => {
    const { productid, prod_name, price, image, discount } = product;
    setLoading(productid);
    try {
      const quantity = 1;
      const userid = localStorage.getItem('userid');
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
          let cart = localStorage.getItem('cart')
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
        localStorage.setItem('cart', JSON.stringify(cart));
        toast.success('Product added to cart successfully');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Error adding product to cart');
    }
    setLoading(false);
  };

  const addToWishlist = async productid => {
    setLoading(true);
    try {
      const userid = localStorage.getItem('userid');
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
        toast.error('Failed to add product to wishlist');
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast.error('Error adding product to wishlist');
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
      await axios.post(url, {
        ...singleProduct,
        quantity: selectedQuantity, // Pass selected quantity here
      });
      toast.success('Product added to order successfully');
      setShowPopup(false);
    } catch (error) {
      console.error('Error adding product to order:', error);
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchOrderIDs();
  }, [showPopup]);

  const isInCart = productid => {
    return cart.some(item => item.productid === productid);
  };

  function RenderProducts(){
    if(!loading && products.length>0){
      return(  
        products.map(product => (
          <ProductCard product={product} isInCart={isInCart} onCartUpdate={handleCartUpdate}/>
        ))
        
      )
    }else if(!loading && !productFetching &&products.length==0){
      return(
        <div className='col-lg-12 d-flex justify-content-center align-items-center'>
          <p>No products available for this brand</p>
        </div>
      )
    }else {
      return (
        <div className='loader-div d-flex justify-content-center align-items-center'>
          <img className='loader-img'
            src={loaderGif}
            alt='Loading...' />
        </div>
      )
    }
  }

  return (
    <>
      
      <section className='shop spad product product-sidebar footer-padding'>
        <div className='container'>
          <div className='row'>
            <div className='col-lg-3'>
              <div className='sidebar' data-aos='fade-right'>
                <div className='sidebar-section box-shadows'>
                  {/* Brands Section */}
                  {brands.length > 0 && (
                    <div className='sidebar-wrapper text-custom-font-1'>
                      <h3 className='wrapper-heading'>Brands</h3>
                      <div className='sidebar-item'>
                        {brands.map((brand, index) => {
                          return index !== 0 ? (
                            <div
                              key={brand.brand_id}
                              id={`brand-${brand.brand_id}`}
                              name='brand'
                              className={
                                brand.brand_id === selectedBrand
                                  ? 'sidebar-sub-category sidebar-sub-category-selected'
                                  : 'sidebar-sub-category'
                              }
                              onClick={() => {
                                setSelectedBrand(brand.brand_id);
                                fetchProducts(brand.brand_id);
                              }}
                            >
                              <label htmlFor={`brand-${brand.brand_id}`}>
                                {brand.brand_name}
                              </label>
                            </div>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* WhatsApp Order Button */}
              <div className='login-btn'>
                <button
                  onClick={connectwhatsapp}
                  className='shop-btn shop-btn-full'
                >
                  If your product is not listed
                  <br />
                  Order on WhatsApp
                </button>
              </div>
            </div>

            <div className='col-lg-9 col-md-9'>
              <div className='row h-75 d-flex flex-wrap align-content-start'>
                <RenderProducts />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ShopByBrand;
