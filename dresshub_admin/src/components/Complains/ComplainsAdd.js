import React, { useState, useEffect } from 'react';
import { Formik, Field, Form } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ConfirmationModal } from '../shared/ConfirmationModal';

export const ComplainsAdd = () => {
  const navigate = useNavigate();

  const initialFormValues = {
    orderid: '',
    name: '',
    email: '',
    mobile: '',
    address: '',
    subject: '',
    complain_desc: '',
  };

  const [modalShow, setModalShow] = useState(false);
  const [formValue, setFormValue] = useState({});
  const [orderIds, setOrderIds] = useState([]);

  const addNewComplain = (values) => {
    setFormValue(values);
    setModalShow(true);
  };

  const confirmAddComplain = async () => {
    setModalShow(false);
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}complains/addcomplain`, formValue);
      navigate('/complainslist');
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchOrderIds = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}orders/allorderIDs`);
        const allOrderIds = response.data.map((order) => order.order_id);
        setOrderIds(allOrderIds);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOrderIds();
  }, []);

  return (
    <>
      <div className="container mt-5">
        <div className="card shadow-sm">
          <div className="card-header bg-success text-white text-center">
            <h4 className="mb-0">Add New Complain</h4>
          </div>
          <div className="card-body p-4">
            <Formik initialValues={initialFormValues} onSubmit={addNewComplain}>
              <Form>
                <div className="mb-3 row">
                  <label className="col-md-4 col-form-label text-end fw-semibold">Order ID:</label>
                  <div className="col-md-6">
                    <Field as="select" name="orderid" className="form-select" required>
                      <option value="">Select an Order ID</option>
                      {orderIds.map((order) => (
                        <option key={order} value={order}>
                          {order}
                        </option>
                      ))}
                    </Field>
                  </div>
                </div>

                <div className="mb-3 row">
                  <label className="col-md-4 col-form-label text-end fw-semibold">Name:</label>
                  <div className="col-md-6">
                    <Field name="name" type="text" className="form-control" required />
                  </div>
                </div>

                <div className="mb-3 row">
                  <label className="col-md-4 col-form-label text-end fw-semibold">Email:</label>
                  <div className="col-md-6">
                    <Field name="email" type="email" className="form-control" required />
                  </div>
                </div>

                <div className="mb-3 row">
                  <label className="col-md-4 col-form-label text-end fw-semibold">Mobile:</label>
                  <div className="col-md-6">
                    <Field name="mobile" type="text" className="form-control" required />
                  </div>
                </div>

                <div className="mb-3 row">
                  <label className="col-md-4 col-form-label text-end fw-semibold">Address:</label>
                  <div className="col-md-6">
                    <Field name="address" type="text" className="form-control" required />
                  </div>
                </div>

                <div className="mb-3 row">
                  <label className="col-md-4 col-form-label text-end fw-semibold">Subject:</label>
                  <div className="col-md-6">
                    <Field name="subject" type="text" className="form-control" required />
                  </div>
                </div>

                <div className="mb-4 row">
                  <label className="col-md-4 col-form-label text-end fw-semibold">Description:</label>
                  <div className="col-md-6">
                    <Field name="complain_desc" type="text" className="form-control" required />
                  </div>
                </div>

                <div className="text-center">
                  <button type="submit" className="btn btn-success px-4 me-3">
                    Add Complain
                  </button>
                  <Link to="/complainslist" className="btn btn-outline-danger">
                    Back to Complain List
                  </Link>
                </div>
              </Form>
            </Formik>
          </div>
        </div>
      </div>

      <ConfirmationModal
        show={modalShow}
        modalMessage="Do you really want to add this complain?"
        onHide={() => setModalShow(false)}
        confirmation={confirmAddComplain}
        operationType="Add"
        wantToAddData={true}
      />
    </>
  );
};

export default ComplainsAdd;
