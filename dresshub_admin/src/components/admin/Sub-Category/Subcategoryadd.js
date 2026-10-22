import React, { useState, useEffect } from 'react';
import { Formik, Field, Form } from 'formik';
import axios from 'axios';
import { Link,useNavigate } from 'react-router-dom';
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Spinner } from 'react-bootstrap';

const Subcategoryadd = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          process.env.REACT_APP_API_URL + 'category/allCategory'
        );
        setCategories(response.data);
      } catch (error) {
        console.error('Error in fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const initialFormValues = {
    subcategoryname: '',
    subcategory_id: '',
    category_id: '',
    sequence: '',
  };

  const addNewSubcategory = async values => {
    setLoading(true);
    try {
      const token = localStorage.getItem('jwttoken');
      const url = process.env.REACT_APP_API_URL + 'subCategory/addSubCategory';
      const response = await axios.post(url, values,{
         headers: {
        'x-access-token': token
      }
      });
      console.log(response.data);

      toast.success('Subcategory added successfully!');
      navigate('/subcategorylist')
    } catch (error) {
      console.error('Error adding subcategory:', error);
      toast.error('Failed to add subcategory');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    
      <div className="container mt-5">
        <div className="card shadow-sm border-0">
          <div className="card-header bg-success text-white text-center">
            <h4 className="mb-0">Add New Subcategory</h4>
          </div>
          <div className="card-body p-4">
            <Formik
              initialValues={initialFormValues}
              onSubmit={(values) => addNewSubcategory(values)}
            >
              <Form>
                <div className="row mb-3 align-items-center">
                  <label className="col-md-4 col-form-label text-end fw-semibold text-success">
                    Subcategory Name:
                  </label>
                  <div className="col-md-6">
                    <Field
                      type="text"
                      name="subcategoryname"
                      className="form-control"
                      placeholder="Enter subcategory name"
                      required
                    />
                  </div>
                </div>

                <div className="row mb-3 align-items-center">
                  <label className="col-md-4 col-form-label text-end fw-semibold text-success">
                    Category:
                  </label>
                  <div className="col-md-6">
                    <Field as="select" name="category_id" className="form-select" required>
                      <option value="">Select Category</option>
                      {categories.map(category => (
                        <option key={category.category_id} value={category.category_id}>
                          {category.categoryname}
                        </option>
                      ))}
                    </Field>
                  </div>
                </div>

                <div className="row mb-4 align-items-center">
                  <label className="col-md-4 col-form-label text-end fw-semibold text-success">
                    Sequence:
                  </label>
                  <div className="col-md-6">
                    <Field
                      type="number"
                      name="sequence"
                      className="form-control"
                      placeholder="Enter sequence number"
                      required
                    />
                  </div>
                </div>

                <div className="text-center">
                  <button type="submit" className="btn btn-success px-4 me-3" disabled={loading}>
                    {loading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />{' '}
                        Adding...
                      </>
                    ) : (
                      'Add Subcategory'
                    )}
                  </button>
                  <Link to="/subcategorylist" className="btn btn-outline-danger">
                    Cancel
                  </Link>
                </div>
              </Form>
            </Formik>
          </div>
        </div>
      </div>
    </>
  );
};

export default Subcategoryadd;