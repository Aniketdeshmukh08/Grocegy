import React, { useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import { ConfirmationModal } from '../shared/ConfirmationModal';

const FAQAdd = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [pendingValues, setPendingValues] = useState(null);

  const initialValues = {
    question: '',
    answer: '',
    type: '',
  };

  const validate = values => {
    const errors = {};
    if (!values.question) errors.question = 'Question is required';
    if (!values.answer) errors.answer = 'Answer is required';
    if (!values.type) errors.type = 'Type is required';
    return errors;
  };

  const submitFAQ = (values) => {
    setPendingValues(values);
    setShowModal(true);
  };

  const handleConfirm = async () => {
    if (!pendingValues) return;
    try {
      const token = localStorage.getItem('jwttoken');
      const headers = {
        'x-access-token': token,
        'Content-Type': 'application/json',
      };
      await axios.post(`${process.env.REACT_APP_API_URL}faq/add`, pendingValues, { headers });
      setShowModal(false);
      navigate('/faq');
    } catch (error) {
      console.log(error);
      setShowModal(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-sm border-0">
        <div className="card-header bg-success text-white text-center">
          <h4 className="mb-0">Add New FAQ</h4>
        </div>
        <div className="card-body p-4">
          <Formik initialValues={initialValues} validate={validate} onSubmit={submitFAQ}>
            <Form>
              <div className="row mb-3">
                <label className="col-md-4 col-form-label text-end fw-semibold text-success">
                  Question:
                </label>
                <div className="col-md-6">
                  <Field name="question" type="text" className="form-control" placeholder="Enter question" />
                  <ErrorMessage name="question" component="div" className="text-danger mt-1" />
                </div>
              </div>

              <div className="row mb-3">
                <label className="col-md-4 col-form-label text-end fw-semibold text-success">
                  Answer:
                </label>
                <div className="col-md-6">
                  <Field name="answer" type="text" className="form-control" placeholder="Enter answer" />
                  <ErrorMessage name="answer" component="div" className="text-danger mt-1" />
                </div>
              </div>

              <div className="row mb-4">
                <label className="col-md-4 col-form-label text-end fw-semibold text-success">
                  Type:
                </label>
                <div className="col-md-6">
                  <Field as="select" name="type" className="form-select">
                    <option value="">Select Type</option>
                    <option value="User">User</option>
                    <option value="Admin">Admin</option>
                    <option value="Delivery Partner">Delivery Partner</option>
                    <option value="Vendor">Vendor</option>
                  </Field>
                  <ErrorMessage name="type" component="div" className="text-danger mt-1" />
                </div>
              </div>

              <div className="text-center">
                <button type="submit" className="btn btn-success px-4 me-3">
                  Submit
                </button>
                <Link to="/faq" className="btn btn-outline-danger px-4">
                  Back
                </Link>
              </div>
            </Form>
          </Formik>
        </div>
      </div>
      <ConfirmationModal
        show={showModal}
        onHide={() => setShowModal(false)}
        confirmation={handleConfirm}
        operationType="Add"
        modalMessage="Are you sure you want to add this FAQ?"
        wantToAddData={true}
      />
    </div>
  );
};

export default FAQAdd;
