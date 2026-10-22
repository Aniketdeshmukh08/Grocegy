import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Formik, Field, Form } from 'formik';
import { ConfirmationModal } from '../shared/ConfirmationModal';

export const ComplainsEdit = () => {
  const { complainid } = useParams();
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    mobile: '',
    address: '',
    subject: '',
    complain_desc: '',
    resolvestatus: 'Pending',
    orderid: '',
    complainid: '',
  });

  const [modalShow, setModalShow] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [formValuesChanged, setFormValuesChanged] = useState(false);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('jwttoken');
    return {
      headers: { 'x-access-token': token }
    };
  };

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}complains/complainbyid/${complainid}`, getAuthHeaders())
      .then(res => {
        const data = res.data[0];
        setFormValues({
          complainid: data.complainid,
          name: data.name,
          email: data.email,
          mobile: data.mobile,
          address: data.address,
          orderid: data.orderid,
          subject: data.subject,
          complain_desc: data.complain_desc,
          resolvestatus: data.resolvestatus || 'Pending',
        });
      })
      .catch(err => {
        console.error("Error fetching complain:", err);
      });
  }, [complainid]);

  const validate = values => {
    const errors = {};
    if (!values.name) errors.name = '*Name is required';
    if (!values.email) errors.email = '*Email is required';
    else if (!/\S+@\S+\.\S+/.test(values.email)) errors.email = '*Email is invalid';
    if (!values.mobile) errors.mobile = '*Mobile number is required';
    else if (!/^[0-9]{10}$/.test(values.mobile)) errors.mobile = '*Mobile number must be 10 digits';
    return errors;
  };

  const updateComplain = values => {
    const isUnchanged = Object.keys(formValues).every(key => formValues[key] === values[key]);
    if (isUnchanged) {
      setModalMessage('Nothing to update');
      setFormValuesChanged(false);
    } else {
      setFormValues(values);
      setModalMessage('You really want to update this complain?');
      setFormValuesChanged(true);
    }
    setModalShow(true);
  };

  const confirmUpdateComplain = async () => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}complains/updatecomplains/${complainid}`,
        formValues,
        getAuthHeaders()
      );
      setModalShow(false);
      navigate('/complainslist');
    } catch (err) {
      console.error("Error updating complain:", err);
    }
  };

  return (
    <>
      <div className="container mt-4">
        <div className="card shadow-sm">
          <div className="card-header bg-success text-white text-center">
            <h4 className="mb-0">Edit Complain</h4>
          </div>
          <div className="card-body">
            <Formik
              enableReinitialize
              initialValues={formValues}
              validate={validate}
              onSubmit={updateComplain}
            >
              {({ errors }) => (
                <Form>
                  <div className="row mb-3">
                    <label className="col-md-4 col-form-label text-md-end">Order ID:</label>
                    <div className="col-md-6">
                      <Field name="orderid" type="text" className="form-control" readOnly />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <label className="col-md-4 col-form-label text-md-end">Complain ID:</label>
                    <div className="col-md-6">
                      <Field name="complainid" type="text" className="form-control" readOnly />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <label className="col-md-4 col-form-label text-md-end">Name:</label>
                    <div className="col-md-6">
                      <Field name="name" type="text" className="form-control" />
                      {errors.name && <div className="text-danger small">{errors.name}</div>}
                    </div>
                  </div>

                  <div className="row mb-3">
                    <label className="col-md-4 col-form-label text-md-end">Email:</label>
                    <div className="col-md-6">
                      <Field name="email" type="text" className="form-control" />
                      {errors.email && <div className="text-danger small">{errors.email}</div>}
                    </div>
                  </div>

                  <div className="row mb-3">
                    <label className="col-md-4 col-form-label text-md-end">Mobile:</label>
                    <div className="col-md-6">
                      <Field name="mobile" type="text" className="form-control" />
                      {errors.mobile && <div className="text-danger small">{errors.mobile}</div>}
                    </div>
                  </div>

                  <div className="row mb-3">
                    <label className="col-md-4 col-form-label text-md-end">Address:</label>
                    <div className="col-md-6">
                      <Field name="address" type="text" className="form-control" />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <label className="col-md-4 col-form-label text-md-end">Subject:</label>
                    <div className="col-md-6">
                      <Field name="subject" type="text" className="form-control" />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <label className="col-md-4 col-form-label text-md-end">Description:</label>
                    <div className="col-md-6">
                      <Field name="complain_desc" type="text" className="form-control" />
                    </div>
                  </div>

                  <div className="row mb-4">
                    <label className="col-md-4 col-form-label text-md-end">Resolve Status:</label>
                    <div className="col-md-6">
                        <Field name="resolvestatus" as="select" className="form-control">
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                          <option value="Closed">Closed</option>
                        </Field>
                      </div>
                  </div>

                  <div className="text-center">
                    <button type="submit" className="btn btn-success px-4 me-3">
                      Submit
                    </button>
                    <Link to="/complainslist" className="btn btn-outline-danger">
                      Back
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
        modalMessage={modalMessage}
        onHide={() => setModalShow(false)}
        confirmation={confirmUpdateComplain}
        operationType="Update"
        wantToAddData={formValuesChanged}
      />
    </>
  );
};

export default ComplainsEdit;
