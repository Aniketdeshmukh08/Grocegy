import React, { useState, useEffect } from 'react';
import { Formik, Field, Form } from 'formik';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { ConfirmationModal } from '../shared/ConfirmationModal';
import { toast } from 'react-toastify';
import axiosInstance from '../../utils/axiosInstance';

const UpdateTeam = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    name: '',
    designation: '',
    department: '',
    image: '',
    description: '',
    sequence: '',
  });

  const [image, setImage] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [formValuesChanged, setFormValuesChanged] = useState(false);
  const [updatedFormData, setUpdatedFormData] = useState(null);

  useEffect(() => {
    axiosInstance(`ourteam/ourteambyid/${id}`)
      .then(res => {      
        const data = res.data[0];
        setFormValues({
          name: data.name,
          designation: data.designation,
          department: data.department,
          image: data.image,
          description: data.description,
          sequence: data.sequence,
        });
      })
      .catch(err => console.log(err));
  }, [id]);

  const handleFileChange = (event) => {
    setImage(event.target.files[0]);
  };

  const openConfirmationModal = (values) => {
    const isUnchanged = Object.keys(formValues).every(
      (key) => formValues[key] === values[key]
    ) && !image;

    if (isUnchanged) {
      setModalMessage('No changes were made. Nothing to update.');
    } else {
      setModalMessage('Do you really want to update this team member?');
      setFormValuesChanged(true);
      setUpdatedFormData(values);
    }
    setModalShow(true);
  };

  const closeModal = () => setModalShow(false);

  const submitUpdate = async () => {
    if (!formValuesChanged) {
      navigate('/teamlist');
    } else {
      try {
        const formDataToSend = new FormData();
        Object.keys(updatedFormData).forEach((key) => {
          formDataToSend.append(key, updatedFormData[key]);
        });

        if (image) {
          formDataToSend.append('image', image);
        }
        const token = localStorage.getItem('jwttoken');
        await axios.put(
          `${process.env.REACT_APP_API_URL}ourteam/updateourteam/${id}`,
          formDataToSend,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              'x-access-token': token
            },
          }
        );
        toast.success('Team Member Updated Successfully');
        navigate('/teamlist');
      } catch (err) {
        console.log(err);
        toast.error('Failed to update team member');
      } finally {
        closeModal();
      }
    }
  };

  return (
    <>
      <div className="container mt-5">
        <div className="card shadow-sm border-0">
          <div className="card-header bg-success text-white text-center">
            <h4 className="mb-0">Update Team Member</h4>
          </div>
          <div className="card-body p-4">
            <Formik
              enableReinitialize={true}
              initialValues={formValues}
              onSubmit={values => openConfirmationModal(values)}
            >
              <Form>
                <div className='mb-3 row'>
                  <label className='col-md-4 col-form-label text-end fw-semibold text-success'>Name:</label>
                  <div className='col-md-6'>
                    <Field name='name' type='text' className='form-control' />
                  </div>
                </div>

                <div className='mb-3 row'>
                  <label className='col-md-4 col-form-label text-end fw-semibold text-success'>Designation:</label>
                  <div className='col-md-6'>
                    <Field name='designation' type='text' className='form-control' />
                  </div>
                </div>

                <div className='mb-3 row'>
                  <label className='col-md-4 col-form-label text-end fw-semibold text-success'>Department:</label>
                  <div className='col-md-6'>
                    <Field name='department' type='text' className='form-control' />
                  </div>
                </div>

                <div className='mb-3 row'>
                  <label className='col-md-4 col-form-label text-end fw-semibold text-success'>Current Image:</label>
                  <div className='col-md-6'>
                    <img
                      src={`${process.env.REACT_APP_API_URL}${formValues.image}`}
                      alt={formValues.name}
                      className='img-fluid'
                      style={{ height: '200px', width: '200px' }}
                    />
                  </div>
                </div>

                <div className='mb-3 row'>
                  <label className='col-md-4 col-form-label text-end fw-semibold text-success'>New Image:</label>
                  <div className='col-md-6'>
                    <input
                      name='image'
                      type='file'
                      className='form-control'
                      onChange={handleFileChange}
                    />
                  </div>
                </div>

                <div className='mb-3 row'>
                  <label className='col-md-4 col-form-label text-end fw-semibold text-success'>Description:</label>
                  <div className='col-md-6'>
                    <Field name='description' type='text' className='form-control' />
                  </div>
                </div>

                <div className='mb-4 row'>
                  <label className='col-md-4 col-form-label text-end fw-semibold text-success'>Sequence:</label>
                  <div className='col-md-6'>
                    <Field name='sequence' type='number' className='form-control' />
                  </div>
                </div>

                <div className="text-center">
                  <button type='submit' className='btn btn-success me-3 px-4'>Submit</button>
                  <Link to='/teamlist' className='btn btn-outline-danger px-4'>Back</Link>
                </div>
              </Form>
            </Formik>
          </div>
        </div>
      </div>

      
      {/*CONFIRMATION MODAL... */}
      <ConfirmationModal
        show={modalShow}
        onHide={closeModal}
        modalMessage={modalMessage}
        confirmation={submitUpdate}
        wantToAddData={true}
        operationType="Update"
      />
    </>
  );
};

export default UpdateTeam;
