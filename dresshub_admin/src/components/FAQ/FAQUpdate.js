import React, { useEffect, useState } from 'react';
import { Formik, Field, Form } from 'formik';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

import { ConfirmationModal } from '../shared/ConfirmationModal';

const FAQUpdate = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [pendingValues, setPendingValues] = useState(null);
  const [formValues, setFormValues] = useState({
    question: '',
    answer: '',
    type: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('jwttoken');
    const headers = {
      'x-access-token': token,
      'Content-Type': 'application/json',
    };
    axios
      .get(`${process.env.REACT_APP_API_URL}faq/${id}`, { headers })
      .then(res => {
        const data = res.data;
        setFormValues({
          question: data.question,
          answer: data.answer,
          type: data.type,
        });
      })
      .catch(err => console.log(err));
  }, [id]);

  const updateFAQ = (values) => {
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

      await axios.put(`${process.env.REACT_APP_API_URL}faq/${id}`, pendingValues, { headers });
      setShowModal(false);
      navigate('/faq');
    } catch (err) {
      console.log(err);
      setShowModal(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-sm border-0">
        <div className="card-header bg-success text-white text-center">
          <h4 className="mb-0">Update FAQ</h4>
        </div>
        <div className="card-body p-4">
          <Formik enableReinitialize initialValues={formValues} onSubmit={updateFAQ}>
            <Form>
              <div className="mb-3 row">
                <label className="col-md-4 col-form-label text-end fw-semibold text-success">
                  Question:
                </label>
                <div className="col-md-6">
                  <Field name="question" type="text" className="form-control" />
                </div>
              </div>

              <div className="mb-3 row">
                <label className="col-md-4 col-form-label text-end fw-semibold text-success">
                  Answer:
                </label>
                <div className="col-md-6">
                  <Field name="answer" type="text" className="form-control" />
                </div>
              </div>

              <div className="mb-4 row">
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
                </div>
              </div>

              <div className="text-center">
                <button type="submit" className="btn btn-success px-4 me-3">
                  Update
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
        operationType="Update"
        modalMessage="Are you sure you want to update this FAQ?"
        wantToAddData={true}
      />
    </div>
  );
};

export default FAQUpdate;
