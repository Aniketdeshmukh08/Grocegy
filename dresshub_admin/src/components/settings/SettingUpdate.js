import React, { useState, useEffect } from 'react';
import { Formik, Field, Form } from 'formik';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { ConfirmationModal } from '../shared/ConfirmationModal';
import { toast } from 'react-toastify';
import Spinner from 'react-bootstrap/Spinner';
import 'react-toastify/dist/ReactToastify.css';

const SettingUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    setting_name: '',
    setting_value: '',
  });

  const [showNoChangesModal, setShowNoChangesModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateValues, setUpdateValues] = useState({});

  useEffect(() => {
    const fetchSettingDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}settings/settingbyid/${id}`,
          {
            headers: {
              'x-access-token': token
            }
          }
        );
        
        if (response.data && response.data.length > 0) {
          const setting = response.data[0];
          setFormValues({
            setting_name: setting.setting_name,
            setting_value: setting.setting_value,
          });
        }
      } catch (error) {
        console.error('Error fetching setting details:', error);
        toast.error('Failed to fetch setting details');
      }
    };

    fetchSettingDetails();
  }, [id]);

  const handleFormSubmit = (values) => {
    const isUnchanged = Object.keys(formValues).every(
      (key) => formValues[key] === values[key]
    );
    
    if (isUnchanged) {
      setShowNoChangesModal(true);
    } else {
      setShowUpdateModal(true);
      setUpdateValues(values);
    }
  };

  const confirmUpdate = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('jwttoken');
      await axios.put(
        `${process.env.REACT_APP_API_URL}settings/updatesetting/${id}`,
        updateValues,
        {
          headers: {
            'x-access-token': token
          }
        }
      );
      setShowUpdateModal(false);
      toast.success('Setting Updated Successfully');
      navigate('/settingslist');
    } catch (error) {
      console.error('Error updating setting:', error);
      toast.error('Failed to update setting');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      
      <div className="container mt-5">
        <div className="card shadow-sm border-0">
          <div className="card-header bg-success text-white text-center">
            <h4 className="mb-0">Update Setting</h4>
          </div>
          <div className="card-body p-4">
            <Formik
              enableReinitialize={true}
              initialValues={formValues}
              onSubmit={(values) => handleFormSubmit(values)}
            >
              <Form>
                <div className="mb-3 row">
                  <label className="col-md-4 col-form-label text-end fw-semibold text-success">
                    Setting ID:
                  </label>
                  <div className="col-md-6">
                    <Field
                      name="setting_id"
                      type="text"
                      className="form-control"
                      value={id}
                      readOnly
                    />
                  </div>
                </div>

                <div className="mb-3 row">
                  <label className="col-md-4 col-form-label text-end fw-semibold text-success">
                    Setting Name:
                  </label>
                  <div className="col-md-6">
                    <Field
                      name="setting_name"
                      type="text"
                      className="form-control"
                      required
                    />
                  </div>
                </div>

                <div className="mb-4 row">
                  <label className="col-md-4 col-form-label text-end fw-semibold text-success">
                    Setting Value:
                  </label>
                  <div className="col-md-6">
                    <Field
                      name="setting_value"
                      type="text"
                      className="form-control"
                      required
                    />
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
                      'Submit'
                    )}
                  </button>
                  <Link to="/settingslist" className="btn btn-outline-danger px-4">
                    Back
                  </Link>
                </div>
              </Form>
            </Formik>
          </div>
        </div>
      </div>

      <ConfirmationModal
        show={showNoChangesModal}
        modalMessage="No changes were made. Nothing to update."
        onHide={() => setShowNoChangesModal(false)}
        wantToAddData={false}
      />

      <ConfirmationModal
        show={showUpdateModal}
        modalMessage="Do you really want to update this setting?"
        onHide={() => setShowUpdateModal(false)}
        confirmation={confirmUpdate}
        operationType="Update"
        wantToAddData={true}
      />
    </>
  );
};

export default SettingUpdate;
