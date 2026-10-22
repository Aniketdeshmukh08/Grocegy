import React, { FC, useState } from 'react';
import axios from 'axios';
import { Formik, Field, Form } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Spinner from 'react-bootstrap/Spinner';
import 'react-toastify/dist/ReactToastify.css';
import nss_payment from '../../images/nss_payment.jpeg';

const UserAdd: FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(false);
  const [paymentModal, setPaymentModal] = useState(false);

  const callApiUserAdd = async (values: any) => {
    setLoading(true);
    try {
      const url = process.env.REACT_APP_API_URL + 'users/adduser';
      const response = await axios.post(url, values);
      
      if (response.status === 201) {
        setStatus(true);
        toast.success('User Added Successfully');
        
        const token = localStorage.getItem('jwttoken');
        if (token) {
          navigate('/userslist');
        }
      }
      return { error: false };
    } catch (error) {
      console.error('Error adding user:', error);
      toast.error('Failed to add user');
      return { error: true };
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      
      <div className="container mt-5">
        <div className="card shadow-sm border-0">
          <div className="card-header bg-success text-white text-center">
            <h4 className="mb-0">Create New User</h4>
          </div>
          <div className="card-body p-4">
            <Formik
              initialValues={{ name: '', email: '', mobile: '', password: '' }}
              onSubmit={async (values, { resetForm }) => {
                const { error } = await callApiUserAdd(values);
                if (!error) {
                  resetForm();
                }
              }}
            >
              <Form>
                <div className="row mb-3 align-items-center">
                  <label className="col-md-4 col-form-label text-end fw-semibold text-success">
                    Name:
                  </label>
                  <div className="col-md-6">
                    <Field
                      type="text"
                      name="name"
                      className="form-control"
                      placeholder="Enter name"
                      required
                    />
                  </div>
                </div>

                <div className="row mb-3 align-items-center">
                  <label className="col-md-4 col-form-label text-end fw-semibold text-success">
                    Email:
                  </label>
                  <div className="col-md-6">
                    <Field
                      type="email"
                      name="email"
                      className="form-control"
                      placeholder="Enter email"
                      required
                    />
                  </div>
                </div>

                <div className="row mb-3 align-items-center">
                  <label className="col-md-4 col-form-label text-end fw-semibold text-success">
                    Mobile:
                  </label>
                  <div className="col-md-6">
                    <Field
                      type="text"
                      name="mobile"
                      className="form-control"
                      placeholder="Enter mobile number"
                      required
                    />
                  </div>
                </div>

                <div className="row mb-4 align-items-center">
                  <label className="col-md-4 col-form-label text-end fw-semibold text-success">
                    Password:
                  </label>
                  <div className="col-md-6">
                    <Field
                      type="password"
                      name="password"
                      className="form-control"
                      placeholder="Enter password"
                      required
                    />
                  </div>
                </div>

                <div className="text-center">
                  <button type="submit" className="btn btn-success px-4 me-3" disabled={loading}>
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
                      'Create User'
                    )}
                  </button>
                  <Link to="/userslist" className="btn btn-outline-danger">
                    Cancel
                  </Link>
                </div>
              </Form>
            </Formik>

            {status && (
              <div className="alert alert-success mt-4" role="alert">
                You are registered. Your account will be activated within 24 hours of
                Payment.&nbsp;
                <button
                  className="btn btn-success btn-sm"
                  onClick={() => setPaymentModal(true)}
                >
                  Click here for payment details.
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {paymentModal && (
        <div
          className="modal fade show"
          style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-center" id="exampleModalLabel">
                  Payment Details
                </h5>
              </div>
              <div className="modal-body text-center">
                <p>Fee - Rs 300</p>
                <p>
                  Note - Please, make payment from registered mobile number and
                  send the screenshot on WhatsApp (9135707273).
                </p>
                <img src={nss_payment} height={300} alt="Payment QR" className="img-fluid" />
              </div>
              <div className="modal-footer justify-content-center">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setPaymentModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserAdd;