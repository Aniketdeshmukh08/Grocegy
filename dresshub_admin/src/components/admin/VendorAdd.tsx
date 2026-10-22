import React, { FC, useState } from 'react';
import axios from 'axios';
import { Formik, Field, Form } from 'formik';
import { useNavigate, Link } from 'react-router-dom';
import { ConfirmationModal } from '../shared/ConfirmationModal';
import { toast } from 'react-toastify';
import Spinner from 'react-bootstrap/Spinner';
import 'react-toastify/dist/ReactToastify.css';

const VendorAdd: FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [formValue, setFormValue] = useState([{}]);

  const initialFormValues = {
    vendor_name: '',
    vendor_description: ''
  };

  const submitVendor = (values: any) => {
    setFormValue(values);
    setModalShow(true);
  };

  const confirmSubmittedVendor = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('jwttoken');
      await axios.post(
        `${process.env.REACT_APP_API_URL}vendor/addvendor`,
        formValue,
        {
          headers: {
            'x-access-token': token || ''
          }
        }
      );
      setModalShow(false);
      toast.success('Vendor Added Successfully');
      navigate('/vendordetails');
    } catch (error) {
      console.error('Error adding vendor:', error);
      toast.error('Failed to add vendor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      
      <div className="container mt-5">
        <div className="card shadow-sm border-0">
          <div className="card-header bg-success text-white text-center">
            <h4 className="mb-0">Add New Vendor</h4>
          </div>
          <div className="card-body p-4">
            <Formik
              initialValues={initialFormValues}
              onSubmit={(values) => submitVendor(values)}
            >
              <Form>
                <div className="row mb-3 align-items-center">
                  <label className="col-md-4 col-form-label text-end fw-semibold text-success">
                    Vendor Name:
                  </label>
                  <div className="col-md-6">
                    <Field
                      name="vendor_name"
                      type="text"
                      className="form-control"
                      placeholder="Enter vendor name"
                      required
                    />
                  </div>
                </div>

                <div className="row mb-4 align-items-center">
                  <label className="col-md-4 col-form-label text-end fw-semibold text-success">
                    Vendor Description:
                  </label>
                  <div className="col-md-6">
                    <Field
                      name="vendor_description"
                      className="form-control"
                      type="text"
                      placeholder="Enter vendor description"
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
                      'Add Vendor'
                    )}
                  </button>
                  <Link to="/vendordetails" className="btn btn-outline-danger">
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
        modalMessage="Do you really want to add this vendor?"
        onHide={() => setModalShow(false)}
        confirmation={confirmSubmittedVendor}
        operationType="Add"
        wantToAddData={true}
      />
    </>
  );
};

export default VendorAdd;
