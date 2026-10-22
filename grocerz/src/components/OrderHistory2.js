// OrderHistory.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import DashboardRoutes from './DashboardRoutes';
import loaderGif from '../assets/images/loader.gif';
const OrderHistory2 = () => {
  const userid = localStorage.getItem('userid');
  const usertype = localStorage.getItem('usertype');
  const [orders, setOrders] = useState([]);
  const [customOrders, setCustomOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [deliverypartners, setDeliveryPartners] = useState([]);
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(0);
  const [count, setCount] = useState(0);

  const handleOrderClick = orderid => {
    navigate(`/orderhistory/orderdetail/${orderid}`);
  };

  const handleOrderSuccess = orderid => {
    navigate(`/ordersuccess/${orderid}`);
  };

  const preventClickPropagation = (event) => {
    event.stopPropagation();
  };

  const handleMarkComplete = async orderid => {
    setLoading(true);
    try {
      const confirm = window.confirm(
        'Are you sure to mark the order as completed?'
      );
      if (confirm) {
        const url =
          process.env.REACT_APP_API_URL + 'orders/markascompleted/' + orderid;
        const response = await axios.put(url);
        fetchOrders();
      }
    } catch (error) {
      console.error('Error fetching cart items', error);
    }
    setLoading(false);
  };
  const handleOrderCancel = async orderid => {
    setLoading(true);
    try {
      const confirm = window.confirm('Are you sure to cancel the order?');
      if (confirm) {
        const url =
          process.env.REACT_APP_API_URL + 'orders/markascancelled/' + orderid;
        const response = await axios.put(url);
        handleDeliveryCancel(orderid);
        fetchOrders();
      }
    } catch (error) {
      console.error('Error fetching cart items', error);
    }
    setLoading(false);
  };
  const handleDelivered = async orderid => {
    setLoading(true);
    try {
      const confirm = window.confirm(
        'Are you sure to mark the order as delivered?'
      );
      if (confirm) {
        const url =
          process.env.REACT_APP_API_URL + 'orders/markdelivered/' + orderid;
        const response = await axios.put(url);
        fetchOrders();
      }
    } catch (error) {
      console.error('Error fetching cart items', error);
    }
    setLoading(false);
  };
  const handleDeliveryCancel = async orderid => {
    setLoading(true);
    try {
      const url =
        process.env.REACT_APP_API_URL +
        'orders/markdeliverycancelled/' +
        orderid;
      const response = await axios.put(url);
      fetchOrders();
    } catch (error) {
      console.error('Error fetching cart items', error);
    }
    setLoading(false);
  };
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const url =
        usertype !== 'user'
          ? 'orders/allOrders'
          : 'orders/getByuserId/' + userid;
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}${url}`
      );

      setCount(response.data.length);

      setCustomOrders(response.data);
      setMax(50);
      setMin(0);

    } catch (error) {
      console.error('Error fetching cart items', error);
    }
    setLoading(false);
  };

  const handlePrev = () => {
    setMax(min);
    (min - 50) < 0 ? setMin(0) : setMin(min - 50);
  }
  const handleNext = () => {
    const maxval = max;
    (max + 50) < count ? setMax(max + 50) : setMax(count);
    setMin(maxval);
  }
  // for handling the payment mode
  const [hidePaymentButtons, setHidePaymentButtons] = useState({});

  const handlePaymentModeChange = async (orderId, newPaymentMode) => {
    setLoading(true);
    try {
      const url = process.env.REACT_APP_API_URL + 'orders/updatePaymentMode/' + orderId;

      await axios.put(
        url,
        { paymentmode: newPaymentMode },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      setHidePaymentButtons((prevState) => ({
        ...prevState,
        [orderId]: true,
      }));

      fetchOrders();
    } catch (error) {
      console.error('Error updating payment mode', error);
    }
    setLoading(false);
  };


  const fetchDeliveryPartnerName = async () => {
    try {
      const url = `${process.env.REACT_APP_API_URL}users/getdeliverypartnername`;
      const response = await axios.get(url);
      setDeliveryPartners(response.data);
    } catch (error) {
      console.error('Error fetching cart items', error);
    }
  };
  useEffect(() => {
    window.scrollTo(0, 0);
    fetchOrders();
    fetchDeliveryPartnerName();
  }, []);

  useEffect(() => {
    setOrders(customOrders.slice(min, max));
  }, [customOrders, min]);

  const findClassNames = order_status => {
    if (order_status === 'Placed') {
      return 'card-body bg-warning bg-opacity-25';
    }
    if (order_status === 'CANCELLED') {
      return 'card-body bg-danger bg-opacity-25';
    }
    if (order_status === 'COMPLETED') {
      return 'card-body bg-success bg-opacity-25';
    }
    return 'card-body bg-warning bg-opacity-25';
  };

  return (
    <>
      <section className='blog about-blog'>
        <div className='container'>
          {/* <div className="blog-bradcrum">
            <span><a href="/">Home</a></span>
            <span className="devider">/</span>
            <span><a href="OrderHistory">Orders</a></span>
          </div> */}
          <div className='blog-heading about-heading'>
            <h1 className='heading'>Orders Page 2</h1>
          </div>
        </div>
      </section>
      <section className='user-profile footer-padding'>
        <div className='container'>
          <div className='user-profile-section box-shadows'>
            <div className='user-dashboard'>
              <DashboardRoutes />
              <div className='container'>
                <div className='row'>
                  <div className='col-6'>
                    <h3>All Orders</h3>
                  </div>
                  <div className="col-6 d-grid gap-2 d-md-flex justify-content-md-end h5">
                    {count != 0 ? (<span className='fs-2 py-3'>{customOrders[min].srno} to {customOrders[max - 1].srno}</span>)
                      : (<span className='fs-2 py-3'></span>)}
                    <button className='btn btn-primary fs-4'
                      onClick={() => {
                        handlePrev();
                      }} disabled={min == 0}>Prev</button>
                    <button className="btn btn-primary fs-4"
                      onClick={() => {
                        handleNext();
                      }} disabled={max == count}>Next</button>
                  </div>
                </div>
                {loading ? (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '50vh',
                    }}
                  >
                    <img
                      src={loaderGif}
                      alt='Loading...'
                      style={{ width: '80px', height: '80px' }}
                    />
                  </div>
                ) : orders.length > 0 ? (
                  orders.map((order, index) => (

                    <div key={index} className='card mt-3'
                      style={{
                        cursor: usertype === 'user' && order.order_status === 'COMPLETED' && order.delivery_status === 'DELIVERED' ? 'pointer' : 'default'
                      }}
                      onClick={() => {
                        if (usertype === 'user' && order.order_status === 'COMPLETED' && order.delivery_status === 'DELIVERED') {
                          handleOrderSuccess(order.order_id);
                        }
                      }}>
                      <div className={findClassNames(order.order_status)}>
                        <div className='row'>
                          {/* <div className="col-md-3">
                            <img src="https://picsum.photos/500/200" className="img-fluid" alt="dummy" />
                          </div> */}
                          <div className='col-sm-12 '>
                            {/* <h5 className="card-title">
                              
                              <strong style={{ cursor: 'pointer' }} onClick={() => handleOrderClick(order.order_id)}>
                                {index+1}.ORD ID {order.order_id} , Total ₹{order.paymentamount}
                              </strong>
                            </h5> */}
                            {/* <div className='row'>
                              <div className='col-9'>
                                <h5 className="card-title">
                                  <strong style={{ cursor: 'pointer' }} onClick={() => handleOrderClick(order.order_id)}>
                                    Order NO - {order.srno}. Total ₹{order.paymentamount}
                                  </strong>
                                </h5>
                              </div>

                              <div className='col-2 button-container'>
                                <button className="view_details_btn shop-btn shop-btn-nomargin" onClick={() => handleOrderClick(order.order_id)}>
                                  View Details
                                </button>
                              </div>
                              <div className='col-2 button-container'>
                              <button className="view_details_btn shop-btn shop-btn-nomargin" onClick={() => handleOrderClick(order.order_id)}>
                                  Mark Complete
                                </button>
                              </div>

                            </div> */}
                            <div className='order-card'>
                              <div className='order-details'>
                                <h5 className='card-title'>
                                  <strong
                                    style={{ cursor: 'pointer' }}
                                    onClick={() =>
                                      handleOrderClick(order.order_id)
                                    }
                                  >
                                    Order NO - {order.srno}. Total ₹
                                    {order.paymentamount}
                                  </strong>
                                </h5>
                              </div>

                              {usertype === 'admin' && (
                                <div className='order-actions'>
                                  {order.order_status === 'Placed' && (
                                    <button
                                      className='mark-cancelled-btn'
                                      onClick={() =>
                                        handleOrderCancel(order.order_id)
                                      }
                                    >
                                      Cancel Order
                                    </button>
                                  )}



                                  {order.delivery_status === 'Pending' && (
                                    <button
                                      className='mark-complete-btn'
                                      onClick={() =>
                                        handleDelivered(order.order_id)
                                      }
                                    >
                                      Mark Delivered
                                    </button>
                                  )}
                                  {order.order_status === 'Placed' && (
                                    <button
                                      className='mark-complete-btn'
                                      onClick={() =>
                                        handleMarkComplete(order.order_id)
                                      }
                                    >
                                      Mark Complete
                                    </button>
                                  )}

                                  <button
                                    className='view-details-btn'
                                    onClick={(event) => {
                                      preventClickPropagation(event);
                                      handleOrderClick(order.order_id)
                                    }}
                                  >
                                    View Details
                                  </button>
                                </div>
                              )}
                              {usertype === 'deliverypartner' && (
                                <div className='order-actions'>
                                  {/* {(order.delivery_status!=='CANCELLED' ) &&<button className="mark-cancelled-btn" onClick={() => handleDeliveryCancel(order.order_id)}>
                                  Cancel Delivery
                                </button> } */}

                                  {order.delivery_status === 'Pending' && (
                                    <button
                                      className='mark-complete-btn'
                                      onClick={() =>
                                        handleDelivered(order.order_id)
                                      }
                                    >
                                      Mark Delivered
                                    </button>
                                  )}

                                  <button
                                    className='view-details-btn'
                                    onClick={() =>
                                      handleOrderClick(order.order_id)
                                    }
                                  >
                                    View Details
                                  </button>
                                </div>
                              )}

                              {usertype === 'user' && (
                                <div className='order-actions'>
                                  <button
                                    className='view-details-btn'
                                    onClick={(event) => {
                                      preventClickPropagation(event);
                                      handleOrderClick(order.order_id)
                                    }}
                                  >
                                    View Details
                                  </button>
                                </div>
                              )}

                              {usertype === 'admin' && (
                                <div className='order-actions'>
                                  {!hidePaymentButtons[order.order_id] ? (
                                    <>
                                      <button
                                        id={`pay-cash-${order.order_id}`}
                                        className='btn btn-warning'
                                        onClick={() => handlePaymentModeChange(order.order_id, 'cash')}
                                      >
                                        Pay in Cash
                                      </button>
                                      <button
                                        id={`pay-upi-${order.order_id}`}
                                        className='btn btn-warning'
                                        onClick={() => handlePaymentModeChange(order.order_id, 'UPI')}
                                      >
                                        Pay by UPI
                                      </button>
                                    </>
                                  ) : null} {/* No message displayed after payment mode is selected */}
                                </div>
                              )}

                            </div>
                            <div className='text-end'></div>
                            <p>
                              <strong>Customer Name - </strong> {order.name}
                            </p>
                            <p>
                              <strong>Order ID - </strong> {order.order_id}
                            </p>
                            <p>
                              <strong>Placed on - </strong> {order.order_date},{' '}
                              {order.order_time.substring(0, 4) + ' ' + order.order_time.substring(8, 12).toUpperCase()}
                            </p>
                            <p>
                              <strong>Order Status -</strong>{' '}
                              {order.order_status}
                            </p>
                            <p>
                              <strong>Delivery Status -</strong>{' '}
                              {order.delivery_status}
                            </p>
                            < p >
                              <strong>Delivery Partner -</strong>{' '}

                              {deliverypartners.map((partner, index) => (
                                (order.delivery_partner === partner.userid) ? <span>{'  '}{partner.name}</span> : <span>{' '}</span>
                              ))
                              }
                            </p>
                            <p>
                              <strong>Payment Mode -</strong>{' '}
                              {order.paymentmode}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No orders found.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section >
    </>
  );
};

export default OrderHistory2;
