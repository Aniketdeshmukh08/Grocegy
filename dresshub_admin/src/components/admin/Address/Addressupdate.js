import React, { useState, useEffect } from 'react';
import { Formik, Field, Form } from 'formik';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { ConfirmationModal } from '../../shared/ConfirmationModal';
import { toast } from 'react-toastify';

const AddressUpdate = () => {
  const { addressid } = useParams();
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
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
  });

  const [modalShow,setModalShow] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [formValuesChanged ,setFormValuesChanged] = useState(false)

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}address/addressById/${addressid}`)
      .then(res => {
        console.log(res);
        let obj = {
          name: res.data[0].name,
          line1: res.data[0].line1,
          line2: res.data[0].line2,
          line3: res.data[0].line3,
          city: res.data[0].city,
          state: res.data[0].state,
          country: res.data[0].country,
          pin: res.data[0].pin,
          contact: res.data[0].contact,
          alternatecontact: res.data[0].alternatecontact,
          landmark: res.data[0].landmark,
        };
        setFormValues(obj);
        console.log(res.data);
      })
      .catch(err => console.log(err));
  }, [addressid]);

  const updateAddress =  values => {
    try {
      const isUnchanged = Object.keys(formValues).every(
        key => formValues[key] === values[key]
      );
      if (isUnchanged) {
        setModalMessage('No changes were made. Nothing to update.');
      }
      else{
        setModalMessage('You really want to Update the Address.');
        setFormValuesChanged(true)
        setFormValues(values);
      }
      setModalShow(true);
    } catch (err) {
      console.log(err);
    }
  };

  const confirmUpdateAddress = async()=>{
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}address/updateAddress/${addressid}`,
        formValues
      );
      navigate('/addressdetails');
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    console.log('formValues', formValues);
  }, [formValues]);

  return (
    <>
      <div className="container mt-5">
        <div className="card shadow-sm border-0">
          <div className="card-header bg-success text-white text-center">
            <h4 className="mb-0">Update Address</h4>
          </div>
          <div className='card-body p-4'>
            <Formik
              enableReinitialize={true}
              initialValues={formValues}
              onSubmit={values => updateAddress(values)}
              >
              <Form className='examAddForm'>
                <div className='row mb-2'>
                  <label className='col-md-4 col-form-label text-end fw-semibold text-success'>Name:-</label>
                  <Field name='name' type='text' className='col-6' required />
                </div>
                <div className='row mb-2'>
                  <label className='col-md-4 col-form-label text-end fw-semibold text-success'>Line1:-</label>
                  <Field name='line1' type='text' className='col-6' required />
                </div>
                <div className='row mb-2'>
                  <label className='col-md-4 col-form-label text-end fw-semibold text-success'>Line2:-</label>
                  <Field name='line2' type='text' className='col-6' required />
                </div>
                <div className='row mb-2'>
                  <label className='col-md-4 col-form-label text-end fw-semibold text-success'>Line3:-</label>
                  <Field name='line3' type='text' className='col-6' required />
                </div>
                <div className='row mb-2'>
                  <label className='col-md-4 col-form-label text-end fw-semibold text-success'>City:-</label>
                  <Field name='city' type='text' className='col-6' required />
                </div>
                <div className='row mb-2'>
                  <label className='col-md-4 col-form-label text-end fw-semibold text-success'>State:-</label>
                  <Field name='state' type='text' className='col-6' required />
                </div>
                <div className='row mb-2'>
                  <label className='col-md-4 col-form-label text-end fw-semibold text-success'>Country:-</label>
                  <Field name='country' type='text' className='col-6' required />
                </div>
                <div className='row mb-2'>
                  <label className='col-md-4 col-form-label text-end fw-semibold text-success'>Pincode:-</label>
                  <Field name='pin' type='text' className='col-6' required />
                </div>
                <div className='row mb-2'>
                  <label className='col-md-4 col-form-label text-end fw-semibold text-success'>Contact:-</label>
                  <Field name='contact' type='text' className='col-6' required />
                </div>
                <div className='row mb-2'>
                  <label className='col-md-4 col-form-label text-end fw-semibold text-success'>AlternateContact:-</label>
                  <Field
                    name='alternatecontact'
                    type='text'
                    className='col-6'
                    required
                    />
                </div>
                <div className='row mb-2'>
                  <label className='col-md-4 col-form-label text-end fw-semibold text-success'>Landmark:-</label>
                  <Field name='landmark' type='text' className='col-6' required />
                </div>

                <div className='text-center'>
                  <button type='submit' className='btn btn-success me-3 px-4'>
                    Submit
                  </button>
                  &nbsp; &nbsp;
                  <Link to='/addressdetails' className='btn btn-outline-danger px-4'>
                    Back
                  </Link>
                </div>

                <br></br>
              </Form>
            </Formik>
          </div>
              </div>
            </div>
      <ConfirmationModal
        show={modalShow}
        modalMessage = {modalMessage}
        onHide={() => setModalShow(false)}
        confirmation ={confirmUpdateAddress}
        operationType = "Update"
        wantToAddData = {formValuesChanged}
        />
    </>
  );
};

export default AddressUpdate;
