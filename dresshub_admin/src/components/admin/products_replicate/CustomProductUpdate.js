import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Formik, Field, Form } from 'formik';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {  toast } from 'react-toastify';
import _ from 'lodash';
import { ConfirmationModal } from '../../shared/ConfirmationModal';

const CustomProductUpdate = () => {
  const { requestid } = useParams();
  const [updateData, setUpdateData] = useState({
    requestid: requestid,
    name: '',
    contact: '',
    userid: '',
    product_name: '',
    product_desc: '',
    quantity: '',
  });
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [isNoChangesModalOpen, setIsNoChangesModalOpen] = useState(false);
  const navigate = useNavigate();

  // Fetch data for the given `requestid`
  const getProductbyIdApi = async () => {
    const token = localStorage.getItem('jwttoken');
    const url = `${process.env.REACT_APP_API_URL}customProduct/getbyproductid/${requestid}`;
    const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          'x-access-token': token
        }
      });
    setUpdateData(response.data[0]); // Assuming response.data is an array
  };

  useEffect(() => {
    getProductbyIdApi();
  }, [requestid]);

  // Submit the form
    const handleFormSubmit = (values) => {
    if (_.isEqual(updateData, values)) {
      setIsNoChangesModalOpen(true);
      return;
    }
    setUpdateData(values);
    setIsConfirmationModalOpen(true);
  };

  const confirmUpdateProduct = async () => {
    try {
      const token = localStorage.getItem('jwttoken');
      const url = `${process.env.REACT_APP_API_URL}customProduct/updateProduct/${requestid}`;
      await axios.put(url, updateData, {
        headers: {
          "Content-Type": "application/json",
          'x-access-token': token
        }
      });
      toast.success('Product updated successfully!');
      setIsConfirmationModalOpen(false);
      setTimeout(() => navigate('/customproductlist'), 2000);
    } catch (error) {
      console.error("Update failed:", error);
      toast.error('Failed to update product');
    }
  };
  
  // Close modals
  const closeModals = () => {
    setIsConfirmationModalOpen(false);
    setIsNoChangesModalOpen(false);
  };

  return (
    <div className="container mt-5">
      
      <div className="card shadow-sm border-0">
        <div className="card-header bg-success text-white text-center">
          <h4 className="mb-0">Update Product Details</h4>
        </div>
        <div className="card-body p-4">
          <Formik
            enableReinitialize={true}
            initialValues={updateData}
            onSubmit={handleFormSubmit}
          >
            <Form>
              <div className="mb-3 row">
                <label className="col-md-4 col-form-label text-end fw-semibold text-success">
                  Name:
                </label>
                <div className="col-md-6">
                  <Field name="name" type="text" className="form-control" />
                </div>
              </div>

              <div className="mb-3 row">
                <label className="col-md-4 col-form-label text-end fw-semibold text-success">
                  Contact:
                </label>
                <div className="col-md-6">
                  <Field name="contact" type="text" className="form-control" />
                </div>
              </div>

              <div className="mb-3 row">
                <label className="col-md-4 col-form-label text-end fw-semibold text-success">
                  Product Name:
                </label>
                <div className="col-md-6">
                  <Field name="product_name" type="text" className="form-control" />
                </div>
              </div>

              <div className="mb-3 row">
                <label className="col-md-4 col-form-label text-end fw-semibold text-success">
                  Product Description:
                </label>
                <div className="col-md-6">
                  <Field name="product_desc" type="text" className="form-control" />
                </div>
              </div>

              <div className="mb-4 row">
                <label className="col-md-4 col-form-label text-end fw-semibold text-success">
                  Quantity:
                </label>
                <div className="col-md-6">
                  <Field name="quantity" type="text" className="form-control" />
                </div>
              </div>

              <div className="text-center">
                <button type="submit" className="btn btn-success me-3 px-4">
                  Submit
                </button>
                <Link to="/customproductlist" className="btn btn-outline-danger px-4">
                  Back
                </Link>
              </div>
            </Form>
          </Formik>
        </div>
      </div>

      <ConfirmationModal
        show={isConfirmationModalOpen}
        modalMessage="Do you really want to update this product?"
        onHide={closeModals}
        confirmation={confirmUpdateProduct}
        operationType="Update"
        wantToAddData={true}
      />

      {isNoChangesModalOpen && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body">
                <p>No changes have been made to the product details.</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModals}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomProductUpdate;
