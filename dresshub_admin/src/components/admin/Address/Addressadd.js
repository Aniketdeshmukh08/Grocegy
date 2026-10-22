import React, { useState } from 'react';
import { Formik, Field, Form } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ConfirmationModal } from '../../shared/ConfirmationModal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Addressadd = () => {
  const navigate = useNavigate();
  const formValues = {
    userid: '',
    name: '',
    line1: '',
    line2: '',
    line3: '',
    city: '',
    state: '',
    country: '',
    pin: '',
    contact: '',
    alternatecontact: '',
    landmark: '',
  };
  const [modalShow, setModalShow] = useState(false);
  const [formValue, setFormValue] = useState([{}]);

  const confirmSubmittedAddress = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}address/addAddress`,
        formValue
      );
      navigate('/addressdetails');
    } catch (error) {
      console.log(error);
    }
  };

  const submitAddress = values => {
    setFormValue(values);
    setModalShow(true);
  };
  return (
    <>
      <ToastContainer position='top-right' autoClose={2500} />
      <div className='container mt-5'>
        <div className='card shadow-sm border-0'>
          <div className='card-header bg-success text-white text-center'>
            <h4 className='mb-0'>Add New Address</h4>
          </div>
          <div className='clard-body p-4'>
            <Formik
              initialValues={formValues}
              onSubmit={values => submitAddress(values)}
            >
              <Form>
                <div className='row mb-3 align-items-center'>
                  <label className='col-md-4 col-form-label text-end fw-semibold text-success'>
                    Userid:-
                  </label>
                  <Field 
                  name='userid' 
                  type='text' 
                  className='col-6' 
                  placeholder="User ID" 
                  required
                  />
                </div>
                <div className='row mb-3 align-items-center'>
                  <label className='col-md-4 col-form-label text-end fw-semibold text-success'>Name:-</label>
                  <Field 
                  name='name' 
                  type='text' 
                  className='col-6' 
                  placeholder="Name" 
                  required
                  />
                </div>
                <div className='row mb-3 align-items-center'>
                  <label className='col-md-4 col-form-label text-end fw-semibold text-success'>Line1:-</label>
                  <Field 
                  name='line1' 
                  type='text' 
                  className='col-6' 
                  placeholder="Line 1" 
                  required
                  />
                </div>
                <div className='row mb-3 align-items-center'>
                  <label className='col-md-4 col-form-label text-end fw-semibold text-success'>Line2:-</label>
                  <Field 
                  name='line2' 
                  type='text' 
                  className='col-6' 
                  placeholder="Line 2" 
                  required
                  />
                </div>
                <div className='row mb-3 align-items-center'>
                  <label className='col-md-4 col-form-label text-end fw-semibold text-success'>Line3:-</label>
                  <Field 
                  name='line3' 
                  type='text' 
                  className='col-6' 
                  placeholder="Line 3" 
                  required
                  />
                </div>
                <div className='row mb-3 align-items-center'>
                  <label className='col-md-4 col-form-label text-end fw-semibold text-success'>City:-</label>
                  <Field 
                  name='city' 
                  type='text' 
                  className='col-6' 
                  placeholder="City" 
                  required
                  />
                </div>
                <div className='row mb-3 align-items-center'>
                  <label className='col-md-4 col-form-label text-end fw-semibold text-success'>State:-</label>
                  <Field 
                  name='state' 
                  type='text' 
                  className='col-6' 
                  placeholder="State" 
                  required
                  />
                </div>
                <div className='row mb-3 align-items-center'>
                  <label className='col-md-4 col-form-label text-end fw-semibold text-success'>Country:-</label>
                  <Field
                    name='country'
                    type='text'
                    className='col-6'
                    placeholder='Country'
                    required
                  />
                </div>
                <div className='row mb-3 align-items-center'>
                  <label className='col-md-4 col-form-label text-end fw-semibold text-success'>Pincode:-</label>
                  <Field 
                  name='pin' t
                  ype='text' 
                  className='col-6' 
                  placeholder='Pincode'
                  required 
                  />
                </div>
                <div className='row mb-3 align-items-center'>
                  <label className='col-md-4 col-form-label text-end fw-semibold text-success'>Contact:-</label>
                  <Field
                    name='contact'
                    type='text'
                    className='col-6'
                    placeholder='Contact Number'
                    required
                  />
                </div>
                <div className='row mb-3 align-items-center'>
                  <label className='col-md-4 col-form-label text-end fw-semibold text-success'>
                    AlternateContact:-
                  </label>
                  <Field
                    name='alternatecontact'
                    type='text'
                    className='col-6'
                    placeholder='Alternate Contact Number'
                    required
                  />
                </div>
                <div className='row mb-3 align-items-center'>
                  <label className='col-md-4 col-form-label text-end fw-semibold text-success'>Landmark:-</label>
                  <Field
                    name='landmark'
                    type='text'
                    className='col-6'
                    placeholder='Landmark'
                    required
                  />
                </div>
                <div className='text-center'>
                  <button type='submit' className='btn btn-success px-4 me-3'>
                    Submit
                  </button>
                  &nbsp; &nbsp;
                  <Link to='/addressdetails' className='btn btn-outline-danger'>
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
        modalMessage='You Want to Add the New Address'
        onHide={() => setModalShow(false)}
        confirmation={confirmSubmittedAddress}
        operationType='Add'
        wantToAddData={true}
      />
    </>
  );
};

export default Addressadd;
