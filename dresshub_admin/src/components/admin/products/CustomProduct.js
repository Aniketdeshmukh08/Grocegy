import React, { useEffect, useState } from 'react';
import { Formik, Field, Form } from 'formik';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { ConfirmationModal } from '../../shared/ConfirmationModal';
import JoditEditor from 'jodit-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Spinner } from 'react-bootstrap';

const CustomProduct = () => {
  // const [requestid, setReuestid] = useState('');
  const navigate = useNavigate();
  const [userid, setUserid] = useState(localStorage.getItem('userid'));
  const [loading, setLoading] = useState(false);

  async function handleSubmit(values) {
    setLoading(true);
    try {
      const token = localStorage.getItem('jwttoken');
      // console.log(
      //   `name = ${name}, contact = ${contact}, prod name = ${product_name}, desc = ${product_desc}, quantity = ${quantity}, userid = ${userid}`
      // );
      const url =
        `${process.env.REACT_APP_API_URL}customProduct/addCustomProduct`;
        console.log(url);
      const response = await axios.post(url, {
        product_name: values.product_name,
        product_desc: values.product_desc,
        quantity: values.quantity,
        userid: values.userid,
        name: values.name,
        contact: values.contact,
        }, 
        {
        headers: {
          'x-access-token': token
        },
        }
      );
      // window.location.reload()
      toast.success('Custom Product Added Successfully');
      setTimeout(() => navigate('/customproductlist'), 1500); 
      // console.log('response = ', response);
    } catch (e) {
      toast.error('Error In Adding Custom Product')
      // console.log('error = ', e.message);
    } finally {
      setLoading(false);
    }
  }

  async function fetchuserIds() {
    try {
      const token = localStorage.getItem('jwttoken');
      const url = `${process.env.REACT_APP_API_URL}customProduct/getAllUserid`;
      const response = await axios.get(url, {
          headers: {
            'x-access-token': token
          },
        });
      // console.log(response.data);
    } catch (error) {
      // console.log(error);
    }
  }

  useEffect(() => {
    fetchuserIds();
  }, []);

  return (
    <>
    
      <div className="container mt-5">
        <div className="card shadow-sm border-0">
          <div className="card-header bg-success text-white text-center">
            <h4 className="mb-0">Add Custom Product</h4>
          </div>
          <div className="card-body p-4">
            <Formik
              initialValues={{
                name: '',
                contact: '',
                userid: userid || '',
                product_name: '',
                product_desc: '',
                quantity: '',
              }}
              onSubmit={(values) => handleSubmit(values)}
            >
              {({ values, handleChange }) => (
                <Form>
                  <div className="row mb-3 align-items-center">
                    <label className="col-md-4 col-form-label text-end fw-semibold text-success">
                      Name:
                    </label>
                    <div className="col-md-6">
                      <Field
                        type="text"
                        name="name"
                        className="form-control"
                        placeholder="Enter name"
                        required
                      />
                    </div>
                  </div>

                  <div className="row mb-3 align-items-center">
                    <label className="col-md-4 col-form-label text-end fw-semibold text-success">
                      Contact:
                    </label>
                    <div className="col-md-6">
                      <Field
                        type="text"
                        name="contact"
                        className="form-control"
                        placeholder="Enter contact"
                        value={values.contact}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^\d{0,10}$/.test(value)) {
                            handleChange(e);
                          }
                        }}
                        required
                      />
                    </div>
                  </div>

                  <div className="row mb-3 align-items-center">
                    <label className="col-md-4 col-form-label text-end fw-semibold text-success">
                      User Id:
                    </label>
                    <div className="col-md-6">
                      <Field
                        type="text"
                        name="userid"
                        className="form-control"
                        placeholder="Enter user ID"
                        required
                      />
                    </div>
                  </div>

                  <div className="row mb-3 align-items-center">
                    <label className="col-md-4 col-form-label text-end fw-semibold text-success">
                      Product Name:
                    </label>
                    <div className="col-md-6">
                      <Field
                        type="text"
                        name="product_name"
                        className="form-control"
                        placeholder="Enter product name"
                        required
                      />
                    </div>
                  </div>

                  <div className="row mb-3 align-items-center">
                    <label className="col-md-4 col-form-label text-end fw-semibold text-success">
                      Product Description:
                    </label>
                    <div className="col-md-6">
                      <Field
                        type="text"
                        name="product_desc"
                        className="form-control"
                        placeholder="Enter product description"
                        required
                      />
                    </div>
                  </div>

                  <div className="row mb-4 align-items-center">
                    <label className="col-md-4 col-form-label text-end fw-semibold text-success">
                      Quantity:
                    </label>
                    <div className="col-md-6">
                      <Field
                        type="text"
                        name="quantity"
                        className="form-control"
                        placeholder="Enter quantity"
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
                            className="me-2"
                          />
                          Adding...
                        </>
                      ) : (
                        'Add Custom Product'
                      )}
                    </button>
                    <Link to="/customproductlist" className="btn btn-outline-danger">
                      Cancel
                    </Link>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </>
  );
};
export default CustomProduct;
