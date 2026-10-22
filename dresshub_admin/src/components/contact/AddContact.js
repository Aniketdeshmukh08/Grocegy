import React, { useState } from 'react';
import { Formik, Field, Form } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast} from 'react-toastify';
import Spinner from 'react-bootstrap/Spinner';
import { ConfirmationModal } from '../shared/ConfirmationModal';
import 'react-toastify/dist/ReactToastify.css';

const AddContact = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [formSubmittedValues, setFormSubmittedValues] = useState(null);

  const today = new Date().toISOString().slice(0, 10);
  const initialFormValues = {
    name: '',
    email: '',
    mobile: '',
    address: '',
    subject: '',
    message: '',
    contactDate: today,
  };

  const validate = (values) => {
    const errors = {};
    
    // Validate name
    if (!values.name) {
      errors.name = '*Name is required';
    }

    // Validate email
    if (!values.email) {
      errors.email = '*Email is required';
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = '*Email address is invalid';
    }

    // Validate mobile number
    if (!values.mobile) {
      errors.mobile = '*Mobile number is required';
    } else if (!/^[0-9]{10}$/.test(values.mobile)) {
      errors.mobile = '*Mobile number should be of 10 digits';
    }

    return errors;
  };

  const handleSubmit = async (values) => {
    setFormSubmittedValues(values);
    setModalShow(true);
  };

  const confirmSubmit = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${process.env.REACT_APP_API_URL}contact/addContact`,
        formSubmittedValues,
        {
          headers: {
            'x-access-token': token
          }
        }
      );
      toast.success('Contact Added Successfully');
      navigate('/ContactList');
    } catch (error) {
      console.error('Error adding contact:', error);
      toast.error('Failed to add contact');
    } finally {
      setLoading(false);
      setModalShow(false);
    }
  };

  return (
    <>
      
      <div className="container mt-5">
        <div className="card shadow-sm border-0">
          <div className="card-header bg-success text-white text-center">
            <h4 className="mb-0">Add New Contact</h4>
          </div>
          <div className="card-body p-4">
            <Formik
              initialValues={initialFormValues}
              validate={validate}
              onSubmit={handleSubmit}
            >
              {({ errors }) => (
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
                      {errors.name && <div className="text-danger small mt-1">{errors.name}</div>}
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
                      {errors.email && <div className="text-danger small mt-1">{errors.email}</div>}
                    </div>
                  </div>

                  <div className="row mb-3 align-items-center">
                    <label className="col-md-4 col-form-label text-end fw-semibold text-success">
                      Mobile No:
                    </label>
                    <div className="col-md-6">
                      <Field
                        type="text"
                        name="mobile"
                        className="form-control"
                        placeholder="Enter mobile number"
                        required
                      />
                      {errors.mobile && <div className="text-danger small mt-1">{errors.mobile}</div>}
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
                        placeholder="Enter address"
                      />
                    </div>
                  </div>

                  <div className="row mb-3 align-items-center">
                    <label className="col-md-4 col-form-label text-end fw-semibold text-success">
                      Subject:
                    </label>
                    <div className="col-md-6">
                      <Field
                        type="text"
                        name="subject"
                        className="form-control"
                        placeholder="Enter subject"
                      />
                    </div>
                  </div>

                  <div className="row mb-3 align-items-center">
                    <label className="col-md-4 col-form-label text-end fw-semibold text-success">
                      Contact Date:
                    </label>
                    <div className="col-md-6">
                      <Field
                        type="date"
                        name="contactDate"
                        className="form-control"
                        required
                      />
                    </div>
                  </div>

                  <div className="row mb-4 align-items-center">
                    <label className="col-md-4 col-form-label text-end fw-semibold text-success">
                      Message:
                    </label>
                    <div className="col-md-6">
                      <Field
                        as="textarea"
                        name="message"
                        className="form-control"
                        placeholder="Enter message"
                        rows="4"
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
                        'Add Contact'
                      )}
                    </button>
                    <Link to="/ContactList" className="btn btn-outline-danger">
                      Cancel
                    </Link>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>

      <ConfirmationModal
        show={modalShow}
        modalMessage="Are you sure you want to add this contact?"
        onHide={() => setModalShow(false)}
        confirmation={confirmSubmit}
        operationType="Add"
        wantToAddData={true}
      />
    </>
  );
};

export default AddContact;
