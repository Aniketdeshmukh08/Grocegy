import React, { useEffect, useState } from 'react';
import { Formik, Field, Form } from 'formik';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { ConfirmationModal } from '../shared/ConfirmationModal';
import { toast } from 'react-toastify';
import Spinner from 'react-bootstrap/Spinner';
import 'react-toastify/dist/ReactToastify.css';

const WishlistUpdate = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formValues, setFormValues] = useState(null); // Initial state is null for loading
  const [initialFormValues, setInitialFormValues] = useState({});
  const [productIds, setProductIds] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [formValuesChanged, setFormValuesChanged] = useState(false);
  const [loadingOnModal, setLoadingOnModal] = useState(false);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}wishlist/usersWishlist/${id}`)
      .then(res => {
        let obj = {
          userid: id,
          productid: res.data[0]?.productid || '',
        };
        setFormValues(obj);
        setInitialFormValues(obj);
      })
      .catch(err => {
        console.log(err);
        toast.error("Could not fetch wishlist data.");
      });
  }, [id]);

  const updateWishlist = values => {
    const isUnchanged = JSON.stringify(initialFormValues) === JSON.stringify(values);
    if (isUnchanged) {
      toast.info("No changes were made. Nothing to update.");
      setModalMessage("Nothing to update");
      setFormValuesChanged(false);
    } else {
      setFormValues(values);
      setModalMessage("You are about to update this wishlist item. Continue?");
      setFormValuesChanged(true);
    }
    setModalShow(true);
  };

  const confirmUpdateWishlist = async () => {
    setLoadingOnModal(true);
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}wishlist/updateWishlist/${id}`,
        formValues
      );
      toast.success("Wishlist updated successfully!");
      navigate('/wishlist');
    } catch (err) {
      console.log(err);
      toast.error("Failed to update wishlist.");
    } finally {
      setModalShow(false);
      setLoadingOnModal(false);
    }
  };

  useEffect(() => {
    const fetchProductIds = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}products/allProducts`);
        const allProductIds = response.data.map(product => product.productid);
        setProductIds(allProductIds);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProductIds();
  }, []);
  
  if (!formValues) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
        <Spinner animation="border" variant="success" />
      </div>
    );
  }

  return (
    <>
      
      <div className="container mt-5">
        <div className="card shadow-sm border-0">
          <div className="card-header bg-success text-white text-center">
            <h4 className="mb-0">Update Wishlist Item</h4>
          </div>
          <div className="card-body p-4">
            <Formik
              enableReinitialize={true}
              initialValues={formValues}
              onSubmit={values => updateWishlist(values)}
            >
              <Form>
                <div className='row mb-3 align-items-center'>
                  <label className='col-md-4 col-form-label text-end fw-semibold text-success'>User ID:</label>
                  <div className="col-md-6">
                    <Field name='userid' type='text' className='form-control' readOnly />
                  </div>
                </div>
                <div className='row mb-3 align-items-center'>
                  <label className='col-md-4 col-form-label text-end fw-semibold text-success'>Product ID:</label>
                  <div className="col-md-6">
                    <Field name='productid' as="select" className='form-select'>
                      <option value="">Select a Product</option>
                      {productIds.map((product) => (
                        <option key={product} value={product}>{product}</option>
                      ))}
                    </Field>
                  </div>
                </div>
                <div className='text-center mt-4'>
                  <button type='submit' className="btn btn-success px-4 me-3">Update Now</button>
                  <Link to='/wishlist' className='btn btn-outline-danger px-4'>Back</Link>
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
        confirmation={confirmUpdateWishlist}
        operationType="Update"
        wantToAddData={formValuesChanged}
        loading={loadingOnModal}
      />
    </>
  );
};

export default WishlistUpdate;