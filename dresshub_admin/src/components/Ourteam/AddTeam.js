import { Formik, Field, Form } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { ConfirmationModal } from '../shared/ConfirmationModal';

const AddTeam = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState('');
  const [formData, setFormData] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const formValues = {
    name: '',
    designation: '',
    department: '',
    image: '',
    description: '',
    sequence: '',
  };

  const openModal = (values) => {
    setFormData(values);
    setShowModal(true);
  };

  const submitTeam = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('designation', formData.designation);
      formDataToSend.append('department', formData.department);
      formDataToSend.append('image', image);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('sequence', formData.sequence);

      const token = localStorage.getItem('jwttoken');

      await axios.post(
        `${process.env.REACT_APP_API_URL}ourTeam/addourteam`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'x-access-token': token,
          },
        }
      );

      toast.success('Team Member Added Successfully');
      setShowModal(false);
      navigate('/teamList');
    } catch (error) {
      console.error(error);
      toast.error('Failed to add team member');
      setShowModal(false);
    }
  };

  return (
    <>
      <div className="container mt-5">
        <div className="card shadow-sm border-0">
          <div className="card-header bg-success text-white text-center">
            <h4 className="mb-0">Add Team Member</h4>
          </div>

          <div className="card-body p-4">
            <Formik initialValues={formValues} onSubmit={openModal}>
              {() => (
                <Form>
                  {['name', 'designation', 'department', 'description', 'sequence'].map((field, idx) => (
                    <div className="row mb-3 align-items-center" key={idx}>
                      <label className="col-md-4 col-form-label text-end fw-semibold text-success">
                        {field.charAt(0).toUpperCase() + field.slice(1)}:
                      </label>

                      <div className="col-md-6">
                        <Field
                          type={field === 'sequence' ? 'number' : 'text'}
                          name={field}
                          className="form-control"
                          placeholder={`Enter ${field}`}
                          required
                        />
                      </div>
                    </div>
                  ))}

                  <div className="row mb-4 align-items-center">
                    <label className="col-md-4 col-form-label text-end fw-semibold text-success">
                      Image:
                    </label>

                    <div className="col-md-6">
                      <input
                        type="file"
                        name="image"
                        className="form-control"
                        accept="image/*"
                        onChange={(event) => setImage(event.currentTarget.files[0])}
                        required
                      />
                    </div>
                  </div>

                  <div className="text-center">
                    <button type="submit" className="btn btn-success px-4 me-3">
                      Submit
                    </button>

                    <Link to="/teamList" className="btn btn-outline-danger">
                      Cancel
                    </Link>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>

      {/*CONFIRMATION MODAL... */}
      <ConfirmationModal
        show={showModal}
        onHide={() => setShowModal(false)}
        confirmation={submitTeam}
        operationType="Add"
        modalMessage="Are you sure you want to add this team member?"
        wantToAddData={true}
      />
    </>
  );
};

export default AddTeam;