import React, { useState } from 'react';
import { Formik, Field, Form } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Spinner from 'react-bootstrap/Spinner';
import { toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import './Customer.css';

const CustomerCreate = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const formValues = {
    userid: '',
    city: '',
    address: '',
    alternatecontact: '',
    pincode: '',
    profile_photo: '',
  };

  const submitCustomer = async values => {
  setLoading(true);
  try {
    const token = localStorage.getItem('jwttoken');
    // If reusing existing userid
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}customer/customer/addCustomer`,
      values, {
         headers: {
        'x-access-token': token
        }
      }
    );
    toast.success('Customer processed successfully');
    navigate('/customerDetails');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to process customer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      
      <div className="container mt-5">
        <div className="card shadow-sm border-0">
          <div className="card-header bg-success text-white text-center">
            <h4 className="mb-0">Add New Customer</h4>
          </div>
          <div className="card-body p-4">
            <Formik initialValues={formValues} onSubmit={submitCustomer}>
              <Form>
                <div className="row mb-3 align-items-center">
                  <label className="col-md-4 col-form-label text-end fw-semibold text-success">
                    User ID:
                  </label>
                  <div className="col-md-6">
                    <Field
                      type="text"
                      name="userid"
                      className="form-control"
                      placeholder="Enter User ID"
                      required
                    />
                  </div>
                </div>

                <div className="row mb-3 align-items-center">
                  <label className="col-md-4 col-form-label text-end fw-semibold text-success">
                    City:
                  </label>
                  <div className="col-md-6">
                    <Field
                      type="text"
                      name="city"
                      className="form-control"
                      placeholder="Enter City"
                      required
                    />
                  </div>
                </div>

                <div className="row mb-3 align-items-center">
                  <label className="col-md-4 col-form-label text-end fw-semibold text-success">
                    Address:
                  </label>
                  <div className="col-md-6">
                    <Field
                      type="text"
                      name="address"
                      className="form-control"
                      placeholder="Enter Address"
                      required
                    />
                  </div>
                </div>

                <div className="row mb-3 align-items-center">
                  <label className="col-md-4 col-form-label text-end fw-semibold text-success">
                    Contact:
                  </label>
                  <div className="col-md-6">
                    <Field
                      type="text"
                      name="alternatecontact"
                      className="form-control"
                      placeholder="Enter Contact Number"
                      required
                    />
                  </div>
                </div>

                <div className="row mb-4 align-items-center">
                  <label className="col-md-4 col-form-label text-end fw-semibold text-success">
                    Pincode:
                  </label>
                  <div className="col-md-6">
                    <Field
                      type="text"
                      name="pincode"
                      className="form-control"
                      placeholder="Enter Pincode"
                      required
                    />
                  </div>
                </div>

                <div className="text-center">
                  <button
                    type="submit"
                    className="btn btn-success px-4 me-3"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />{' '}
                        Adding...
                      </>
                    ) : (
                      'Add Customer'
                    )}
                  </button>
                  <Link to="/customerDetails" className="btn btn-outline-danger">
                    Cancel
                  </Link>
                </div>
              </Form>
            </Formik>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerCreate;