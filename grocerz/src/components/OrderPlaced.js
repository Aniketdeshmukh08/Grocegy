import axios from 'axios';
import { useLocation, Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardRoutes from './DashboardRoutes';
import FeedbackModal from "./FeedbackModal";
import loaderGif from '../assets/images/loader.gif';

const OrderPlaced = () => {
  const userid = localStorage.getItem('userid');
  const usertype = localStorage.getItem('usertype');
  const { orderid } = useParams();
  const [orders, setOrders] = useState([]);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const url = (
        `${process.env.REACT_APP_API_URL}orderdetails/${orderid}`
      );
      const response = await axios.get(url);
      setOrderDetails(response.data.orderDetails || []);
    } catch (error) {
      console.error('Error fetching order details:', error);
      setError('Something went wrong, please try again!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // if (!userid) {
    //   navigate('/login');
    //   navigate(`/ordersuccess/${orderid}`);
    //   return;
    // }
    window.scrollTo(0, 0);
    fetchOrderDetails();
  }, [orderid, userid, navigate]);

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '60vh',
        }}
      >
        <img
          src={loaderGif}
          alt='Loading...'
          style={{ width: '80px', height: '80px' }}
        />
      </div>
    );
  }

  if (!orderDetails || orderDetails.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // const {
  //   order_id,
  //   paymentamount,
  //   order_date,
  //   order_time,
  //   delivery_status
  // } = orderDetails;
  const order = orderDetails?.[0];

  // Function to format date properly
  const formatOrderDate = (dateStr) => {
    if (!dateStr) return 'N/A';

    // If it's already in dd/mm/yyyy format, check if year is valid
    const ddmmyyyyMatch = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (ddmmyyyyMatch) {
      const year = parseInt(ddmmyyyyMatch[3]);
      // If year is reasonable (between 2020 and 2030), return as is
      if (year >= 2020 && year <= 2030) {
        return dateStr;
      }
    }

    // If it's an ISO string or other format, try to parse and format
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        return dateStr; // Return original if can't parse
      }

      const year = date.getFullYear();

      // If year is unreasonable (like 1899), use current date
      if (year < 2020 || year > 2030) {
        const now = new Date();
        const day = now.getDate();
        const month = now.getMonth() + 1;
        const currentYear = now.getFullYear();
        return `${day}/${month}/${currentYear}`;
      }

      const day = date.getDate();
      const month = date.getMonth() + 1;
      return `${day}/${month}/${year}`;
    } catch (error) {
      return dateStr; // Return original on error
    }
  };


  return (

    <>

      <section className='blog about-blog'>
        <div className='container'>
          {/* <span>
              <Link to='/home'>Home</Link>
            </span>
            <span className='devider'> / </span>
            <span>
              <Link to='/cart'>Cart</Link>
            </span>
            <span className='devider'> / </span>
            <span>
              <Link to='/checkout'>Checkout</Link>
            </span>
            <span className='devider'> / </span>
            <span>Order Successful</span> */}
          <div className='blog-heading about-heading'>
            <h1 className='heading'>Your Order is Placed Successfully!</h1>
          </div>
        </div>
      </section>

      <section className='user-profile footer-padding'>
        <div className='container'>
          <div className='user-profile-section box-shadows'>
            <div className='user-dashboard'>
              {/* <DashboardRoutes /> */}
              <div className="container">
                <div className="row">
                  <div >
                    <div className="text-center mt-10 text-custom-font-1">

                      {/* <div col-12>
                        Order Id - {order.srno || 'N/A'}
                      </div>

                      <div col-12>
                        Total Amount - {order.paymentamount || 'N/A'}
                      </div>

                      <div col-12>
                        Placed On - {order.order_date}{' | '}
                      </div>

                      <div col-12>
                        Delivery Status - {order.delivery_status || 'N/A'}
                      </div> */}


                      <table className='table table-borderd table-striped'>
                        <tbody>
                          {userid && (
                            <tr className='fs-3'>
                              <th className=''>
                                Order Number
                              </th>
                              <td className=''>
                                {order.srno || 'N/A'}
                              </td>
                            </tr>
                          )}

                          <tr className='fs-3'>
                            <th className=''>
                              Order Id
                            </th>
                            <td className=''>
                              {order.order_id || 'N/A'}
                            </td>
                          </tr>

                          <tr className='fs-3'>
                            <th className=''>
                              Total Amount

                            </th>
                            <td className=''>
                              {order?.paymentamount || 'N/A'}
                            </td>
                          </tr>

                          <tr className='fs-3'>
                            <th className=''>

                              Placed On

                            </th>
                            <td className=''>
                              {formatOrderDate(order.order_date)}{' | '}
                              {order.order_time}
                            </td>
                          </tr>

                          <tr className='fs-3'>
                            <th className=''>

                              Delivery Status

                            </th>
                            <td className=''>
                              {order.delivery_status || 'N/A'}
                            </td>
                          </tr>
                        </tbody>
                      </table>


                      <p className="fw-semibold text-center mt-4">
                        Thank you for shopping with us. Your order will be delivered to you shortly.
                      </p>

                      <div className='d-flex flex-wrap gap-3 align-items-center justify-content-center mt-4'>

                        <Link to="/orderhistory" className="shop-btn btn-success px-4 my-4">View Order History</Link>

                        <div>
                          <FeedbackModal />
                        </div>

                        <a className='shop-btn px-4 my-4' rel='noreferrer' target='_blank' href="https://api.whatsapp.com/send?phone=918757499345&text=I would like to request login credentials">
                          Get Login Credential From Whatsapp
                        </a>
                      </div>

                      <div className='d-flex flex-wrap gap-3 align-items-center justify-content-center'>

                        <Link className="shop-btn shop-btn-yellow px-4 my-4">Call Customer Support - 8757499345</Link>

                        <a className='shop-btn shop-btn-red px-4 my-4' rel='noreferrer' target='_blank' href="https://api.whatsapp.com/send?phone=918757499345&text=Hi, I want to discuss about my order.">
                          Chat with Customer Support
                        </a>

                        <Link className="shop-btn shop-btn-yellow px-4 my-4">Call Delivery Partner - 8757499344</Link>

                        <a className='shop-btn shop-btn-red px-4 my-4' rel='noreferrer' target='_blank' href="https://api.whatsapp.com/send?phone=918757499344&text=Hi, I have placed an order now.">
                          Chat with Delivery Partner
                        </a>
                      </div>


                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};


export default OrderPlaced;
