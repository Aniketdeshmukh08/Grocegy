import React, { useState } from 'react';
import { Formik, Field, Form } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Spinner from 'react-bootstrap/Spinner';
import 'react-toastify/dist/ReactToastify.css';

const OrderDetailAdd = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const initialFormValues = {
    order_id: '',
    productid: '',
    quantity: '',
  };

  const submitOrder = async (values) => {
    setLoading(true);
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}orderdetails/addToOrderProducts`,
        values
      );
      toast.success('Order Detail Added Successfully');
      navigate('/orderDetails');
    } catch (error) {
      console.error('Error adding order detail:', error);
      toast.error('Failed to add order detail');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      
      <div className="container mt-5">
        <div className="card shadow-sm border-0">
          <div className="card-header bg-success text-white text-center">
            <h4 className="mb-0">Add New Order Detail</h4>
          </div>
          <div className="card-body p-4">
            <Formik
              initialValues={initialFormValues}
              onSubmit={values => submitOrder(values)}
            >
              <Form>
                <div className="row mb-3 align-items-center">
                  <label className="col-md-4 col-form-label text-end fw-semibold text-success">
                    Order ID:
                  </label>
                  <div className="col-md-6">
                    <Field
                      name="order_id"
                      type="text"
                      className="form-control"
                      placeholder="Enter Order ID"
                      required
                    />
                  </div>
                </div>
                <div className="row mb-3 align-items-center">
                  <label className="col-md-4 col-form-label text-end fw-semibold text-success">
                    Product ID:
                  </label>
                  <div className="col-md-6">
                    <Field
                      name="productid"
                      type="text"
                      className="form-control"
                      placeholder="Enter Product ID"
                      required
                    />
                  </div>
                </div>
                <div className="row mb-4 align-items-center">
                  <label className="col-md-4 col-form-label text-end fw-semibold text-success">
                    Quantity:
                  </label>
                  <div className="col-md-6">
                    <Field
                      name="quantity"
                      type="number"
                      className="form-control"
                      placeholder="Enter Quantity"
                      required
                    />
                  </div>
                </div>
                <div className="text-center">
                  <button type="submit" className="btn btn-success px-4 me-3" disabled={loading}>
                    {loading ? (
                      <>
                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />{' '}
                        Adding...
                      </>
                    ) : (
                      'Add Order Detail'
                    )}
                  </button>
                  <Link to="/orderDetails" className="btn btn-outline-danger">
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

export default OrderDetailAdd;