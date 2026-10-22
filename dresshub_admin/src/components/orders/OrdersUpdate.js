import React, { useState, useEffect } from 'react';
import { Formik, Field, Form } from 'formik';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { ConfirmationModal } from '../shared/ConfirmationModal';


const OrdersUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    order_id: '',
    order_date: '',
    order_time: '',
    order_status: '',
    paymentamount: '',
    paymentstatus: '',
    paymentmode: '',
    addressid: '',
    delivery_status: '',
    tracking_id: '',
    delivery_partner: '',
  });

  const [modalShow, setModalShow] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [formValuesChanged, setFormValuesChanged] = useState(false);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}orders/getById/${id}`)
      .then(res => {
        console.log(res);
        let obj = {
          order_id: res.data[0].order_id,
          order_date: res.data[0].order_date,
          order_time: res.data[0].order_time,
          order_status: res.data[0].order_status,
          paymentamount: res.data[0].paymentamount,
          paymentstatus: res.data[0].paymentstatus,
          paymentmode: res.data[0].paymentmode,
          addressid: res.data[0].addressid,
          delivery_status: res.data[0].delivery_status,
          tracking_id: res.data[0].tracking_id,
          delivery_partner: res.data[0].delivery_partner,
        };
        setFormValues(obj);
        console.log(res.data[0]);
      })
      .catch(err => console.log(err));
  }, [id]);

  // const handleFieldChange = (e) => {
  //   setFormValues(e.target.value);
  // };
  const handleFormSubmit = (values) => {
    const isUnchanged = Object.keys(formValues).every(
      (key) => formValues[key] === values[key]
    );

    if (isUnchanged) {
      setModalMessage('No changes were made. Nothing to update.');
      setFormValuesChanged(false);
    } else {
      setModalMessage('Do you really want to update this order?');
      setFormValuesChanged(true);
      setFormValues(values);
    }
    setModalShow(true);
  };


  const confirmUpdateOrder = async () => {
    try {

      await axios.put(
        `${process.env.REACT_APP_API_URL}orders/updateOrder/${id}`,
        formValues
      );
      setModalShow(false);
      toast.success('Order Updated Successfully');
      setTimeout(() => {
        navigate("/orders");
      }, 1000);
    }
    catch (err) {
      console.log(err);
      toast.error('Failed to update order');
    }
  };



  // const updateOrder = async values => {
  //   try {
  //     // Check if form values are unchanged
  //     const isUnchanged = Object.keys(formValues).every(
  //       key => formValues[key] === values[key]
  //     );

  //     if (isUnchanged) {
  //       alert('No changes were made. Nothing to update.');
  //       return;
  //     }
  //     //after form values update
  //     const confirmed = window.confirm(
  //       'Are you sure you want to Update this order?'
  //     );
  //     if (confirmed === true) {
  //       await axios.put(
  //         `${process.env.REACT_APP_API_URL}order/updateOrder/${id}`,
  //         values
  //       );
  //       navigate('/orders');
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  // useEffect(() => {
  //   console.log('formValues', formValues);
  // }, [formValues]);

  return (
    <>
      <div className="container mt-5">
        <div className="card shadow-sm border-0">
          <div className="card-header bg-success text-white text-center">
            <h4 className="mb-0">Update Order</h4>
          </div>
          <div className="card-body p-4">
            <Formik
              enableReinitialize={true}
              initialValues={formValues}
              onSubmit={(values) => handleFormSubmit(values)}
            >

              <Form>
                <div className='mb-3 row'>
                  <label className='col-md-4 col-form-label text-end fw-semibold text-success'>Order Id:</label>
                  <div className="col-md-6">
                    <Field name='order_id' type='text' className='form-control' readOnly />
                  </div>
                </div>
                <div className='mb-3 row'>
                  <label className='col-md-4 col-form-label text-end fw-semibold text-success'>Order Date:</label>
                  <div className="col-md-6">
                    <Field name='order_date' type='text' className='form-control'
                      required />
                  </div>
                </div>
                <div className='mb-3 row'>
                  <label className='col-md-4 col-form-label text-end fw-semibold text-success'>Order Time:</label>
                  <div className="col-md-6">
                    <Field name='order_time' type='text' className='form-control'
                      required />
                  </div>
                </div>
                <div className='mb-3 row'>
                  <label className='col-md-4 col-form-label text-end fw-semibold text-success'>Order Status:</label>
                  <div className="col-md-6">
                    <Field name='order_status' type='text' className='form-control'
                      required />
                  </div>
                </div>

                <div className='mb-3 row'>
                  <label className='col-md-4 col-form-label text-end fw-semibold text-success'>Payment Amount:</label>
                  <div className="col-md-6">
                    <Field name='paymentamount' type='text' className='form-control'
                      required />
                  </div>
                </div>
                <div className='mb-3 row'>
                  <label className='col-md-4 col-form-label text-end fw-semibold text-success'>Payment Status:</label>
                  <div className="col-md-6">
                    <Field name='paymentstatus' type='text' className='form-control'
                      required />
                  </div>
                </div>
                <div className='mb-3 row'>
                  <label className='col-md-4 col-form-label text-end fw-semibold text-success'>Payment Mode:</label>
                  <div className="col-md-6">
                    <Field name='paymentmode' type='text' className='form-control'
                      required />
                  </div>
                </div>
                <div className='mb-3 row'>
                  <label className='col-md-4 col-form-label text-end fw-semibold text-success'>Address Id:</label>
                  <div className="col-md-6">
                    <Field name='addressid' type='text' className='form-control' readOnly />
                  </div>
                </div>
                <div className='mb-3 row'>
                  <label className='col-md-4 col-form-label text-end fw-semibold text-success'>Delivery Status:</label>
                  <div className="col-md-6">
                    <Field name='delivery_status' type='text' className='form-control'
                      required />
                  </div>
                </div>
                <div className='mb-3 row'>
                  <label className='col-md-4 col-form-label text-end fw-semibold text-success'>Tracking Id:</label>
                  <div className="col-md-6">
                    <Field name='tracking_id' type='text' className='form-control' readOnly />
                  </div>
                </div>
                <div className='mb-3 row'>
                  <label className='col-md-4 col-form-label text-end fw-semibold text-success'>Delivery Partner:</label>
                  <div className="col-md-6">
                    <Field name='delivery_partner' type='text' className='form-control'
                      required />
                  </div>
                </div>
                <div className="text-center">
                  <button type="submit" className="btn btn-success me-3 px-4">
                    Submit
                  </button>
                  <Link to='/orders' className='btn btn-outline-danger px-4'>
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
        confirmation={confirmUpdateOrder}
        operationType="Update"
        wantToAddData={formValuesChanged}
      />
      
    </>
  );
};

export default OrdersUpdate;
