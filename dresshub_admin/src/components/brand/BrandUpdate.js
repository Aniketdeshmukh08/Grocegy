import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Formik, Field, Form } from 'formik';
import { ConfirmationModal } from '../shared/ConfirmationModal';
import { toast } from 'react-toastify';

const BrandUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState({
    vendor_id: '',
    brand_name: '',
    brand_id: '',
  });

  const [modalShow, setModalShow] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [formValuesChanged, setFormValuesChanged] = useState(false);
  const token = localStorage.getItem('jwttoken');
  useEffect(() => {
    const fetchBrandDetails = async () => {
      try {
        const token = localStorage.getItem("jwttoken");
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}brand/brandbyid/${id}`,
          {
            headers: {
              'x-access-token': token 
            }
          }
        );
        const brand = response.data && response.data.length > 0 ? response.data[0] : null;
        if (brand) {
          setFormValues({
            vendor_id: brand.vendor_id,
            brand_name: brand.brand_name,
            brand_id: brand.brand_id,
          });
        } else {
          setFormValues({ brand_name: '' });
        }
      } catch (err) {
        console.error(err);
        setFormValues({ brand_name: '' });
      }
    };

    fetchBrandDetails();
  }, [id]);

  const updateBrand = (values) => {
    const isUnchanged = Object.keys(formValues).every(
      (key) => formValues[key] === values[key]
    );

    if (isUnchanged) {
      setModalMessage('No changes were made. Nothing to update.');
      setFormValuesChanged(false);
    } else {
      setModalMessage('Do you really want to update this brand?');
      setFormValuesChanged(true);
      setFormValues(values);
    }
    setModalShow(true);
  };

  const confirmUpdateBrand = async () => {
    try {
      const token = localStorage.getItem("jwttoken");
      await axios.put(
        `${process.env.REACT_APP_API_URL}brand/updatebrand/${id}`,
        formValues,
        {
          headers: {
             'x-access-token': token
          }
        }
      );
      setModalShow(false);
      toast.success('Brand Updated Successfully');
      navigate('/brandlist');
    } catch (error) {
      console.log(error);
      toast.error('Failed to update brand');
    }
  };

  return (
    <>
      <div className="container mt-5">
        <div className="card shadow-sm border-0">
          <div className="card-header bg-success text-white text-center">
            <h4 className="mb-0">Update Brand</h4>
          </div>
          <div className="card-body p-4">
            <Formik
              enableReinitialize={true}
              initialValues={formValues}
              onSubmit={(values) => updateBrand(values)}
            >
              <Form>
                <div className="mb-3 row">
                  <label className="col-md-4 col-form-label text-end fw-semibold text-success">
                    Vendor ID:
                  </label>
                  <div className="col-md-6">
                    <Field
                      name="vendor_id"
                      type="text"
                      className="form-control"
                      readOnly
                    />
                  </div>
                </div>

                <div className="mb-3 row">
                  <label className="col-md-4 col-form-label text-end fw-semibold text-success">
                    Brand ID:
                  </label>
                  <div className="col-md-6">
                    <Field
                      name="brand_id"
                      type="text"
                      className="form-control"
                      readOnly
                    />
                  </div>
                </div>

                <div className="mb-4 row">
                  <label className="col-md-4 col-form-label text-end fw-semibold text-success">
                    Brand Name:
                  </label>
                  <div className="col-md-6">
                    <Field
                      name="brand_name"
                      type="text"
                      className="form-control"
                      required
                    />
                  </div>
                </div>

                <div className="text-center">
                  <button type="submit" className="btn btn-success me-3 px-4">
                    Submit
                  </button>
                  <Link to="/brandlist" className="btn btn-outline-danger px-4">
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
        confirmation={confirmUpdateBrand}
        operationType="Update"
        wantToAddData={formValuesChanged}
      />
    </>
  );
};

export default BrandUpdate;
