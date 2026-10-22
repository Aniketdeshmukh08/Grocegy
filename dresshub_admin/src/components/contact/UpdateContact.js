import React, { useState, useEffect } from 'react';
import { Formik, Field, Form } from 'formik';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Spinner from 'react-bootstrap/Spinner';
import { ConfirmationModal } from '../shared/ConfirmationModal';
import 'react-toastify/dist/ReactToastify.css';
//  label status numbers
const statusMap = {
  0: 'Pending',
  1: 'In Progress',
  2: 'Resolved',
  3: 'Closed'
};

const UpdateContact = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    mobile: '',
    address: '',
    subject: '',
    message: '',
    contactDate: '',
    resolvestatus: 0
  });

  const [modalShow, setModalShow] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [formValuesChanged, setFormValuesChanged] = useState(false);

  useEffect(() => {
    const fetchContactDetails = async () => {
      try {
        const token = localStorage.getItem('jwttoken');
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}contact/getById/${id}`,
          {
            headers: {
              'x-access-token': token
            }
          }
        );
        const contact = response.data && response.data.length > 0 ? response.data[0] : null;
        if (contact) {
          setFormValues({
            name: contact.name,
            email: contact.email ,
            mobile: contact.mobile ,
            address: contact.address,
            subject: contact.subject ,
            message: contact.message,
            contactDate: contact.contactdate ? contact.contactdate.slice(0, 10) : '',
            resolvestatus: contact.resolvestatus ?? 0
          });
        } else {
          setFormValues({ name: '', email: '', mobile: '', address: '', subject: '', message: '', contactDate: '', resolvestatus: 0 });
        }
      } catch (error) {
        console.error('Error fetching contact details:', error);
        toast.error('Failed to fetch contact details');
      }
    };

    fetchContactDetails();
  }, [id]);

  const updateContact = (values) => {
    const isUnchanged = Object.keys(formValues).every(
      (key) => formValues[key] === values[key]
    );

    if (isUnchanged) {
      setModalMessage('No changes were made. Nothing to update.');
      setFormValuesChanged(false);
    } else {
      setModalMessage('Do you really want to update this contact?');
      setFormValuesChanged(true);
      // setFormValues(values);
      setFormValues({
        ...values,
        resolvestatus: parseInt(values.resolvestatus)
      });
    }
    setModalShow(true);
  };

  const confirmUpdateContact = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('jwttoken');
      await axios.put(
        `${process.env.REACT_APP_API_URL}contact/updateContact/${id}`,
        formValues,
        {
          headers: {
            'x-access-token': token
          }
        }
      );
      setModalShow(false);
      toast.success('Contact Updated Successfully');
      navigate('/ContactList');
    } catch (error) {
      console.error('Error updating contact:', error);
      toast.error('Failed to update contact');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>

      <div className="container mt-5">
        <div className="card shadow-sm border-0">
          <div className="card-header bg-success text-white text-center">
            <h4 className="mb-0">Update Contact</h4>
          </div>
          <div className="card-body p-4">
            <Formik
              enableReinitialize={true}
              initialValues={formValues}
              onSubmit={(values) => updateContact(values)}
            >
              <Form>
                <div className="row mb-3 align-items-center">
                  <label className="col-md-4 col-form-label text-end fw-semibold text-success">
                    Name:
                  </label>
                  <div className="col-md-6">
                    <Field
                      name="name"
                      type="text"
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
                      name="email"
                      type="email"
                      className="form-control"
                      placeholder="Enter email"
                      required
                    />
                  </div>
                </div>

                <div className="row mb-3 align-items-center">
                  <label className="col-md-4 col-form-label text-end fw-semibold text-success">
                    Mobile No:
                  </label>
                  <div className="col-md-6">
                    <Field
                      name="mobile"
                      type="text"
                      className="form-control"
                      placeholder="Enter mobile number"
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
                      name="address"
                      type="text"
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
                      name="subject"
                      type="text"
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

                <div className="row mb-3 align-items-center">
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

                {/* <div className="row mb-4 align-items-center">
                  <label className="col-md-4 col-form-label text-end fw-semibold text-success">
                    Resolve Status:
                  </label>
                  <div className="col-md-6">
                    <Field as="select" name="resolvestatus" className="form-select">
                      <option value="0">Unresolved</option>
                      <option value="1">Resolved</option>
                    </Field>
                  </div>
                </div> */}

                {/* Replaced resolve status with 4-option status dropdown */}
                <div className="row mb-4 align-items-center">
                  <label className="col-md-4 col-form-label text-end fw-semibold text-success">
                    Status:
                  </label>
                  <div className="col-md-6">
                    <Field as="select" name="resolvestatus" className="form-select">
                      <option value={0}>Pending</option>
                      <option value={1}>In Progress</option>
                      <option value={2}>Resolved</option>
                      <option value={3}>Closed</option>
                    </Field>
                  </div>
                </div>

                <div className="text-center">
                  <button type="submit" className="btn btn-success me-3 px-4" disabled={loading}>
                    {loading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />{' '}
                        Updating...
                      </>
                    ) : (
                      'Update Contact'
                    )}
                  </button>
                  <Link to="/ContactList" className="btn btn-outline-danger px-4">
                    Cancel
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
        confirmation={confirmUpdateContact}
        operationType="Update"
        wantToAddData={formValuesChanged}
      />
    </>
  );
};

export default UpdateContact;
