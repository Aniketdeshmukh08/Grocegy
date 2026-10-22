import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import loaderGif from '../assets/images/loader.gif';
import DashboardRoutes from './DashboardRoutes';

const OrderSuccess = () => {
  const { orderid } = useParams(); // Retrieve order ID from URL parameters
  const userid = localStorage.getItem('userid');
  const usertype = localStorage.getItem('usertype');

  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch order details using the new completed orders API
  const fetchOrderDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}orderDetails/completed/${orderid}` // Make sure no extra slash
      );
      setOrderDetails(response.data);
      // console.log('Order Details:', response.data);
    } catch (error) {
      console.error('Error fetching order details:', error.response ? error.response.data : error.message);
    }
    setLoading(false);
  };
  
  

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchOrderDetails();
  }, [orderid]);

  return (
    <>
      <section className='blog about-blog'>
        <div className='container'>
          <div className='blog-heading about-heading'>
            <h1 className='heading'>Order Completed</h1>
          </div>
        </div>
      </section>
      <section className='user-profile footer-padding'>
        <div className='container'>
          <div className='user-profile-section box-shadows'>
            <div className='user-dashboard'>
              <DashboardRoutes />
              <div className='container'>
                <h3>Delivered Order Details</h3>
                {loading ? (
                  <div className='loader-div'>
                  <img className='loader-img'
                    src={loaderGif}
                    alt='Loading...'/>
                </div>
                ) : orderDetails ? (
                  <div className='card mt-3'>
                    <div className='card-body bg-success bg-opacity-25'>
                      <div className='row'>
                        <div className='col-sm-12'>
                          <div className='order-card'>
                            <div className='order-details'>
                              <h5 className='card-title'>
                                <strong>Order ID - {orderDetails.order_id}</strong>
                              </h5>
                            </div>
                          </div>
                          <p>
                            <strong>Placed on - </strong> {orderDetails.order_date}, {orderDetails.order_time}
                          </p>
                          <p>
                            <strong>Total Price - </strong> ₹{orderDetails.paymentamount}
                          </p>
                          <p>
                            <strong>Delivery Status - </strong> {orderDetails.delivery_status}
                          </p>
                          <p>
                            <strong>Order Status - </strong> {orderDetails.order_status}
                          </p>
                          <p>
                            <strong> Customer support Number - </strong>
                          </p>
                          <p>
                            <strong>Delivery Staff Name - </strong>  {orderDetails.delivery_partner_name}
                          </p>
                          <p>
                            <strong>Delivery Staff Number - </strong> {orderDetails.delivery_partner_mobile}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p>No order details found.</p>
                )}

                {usertype === 'user' && (
                  <div className='text-center my-3'>
                    <div className='d-flex justify-content-center'>
                      <p>
                      <div className='order-actions mt-4'>
                        <button
                          className='go-to-order-history-btn view-details-btn'
                          onClick={() => navigate('/orderhistory')}
                        >
                          Go to My Order History
                        </button>
                        <button
                          className='submit-feedback-btn view-details-btn'
                          onClick={() => navigate('/feedback')}
                        >
                          Submit Feedback
                        </button>
                        <button
                          className='view-details-btn'>
                          Chat with Customer Support
                        </button>
                      </div>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default OrderSuccess;
