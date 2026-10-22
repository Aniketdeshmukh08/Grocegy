import React, { FC, useEffect, useState } from 'react';
import axios from 'axios';
import { Formik, Field, Form } from 'formik';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {  toast } from 'react-toastify';
import { ConfirmationModal } from '../shared/ConfirmationModal';

const _ = require('lodash');

const UserUpdate: FC = () => {
  const { id } = useParams();
  //console.log('user id - ', id)
  const userDataIntialState = {
    userid: id,
    name: '',
    mobile: '',
    password: '',
  };
  const [updateData, SetUpdateData] = useState(userDataIntialState);
  const [modalShow, setModalShow] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [formValuesChanged, setFormValuesChanged] = useState(false);
  const [formValues, setFormValues] = useState <any>(null);
  const navigate = useNavigate();

  const callUserUpdateApi = async (data: any) => {
    //console.log('data-----------', data)
    const url = process.env.REACT_APP_API_URL + 'users/updateusers';
    const response = await axios.put(url, data);
    //console.log(response);
  };

  const getUserbyIdApi = async (id: any) => {
    // Needs to be changed
    const url = process.env.REACT_APP_API_URL + 'users/searchuser/' + id;
    const response = await axios.get(url);
    // console.log(response);
    return response.data;
  };

  useEffect(() => {
    (async () => {
      // To be used when api provided
      let data = await getUserbyIdApi(id);
      SetUpdateData(data[0]);
      //console.log(data);
    })();
  }, [id]);

  const updateUser = (values: any) => {
    const isUnchanged = Object.keys(updateData).every(
      (key) => updateData[key as keyof typeof updateData] === values[key]
    );

    if (isUnchanged) {
      setModalMessage('No changes were made. Nothing to update.');
      setFormValuesChanged(false);
    } else {
      setModalMessage('Do you really want to update this user?');
      setFormValuesChanged(true);
      setFormValues(values);
    }
    setModalShow(true);
  };

  const confirmUpdateUser = async () => {
    if (formValues) {
      try {
        await callUserUpdateApi(formValues);
        setModalShow(false);
        toast.success('User updated successfully');
        setTimeout(() => {
          navigate('/userslist');
        }, 2000);
      } catch (error) {
        toast.error('Error updating user');
      }
    }
  };

  return (
    <>
      
      <div className="container mt-5">
        <div className="card shadow-sm border-0">
          <div className="card-header bg-success text-white text-center">
            <h4 className="mb-0">Update User Details</h4>
          </div>
          <div className="card-body p-4">
            <Formik
              enableReinitialize={true}
              initialValues={updateData}
              onSubmit={updateUser}
            >
              <Form>
                <div className="mb-3 row">
                  <label className="col-md-4 col-form-label text-end fw-semibold text-success">
                    User ID:
                  </label>
                  <div className="col-md-6">
                    <Field
                      name="userid"
                      type="text"
                      className="form-control"
                      readOnly
                    />
                  </div>
                </div>

                <div className="mb-3 row">
                  <label className="col-md-4 col-form-label text-end fw-semibold text-success">
                    Name:
                  </label>
                  <div className="col-md-6">
                    <Field
                      name="name"
                      type="text"
                      className="form-control"
                      required
                    />
                  </div>
                </div>

                <div className="mb-3 row">
                  <label className="col-md-4 col-form-label text-end fw-semibold text-success">
                    Mobile:
                  </label>
                  <div className="col-md-6">
                    <Field
                      name="mobile"
                      type="text"
                      className="form-control"
                      required
                    />
                  </div>
                </div>

                <div className="mb-4 row">
                  <label className="col-md-4 col-form-label text-end fw-semibold text-success">
                    Password:
                  </label>
                  <div className="col-md-6">
                    <Field
                      name="password"
                      type="password"
                      className="form-control"
                      required
                    />
                  </div>
                </div>

                <div className="text-center">
                  <button type="submit" className="btn btn-success me-3 px-4">
                    Submit
                  </button>
                  <Link to="/userslist" className="btn btn-outline-danger px-4">
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
        confirmation={confirmUpdateUser}
        operationType="Update"
        wantToAddData={formValuesChanged}
      />
    </>
  );
};

export default UserUpdate;