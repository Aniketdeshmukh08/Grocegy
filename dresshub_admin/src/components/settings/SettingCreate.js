import React, { useState } from 'react';
import { Formik, Field, Form } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ConfirmationModal } from '../shared/ConfirmationModal';
import Spinner from 'react-bootstrap/Spinner';
import 'react-toastify/dist/ReactToastify.css';

const SettingCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(null);

  const initialFormValues = {
    setting_name: '',
    setting_value: '',
  };

  const handleFormSubmit = (values) => {
    setFormData(values);
    setShowModal(true);
  };

  const handleConfirmSubmit = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('jwttoken');
      await axios.post(
        `${process.env.REACT_APP_API_URL}settings/addsetting`,
        formData,
        {
          headers: {
            'x-access-token': token
          }
        }
      );
      setShowModal(false);
      toast.success('Setting Added Successfully');
      navigate('/settingslist');
    } catch (error) {
      console.error('Error adding setting:', error);
      toast.error('Failed to add setting');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      
      <div className="container mt-5">
        <div className="card shadow-sm border-0">
          <div className="card-header bg-success text-white text-center">
            <h4 className="mb-0">Add New Setting</h4>
          </div>
          <div className="card-body p-4">
            <Formik
              initialValues={initialFormValues}
              onSubmit={(values) => handleFormSubmit(values)}
            >
              <Form>
                <div className="row mb-3 align-items-center">
                  <label className="col-md-4 col-form-label text-end fw-semibold text-success">
                    Setting Name:
                  </label>
                  <div className="col-md-6">
                    <Field
                      type="text"
                      name="setting_name"
                      className="form-control"
                      placeholder="Enter setting name"
                      required
                    />
                  </div>
                </div>

                <div className="row mb-4 align-items-center">
                  <label className="col-md-4 col-form-label text-end fw-semibold text-success">
                    Setting Value:
                  </label>
                  <div className="col-md-6">
                    <Field
                      type="text"
                      name="setting_value"
                      className="form-control"
                      placeholder="Enter setting value"
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
                      'Add Setting'
                    )}
                  </button>
                  <Link to="/settingslist" className="btn btn-outline-danger">
                    Cancel
                  </Link>
                </div>
              </Form>
            </Formik>
          </div>
        </div>
      </div>

      <ConfirmationModal
        show={showModal}
        modalMessage="Are you sure you want to add this setting?"
        onHide={() => setShowModal(false)}
        confirmation={handleConfirmSubmit}
        operationType="Add"
        wantToAddData={true}
      />
    </>
  );
};

export default SettingCreate;
