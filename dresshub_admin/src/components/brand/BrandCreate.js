import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Formik, Field, Form } from 'formik';
import Spinner from 'react-bootstrap/Spinner';
import 'react-toastify/dist/ReactToastify.css';

const BrandCreate = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [vendorIds, setVendorIds] = useState([]);

  const initialFormValues = {
    brand_name: '',
    brand_image: '',
    vendor_id: '',
  };

  const handleSubmit = async (values) => {
    setLoading(true);

    const formData = new FormData();
    formData.append('brand_name', values.brand_name);
    formData.append('vendor_id', values.vendor_id);
    formData.append('brand_image', values.brand_image);
    const token = localStorage.getItem('jwttoken'); 
    try {
       const token = localStorage.getItem("jwttoken");
      await axios.post(`${process.env.REACT_APP_API_URL}brand/addbrand`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
           'x-access-token': token
        }
      });
      toast.success('Brand Added Successfully');
      navigate('/brandlist');
    } catch (error) {
      console.error('Error adding brand:', error);
      toast.error('Failed to add brand');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchVendorIds = async () => {
      try {
        const token = localStorage.getItem('jwttoken');
        const response = await axios.get(`${process.env.REACT_APP_API_URL}vendor/allvendors`, {
          headers: {
            'x-access-token': token
          }
        });
        const allVendorIds = response.data.map((vendor) => vendor.vendor_id);
        setVendorIds(allVendorIds);
      } catch (error) {
        console.log(error);
      }
    };

    fetchVendorIds();
  }, []);

  return (
    <>
      
      <div className="container mt-5">
        <div className="card shadow-sm border-0">
          <div className="card-header bg-success text-white text-center">
            <h4 className="mb-0">Add New Brand</h4>
          </div>
          <div className="card-body p-4">
            <Formik
              initialValues={initialFormValues}
              onSubmit={(values) => handleSubmit(values)}
            >
              {({ setFieldValue }) => (
                <Form>
                  <div className="row mb-3 align-items-center">
                    <label className="col-md-4 col-form-label text-end fw-semibold text-success">
                      Brand Name:
                    </label>
                    <div className="col-md-6">
                      <Field
                        type="text"
                        name="brand_name"
                        className="form-control"
                        placeholder="Enter brand name"
                        required
                      />
                    </div>
                  </div>

                  <div className="row mb-3 align-items-center">
                    <label className="col-md-4 col-form-label text-end fw-semibold text-success">
                      Vendor ID:
                    </label>
                    <div className="col-md-6">
                      {/* This was changed and made so that it will not be required */}
                      <Field as="select" name="vendor_id" className="form-select">
                        <option value="">Select a Vendor</option>
                        {vendorIds.map((vendor) => (
                          <option key={vendor} value={vendor}>
                            {vendor}
                          </option>
                        ))}
                      </Field>
                    </div>
                  </div>

                  <div className="row mb-4 align-items-center">
                    <label className="col-md-4 col-form-label text-end fw-semibold text-success">
                      Brand Image:
                    </label>
                    <div className="col-md-6">
                      <input
                        type="file"
                        name="brand_image"
                        className="form-control"
                        accept="image/*"
                        onChange={(event) =>
                          setFieldValue('brand_image', event.currentTarget.files[0])
                        }
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
                        'Add Brand'
                      )}
                    </button>
                    <Link to="/brandlist" className="btn btn-outline-danger">
                      Cancel
                    </Link>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </>
  );
};

export default BrandCreate;
