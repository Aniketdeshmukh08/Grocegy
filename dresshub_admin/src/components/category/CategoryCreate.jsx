import React, { useState } from 'react';
import { Formik, Field, Form } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Spinner from 'react-bootstrap/Spinner';

const CategoryCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  const token = localStorage.getItem('jwttoken');

  const formValues = {
    categoryname: '',
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    // Optional validation
    if (selectedFile && !selectedFile.type.startsWith('image/')) {
      toast.error('Only image files are allowed!');
      return;
    }

    setFile(selectedFile);
  };

  const submitCategory = async (values) => {
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('categoryname', values.categoryname);

      if (file) {
        formData.append('categoryimage', file);
      }

      await axios.post(
        `${process.env.REACT_APP_API_URL}category/addCategory`,
        formData,
        {
          headers: {
            //DO NOT add Content-Type manually
            'x-access-token': token,
          },
        }
      );

      toast.success('Category created successfully!');

      setTimeout(() => {
        setLoading(false);
        navigate('/categoryDetails');
      }, 1000);

    } catch (error) {
      console.error(" FRONTEND ERROR:", error.response?.data || error);
      toast.error(
        error.response?.data?.message || 'Error creating category!'
      );
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-sm border-0">
        <div className="card-header bg-success text-white text-center">
          <h4 className="mb-0">Add New Category</h4>
        </div>

        <div className="card-body p-4">
          <Formik
            initialValues={formValues}
            onSubmit={submitCategory}
          >
            <Form>
              {/* Category Name */}
              <div className="row mb-3 align-items-center">
                <label className="col-md-4 col-form-label text-end fw-semibold text-success">
                  Category Name:
                </label>
                <div className="col-md-6">
                  <Field
                    name="categoryname"
                    type="text"
                    className="form-control"
                    placeholder="Enter category name"
                    required
                  />
                </div>
              </div>

              {/* Category Image */}
              <div className="row mb-4 align-items-center">
                <label className="col-md-4 col-form-label text-end fw-semibold text-success">
                  Category Image:
                </label>
                <div className="col-md-6">
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="text-center mt-4">
                <button
                  type="submit"
                  className="btn btn-success px-4 me-3"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                      />{' '}
                      Adding...
                    </>
                  ) : (
                    'Add Category'
                  )}
                </button>

                <Link
                  to="/categoryDetails"
                  className="btn btn-outline-danger"
                >
                  Cancel
                </Link>
              </div>
            </Form>
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default CategoryCreate;