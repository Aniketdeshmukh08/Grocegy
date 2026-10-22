import React, { useState, useEffect } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Spinner from 'react-bootstrap/Spinner';

const PincodeEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [pincodeData, setPincodeData] = useState(null);
    const token = localStorage.getItem('jwttoken');

    useEffect(() => {
        const fetchPincodeDetails = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}pincodes/getById/${id}`, {
                    headers: {
                        'x-access-token': token
                    }
                });
                setPincodeData(res.data);
            } catch (err) {
                console.error('Error fetching pincode:', err);
                toast.error('Failed to load pincode details.');
                navigate('/pincodes');
            } finally {
                setInitialLoading(false);
            }
        };
        fetchPincodeDetails();
    }, [id, navigate, token]);

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
            await axios.put(
                `${process.env.REACT_APP_API_URL}pincodes/update/${id}`,
                values,
                {
                    headers: {
                        'x-access-token': token,
                    },
                }
            );

            toast.success('Pincode updated successfully!');
            setTimeout(() => {
                setLoading(false);
                navigate('/pincodes');
            }, 1000);
        } catch (error) {
            console.error(error);
            const errorMsg = error.response?.data?.message || 'Error updating pincode!';
            toast.error(errorMsg);
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <div className="container mt-5 text-center">
                <Spinner animation="border" variant="success" />
                <p className="mt-2 text-success">Loading Pincode Data...</p>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <div className="card shadow-sm border-0">
                <div className="card-header bg-success text-white text-center">
                    <h4 className="mb-0">Edit Pincode</h4>
                </div>
                <div className="card-body p-4">
                    <Formik
                        initialValues={pincodeData || {}}
                        enableReinitialize={true}
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
                                        <Field name="pincode" type="text" className="form-control" disabled />
                                        <small className="text-muted">Pincode digits normally cannot be changed. Delete and recreate if needed.</small>
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
                                        <Field name="country" type="text" className="form-control" placeholder="Enter country" />
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
                                        ) : 'Update Pincode'}
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

export default PincodeEdit;
