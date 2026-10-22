import React, { useState, useContext, useId } from 'react';
import { Formik, Field, Form } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import { DataAppContext } from '../../DataContext';
import axios from 'axios';
import Loader from '../loader/Loader';
import loaderGif from '../../assets/images/loader.gif'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toast, } from 'react-toastify';
const Login = () => {
  const navigate = useNavigate();
  const { login_user } = useContext(DataAppContext);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const url = `${process.env.REACT_APP_API_URL}users/login`;
  const [showPassword, setshowPassword] = useState(false);
  const [usernameReqLoading, setUsernameReqLoading] = useState(false);
  const [input, setInput] = useState('');

  const togglePasswordVisibility = () => {
    setshowPassword(!showPassword);
  };

  const initialValues = {
    username: '',
    password: '',
  };

  const submitLogin = async (values, { setSubmitting }) => {
    setLoading(true);
    try {
      const response = await axios.post(url, values);

      if (response.status === 202) {
        // console.log(response.data);
        const token = response.data.token;
        localStorage.setItem('jwttoken', token);
        localStorage.setItem('userid', response.data.userId);
        localStorage.setItem('usertype', response.data.userType);
        login_user();
        AddProductsToCart();
        fetchCartItems();
        navigate('/home');
      }
    } catch (error) {
      // console.error("Login failed:", error);
      if (error.response && error.response.status === 422) {
        setError('User not found. Please check your credentials.');
      } else if (error.response && error.response.data) {
        setError(error.response.data.message);
      } else if (error.message === 'Network Error') {
        setError('Network error occurred. Please try again later.');
      } else {
        setError('Something went wrong. Please try again later.');
      }
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };
  const AddProductsToCart = async () => {
    setLoading(true);
    try {
      const userid = localStorage.getItem('userid');
      const storedCart =
        (localStorage.getItem('cart') &&
          JSON.parse(localStorage.getItem('cart'))) ||
        [];
      const cartItems = storedCart.map(item => ({
        productid: item.productid,
        quantity: item.quantity,
      }));
      for (let i = 0; i < cartItems.length; i++) {
        const { productid, quantity } = cartItems[i];
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}cart/addToCart`,
          {
            userid,
            productid,
            quantity,
          }
        );
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setLoading(false);
      localStorage.setItem('cart', '');
    }
  };
  const fetchCartItems = async () => {
    setLoading(true);
    const userid = localStorage.getItem('userid');
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}cart/userCart/${userid}`
      );
      const items = response.data;
      const sortedItems = items
        .map(item => ({
          productid: item.productid,
          prod_name: item.prod_name,
          price: item.price,
          image: item.image,
          discount: item.discount,
        }))
        .sort((a, b) => {
          return a.prod_name.localeCompare(b.prod_name);
        });
      localStorage.setItem('cart', JSON.stringify(sortedItems));
    } catch (error) {
      console.error('Error fetching cart items', error);
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    setInput(e.target.value)
  };
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setUsernameReqLoading(true)

    const formData = { input: input };
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}users/forget-username`, formData);
      //console.log("Response:", response.data);
      toast.success(response.data.msg);
    } catch (error) {
      console.error("Error submitting form:", error);
      if (error.response && error.response.data) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Something went wrong. Please try again later.');
      }

    } finally {
      setUsernameReqLoading(false)
    }

  };


  return (
    <>
      <section class='login product footer-padding'>
        <div class='container'>

          <Formik initialValues={initialValues} onSubmit={submitLogin}>
            {({ isSubmitting, handleSubmit }) => (
              <Form class='login-section'
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}>
                <div class='row align-items-center'>
                  <div class='col-lg-6'>
                    <div className={`loader-div ${!loading ? 'd-none' : ''}`}>
                      <img className='loader-img'
                        src={loaderGif}
                        alt='Loading...' />
                    </div>
                    <div class={`login-form ${loading ? 'd-none' : ''}`}>
                      <div class='review-form  box-shadows'>
                        <div class='login-btn text-center my-1'>
                          <a class='shop-btn' target='_blank' href="https://api.whatsapp.com/send?phone=918757499345&text=I would like to request login credentials">
                            Get Login Credential From Whatsapp
                          </a>
                        </div>
                        <div class='review-form-text'>
                          <h5 class='comment-title'>Log In</h5>
                          <img
                            src='assets/images/homepage-one/vector-line.png'
                            alt='img'
                          />
                        </div>
                        <div class='review-inner-form '>
                          <div class='review-form-name'>
                            <label for='username' class='form-label'>
                              Username/Mobile/Email**
                            </label>
                            <Field
                              type='text'
                              id='username'
                              name='username'
                              class='form-control'
                              placeholder='Username/Mobile/Email'
                            />
                          </div>
                          <div class='review-form-name'>
                            <label for='password' class='form-label'>
                              Password*
                            </label>
                            <div className="input-group">
                              <Field
                                type={showPassword ? "text" : "password"}
                                id='password'
                                name='password'
                                class='form-control'
                                placeholder='Password'
                              />
                              <span className="input-group-text" onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}>
                                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                              </span>
                            </div>
                          </div>
                          <div class="review-form-name checkbox">
                            <div class="checkbox-item">
                              <input type="checkbox" />
                              <span class="address">Remember Me</span>
                            </div>
                            <div class="ms-auto">
                              <button className="fs-4 fw-bold cursor-pointer" type='button' onClick={() => setShowPopup(true)}>Forgot userid?</button>
                            </div>
                            <div class="forget-pass ms-3">
                              <Link to='/forgetpassword' className='fs-4 fw-bold'>Forgot password?</Link>
                            </div>
                          </div>
                        </div>
                        {error && <div class='error-message'>{error}</div>}
                        <div class='login-btn text-center'>
                          <button
                            type='submit'
                            class='shop-btn'
                            disabled={isSubmitting}
                          >
                            Log In
                          </button>
                          <div class='d-flex justify-content-around mb-5'>
                            <span class='shop-account'>
                              Dont't have an account?
                              <Link to='/register'>
                                {' '}
                                <button class='btn btn-warning btn-lg ps-5  ps-5 pe-5   '>
                                  Register
                                </button>
                              </Link>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                  <div class='col-lg-6'>
                    <div class='login-img'>
                      <img
                        src='assets/images/homepage-one/account-img.webp'
                        alt='img'
                      />
                    </div>
                  </div>
                </div>
              </Form>
            )}
          </Formik>

          {showPopup && (
            <div className='popup-overlay'>
              <div className='popup-content'>
                <h3>Forget Username</h3>
                <form className='review-form text-start' onSubmit={handleSubmit}>
                  <div className='review-form-name mb-5 '>
                    <label for='email' class='form-label'>
                      Email/Mobile**
                    </label>
                    <input
                      type='text'
                      id='input'
                      name='input'
                      value={input}
                      className='form-control'
                      onChange={handleInputChange}
                      placeholder='Enter Email/Mobile'
                    />
                  </div>
                  <div className='text-center'>
                    <button className='btn shop-btn' type='submit'>
                      Submit
                    </button>
                    <button className='btn shop-btn' onClick={() => setShowPopup(false)}>
                      Close
                    </button>
                  </div>
                </form>
                {usernameReqLoading && (
                  <div className='spinner-overlay'>
                    <p className='spinner2'></p>
                  </div>
                )}
              </div>
            </div>
          )}
          

        </div>
      </section>
    </>
  );
};


export default Login;
