import React, { useContext, useEffect, useState,useRef } from 'react';
import { DataAppContext } from '../DataContext';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
// import Loader from './loader/Loader';
import loaderGif from '../assets/images/loader.gif'
import dress1 from '../assets/img/product/women/dress1.jpg';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SimilarProducts from './SimilarProducts';
import Discount from './shared/Discount_tag';
import { Helmet } from 'react-helmet-async';

const ShareComponent = ({ product }) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const popoverRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setPopoverOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [popoverRef]);

  if (!product || !product.prod_name) return null;

  const shareUrl = window.location.href;
  const title = `Check out this product: ${product.prod_name}`;

  const shareOptions = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(title)}%20${encodeURIComponent(shareUrl)}`,
    instagram: `https://www.instagram.com/?url=${encodeURIComponent(shareUrl)}`
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      toast.success('Link copied to clipboard!');
      setPopoverOpen(false);
    });
  };

  const shareWithImage = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}${product.image}`);
      const blob = await response.blob();
      const file = new File([blob], `${product.prod_name.replace(/\s/g, '_')}.jpg`, { type: blob.type });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: product.prod_name,
          text: title,
        });
      } else {
        toast.info('Your browser does not support sharing images directly.');
      }
    } catch (err) {
      console.error('Share with image failed:', err);
      toast.error('Could not share image.');
    }
    setPopoverOpen(false);
  };

  const containerStyle = { position: 'relative', display: 'inline-block' };
  const popoverStyle = {
    display: popoverOpen ? 'block' : 'none',
    position: 'absolute',
    top: '100%',
    left: 0,
    marginTop: '10px',
    backgroundColor: 'white',
    border: '1px solid #eee',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    zIndex: 1000,
    width: '200px',
    padding: '8px',
  };
  const menuItemStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '10px',
    cursor: 'pointer',
    borderRadius: '4px',
    textDecoration: 'none',
    color: '#333',
  };
  const iconStyle = { marginRight: '12px', width: '20px', height: '20px' };
return (
  <div style={containerStyle} ref={popoverRef}>
    <button className='quantity' type='button' onClick={() => setPopoverOpen(prev => !prev)}>
      <span>
        <svg height="23px" width="23px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16.9999 15.5C16.4999 15.5 16.0399 15.68 15.6799 15.98L9.67994 12.3C9.85994 11.95 9.99994 11.5 9.99994 11C9.99994 10.5 9.85994 10.05 9.67994 9.7L15.6799 6.02C16.0399 6.32 16.4999 6.5 16.9999 6.5C18.3799 6.5 19.4999 5.38 19.4999 4C19.4999 2.62 18.3799 1.5 16.9999 1.5C15.6199 1.5 14.4999 2.62 14.4999 4C14.4999 4.5 14.6399 4.95 14.8199 5.3L8.81994 8.98C8.45994 8.68 7.99994 8.5 7.49994 8.5C6.11994 8.5 4.99994 9.62 4.99994 11C4.99994 12.38 6.11994 13.5 7.49994 13.5C7.99994 13.5 8.45994 13.32 8.81994 13.02L14.8199 16.7C14.6399 17.05 14.4999 17.5 14.4999 18C14.4999 19.38 15.6199 20.5 16.9999 20.5C18.3799 20.5 19.4999 19.38 19.4999 18C19.4999 16.62 18.3799 15.5 16.9999 15.5Z" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </span>
    </button>

    <div style={popoverStyle}>
      <a href={shareOptions.whatsapp} target="_blank" rel="noopener noreferrer" style={menuItemStyle}>
        <img src={require('../assets/social-icons/whatsapp.png')} alt="WhatsApp" style={iconStyle} />
        <span>WhatsApp</span>
      </a>
      <a href={shareOptions.facebook} target="_blank" rel="noopener noreferrer" style={menuItemStyle}>
        <img src={require('../assets/social-icons/facebook.png')} alt="Facebook" style={iconStyle} />
        <span>Facebook</span>
      </a>
      <a href={shareOptions.twitter} target="_blank" rel="noopener noreferrer" style={menuItemStyle}>
        <img src={require('../assets/social-icons/twitter.png')} alt="Twitter" style={iconStyle} />
        <span>Twitter</span>
      </a>
      <a href={shareOptions.instagram} target="_blank" rel="noopener noreferrer" style={menuItemStyle}>
        <img src={require('../assets/social-icons/instagram.png')} alt="Instagram" style={iconStyle} />
        <span>Instagram</span>
      </a>
      <button onClick={shareWithImage} style={{...menuItemStyle, width: '100%', background: 'none', border: 'none'}}>
        <img src={require('../assets/social-icons/share.png')} alt="Share with Image" style={iconStyle} />
        <span>Share with Image</span>
      </button>
      <button onClick={copyToClipboard} style={{...menuItemStyle, width: '100%', background: 'none', border: 'none'}}>
        <img src={require('../assets/social-icons/copylink.png')} alt="Copy Link" style={iconStyle} />
        <span>Copy Link</span>
      </button>
    </div>
  </div>
);
};

const ProductDetails = () => {
  const { productid } = useParams();
  const [selectedSize, setSelectedSize] = useState('xs');
  const [selectedColor, setSelectedColor] = useState('red');
  const [activeTab, setActiveTab] = useState('description');
  const [quantity, setQuantity] = useState(0);
  const [loading, setLoading] = useState(false);

  // if (!JSON.parse(localStorage.getItem('cart'))) {
  //   localStorage.setItem('cart', JSON.stringify([]));
  // }

  useEffect(() => {
    const cart = localStorage.getItem('cart');

    if (!cart) {
      localStorage.setItem('cart', JSON.stringify([]));
    }
  }, []);

  const userid = localStorage.getItem('userid');
  const [cart, setCart] = useState([]);
  const [isInCart, setIsInCart] = useState(null);
  const { updateCartCount } = useContext(DataAppContext);


  useEffect(() => {
    // Fetch the cart from local storage when the component mounts
    const storedCart =
      (localStorage.getItem('cart') &&
        JSON.parse(localStorage.getItem('cart'))) ||
      [];
    setCart(storedCart);
    setIsInCart(storedCart.some(item => item.productid === productid));
  }, []);

 useEffect(() => {
  const temparr = JSON.parse(localStorage.getItem('cart')) || [];
  if (temparr.length > 0) {
    const cartItem = temparr.find(item => item.productid === productid);
    setQuantity(cartItem ? cartItem.quantity : 1);
  } else {
    setQuantity(1);
  }
}, [productid]);

  const [product, setProduct] = useState({
    // image:
    //   'https://cdn.pixabay.com/photo/2016/12/06/09/30/blank-1886001_640.png',
    // image1:
    //   'https://5.imimg.com/data5/HB/VQ/MY-44811379/men-black-plain-t-shirt.jpg',
    // image2:
    //   'https://assets.ajio.com/medias/sys_master/root/20231012/O3AN/65281d84afa4cf41f53f4650/-473Wx593H-466701145-black-MODEL2.jpg',
    // image3:
    //   'https://cdn11.bigcommerce.com/s-o7vdfbtasz/images/stencil/500x659/products/358/1048/i-once-lived-in-fargo-really-fargo-stuff-black-back__82397.1541002551.jpg?c=2',
    // prod_name: 'Essential structured blazer',
    // brand: 'Brand: SKMEIMore Men Watches from SKMEI',
    // description:
    //   'Nemo enim ipsam voluptatem quia aspernatur aut odit aut loret fugit, sed quia consequuntur magni lores eos qui ratione voluptatem sequi nesciunt.',
    // specification:
    //   'Traditionally, it has short sleeves and a round neckline, known as a crew neck, which lacks a collar. T-shirts are generally made of stretchy, light, and inexpensive fabric and are easy to clean.',
    // reviews:
    //   "The most famous of T-shirts styles are crew necks, also known as classic T-shirts. These are T-shirts with a round circular neck. They provide excellent flexibility, and fit comfortably on your body giving you a toned appearance. They work well if you've got a long and narrow face with slightly sloped shoulders.",
    // disc_price: '75$',
    // price: '83$',
    // shipping: 'Free Shipping',
  });

  const updateQuantity = async (newQuantity) => {
    if (newQuantity < 1 || !isInCart) {
      return;
    }

    try {
      if (userid) {
        const response = await axios.put(
          `${process.env.REACT_APP_API_URL}cart/handleQuantity/${userid}/${productid}`,
          { quantity: newQuantity }
        );
        if (response.status === 200) {
          let cart = localStorage.getItem('cart')
            ? JSON.parse(localStorage.getItem('cart'))
            : [];
          const updatedItems = cart.map(item =>
            item.productid === productid
              ? { ...item, quantity: newQuantity }
              : item
          );
          localStorage.setItem('cart', JSON.stringify(updatedItems));
          setQuantity(newQuantity)
          toast.success('Product quantity updated successfully');
          return updatedItems;
        }
      } else {
        let cart = localStorage.getItem('cart')
          ? JSON.parse(localStorage.getItem('cart'))
          : [];
        const updatedItems = cart.map(item =>
          item.productid === productid
            ? { ...item, quantity: newQuantity }
            : item
        );
        localStorage.setItem('cart', JSON.stringify(updatedItems));
        setQuantity(newQuantity)
        toast.success('Product quantity updated successfully');
        return updatedItems;
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    }

  };
  //tabchange
  const handleTabClick = tab => {
    setActiveTab(tab);
  };

  // Function to handle size selection
  const handleSizeChange = size => {
    setSelectedSize(size);
  };

  // Function to handle color selection
  const handleColorChange = color => {
    setSelectedColor(color);
  };

  //product_detail_pic_left change
  const handleThumbnailClick = imageUrl => {
    setProduct({ ...product, image: imageUrl });
  };

  //for quantity
  const handleQuantityChange = e => {
    setLoading(true);
    // Parse the input value to ensure it's a number
    const newQuantity = parseInt(e.target.value);

    // Check if the new quantity is less than 1
    if (newQuantity < 1) {
      // If it's less than 1, set the quantity to 1
      setQuantity(1);
    } else {
      // Otherwise, set the quantity to the new value
      setQuantity(newQuantity);
    }
    setLoading(false);
  };

  //for data and Api
  const handleAddToCart = async product => {
    const { productid, prod_name, price, image, discount } = product;
    try {
      setIsInCart(true);
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
          let cart = localStorage.getItem('cart')
            ? JSON.parse(localStorage.getItem('cart'))
            : [];
          cart.push({ productid, prod_name, price, image, discount, quantity });
          localStorage.setItem('cart', JSON.stringify(cart));
          cart.length && updateCartCount(cart.length);
          toast.success('Product added to cart successfully');
        } else {
          setIsInCart(false);
          toast.error('Failed to add product to cart');
        }
      } else {
        let cart = localStorage.getItem('cart')
          ? JSON.parse(localStorage.getItem('cart'))
          : [];
        const existingProduct = (cart.length > 0) && cart.find(item => item.productid === productid);
        if (existingProduct) {
          existingProduct.quantity += quantity;
        } else {
          cart.push({ productid, prod_name, price, image, discount, quantity });
          updateCartCount(cart.length);
        }
        // Save the updated cart back to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        toast.success('Product added to cart successfully');
      }
    } catch (error) {
      setIsInCart(false);
      console.error('Error adding to cart:', error);
    }
  };

  const fetchProductDetail = async () => {
    setLoading(true);
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}products/productByPId/${productid}`
    );
    // console.log('Product Details - ', response.data);
    setProduct(response.data);
    setLoading(false);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProductDetail();
  }, [productid]);

  // const isInCart = productid => {
  //   return cart.some(item => item.productid === productid);
  // };

  const getPlainTextDescription = (htmlString) => {
    if (!htmlString) return '';
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlString;
    return tempDiv.textContent || tempDiv.innerText || '';
}

  return (
    <>
    <Helmet>
                <title>{`${product.prod_name || 'Product'} Details`}</title>
                <meta name="description" content={getPlainTextDescription(product.prod_desc).substring(0, 160)} />
                
                <meta property="og:type" content="product" />
                <meta property="og:title" content={product.prod_name} />
                <meta property="og:description" content={getPlainTextDescription(product.prod_desc).substring(0, 200)} />
                <meta property="og:image" content={`${process.env.REACT_APP_API_URL}${product.image}`} />
                <meta property="og:url" content={window.location.href} />

                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={product.prod_name} />
                <meta name="twitter:description" content={getPlainTextDescription(product.prod_desc).substring(0, 200)} />
                <meta name="twitter:image" content={`${process.env.REACT_APP_API_URL}${product.image}`} />
            </Helmet>
      <section className='blog about-blog'>
        <div className='container'>
          {/* <div class='blog-bradcrum'>
            <span>
              <a href='/home'>Home</a>
            </span>
            <span class='devider'>/</span>
            <span>
              <a href={`/category/${product.category}`}>
                {product.categoryname}{' '}
              </a>
            </span>
            <span class='devider'></span>
          </div> */}
          <div className="blog-heading about-heading text-center">
            <h1 className="heading text-nowrap text-truncate w-100 d-inline-block fs-1">
              {product.prod_name}
            </h1>
          </div>
        </div>
      </section>

      
      <div class='product-info-section'>
        {loading &&
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '50vh',
            }}
          >
            <img
              src={loaderGif}
              alt='Loading...'
              style={{
                width: '80px',
                height: '80px',
              }}
            />
          </div>
        }
        <div class='row '>
          <div class='col-md-6'>
            <div class='product-info-img' data-aos='fade-right'>
              <div class='swiper product-top'>
                <div class='swiper-wrapper'>
                  <div class='swiper-slide slider-top-img'>
                    <img
                      src={`${process.env.REACT_APP_API_URL}${product.image}`}
                      alt='ProductIMG'
                    />
                  </div>
                  <div class='swiper-slide slider-top-img'>
                    <img
                      src={`${process.env.REACT_APP_API_URL}${product.image}`}
                      alt='ProductIMG'
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class='col-md-6'>
            <div class='product-info-content'>

              {
                product.discount > 0 &&
                (<Discount price={product.price} discount={product.discount} />)
              }
              <span class="wrapper-subtitle">{product.categoryname}</span>
              <h3 class='wrapper-heading'>{product.prod_name}</h3>
              {/* <div class="ratings">
                                <span>
                                    <svg width="75" height="15" viewBox="0 0 75 15" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M7.5 0L9.18386 5.18237H14.6329L10.2245 8.38525L11.9084 13.5676L7.5 10.3647L3.09161 13.5676L4.77547 8.38525L0.367076 5.18237H5.81614L7.5 0Z"
                                            fill="#FFA800" />
                                        <path
                                            d="M22.5 0L24.1839 5.18237H29.6329L25.2245 8.38525L26.9084 13.5676L22.5 10.3647L18.0916 13.5676L19.7755 8.38525L15.3671 5.18237H20.8161L22.5 0Z"
                                            fill="#FFA800" />
                                        <path
                                            d="M37.5 0L39.1839 5.18237H44.6329L40.2245 8.38525L41.9084 13.5676L37.5 10.3647L33.0916 13.5676L34.7755 8.38525L30.3671 5.18237H35.8161L37.5 0Z"
                                            fill="#FFA800" />
                                        <path
                                            d="M52.5 0L54.1839 5.18237H59.6329L55.2245 8.38525L56.9084 13.5676L52.5 10.3647L48.0916 13.5676L49.7755 8.38525L45.3671 5.18237H50.8161L52.5 0Z"
                                            fill="#FFA800" />
                                        <path
                                            d="M67.5 0L69.1839 5.18237H74.6329L70.2245 8.38525L71.9084 13.5676L67.5 10.3647L63.0916 13.5676L64.7755 8.38525L60.3671 5.18237H65.8161L67.5 0Z"
                                            fill="#FFA800" />
                                    </svg>
                                </span>
                                <span class="text">6 Reviews</span>
                            </div> */}
              <div class='price'>
                {product.discount === 0 ?
                  <span class='new-price'>
                    &#8377; &nbsp;{product.price}
                  </span>
                  :
                  <>
                    <span class='price-cut'>&#8377; &nbsp;{product.price}</span>
                    <span class='new-price'>
                      &#8377; &nbsp;{product.price - product.discount}
                    </span>
                  </>
                }
              </div>
              {/* <p class="content-paragraph">It is a long established fact that a reader will be distracted
                by <span class="inner-text">the readable there content of a page.</span></p>
              <hr></hr> */}
              <div class='product-details'>
                <p class='category'>
                  Category :{' '}
                  <span class='inner-text'>{product.categoryname}</span>
                </p>
                <p class='tags'>
                  Subcategory :{' '}
                  <span class='inner-text'>{product.subcategoryname}</span>
                </p>
                <p class='sku'>
                  Brand : <span class='inner-text'>{product.brand_name}</span>
                </p>
              </div>
              <hr></hr>
              <div className='product-availability'>
             <span>Availability : </span>
             <span className='inner-text'>
                  {product.stock_quantity <= 0 && (
             <span className='text-danger'>Out of Stock</span>
    )}
             </span>
             <span className='inner-text'>
                      {product.stock_quantity > 0 && (
             <span>Available</span>
    )}
             </span>

          
            {isInCart && (
            <span className='ms-2 text-success'>
                 (Already in Cart)
            </span>
  )}
            </div>
            <hr />

              <div class='product-quantity'>
                <div class='quantity-wrapper'>
                  {/* <div class="quantity">
                    <span class="minus">
                      -
                    </span>
                    <span class="number"></span>
                    <span class="plus">
                      +
                    </span>
                  </div> */}
                  {/* <div class="wishlist">
                    <span>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M17 1C14.9 1 13.1 2.1 12 3.7C10.9 2.1 9.1 1 7 1C3.7 1 1 3.7 1 7C1 13 12 22 12 22C12 22 23 13 23 7C23 3.7 20.3 1 17 1Z"
                          stroke="#797979" stroke-width="2" stroke-miterlimit="10"
                          stroke-linecap="square" />
                      </svg>
                    </span>
                  </div> */}
                </div>
                {/* <a href="#" class="shop-btn" onClick={() => handleAddToCart(product)}>
                  <span>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
                      xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M8.25357 3.32575C8.25357 4.00929 8.25193 4.69283 8.25467 5.37583C8.25576 5.68424 8.31536 5.74439 8.62431 5.74439C9.964 5.74603 11.3031 5.74275 12.6428 5.74603C13.2728 5.74767 13.7397 6.05663 13.9246 6.58104C14.2209 7.42098 13.614 8.24232 12.6762 8.25052C11.5919 8.25982 10.5075 8.25271 9.4232 8.25271C9.17714 8.25271 8.93107 8.25216 8.68501 8.25271C8.2913 8.2538 8.25412 8.29154 8.25412 8.69838C8.25357 10.0195 8.25686 11.3412 8.25248 12.6624C8.25029 13.2836 7.92603 13.7544 7.39891 13.9305C6.56448 14.2088 5.75848 13.6062 5.74863 12.6821C5.73824 11.7251 5.74645 10.7687 5.7459 9.81173C5.7459 9.41965 5.74754 9.02812 5.74535 8.63604C5.74371 8.30849 5.69012 8.2538 5.36204 8.25326C4.02235 8.25162 2.68321 8.25545 1.34352 8.25107C0.719613 8.24943 0.249902 7.93008 0.0710952 7.40348C-0.212153 6.57065 0.388245 5.75916 1.31017 5.74658C2.14843 5.73564 2.98669 5.74384 3.82495 5.74384C4.30779 5.74384 4.79062 5.74384 5.274 5.74384C5.72184 5.7433 5.7459 5.71869 5.7459 5.25716C5.7459 3.95406 5.74317 2.65096 5.74699 1.34786C5.74863 0.720643 6.0625 0.253102 6.58799 0.0704598C7.40875 -0.213893 8.21803 0.370671 8.25248 1.27349C8.25303 1.29154 8.25303 1.31013 8.25303 1.32817C8.25357 1.99531 8.25357 2.66026 8.25357 3.32575Z"
                        fill="white" />
                    </svg>
                  </span>
                </a> */}
                {isInCart && <div
                  className='quantity'
                  style={{ cursor: isInCart ? 'pointer' : 'not-allowed' }}
                >
                  <span
                    className='minus'
                    onClick={() =>
                      updateQuantity(quantity - 1)
                    }
                  >
                    -
                  </span>
                  <span className='number'>
                    {quantity ?? 1}
                  </span>
                  <span
                    className='plus'
                    onClick={() =>
                      updateQuantity(quantity + 1)
                    }
                  >
                    +
                  </span>
                </div>}
                {userid && <WishlistButton productid={productid} userid={userid} />}
                <ShareComponent product={product}/>
                {isInCart ? (
                  <Link
                    to={'/cart'}
                    className='product-btn  shop-btn'
                    type='button'
                  >
                    Go to Cart
                  </Link>
                ) : (
                  product.stock_quantity > 0 &&
                  <button
                    onClick={() => handleAddToCart(product)}
                    className='shop-btn'
                    type='button'
                  >
                    Add to Cart
                  </button>
                )}
              </div>
              <hr></hr>
            </div>
          </div>
        </div>
      </div>

      <section class='product product-description'>
        <div class='container'>
          <div class='product-detail-section'>
            <nav>
              <div class='nav nav-tabs nav-item' id='nav-tab' role='tablist'>
                <button
                  class='nav-link active'
                  id='nav-home-tab'
                  data-bs-toggle='tab'
                  data-bs-target='#nav-home'
                  type='button'
                  role='tab'
                  aria-controls='nav-home'
                  aria-selected='true'
                >
                  Description
                </button>

                {/* <button class="nav-link" id="nav-review-tab" data-bs-toggle="tab" data-bs-target="#nav-review"
                            type="button" role="tab" aria-controls="nav-review" aria-selected="false">Reviews</button>

                        <button class="nav-link" id="nav-seller-tab" data-bs-toggle="tab" data-bs-target="#nav-seller"
                            type="button" role="tab" aria-controls="nav-seller" aria-selected="false">Seller
                            Info</button> */}
              </div>
            </nav>
            <div class='tab-content tab-item' id='nav-tabContent'>
              <div
                class='tab-pane fade show active'
                id='nav-home'
                role='tabpanel'
                aria-labelledby='nav-home-tab'
                tabindex='0'
                data-aos='fade-up'
              >
                <div class='product-intro-section'>
                  <h5 class='intro-heading'>Introduction</h5>
                  <p class='product-details'>
                    <div
                      dangerouslySetInnerHTML={{ __html: product.prod_desc }}
                    />
                  </p>
                </div>
                {/* <div class="product-feature">
                  <h5 class="intro-heading">Features :</h5>
                  <ul>
                    <li>
                      <p>slim body with metal cover</p>
                    </li>
                    <li>
                      <p>latest Intel Core i5-1135G7 processor (4 cores / 8 threads)</p>
                    </li>
                    <li>
                      <p>8GB DDR4 RAM and fast 512GB PCIe SSD</p>
                    </li>
                    <li>
                      <p>NVIDIA GeForce MX350 2GB GDDR5 graphics card backlit keyboard, touchpad with
                        gesture support</p>
                    </li>
                  </ul>
                </div> */}
              </div>
              {/* <div class="tab-pane fade" id="nav-review" role="tabpanel" aria-labelledby="nav-review-tab"
                tabindex="0">
                <div class="product-review-section" data-aos="fade-up">
                  <h5 class="intro-heading">Reviews</h5>

                  <div class="review-wrapper">
                    <div class="wrapper">
                      <div class="wrapper-aurthor">
                        <div class="wrapper-info">
                          <div class="aurthor-img">
                            <img src="assets/images/homepage-one/aurthor-img-1.webp"
                              alt="aurthor-img" />
                          </div>
                          <div class="author-details">
                            <h5>Sajjad Hossain</h5>
                            <p>London, UK</p>
                          </div>
                        </div>
                        <div class="ratings">
                          <span>
                            <svg width="75" height="15" viewBox="0 0 75 15" fill="none"
                              xmlns="http://www.w3.org/2000/svg">
                              <path
                                d="M7.5 0L9.18386 5.18237H14.6329L10.2245 8.38525L11.9084 13.5676L7.5 10.3647L3.09161 13.5676L4.77547 8.38525L0.367076 5.18237H5.81614L7.5 0Z"
                                fill="#FFA800" />
                              <path
                                d="M22.5 0L24.1839 5.18237H29.6329L25.2245 8.38525L26.9084 13.5676L22.5 10.3647L18.0916 13.5676L19.7755 8.38525L15.3671 5.18237H20.8161L22.5 0Z"
                                fill="#FFA800" />
                              <path
                                d="M37.5 0L39.1839 5.18237H44.6329L40.2245 8.38525L41.9084 13.5676L37.5 10.3647L33.0916 13.5676L34.7755 8.38525L30.3671 5.18237H35.8161L37.5 0Z"
                                fill="#FFA800" />
                              <path
                                d="M52.5 0L54.1839 5.18237H59.6329L55.2245 8.38525L56.9084 13.5676L52.5 10.3647L48.0916 13.5676L49.7755 8.38525L45.3671 5.18237H50.8161L52.5 0Z"
                                fill="#FFA800" />
                              <path
                                d="M67.5 0L69.1839 5.18237H74.6329L70.2245 8.38525L71.9084 13.5676L67.5 10.3647L63.0916 13.5676L64.7755 8.38525L60.3671 5.18237H65.8161L67.5 0Z"
                                fill="#FFA800" />
                            </svg>
                          </span>
                          <span>(5.0)</span>
                        </div>
                      </div>
                      <div class="wrapper-description">
                        <p class="wrapper-details">Lorem Ipsum is simply dummy text of the printing and
                          typesetting industry. Lorem Ipsum has been the industry's standard dummy
                          text ever since the redi 1500s, when an unknown printer took a galley of
                          type and scrambled it to make a type specimen book. It has survived not only
                          five centuries but also the on leap into electronic typesetting, remaining
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="tab-pane fade" id="nav-seller" role="tabpanel" aria-labelledby="nav-seller-tab"
                tabindex="0">
                <div class="product-review-section" data-aos="fade-up">

                </div>
              </div> */}
            </div>
          </div>
        </div>
      </section>

      {/* <div className="breadcrumb-option">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="breadcrumb__links">
                <Link to="/">
                  <i className="fa fa-home"></i> Home
                </Link>
                <a href="/women">Women’s </a>
                <span>Essential structured blazer</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="product-details spad">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="product__details__pic">

                <div className="product__details__slider__content">
                  <div className="product__details__pic__slider owl-carousel">
                    <img
                      data-hash="product-1"
                      className="product__big__img"
                      src={dress1 || product.image}
                      alt=""
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="product__details__text">
                <h3>
                  {product.prod_name} <span>{product.brand}</span>
                </h3>
                <div className="rating">
                  <i className="fa fa-star"></i>
                  <i className="fa fa-star"></i>
                  <i className="fa fa-star"></i>
                  <i className="fa fa-star"></i>
                  <i className="fa fa-star"></i>
                  <span>( 138 reviews )</span>
                </div>
                <div className="product__details__price">
                  {product.price - (product.discount * product.price) / 100} <span>{product.price}</span>
                </div>
                <p>{product.prod_desc}</p>
                <div className="product__details__button">
                  <div className="quantity">
                    <span>Quantity:</span>
                    <div className="pro-qty">
                      <input
                        type="number"
                        value={quantity}
                        onChange={handleQuantityChange}
                      />
                    </div>
                  </div>
                  <button onClick={handleAddToCart} className="cart-btn">
                    <span className="icon_bag_alt"></span> Add to cart
                  </button>
                  <ul>
                    <li>
                      <a href="/wishlist">
                        <span className="icon_heart_alt"></span>
                      </a>
                    </li>
                    <li>
                      <a href="/">
                        <span className="icon_adjust-horiz"></span>
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="product__details__widget">
                  <ul>
                    <li>
                      <span>Availability:</span>
                      <div className="stock__checkbox">
                        <label for="stockin">
                          In Stock
                          <input type="checkbox" id="stockin"></input>
                          <span className="checkmark"></span>
                        </label>
                      </div>
                    </li>
                    <li>
                      <span>Available color:</span>
                      <div className="color__checkbox">
                        <label
                          htmlFor="red"
                          className={selectedColor === "red" ? "active" : ""}
                        >
                          <input
                            type="radio"
                            name="color__radio"
                            id="red"
                            checked={selectedColor === "red"}
                            onChange={() => handleColorChange("red")}
                          />
                          <span className="checkmark"></span>
                        </label>
                        <label
                          htmlFor="black"
                          className={selectedColor === "black" ? "active" : ""}
                        >
                          <input
                            type="radio"
                            name="color__radio"
                            id="black"
                            checked={selectedColor === "black"}
                            onChange={() => handleColorChange("black")}
                          />
                          <span className="checkmark black-bg"></span>
                        </label>
                        <label
                          htmlFor="grey"
                          className={selectedColor === "grey" ? "active" : ""}
                        >
                          <input
                            type="radio"
                            name="color__radio"
                            id="grey"
                            checked={selectedColor === "grey"}
                            onChange={() => handleColorChange("grey")}
                          />
                          <span className="checkmark grey-bg"></span>
                        </label>
                      </div>
                    </li>
                    <li>
                      <span>Available size:</span>
                      <div className="size__btn">
                        <label
                          htmlFor="xs-btn"
                          className={selectedSize === "xs" ? "active" : ""}
                        >
                          <input
                            type="radio"
                            id="xs-btn"
                            checked={selectedSize === "xs"}
                            onChange={() => handleSizeChange("xs")}
                          />
                          xs
                        </label>
                        <label
                          htmlFor="s-btn"
                          className={selectedSize === "s" ? "active" : ""}
                        >
                          <input
                            type="radio"
                            id="s-btn"
                            checked={selectedSize === "s"}
                            onChange={() => handleSizeChange("s")}
                          />
                          s
                        </label>
                        <label
                          htmlFor="m-btn"
                          className={selectedSize === "m" ? "active" : ""}
                        >
                          <input
                            type="radio"
                            id="m-btn"
                            checked={selectedSize === "m"}
                            onChange={() => handleSizeChange("m")}
                          />
                          m
                        </label>
                        <label
                          htmlFor="l-btn"
                          className={selectedSize === "l" ? "active" : ""}
                        >
                          <input
                            type="radio"
                            id="l-btn"
                            checked={selectedSize === "l"}
                            onChange={() => handleSizeChange("l")}
                          />
                          l
                        </label>
                      </div>
                    </li>
                    <li>
                      <span>Promotions:</span>
                      <p>{product.shipping}</p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section> */}
      <SimilarProducts />
    </>
  );
};

function WishlistButton({ productid, userid }) {
  const [inWishlist, setInWishlist] = useState(false);
  const { updateWishlistCount } = useContext(DataAppContext);

  useEffect(() => {
    const fetchWishListItems = async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}wishlist/usersWishlist/${userid}`
      );

      if (response.status !== 200) {
        console.error('Fail to fetch wishlist for the product');
        return;
      }

      const product = (response.data.length > 0) && response.data.find(item => item.productid === Number(productid));
      product ? setInWishlist(true) : setInWishlist(false);
    }

    fetchWishListItems();
  }, [userid, productid]);

  const addToWishlist = async () => {
    setInWishlist(true);

    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}wishlist/addToWishlist`,
      {
        userid,
        productid,
      }
    );
    toast.success('Product added to wishlist successfully');
    if (response.status !== 200) {
      console.error('Could not add to wishlist');
      setInWishlist(false);
      return;
    }

    updateWishlistCount(prev => prev + 1);
  };

  const removeFromWishlist = async () => {
    setInWishlist(false);

    const response = await axios.delete(
      `${process.env.REACT_APP_API_URL}wishlist/hardremoveFromWishlist/${userid}/${productid}`
    );
    toast.success('Product removed form wishlist successfully');
    if (response.status !== 200) {
      console.error('Could not remove from the wishlist');
      setInWishlist(prev => !prev);
    }

    updateWishlistCount(prev => Math.max(0, prev - 1));
  };

  const style = {
    cursor: 'pointer'
  };

  return (

    <button
      className='quantity'
      type='button'
      onClick={inWishlist ? removeFromWishlist : addToWishlist}
    >
      <span>
        <svg
          width={23}
          height={23}
          viewBox='0 0 16 14'
          // fill='none
          style={{ fill: inWishlist ? 'green' : 'gray' }}
          xmlns='http://www.w3.org/2000/svg'
        >
          <g clipPath='url(#clip0_113_3017)'>
            <path d='M8.00893 1.94252C8.25673 1.67321 8.45526 1.43486 8.67664 1.22099C10.387 -0.427293 13.0628 -0.40281 14.7246 1.2714C16.3985 2.95785 16.4356 5.687 14.7674 7.39721C12.6907 9.52652 10.5848 11.6263 8.48882 13.7369C8.13819 14.0897 7.85825 14.0876 7.50619 13.7326C5.4188 11.6306 3.32426 9.53588 1.25187 7.41953C-0.424185 5.70788 -0.410617 2.98738 1.25258 1.293C2.92721 -0.413611 5.62304 -0.434494 7.35265 1.24836C7.56475 1.4543 7.76042 1.67825 8.00893 1.94252Z'
            />
          </g>
          <defs>
            <clipPath id='clip0_113_3017'>
              <rect width={16} height={14} fill='white' />
            </clipPath>
          </defs>
        </svg>
      </span>
    </button>
  );

}

export default ProductDetails;