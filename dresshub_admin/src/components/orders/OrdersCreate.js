import { Formik, Field, Form } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Spinner from 'react-bootstrap/Spinner';
import 'react-toastify/dist/ReactToastify.css';


const OrdersCreate = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const formValues = {
    order_id: '',
    order_date: '',
    order_time: '',
    order_status: '',
    userid: '',
    isactive: '1',
    paymentamount: '',
    paymentstatus: '',
    paymentmode: '',
    addressid: '',
    delivery_status: '',
    tracking_id: '',
    delivery_partner: '',
    costamount: '0'
  };
  const [userIds, setUserIds] = useState([]);
  const [addressIds, setAddressIds] = useState([]);

  useEffect(() => {
    const fetchUserIds = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}users/allusers`);
        setUserIds(response.data);
      } catch (error) {
        console.error('Error fetching order IDs:', error);
      }
    };
    const fetchAddressIds = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}address/allAddress`);
        setAddressIds(response.data.data || []);
      } catch (error) {
        console.error('Error fetching address IDs:', error);
      }
    }
    fetchUserIds();
    fetchAddressIds();
  }, []);

  const handleFormSubmit = async (values) => {
    setLoading(true);

    try {

      await axios.post(`${process.env.REACT_APP_API_URL}orders/addOrder`, values);
      toast.success("Order Added Successfully");
      setTimeout(() => {
        navigate("/orders");
      }, 1000);
    } catch (error) {
      console.error('Error adding order:', error);
      toast.error('Failed to add order');
      setLoading(false);
    }
  };



  // const submitOrder = async values => {
  //   try {
  //     const confirmed = window.confirm(
  //       'Are you sure you want to Add New Order???'
  //     );
  //     if (confirmed) {
  //       await axios.post(
  //         `${process.env.REACT_APP_API_URL}orders/addOrder`,
  //         values
  //       );
  //       navigate('/orders');
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  return (
    <>
      
      <div className="container mt-5">
        <div className="card shadow-sm border-0">

          <div className="card-header bg-success text-white text-center">
            <h4 className="mb-0">Add New Order</h4>
          </div>
          <div className="card-body p-4">
            <Formik
              enableReinitialize={true}
              initialValues={formValues}
              onSubmit={values => handleFormSubmit(values)}
            >
              <Form>
                <div className="row mb-3 align-items-center">
                  <label className="col-md-4 col-form-label text-end fw-semibold text-success">User ID:</label>
                  <div className="col-md-6">
                    <Field as="select" name="userid" className="form-select" required>
                      <option value="">Select an User ID</option>
                      {userIds.map((user) => (
                        <option key={user.userid} value={user.userid}>
                          {user.userid}
                        </option>
                      ))}
                    </Field>
                  </div>
                </div>
                {/* <div className='row mb-2'>
            <label className='col-4 my-2 text-center'>Order_Date:-</label>
            <Field name='order_date' type='text' className='col-6' />
          </div>
          <div className='row mb-2'>
            <label className='col-4 my-2 text-center'>Order_Time:-</label>
            <Field name='order_time' type='text' className='col-6' />
          </div> */}
                <div className='row mb-3 align-items-center'>
                  <label className='col-md-4 col-form-label text-end fw-semibold text-success'>Order Status:</label>
                  <div className="col-md-6">
                    <Field name='order_status' type='text'
                      className='form-control'
                      placeholder="Enter order status"
                      required />
                  </div>
                </div>

                <div className="row mb-3 align-items-center">
                  <label className="col-md-4 col-form-label text-end fw-semibold text-success">Payment Amount:</label>
                  <div className="col-md-6">
                    <Field name='paymentamount' type='text'
                      className="form-control"
                      placeholder="Enter payment amount"
                      required />
                  </div>
                </div>
                <div className="row mb-3 align-items-center">
                  <label className="col-md-4 col-form-label text-end fw-semibold text-success">Payment Status:</label>
                  <div className="col-md-6">
                    <Field name='paymentstatus' type='text'
                      className="form-control"
                      placeholder="Enter payment status"
                      required />
                  </div>
                </div>
                <div className="row mb-3 align-items-center">
                  <label className="col-md-4 col-form-label text-end fw-semibold text-success">Payment Mode:</label>
                  <div className="col-md-6">
                    <Field name='paymentmode' type='text'
                      className="form-control"
                      placeholder="Enter payment mode"
                      required />
                  </div>
                </div>
                <div className="row mb-3 align-items-center">
                  <label className="col-md-4 col-form-label text-end fw-semibold text-success">
                    Address ID:
                  </label>
                  <div className="col-md-6">
                    <Field as="select" name="addressid" className="form-select" required>
                      <option value="">Select an Address ID</option>
                      {addressIds.map((address) => (
                        <option key={address.addressid} value={address.addressid}>
                          {address.addressid}
                        </option>
                      ))}
                    </Field>
                  </div>
                </div>
                <div className="row mb-3 align-items-center">
                  <label className="col-md-4 col-form-label text-end fw-semibold text-success">Delivery Status:</label>
                  <div className="col-md-6">
                    <Field name='delivery_status' type='text'
                      className="form-control"
                      placeholder="Enter delivery status"
                      required />
                  </div>
                </div>
                {/* <div className='row mb-2'>
            <label className='col-4 my-2 text-center'>Tracking_Id:-</label>
            <Field name='tracking_id' type='text' className='col-6' />
          </div> */}
                <div className="row mb-3 align-items-center">
                  <label className="col-md-4 col-form-label text-end fw-semibold text-success">Delivery Partner:</label>
                  <div className="col-md-6">
                    <Field name='delivery_partner' type='text'
                      className="form-control"
                      placeholder="Enter delivery partner"
                      required />
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
                      'Add Order'
                    )}
                  </button>
                  <Link to='/orders' className='btn btn-outline-danger'>
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

export default OrdersCreate;
