import React, { FC, useEffect, useState } from 'react';
import axios from 'axios';
import { Formik, Field, Form } from 'formik';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ConfirmationModal } from '../shared/ConfirmationModal';
import { toast } from 'react-toastify';
import Spinner from 'react-bootstrap/Spinner';
import 'react-toastify/dist/ReactToastify.css';

const _ = require('lodash');

const VendorUpdate: FC = () => {
  const { vendorid } = useParams();
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    vendor_id: vendorid,
    vendor_name: '',
    vendor_description: ''
  });

  const [modalShow, setModalShow] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [formValuesChanged, setFormValuesChanged] = useState(false); 
  const navigate = useNavigate();

  const callVendorUpdateApi = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('jwttoken');
      await axios.put(
        `${process.env.REACT_APP_API_URL}vendor/updatevendor/${vendorid}`, 
        formValues,
        {
          headers: {
            'x-access-token': token || ''
          }
        }
      );
      setModalShow(false);
      toast.success('Vendor Updated Successfully');
      navigate('/vendorDetails');
    } catch (error) {
      console.error('Error updating vendor:', error);
      toast.error('Failed to update vendor');
    } finally {
      setLoading(false);
    }
  };

  const getVendorbyIdApi = async (vendorid: string) => {
    try {
      const token = localStorage.getItem('jwttoken');
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}vendor/vendorbyid/${vendorid}`,
        {
          headers: {
            'x-access-token': token || ''
          }
        }
      );
      const data = response.data[0];
      setFormValues({
        vendor_id: data.vendor_id,
        vendor_name: data.vendor_name,
        vendor_description: data.vendor_description,
      });
    } catch (error) {
      console.error('Error fetching vendor details:', error);
      toast.error('Failed to fetch vendor details');
    }
  };

  useEffect(() => {
    if (vendorid) {
      getVendorbyIdApi(vendorid);
    }
  }, [vendorid]);

  const updateVendor = (values: any) => {
    const isUnchanged = _.isEqual(values, formValues); // Check if the form values have changed

    if (isUnchanged) {
      setModalMessage('No changes were made. Nothing to update.');
      setFormValuesChanged(false);
    } else {
      setModalMessage('Do you really want to update this vendor?');
      setFormValuesChanged(true); // Set that form values have changed
      setFormValues(values); // Update the state with the new form values
    }

    setModalShow(true); // Show the confirmation modal
  };

  return (
    <>
     
      <div className="container mt-5">
        <div className="card shadow-sm border-0">
          <div className="card-header bg-success text-white text-center">
            <h4 className="mb-0">Update Vendor</h4>
          </div>
          <div className="card-body p-4">
            <Formik
              enableReinitialize={true}
              initialValues={formValues}
              onSubmit={(values) => updateVendor(values)}
            >
              <Form>
                <div className="mb-3 row">
                  <label className="col-md-4 col-form-label text-end fw-semibold text-success">
                    Vendor ID:
                  </label>
                  <div className="col-md-6">
                    <Field
                      name="vendor_id"
                      type="text"
                      className="form-control"
                      readOnly
                    />
                  </div>
                </div>

                <div className="mb-3 row">
                  <label className="col-md-4 col-form-label text-end fw-semibold text-success">
                    Vendor Name:
                  </label>
                  <div className="col-md-6">
                    <Field
                      name="vendor_name"
                      type="text"
                      className="form-control"
                      required
                    />
                  </div>
                </div>

                <div className="mb-4 row">
                  <label className="col-md-4 col-form-label text-end fw-semibold text-success">
                    Vendor Description:
                  </label>
                  <div className="col-md-6">
                    <Field
                      name="vendor_description"
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
                  <Link to="/vendorDetails" className="btn btn-outline-danger px-4">
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
        confirmation={callVendorUpdateApi}
        operationType="Update"
        wantToAddData={formValuesChanged}
      />
    </>
  );
};

export default VendorUpdate;
