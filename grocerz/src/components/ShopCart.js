import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { DataAppContext } from '../DataContext';
import loaderGif from '../assets/images/loader.gif';
const ShopCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [message, setMessage] = useState('');
  const userid = localStorage.getItem('userid');
  const [loading, setLoading] = useState(false);
  const [totalCost, setTotalCost] = useState(0);
  const { updateCartCount } = useContext(DataAppContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    calculateTotal();
  }, [cartItems]);

  useEffect(() => {
    fetchCartItems();
  }, [userid]);

  const fetchCartItems = async () => {
    setLoading(true);
    try {
      if (userid) {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}cart/userCart/${userid}`
        );
        const items = response.data;
        setCartItems(items);
        updateCartCount(response.data.length);
        const sortedItems = items
          .map(item => ({
            productid: item.productid,
            prod_name: item.prod_name,
            price: item.price,
            image: item.image,
            discount: item.discount,
            quantity: item.quantity,
          }))
          .sort((a, b) => {
            return a.prod_name.localeCompare(b.prod_name);
          });
        localStorage.setItem('cart', JSON.stringify(sortedItems));
        setLoading(false);
      } else {
        const storedCartItems =
          (localStorage.getItem('cart') &&
            JSON.parse(localStorage.getItem('cart'))) ||
          [];
        setCartItems([...storedCartItems]);
        updateCartCount(storedCartItems.length);
      }
    } catch (error) {
      console.error('Error fetching cart items', error);
    }
    setLoading(false);
  };

  const calculateTotal = () => {
    // console.log("totalling");
    let total = cartItems.reduce(
      (total, item) =>
        total +
        (Number(item.price) * (item.quantity ?? 1) -
          Number(item.discount) * (item.quantity ?? 1)),
      0
    );
    // console.log("total", total);
    setTotalCost(total);
  };

  const removeFromCart = async (productid) => {
    setLoading(false);
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}cart/removeProduct/${userid}/${productid}`
      );

      if (response.status === 200) {
        toast.success('Product successfully removed from cart');
        const updatedCartItems = cartItems.filter(item => item.productid !== productid);
        setCartItems(updatedCartItems);
        updateCartCount(updatedCartItems.length);
        localStorage.setItem('cart', JSON.stringify(updatedCartItems));
      } else {
        toast.error('Failed to remove product from cart');
      }
    } catch (error) {
      toast.error('An error occurred while removing the product');
      console.error('Error removing from cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productid, newQuantity) => {
    setLoading(false);
    try {
      if (userid) {
        const response = await axios.put(
          `${process.env.REACT_APP_API_URL}cart/handleQuantity/${userid}/${productid}`,
          { quantity: newQuantity }
        );
        if (response.status === 200) {
          setCartItems(prevItems => {
            const updatedItems = prevItems.map(item =>
              item.productid === productid
                ? { ...item, quantity: newQuantity }
                : item
            );
            localStorage.setItem('cart', JSON.stringify(updatedItems));
            return updatedItems;
          });
        }
      } else {
        // Update cartItems locally if the user is not logged in
        setCartItems(prevItems => {
          const updatedItems = prevItems.map(item =>
            item.productid === productid
              ? { ...item, quantity: newQuantity }
              : item
          );
          localStorage.setItem('cart', JSON.stringify(updatedItems));
          return updatedItems;
        });
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
    setLoading(false);
  };

  const incrementQuantity = (productid, currentQuantity) => {
    updateQuantity(productid, currentQuantity + 1);
  };

  const decrementQuantity = (productid, currentQuantity) => {
    if (currentQuantity > 1) {
      updateQuantity(productid, currentQuantity - 1);
    } else {
      removeFromCart(productid);
    }
  };
  const clearCart = async () => {
    try {
      setLoading(true);
      if (userid) {
        const url = `${process.env.REACT_APP_API_URL}cart/emptyCart/${userid}`;
        const response = await axios.put(url);
        if (response.status === 200) {
          setCartItems([]);
          updateCartCount(0);
          localStorage.setItem('cart', JSON.stringify([]));
        } else {
          setMessage('There was an error clearing the cart!');
        }
      } else {
        // For guest users, clear localStorage
        localStorage.removeItem('cart');
        setCartItems([]);
        updateCartCount(0);
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      setMessage('There was an error clearing the cart!');
    }
    setLoading(false);
    setIsModalOpen(false);
  };

  return (
    <>
      <section class='blog about-blog'>
        <div class='container'>
          {/* <div class="blog-bradcrum">
                <span><a href="/">Home</a></span>
                <span class="devider">/</span>
                <span><a href="#">Contact</a></span>
            </div> */}
          <div class='blog-heading about-heading'>
            <h1 class='heading'> Cart</h1>
          </div>
        </div>
      </section>
      {/* <section className='product-cart product footer-padding'>
        {loading && (
          <div className='loader-div'>
          <img className='loader-img'
            src={loaderGif}
            alt='Loading...'/>
        </div>
        )}
        </section> */}
      <section className='product-cart product footer-padding'>
        {loading && (
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
              style={{ width: '80px', height: '80px' }}
            />
          </div>
        )}

        {!loading && (
          <div className="container">
            <div className="cart-section">

              <div className="d-none d-md-block">
                <table className="table">
                  <tbody>
                    <tr className="table-row table-top-row">
                      <td className="table-wrapper text-center">
                        <h5 className="table-heading">S.No.</h5>
                      </td>
                      <td className="table-wrapper wrapper-product text-center">
                        <h5 className="table-heading">PRODUCTS</h5>
                      </td>
                      <td className="table-wrapper d-none d-md-table-cell">
                        <div className="table-wrapper-center">
                          <h5 className="table-heading">PRICE</h5>
                        </div>
                      </td>
                      <td className="table-wrapper d-none d-md-table-cell text-center">
                        <h5 className="table-heading">DISCOUNT</h5>
                      </td>
                      <td className="table-wrapper d-none d-md-table-cell">
                        <div className="table-wrapper-center">
                          <h5 className="table-heading">QUANTITY</h5>
                        </div>
                      </td>
                      <td className="table-wrapper wrapper-total d-none d-md-table-cell">
                        <div className="table-wrapper-center">
                          <h5 className="table-heading">TOTAL</h5>
                        </div>
                      </td>
                      <td className="table-wrapper d-none d-md-table-cell">
                        <div className="table-wrapper-center">
                          <h5 className="table-heading">ACTION</h5>
                        </div>
                      </td>
                    </tr>

                    {cartItems.length > 0 && !loading ? (
                      cartItems.map((item, index) => (
                        <tr className="table-row ticket-row"
                          key={item.productid}
                          onClick={() => navigate(`/product/${item.productid}`)}
                          style={{ cursor: 'pointer' }}
                        >
                          <td className="table-wrapper text-center align-middle">
                            <h5 className="heading">{index + 1}</h5>
                          </td>
                          <td className="table-wrapper align-middle">
                            <div className="table-wrapper-center d-flex align-items-center">
                              <div className="wrapper-img ms-3">
                                <img
                                  src={`${process.env.REACT_APP_API_URL}${item.image}`}
                                  alt="Product"
                                />
                              </div>
                              <div className="wrapper-content">
                                <h5 className="heading">
                                  <Link className="heading" to={`/product/${item.productid}`}>
                                    {item.prod_name || 'Product Name - ' + item.productid}
                                  </Link>
                                </h5>
                              </div>
                            </div>
                          </td>
                          <td className="table-wrapper d-none d-md-table-cell text-center align-middle">
                            <div className="table-wrapper-center">
                              {/* <h5 className="heading main-price">Rs. {item.price}</h5> */}
                              <Link className="heading main-price" to={`/product/${item.productid}`}>
                                Rs. {item.price}
                              </Link>
                            </div>
                          </td>
                          <td className="table-wrapper d-none d-md-table-cell text-center align-middle">
                            <div className="table-wrapper-center">
                              <h5 className="heading">Rs. {item.discount}</h5>
                            </div>
                          </td>
                          <td className="table-wrapper d-none d-md-table-cell text-center align-middle">
                            <div className="table-wrapper-center">
                              <div className="quantity">
                                <span
                                  className="minus"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    decrementQuantity(item.productid, item.quantity ?? 1);
                                  }}
                                >
                                  -
                                </span>
                                <span className="number">{item.quantity ?? 1}</span>
                                <span
                                  className="plus"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    incrementQuantity(item.productid, item.quantity ?? 1);
                                  }}
                                >
                                  +
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="table-wrapper wrapper-total d-none d-md-table-cell text-center align-middle">
                            <div className="table-wrapper-center">
                              <h5 className="heading total-price">
                                Rs. {item.price * (item.quantity ?? 1) - Number(item.discount) * (item.quantity ?? 1)}
                              </h5>
                            </div>
                          </td>
                          <td className="table-wrapper d-none d-md-table-cell align-middle text-center">
                            <div className="wishlist-btn cart-btn">
                              <Link to="/checkout" state={{ product: item }} className="shop-btn">
                                Buy Now
                              </Link>
                              <div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeFromCart(item.productid);
                                  }}
                                  className="shop-btn remove clean-btn rounded-circle d-flex align-items-center justify-content-center p-0"
                                  style={{ width: "40px", height: "40px" }}
                                >
                                  X
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : null}
                  </tbody>
                </table>
              </div>

              <div className="d-md-none">
                <div className="table-responsive">
                  <table className="table align-middle">
                    <tbody>
                      {cartItems.length > 0 && !loading ? (
                        cartItems.map((item) => (
                          <tr className="border-bottom" key={item.productid}>

                            <td className="align-middle">
                              <img
                                src={`${process.env.REACT_APP_API_URL}${item.image}`}
                                alt="Product"
                                className="img-fluid rounded"
                                style={{ width: "50px", height: "50px" }}
                              />
                            </td>

                            <td className="align-middle">
                              <p className="mb-0 fw-bold text-black">{item.prod_name}</p>
                              <div
                                className="d-inline-flex align-items-center border rounded-1 p-0 justify-content-center"
                                style={{ fontSize: "1rem", height: "25px" }}
                              >
                                <button
                                  className="btn btn-sm text-danger border-0 p-0"
                                  onClick={() => decrementQuantity(item.productid, item.quantity ?? 1)}
                                  style={{ width: "20px", height: "20px" }}
                                >
                                  –
                                </button>
                                <span className="px-2 text-black">{item.quantity ?? 1}</span>
                                <button
                                  className="btn btn-sm text-danger border-0 p-0"
                                  onClick={() => incrementQuantity(item.productid, item.quantity ?? 1)}
                                  style={{ width: "20px", height: "20px" }}
                                >
                                  +
                                </button>
                              </div>
                            </td>


                            <td className="align-middle text-center text-center align-middle">
                              <p className="mb-0 fw-bold text-black">₹{item.price - item.discount}</p>
                              <small className="text-muted text-decoration-line-through">₹{item.price}</small>
                            </td>

                            <td className="align-middle">
                              <p className="mb-0 text-success fw-semibold ms-4">Total: ₹{(item.price - item.discount) * (item.quantity ?? 1)}</p>
                            </td>
                          </tr>
                        ))
                      ) : null}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>


            {cartItems.length === 0 && !loading && <div className='container d-flex flex-column justify-content-center align-items-center'>
              <img src="assets/images/homepage-one/empty-cart.webp" width={150} height={150} alt="" />
              <h3 className='p-3'>Cart is Empty</h3>
            </div>
            }

            <div className="wishlist-btn cart-btn mt-4">
              <div className="row d-flex justify-content-center align-items-stretch gx-2">
                <div className="col-4 d-flex">
                  <button
                    className="clean-btn shop-btn btn btn-sm py-1 text-nowrap w-100 text-center d-flex justify-content-center align-items-center"
                    onClick={() => setIsModalOpen(true)}
                    disabled={cartItems.length === 0}
                    style={{ minWidth: "100px" }}
                  >
                    Clear Cart
                  </button>
                </div>


                <div className="col-4 d-flex">
                  <Link
                    to="/checkout"
                    className="shop-btn btn btn-sm d-flex align-items-center justify-content-center py-1 text-center mx-auto"
                    style={{
                      pointerEvents: cartItems.length === 0 ? "none" : "auto",
                      opacity: cartItems.length === 0 ? 1 : 1,
                      width: "auto",
                    }}
                  >
                    <span className="d-none d-lg-inline">Proceed to Checkout</span>
                    <span className="d-inline d-lg-none">Checkout</span>
                  </Link>

                </div>

                <div className="col-4 d-flex">
                  <button
                    className="shop-btn btn btn-sm py-1 text-nowrap w-100 text-center d-flex justify-content-center align-items-center"
                    disabled={cartItems.length === 0}
                    style={{ minWidth: "100px" }}
                  >
                    Total - {totalCost}
                  </button>
                </div>
              </div>
            </div>



            {message && <p>{message}</p>}
          </div>
        )}


        <div>
          {/* <div className="col-lg-6 col-md-6 col-sm-6">
          <div className="cart__btn update__btn">
            <Link to="#">
              <span className="icon_loading" /> Update cart
            </Link>
          </div>
        </div> */}
        </div>
        {/* </div> */}

        {/* <div class="row">
        {/* <div class="row">
        <div class="col-lg-6">
          <div class="discount__content">
            <h6>Discount codes</h6>
            <form action="#">
              <input type="text" placeholder="Enter your coupon code" />
              <button type="submit" class="site-btn">Apply</button>
            </form>
          </div>
        </div>
        <div class="col-lg-4 offset-lg-2">
          <div class="cart__total__procced">
            <h6>Cart total</h6>
            <ul>
              <li>Subtotal <span>$ 750.0</span></li>
              <li>Total <span>Rs. {total || 123123}</span></li>
            </ul>
            <Link to="/checkout" className="primary-btn">
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div> */}
      </section>
      {isModalOpen && (
        <div className='popup-overlay'>
          <div className='popup-content'>
            <h3>Are you sure you want to delete all items from your cart?</h3>
            <button onClick={clearCart}>Yes, Clear Cart</button>
            <button onClick={() => setIsModalOpen(false)}>Cancel</button>
            {loading && (
              <div className='spinner-overlay'>
                <p className='spinner2'></p>
              </div>
            )}
          </div>
        </div>
      )}

      
    </>
  );
};

export default ShopCart;