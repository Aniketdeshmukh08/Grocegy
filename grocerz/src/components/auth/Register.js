import React, { useState } from 'react';
import { Formik, Field, Form } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as Yup from 'yup';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  toast } from 'react-toastify';
import loaderGif from '../../assets/images/loader.gif';

const Register = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const url = `${process.env.REACT_APP_API_URL}users/adduser`;
  const [showPassword, setshowPassword]= useState(false);

  const togglePasswordVisibility = () => {
    setshowPassword(!showPassword);
  };

  const initialValues = {
    name: '',
    email: '',
    mobile: '',
    password: '',
    // confirmPassword: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, 'Name must be at least 3 characters')
      .required('Name is required'),
    email: Yup.string()
    .email('Invalid email address')
    .optional(),
    mobile: Yup.string()
      .matches(
        /^[6-9]\d{9}$/,
        'Mobile number must be 10 digits starting with 6-9'
      )
      .required('Mobile number is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      // .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      // .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      // .matches(/[0-9]/, "Password must contain at least one number")
      // .matches(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character")
      .required('Password is required'),
    // confirmPassword: Yup.string()
    //   .oneOf([Yup.ref('password'), null], "Passwords must match")
    //   .required("Confirm Password is required"),
  });

  const submitRegistration = async (values, { setSubmitting }) => {
    setError(null);
    setSuccessMessage(null);

    // if (values.password !== values.confirmPassword) {
    //   setError("Passwords do not match.");
    //   setSubmitting(false);
    //   return;
    // }

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const response = await axios.post(url, {
        name: values.name,
        email: values.email,
        mobile: values.mobile,
        password: values.password,
      });

      if (response.status === 201) {
        setSuccessMessage('Registration successful! Redirecting to login...');
        toast.success('User regiistered successfully!');
        // navigate('/login');
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (error) {
      console.error('Registration failed:', error);
      if (error.response && error.response.status === 409) {
        setError('Mobile number or mail id already in use. Please log in using them.');
      } else {
        setError('Something went wrong. Please try again later.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <style>{`
    .loader-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(255, 255, 255, 0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }
    .loader {
      width: 100px;
      height: 100px;
    }
    .error-message {
      color: red;
      margin-top: 5px;
    }
    .success-message {
      color: green;
      margin-top: 5px;
    }
  `}</style>
        
      <section className='login product footer-padding'>
        <div className='container'>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={submitRegistration}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form className='login-section'>
                <div className='row align-items-center'>
                  <div className='col-lg-6'>
                    <div className='login-form'>
                      <div className='review-form box-shadows'>
                        <div className='review-form-text'>
                          <h5 className='comment-title'>Sign Up</h5>
                          <img
                            src='assets/images/homepage-one/vector-line.png'
                            alt='img'
                          />
                        </div>
                        <div className='review-inner-form'>
                          <div className='review-form-name'>
                            <label htmlFor='name' className='form-label'>
                              Name*
                            </label>
                            <Field
                              type='text'
                              id='name'
                              name='name'
                              className='form-control'
                              placeholder='Name'
                              required
                            />
                            {errors.name && touched.name ? (
                              <div className='error-message'>{errors.name}</div>
                            ) : null}
                          </div>
                          <div className='review-form-name'>
                            <label htmlFor='email' className='form-label'>
                              Email Address
                            </label>
                            <Field
                              type='email'
                              id='email'
                              name='email'
                              className='form-control'
                              placeholder='Email'
                            />
                            {errors.email && touched.email ? (
                              <div className='error-message'>
                                {errors.email}
                              </div>
                            ) : null}
                          </div>
                          <div className='review-form-name'>
                            <label htmlFor='mobile' className='form-label'>
                              Mobile Number*
                            </label>
                            <Field
                              type='text'
                              id='mobile'
                              name='mobile'
                              className='form-control'
                              placeholder='Mobile Number'
                              required
                            />
                            {errors.mobile && touched.mobile ? (
                              <div className='error-message'>
                                {errors.mobile}
                              </div>
                            ) : null}
                          </div>
                          <div className='review-form-name'>
                            <label htmlFor='password' className='form-label'>
                              Password*
                            </label>
                            <div className="input-group">
                            <Field
                              type={showPassword ? "text" : "password"}
                              id='password'
                              name='password'
                              className='form-control'
                              placeholder='Password'
                              required
                            />
                            <span className="input-group-text" onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}>
                                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                              </span>
                            </div>
                            {errors.password && touched.password ? (
                              <div className='error-message'>
                                {errors.password}
                              </div>
                            ) : null}
                          </div>
                          {/* <div className="review-form-name">
                            <label htmlFor="confirmPassword" className="form-label">
                              Confirm Password*
                            </label>
                            <Field
                              type="password"
                              id="confirmPassword"
                              name="confirmPassword"
                              className="form-control"
                              placeholder="Confirm Password"
                              required
                            />
                            {errors.confirmPassword && touched.confirmPassword ? ( 
                              <div className="error-message">{errors.confirmPassword}</div>
                            ) : null}
                          </div> */}
                        </div>
                        {error && <div className='error-message'>{error}</div>}
                        {successMessage && (
                          <div className='success-message'>
                            {successMessage}
                          </div>
                        )}
                        <div className='login-btn text-center'>
                          {/*
                        {isSubmitting ? ( /
                            <div className="loader-container">  
                            <img
                                src="https://media.tenor.com/wpSo-8CrXqUAAAAi/loading-loading-forever.gif"
                                alt="Loading..."
                                className="loader"
                              />  
                          </div>
                          ) : (*/}
                          <>
                            <button
                              type='submit'
                              className='shop-btn'
                              disabled={isSubmitting}
                            >
                              Sign Up
                            </button>
                            <span className='shop-account'>
                              Already have an account?{' '}
                              <Link to='/login'>Log In</Link>
                            </span>
                          </>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='col-lg-6'>
                    <div className='login-img'>
                      <img
                        src='assets/images/homepage-one/account-img.webp'
                        alt='img'
                      />
                    </div>
                  </div>
                </div>
                {isSubmitting && (
                  <div className='loader-overlay'>
                    <img
                      //src="https://media.tenor.com/wpSo-8CrXqUAAAAi/loading-loading-forever.gif"
                      //src=""
                      src={loaderGif}
                      alt='Loading...'
                      className='loader'
                    />
                  </div>
                )}
              </Form>
            )}
          </Formik>
        </div>
      </section>
    </>
  );
};

export default Register;
