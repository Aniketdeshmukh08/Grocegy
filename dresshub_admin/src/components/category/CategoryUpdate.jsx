import React, { useState, useEffect } from 'react';
import { Formik, Field, Form } from 'formik';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ConfirmationModal } from '../shared/ConfirmationModal';

const CategoryUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    categoryname: '',
  });
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [pendingValues, setPendingValues] = useState(null);
  const [file, setFile] = useState(null);
  const [existingImage, setExistingImage] = useState(null);

  // ================= FETCH CATEGORY =================
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}category/getById/${id}`
        );

        // ✅ FIXED (backend returns object, not array)
        if (res.data) {
          const data = res.data;

          setFormValues({
            categoryname: data.categoryname,
          });

          setExistingImage(data.categoryimage);
        } else {
          toast.error("Category not found");
          navigate('/categoryDetails');
        }

      } catch (err) {
        console.error("FETCH ERROR:", err.response?.data || err);
        toast.error("Error loading category");
      }
    };

    fetchCategory();
  }, [id, navigate]);

  // ================= CONFIRM UPDATE =================
  const confirmUpdateCategory = async () => {
    if (!pendingValues) {
      setShowModal(false);
      return;
    }

    setShowModal(false);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('categoryname', pendingValues.categoryname);

      if (file) {
        formData.append('categoryimage', file);
      }

      await axios.put(
        `${process.env.REACT_APP_API_URL}category/updateCategory/${id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data', // ✅ FIXED
            'x-access-token': localStorage.getItem('jwttoken'),
          },
        }
      );

      toast.success('Category updated successfully!');
      setTimeout(() => navigate('/categoryDetails'), 1000);

    } catch (error) {
      console.error("UPDATE ERROR:", error.response?.data || error);
      toast.error(error.response?.data?.message || 'Error updating category!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="container mt-5">
        <div className="card shadow-sm border-0">
          <div className="card-header bg-success text-white text-center">
            <h4 className="mb-0">Update Category</h4>
          </div>

          <div className="card-body p-4">
            <Formik
              enableReinitialize
              initialValues={formValues}
              onSubmit={(values) => {
                const isUnchanged =
                  values.categoryname === formValues.categoryname && !file;

                setModalMessage(
                  isUnchanged
                    ? 'No changes were made.'
                    : 'Do you really want to update this category?'
                );

                setPendingValues(isUnchanged ? null : values);
                setShowModal(true);
              }}
            >
              <Form>
                {/* CATEGORY NAME */}
                <div className="mb-4 row">
                  <label className="col-md-4 col-form-label text-end fw-semibold text-success">
                    Category Name:
                  </label>
                  <div className="col-md-6">
                    <Field
                      name="categoryname"
                      type="text"
                      className="form-control"
                      required
                    />
                  </div>
                </div>

                {/* IMAGE */}
                <div className="row mb-4 align-items-center">
                  <label className="col-md-4 col-form-label text-end fw-semibold text-success">
                    Category Image:
                  </label>
                  <div className="col-md-6">
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={(e) => setFile(e.target.files[0])}
                    />

                    {/* EXISTING IMAGE */}
                    {existingImage && !file && (
                      <div className="mt-2">
                        <img
                          src={`${process.env.REACT_APP_API_URL}uploads/categories/${existingImage}`}
                          alt="Category"
                          style={{
                            width: '150px',
                            height: '150px',
                            objectFit: 'cover',
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* BUTTONS */}
                <div className="text-center">
                  <button
                    type="submit"
                    className="btn btn-success me-3 px-4"
                    disabled={loading}
                  >
                    {loading ? 'Updating...' : 'Submit'}
                  </button>

                  <Link
                    to="/categoryDetails"
                    className="btn btn-outline-danger px-4"
                  >
                    Back
                  </Link>
                </div>
              </Form>
            </Formik>
          </div>
        </div>
      </div>

      {/* MODAL */}
      <ConfirmationModal
        show={showModal}
        onHide={() => setShowModal(false)}
        confirmation={confirmUpdateCategory}
        modalMessage={modalMessage}
        wantToAddData={!!pendingValues}
        operationType="Update"
      />
    </>
  );
};

export default CategoryUpdate;