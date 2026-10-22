import React, { useState, useEffect } from 'react';
import { Formik, Field, Form } from 'formik';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
// import './Customer.css';
import { ConfirmationModal } from '../shared/ConfirmationModal';
import {  toast } from 'react-toastify';

const CustomerUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    username: '',
    userid: '',
    name: '',
    email: '',
    mobile: '',
    password: '',
    city: '',
    address: '',
    alternatecontact: '',
    pincode: '',
  });

  const [modalShow, setModalShow] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [formValuesChanged, setFormValuesChanged] = useState(false);

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}customer/customer/customerById/${id}`);
        const customer =
          response.data && response.data.length > 0 ? response.data[0] : null;
        if (customer) {
          setFormValues({
            username: customer.username || '',
            userid: customer.userid || '',
            name: customer.name || '',
            email: customer.email || '',
            mobile: customer.mobile || '',
            password: customer.password || '',
            city: customer.city || '',
            address: customer.address || '',
            alternatecontact: customer.alternatecontact || '',
            pincode: customer.pincode || '',
          });
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchCustomerDetails();
  }, [id]);

  // const handleFieldChange = (e) => {
  //   setFormValues(e.target.value);
  // };

  const updateCustomer = async values => {
    try {
      // Check if form values are unchanged
      const isUnchanged = Object.keys(formValues).every(
        key => formValues[key] === values[key]
      );

      if (isUnchanged) {
      setModalMessage('No changes were made. Nothing to update.');
      setFormValuesChanged(false);
    } else {
      setModalMessage('Do you really want to update this customer?');
      setFormValuesChanged(true);
      setFormValues(values);
    }
      setModalShow(true);
    } catch (err) {
      console.log(err);
    }
  };

    const confirmUpdateCustomer = async () => {
    try {
      const token = localStorage.getItem('jwttoken');
      await axios.put(
        `${process.env.REACT_APP_API_URL}customer/updateCustomerDetails/${id}`, formValues,{
         headers: {
        'x-access-token': token
        }
      });
      setModalShow(false);
      toast.success('Customer Updated Successfully');
      navigate('/customerDetails');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update customer');
    }
  };

  return (
    <>
      
      <div className="container mt-5">
        <div className="card shadow-sm border-0">
          <div className="card-header bg-success text-white text-center">
            <h4 className="mb-0">Update Customer</h4>
          </div>
          <div className="card-body p-4">
            <Formik
              enableReinitialize={true}
              initialValues={formValues}
              onSubmit={values => updateCustomer(values)}
            >
              <Form>
                <div className="mb-3 row">
                  <label className="col-md-4 col-form-label text-end fw-semibold">
                    Name:
                  </label>
                  <div className="col-md-6">
                    <Field name="name" type="text" className="form-control" />
                  </div>
                </div>
                <div className="mb-3 row">
                  <label className="col-md-4 col-form-label text-end fw-semibold">
                    Username:
                  </label>
                  <div className="col-md-6">
                    <Field name="username" type="text" className="form-control" />
                  </div>
                </div>
                <div className="mb-3 row">
                  <label className="col-md-4 col-form-label text-end fw-semibold">
                    Email:
                  </label>
                  <div className="col-md-6">
                    <Field name="email" type="email" className="form-control" />
                  </div>
                </div>

                <div className="mb-3 row">
                  <label className="col-md-4 col-form-label text-end fw-semibold">
                    Mobile:
                  </label>
                  <div className="col-md-6">
                    <Field name="mobile" type="text" className="form-control" />
                  </div>
                </div>

                <div className="mb-3 row">
                  <label className="col-md-4 col-form-label text-end fw-semibold">
                    Password:
                  </label>
                  <div className="col-md-6">
                    <Field name="password" type="text" className="form-control" />
                  </div>
                </div>

                <div className="mb-3 row">
                  <label className="col-md-4 col-form-label text-end fw-semibold">
                    City:
                  </label>
                  <div className="col-md-6">
                    <Field name="city" type="text" className="form-control" />
                  </div>
                </div>

                <div className="mb-3 row">
                  <label className="col-md-4 col-form-label text-end fw-semibold">
                    Address:
                  </label>
                  <div className="col-md-6">
                    <Field name="address" type="text" className="form-control" />
                  </div>
                </div>

                <div className="mb-3 row">
                  <label className="col-md-4 col-form-label text-end fw-semibold">
                    Alternate Contact:
                  </label>
                  <div className="col-md-6">
                    <Field
                      name="alternatecontact"
                      type="text"
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="mb-4 row">
                  <label className="col-md-4 col-form-label text-end fw-semibold">
                    Pincode:
                  </label>
                  <div className="col-md-6">
                    <Field name="pincode" type="text" className="form-control" />
                  </div>
                </div>

                <div className="text-center">
                  <button type="submit" className="btn btn-success me-3 px-4">
                    Submit
                  </button>
                  <Link
                    to="/customerDetails"
                    className="btn btn-outline-danger px-4"
                  >
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
        confirmation={confirmUpdateCustomer}
        operationType="Update"
        wantToAddData={formValuesChanged}
      />
    </>
  );
};

export default CustomerUpdate;
