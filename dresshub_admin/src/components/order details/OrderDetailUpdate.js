import React, { useEffect, useState } from 'react';
import { Formik, Field, Form } from 'formik';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { ConfirmationModal } from '../shared/ConfirmationModal'; // Assuming this component exists
import { toast } from 'react-toastify';
import Spinner from 'react-bootstrap/Spinner';

const OrderDetailUpdate = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [initialFormValues, setInitialFormValues] = useState({
    order_id: '',
    productid: '',
    quantity: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalShow, setModalShow] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [formValuesChanged, setFormValuesChanged] = useState(false);
  const [updatedValues, setUpdatedValues] = useState({});

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}orderdetails/getById/${id}`);
        const data = res.data && res.data.length > 0 ? res.data[0] : null;
        if (data) {
          setInitialFormValues({
            order_id: data.order_id,
            productid: data.productid,
            quantity: data.quantity,
          });
        } else {
          setError('No order details found for this ID.');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch order details.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [id]);

  const updateOrderDetails = (values) => {
    const isUnchanged = Object.keys(initialFormValues).every(
      (key) => initialFormValues[key] === values[key]
    );

    if (isUnchanged) {
      setModalMessage('No changes were made. Nothing to update.');
      setFormValuesChanged(false);
    } else {
      setModalMessage('Do you really want to update this order detail?');
      setFormValuesChanged(true);
      setUpdatedValues(values);
    }
    setModalShow(true);
  };

  const confirmUpdate = async () => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}orderdetails/updateOrderProductDetails/${id}`,
        updatedValues
      );
      setModalShow(false);
      toast.success('Order Detail Updated Successfully');
      navigate('/orderDetails');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update order detail');
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <Spinner animation="border" variant="success" />
        <p className="mt-2 text-success">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5 text-center text-danger">
        <h4>{error}</h4>
        <Link to="/orderDetails" className="btn btn-outline-danger mt-3">
          Back to List
        </Link>
      </div>
    );
  }

  return (
    <>
      
      <div className="container mt-5">
        <div className="card shadow-sm border-0">
          <div className="card-header bg-success text-white text-center">
            <h4 className="mb-0">Update Order Detail</h4>
          </div>
          <div className="card-body p-4">
            <Formik
              enableReinitialize={true}
              initialValues={initialFormValues}
              onSubmit={values => updateOrderDetails(values)}
            >
              <Form>
                <div className="mb-3 row">
                  <label className="col-md-4 col-form-label text-end fw-semibold text-success">
                    Order ID:
                  </label>
                  <div className="col-md-6">
                    <Field
                      name="order_id"
                      type="text"
                      className="form-control"
                      readOnly
                    />
                  </div>
                </div>
                <div className="mb-3 row">
                  <label className="col-md-4 col-form-label text-end fw-semibold text-success">
                    Product ID:
                  </label>
                  <div className="col-md-6">
                    <Field
                      name="productid"
                      type="text"
                      className="form-control"
                      readOnly
                    />
                  </div>
                </div>
                <div className="mb-4 row">
                  <label className="col-md-4 col-form-label text-end fw-semibold text-success">
                    Quantity:
                  </label>
                  <div className="col-md-6">
                    <Field
                      name="quantity"
                      type="number"
                      className="form-control"
                      required
                    />
                  </div>
                </div>
                <div className="text-center">
                  <button type="submit" className="btn btn-success me-3 px-4">
                    Submit
                  </button>
                  <Link to="/orderDetails" className="btn btn-outline-danger px-4">
                    Back
                  </Link>
                </div>
              </Form>
            </Formik>
          </div>
        </div>
      </div>

      <ConfirmationModal
        show={modalShow}
        modalMessage={modalMessage}
        onHide={() => setModalShow(false)}
        confirmation={confirmUpdate}
        operationType="Update"
        wantToAddData={formValuesChanged}
      />
    </>
  );
};

export default OrderDetailUpdate;