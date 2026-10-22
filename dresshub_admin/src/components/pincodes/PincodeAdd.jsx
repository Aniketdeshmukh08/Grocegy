import React, { useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Spinner from 'react-bootstrap/Spinner';

const PincodeAdd = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem('jwttoken');

    const initialValues = {
        pincode: '',
        area_name: '',
        city: '',
        district: '',
        state: '',
        country: 'India',
        latitude: '',
        longitude: '',
        is_active: 1
    };

    const validate = (values) => {
        const errors = {};
        if (!values.pincode) errors.pincode = 'Required';
        else if (!/^\d{6}$/.test(values.pincode)) errors.pincode = 'Must be exactly 6 digits';

        if (!values.city) errors.city = 'Required';
        if (!values.state) errors.state = 'Required';
        return errors;
    };

    const submitPincode = async (values) => {
        setLoading(true);
        try {
            await axios.post(
                `${process.env.REACT_APP_API_URL}pincodes/add`,
                values,
                {
                    headers: {
                        'x-access-token': token,
                    },
                }
            );

            toast.success('Pincode added successfully!');
            setTimeout(() => {
                setLoading(false);
                navigate('/pincodes');
            }, 1000);
        } catch (error) {
            console.error(error);
            const errorMsg = error.response?.data?.message || 'Error adding pincode!';
            toast.error(errorMsg);
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <div className="card shadow-sm border-0">
                <div className="card-header bg-success text-white text-center">
                    <h4 className="mb-0">Add New Pincode</h4>
                </div>
                <div className="card-body p-4">
                    <Formik
                        initialValues={initialValues}
                        validate={validate}
                        onSubmit={(values) => submitPincode(values)}
                    >
                        {({ values, handleChange }) => (
                            <Form>
                                <div className="row mb-3 align-items-center">
                                    <label className="col-md-4 col-form-label text-end fw-semibold text-success">
                                        Pincode <span className="text-danger">*</span>:
                                    </label>
                                    <div className="col-md-6">
                                        <Field name="pincode" type="text" className="form-control" placeholder="Enter 6-digit pincode" />
                                        <ErrorMessage name="pincode" component="div" className="text-danger small mt-1" />
                                    </div>
                                </div>

                                <div className="row mb-3 align-items-center">
                                    <label className="col-md-4 col-form-label text-end fw-semibold text-success">
                                        Area Name:
                                    </label>
                                    <div className="col-md-6">
                                        <Field name="area_name" type="text" className="form-control" placeholder="e.g., Downtown" />
                                    </div>
                                </div>

                                <div className="row mb-3 align-items-center">
                                    <label className="col-md-4 col-form-label text-end fw-semibold text-success">
                                        City <span className="text-danger">*</span>:
                                    </label>
                                    <div className="col-md-6">
                                        <Field name="city" type="text" className="form-control" placeholder="Enter city" />
                                        <ErrorMessage name="city" component="div" className="text-danger small mt-1" />
                                    </div>
                                </div>

                                <div className="row mb-3 align-items-center">
                                    <label className="col-md-4 col-form-label text-end fw-semibold text-success">
                                        District:
                                    </label>
                                    <div className="col-md-6">
                                        <Field name="district" type="text" className="form-control" placeholder="Enter district" />
                                    </div>
                                </div>

                                <div className="row mb-3 align-items-center">
                                    <label className="col-md-4 col-form-label text-end fw-semibold text-success">
                                        State <span className="text-danger">*</span>:
                                    </label>
                                    <div className="col-md-6">
                                        <Field name="state" type="text" className="form-control" placeholder="Enter state" />
                                        <ErrorMessage name="state" component="div" className="text-danger small mt-1" />
                                    </div>
                                </div>

                                <div className="row mb-3 align-items-center">
                                    <label className="col-md-4 col-form-label text-end fw-semibold text-success">
                                        Country:
                                    </label>
                                    <div className="col-md-6">
                                        <Field name="country" type="text" className="form-control" placeholder="Enter country (default: India)" />
                                    </div>
                                </div>

                                <div className="row mb-3 align-items-center">
                                    <label className="col-md-4 col-form-label text-end fw-semibold text-success">
                                        Is Active:
                                    </label>
                                    <div className="col-md-6">
                                        <select
                                            name="is_active"
                                            value={values.is_active}
                                            onChange={handleChange}
                                            className="form-select"
                                        >
                                            <option value={1}>Yes (Active)</option>
                                            <option value={0}>No (Inactive)</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="text-center mt-4">
                                    <button type="submit" className="btn btn-success px-4 me-3" disabled={loading}>
                                        {loading ? (
                                            <>
                                                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />{' '}
                                                Saving...
                                            </>
                                        ) : 'Save Pincode'}
                                    </button>
                                    <Link to="/pincodes" className="btn btn-outline-danger">
                                        Cancel
                                    </Link>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
};

export default PincodeAdd;
