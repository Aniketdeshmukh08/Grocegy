import React, { useContext, useEffect, useState } from 'react';
import {  useNavigate } from 'react-router-dom';
import { Formik, Field, Form } from 'formik';
import axios from 'axios';

import { DataAppContext } from '../../DataContext';
const Login = () => {
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState('');
  const localContext = useContext(DataAppContext);
  const navigate = useNavigate();
  const login = async (values: any) => {
    setLoader(true);
    const url = process.env.REACT_APP_API_URL + 'users/login';
    try {
      const response = await axios.post(url, values);
      setLoader(false);
      const { token, userId, userType } = response.data;
      if (response.status === 202 && userType === "admin") {
        const loginTime = new Date().getTime();
        localStorage.setItem('jwttoken', token);
        localStorage.setItem('userid', userId);
        localStorage.setItem('usertype', userType);
        localStorage.setItem('loginTime', loginTime.toString()); 
        navigate('/admindashboard');
        localContext.login_user();
      } else if (response.status === 202 && userType !== "admin") {
        setError('Please login with admin credentials.');
      } else {
        setError('Something went wrong. Please try again later.');
      }
    } catch (err: Error | any) {
      setLoader(false);
      console.error('Login failed:', error);
      if (err.response && err.response.status === 422) {
        setError('User not found. Please check your credentials.');
      } else if (err.response && err.response.data) {
        setError(err.response.data.message);
      } else if (err.message === 'Network Error') {
        setError('Network error occurred. Please try again later.');
      } else {
        setError('Something went wrong. Please try again later.');
      }
    }
  };

  return (
    <>
      <div className="container mt-5 p-0">
        <div className="row justify-content-center">
          <div className="col-md-6 col-sm-10">
            <div className="card shadow border-0">
              <div className="card-header bg-success text-white text-center">
                <h4 className="mb-0">Log In</h4>
              </div>
              <div className="card-body px-4 py-5">
                <Formik
                  initialValues={{ username: '', password: '' }}
                  onSubmit={values => login(values)}
                >
                  <Form>
                    <div className="mb-3 row">
                      <label className="col-sm-4 col-form-label text-end text-success fw-semibold">
                        Username:
                      </label>
                      <div className="col-sm-8">
                        <Field
                          name="username"
                          type="text"
                          className="form-control"
                          placeholder="Enter your username"
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-4 row">
                      <label className="col-sm-4 col-form-label text-end text-success fw-semibold">
                        Password:
                      </label>
                      <div className="col-sm-8">
                        <Field
                          name="password"
                          type="password"
                          className="form-control"
                          placeholder="Enter your password"
                          required
                        />
                      </div>
                    </div>

                    <div className="text-center">
                      <button
                        type="submit"
                        className="btn btn-success px-4 w-50"
                        disabled={loader}
                      >
                        {loader ? 'Logging In...' : 'Log In'}
                      </button>
                    </div>

                    {error && (
                      <div className="alert alert-danger mt-4 text-center" role="alert">
                        {error}
                      </div>
                    )}
                  </Form>
                </Formik>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
