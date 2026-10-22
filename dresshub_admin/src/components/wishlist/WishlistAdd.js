import React, { useState, useEffect } from 'react';
import { Formik, Field, Form } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast} from 'react-toastify';
import Spinner from 'react-bootstrap/Spinner';
import 'react-toastify/dist/ReactToastify.css';

const WishlistAdd = () => {
  const [userIds, setUserIds] = useState([]);
  const [productIds, setProductIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const initialFormValues = {
    userid: '',
    productid: '',
  };

  const submitWishlist = async (values) => {
    setLoading(true);
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}wishlist/addToWishlist`,
        values
      );
      toast.success("Item added to wishlist successfully!");
      navigate('/wishlist');
    } catch (error) {
      console.log(error);
      toast.error("Failed to add item to wishlist.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUserIds = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}users/allusers`);
        const allUserIds = response.data.map(user => user.userid);
        setUserIds(allUserIds);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchProductIds = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}products/allProducts`);
        const allProductIds = response.data.map(product => product.productid);
        setProductIds(allProductIds);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserIds();
    fetchProductIds();
  }, []);

  return (
    <>
      
      <div className="container mt-5">
        <div className="card shadow-sm border-0">
          <div className="card-header bg-success text-white text-center">
            <h4 className="mb-0">Add Item to Wishlist</h4>
          </div>
          <div className="card-body p-4">
            <Formik
              enableReinitialize={true}
              initialValues={initialFormValues}
              onSubmit={values => submitWishlist(values)}
            >
              <Form>
                <div className='row mb-3 align-items-center'>
                  <label className='col-md-4 col-form-label text-end fw-semibold text-success'>User ID:</label>
                  <div className="col-md-6">
                    <Field as="select" name="userid" className="form-select" required>
                      <option value="">Select a User ID</option>
                      {userIds.map((user) => (
                        <option key={user} value={user}>{user}</option>
                      ))}
                    </Field>
                  </div>
                </div>
                <div className='row mb-3 align-items-center'>
                  <label className='col-md-4 col-form-label text-end fw-semibold text-success'>Product ID:</label>
                  <div className="col-md-6">
                    <Field name='productid' as="select" className='form-select' required>
                      <option value="">Select a Product ID</option>
                      {productIds.map((product) => (
                        <option key={product} value={product}>{product}</option>
                      ))}
                    </Field>
                  </div>
                </div>
                <div className='text-center mt-4'>
                  <button type='submit' className="btn btn-success px-4 me-3" disabled={loading}>
                    {loading ? (
                      <><Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true"/> Adding...</>
                    ) : 'Submit Now'}
                  </button>
                  <Link to='/wishlist' className='btn btn-outline-danger px-4'>Back</Link>
                </div>
              </Form>
            </Formik>
          </div>
        </div>
      </div>
    </>
  );
};

export default WishlistAdd;