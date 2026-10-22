import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Formik, Field, Form } from 'formik';
import { ConfirmationModal } from '../../shared/ConfirmationModal';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Spinner } from 'react-bootstrap';

const Subcategoryedit = () => {
  const { subcategoryid } = useParams();
  const [formValues, setFormValues] = useState({
    subcategoryname: '',
    subcategory_id: '',
    sequence: '',
    subcategoryimage: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imageName, setImageName] = useState('');
  const [modalShow, setModalShow] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [formValuesChanged, setFormValuesChanged] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchSubcategoryById = async subcategoryid => {
    try {
      const url =
        process.env.REACT_APP_API_URL +
        'subCategory/subCategoryById/' +
        subcategoryid;
      const response = await axios.get(url);
      console.log('fetchSubcategoryById', response.data);
      const subcategoryData = response.data[0];
      setFormValues({
        subcategoryname: subcategoryData.subcategoryname,
        subcategory_id: subcategoryData.subcategory_id,
        sequence: subcategoryData.sequence || '',
        subcategoryimage: subcategoryData.subcategoryimage || ''
      });
    } catch (error) {
      console.error('Error fetching subcategory:', error);
      toast.error('Failed to fetch subcategory details');
    }
  };

  const updateSubcategory = (values) => {
    const isUnchanged = Object.keys(formValues).every(
      (key) => formValues[key] === values[key]
    );

    if (isUnchanged && !imageFile) {
      setModalMessage('No changes were made. Nothing to update.');
      setFormValuesChanged(false);
    } else {
      setModalMessage('Do you really want to update this subcategory?');
      setFormValuesChanged(true);
      setFormValues(values);
    }
    setModalShow(true);
  };

  const confirmUpdateSubcategory = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('jwttoken');
      const formData = new FormData();
      formData.append('subcategoryname', formValues.subcategoryname);
      formData.append('sequence', formValues.sequence);
      if (imageFile) {
        formData.append('image', imageFile);
      }

      await axios.put(
        `${process.env.REACT_APP_API_URL}subcategory/updateSubCategory/${subcategoryid}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'x-access-token': token
          }
        }
      );
      
      toast.success('Subcategory updated successfully!');
      navigate('/subcategorylist');
    } catch (error) {
      console.error('Error updating subcategory:', error);
      toast.error(error.response?.data?.message || 'Failed to update subcategory');
    } finally {
      setLoading(false);
      setModalShow(false);
    }
  };

  useEffect(() => {
    fetchSubcategoryById(subcategoryid);
  }, [subcategoryid]);

  return (
    <>
      
      <div className="container mt-5">
        <div className="card shadow-sm border-0">
          <div className="card-header bg-success text-white text-center">
            <h4 className="mb-0">Update Subcategory</h4>
          </div>
          <div className="card-body p-4">
            <Formik
              enableReinitialize={true}
              initialValues={formValues}
              onSubmit={(values) => updateSubcategory(values)}
            >
              {({ setFieldValue }) => (
                <Form>
                  <div className="mb-3 row">
                    <label className="col-md-4 col-form-label text-end fw-semibold text-success">
                      Subcategory ID:
                    </label>
                    <div className="col-md-6">
                      <Field
                        name="subcategory_id"
                        type="text"
                        className="form-control"
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="mb-3 row">
                    <label className="col-md-4 col-form-label text-end fw-semibold text-success">
                      Subcategory Name:
                    </label>
                    <div className="col-md-6">
                      <Field
                        name="subcategoryname"
                        type="text"
                        className="form-control"
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3 row">
                    <label className="col-md-4 col-form-label text-end fw-semibold text-success">
                      Sequence:
                    </label>
                    <div className="col-md-6">
                      <Field
                        name="sequence"
                        type="number"
                        className="form-control"
                        required
                        min="1"
                      />
                    </div>
                  </div>

                  <div className="mb-4 row">
                    <label className="col-md-4 col-form-label text-end fw-semibold text-success">
                      Image:
                    </label>
                    <div className="col-md-6">
                      <input
                        type="file"
                        name="image"
                        className="form-control"
                        accept="image/*"
                        onChange={(e) => {
                          setFieldValue('image', e.target.files[0]);
                          setImageFile(e.target.files[0]);
                        }}
                      />
                      {formValues.subcategoryimage && !imageFile && (
                        <small className="text-muted">
                          Current image: {formValues.subcategoryimage}
                        </small>
                      )}
                    </div>
                  </div>

                  <div className="text-center">
                    <button 
                      type="submit" 
                      className="btn btn-success me-3 px-4"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                          />{' '}
                          Updating...
                        </>
                      ) : (
                        'Update'
                      )}
                    </button>
                    <Link to="/subcategorylist" className="btn btn-outline-danger px-4">
                      Back
                    </Link>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>

      <ConfirmationModal
        show={modalShow}
        modalMessage={modalMessage}
        onHide={() => setModalShow(false)}
        confirmation={confirmUpdateSubcategory}
        operationType="Update"
        wantToAddData={formValuesChanged}
      />
    </>
  );
};

export default Subcategoryedit;