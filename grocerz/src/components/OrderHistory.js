import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import DashboardRoutes from './DashboardRoutes';
import loaderGif from '../assets/images/loader.gif';

import { FcNext } from "react-icons/fc";

const OrderHistory = () => {
  const userid = localStorage.getItem('userid');
  const usertype = localStorage.getItem('usertype');
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const ordersPerPage = 5;

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [deliverypartners, setDeliveryPartners] = useState([]);

  // const [size,setSize] = useState(10)
  // const [array, setArray] = useState(() => Array(10).fill(undefined));
  // const [start,setStart] = useState(0)
  // const [end,setEnd] = useState(10)
  // const [upper,setUpper] = useState(10)

  // useEffect(() => {
  //   console.log("useEffect = ",array); 
  //   setArray(orders.slice(start,end))
  //   setUpper(start+array.length)
  // },[start,end]) 
  // useEffect(() => {
  //   setUpper(start+array.length)
  // },[array]) 
  // useEffect(() => {
  //   if (orders.length > 0) {
  //     setArray(orders.slice(0, 10));
  //   }
  // }, [orders]);

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
      let url;
      let response;
      if (usertype !== 'user') {
        url = 'orders/allOrders';
        response = await axios.get(`${process.env.REACT_APP_API_URL}${url}`);
        setOrders(response.data);
      } else {
        url = `orders/getUserOrders/${userid}?page=${currentPage}&limit=${ordersPerPage}`;
        response = await axios.get(`${process.env.REACT_APP_API_URL}${url}`);
        
        if (response.data.success) {
          setOrders(response.data.orders);
          setTotalPages(response.data.totalPages);
          setTotalOrders(response.data.totalOrders);
        } else {
          console.error('API Error:', response.data.error);
          setOrders([]);
        }
      }
      console.log(`res=${response}\n url=${url}`);
    } catch (error) {
      console.error('Error fetching orders', error);
      setOrders([]);
    }
    setLoading(false);
  };

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
  }, [currentPage]);

  // useEffect(() => {
  //   fetchDeliveryPartnerName();
  // }, [fetchDeliveryPartnerName]);

  const findClassNames = (order_status, delivery_status) => {
    if (order_status === 'COMPLETED' && delivery_status === 'DELIVERED') {
      return 'card-body bg-opacity-25 bg-success';
    }
    if (delivery_status === 'DELIVERED') {
      return 'card-body bg-info bg-opacity-25';
    }
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

  // async function handlePrev()
  // {
  //   if(start==0 ) return

  //   setStart(start-size)
  //   setEnd(end-size)

  //   console.log(array);
  // }


  // async function handleNext()
  // {
  //   if(end==orders.length) return 
  //   if(end+size>orders.length)
  //   {
  //     if(end>orders.length || end==orders.length) return 

  //     setEnd(end+size)
  //     setStart(start+size)
  //   }
  //   else
  //   {
  //     setEnd(end+size)
  //     setStart(start+size)
  //   }
  //   console.log(array);
  // }

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
            <h1 className='heading'>Orders</h1>
          </div>
        </div>
      </section>
      <section className='user-profile footer-padding'>
        <div className='container'>
          <div className='user-profile-section box-shadows'>
            <div className='user-dashboard'>
              <DashboardRoutes />
              <div className='container'>
                <div className='d-flex justify-content-between'>
                  <div>
                    <h3>
                      All Orders
                    </h3>
                  </div>
                  {/* <div className='fs-3'> 
                    {start+1} - {upper}
                  </div>
                  <div className='d-flex gap-4'>
                    <div>
                      {start===0 ? 
                      (
                        <div></div>
                      )
                      : 
                      (
                        <button onClick={handlePrev} className='btn btn-primary fs-3'>
                          prev
                        </button>
                      ) 
                      }
                      
                    </div>
                    <div>
                      {end>=orders.length ? 
                      (
                        <div></div>
                      ) : 
                      (
                        <button onClick={handleNext} className='btn btn-primary fs-3'>
                          next
                        </button>
                      )
                      }
                    </div>
                  </div> */}
                </div>


                <div className="d-flex justify-content-center align-items-center mb-4 flex-wrap gap-3">
                  <button
                    className="btn btn-success btn-lg px-4"
                    onClick={handlePrev}
                    disabled={currentPage === 1}
                  >
                    &laquo; Previous
                  </button>

                  <div className="d-flex align-items-center">
                    <select
                      className="form-select mx-2"
                      style={{ width: '100px', color: 'blue', fontWeight: 'bold' }}
                      value={currentPage}
                      onChange={(e) => setCurrentPage(Number(e.target.value))}
                      disabled={loading}
                    >
                      {[...Array(totalPages).keys()].map((num) => (
                        <option key={num + 1} value={num + 1}>
                          Page {num + 1}
                        </option>
                      ))}
                    </select>
                    <span className="fw-bold">
                      of {totalPages}
                    </span>
                  </div>

                  <button
                    className="btn btn-success btn-lg px-4"
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                  >
                    Next &raquo;
                  </button>
                </div>






                {loading ? (
                  <div className='loader-div'>
                    <img className='loader-img'
                      src={loaderGif}
                      alt='Loading...' />
                  </div>
                ) : orders.length > 0 ? (
                  orders.map((order, index) => (

                    <div key={index} className='card mt-3  h-50vh overflow-y-auto'
                      style={{
                        cursor: usertype === 'user' && order.order_status === 'COMPLETED' && order.delivery_status === 'DELIVERED' ? 'pointer' : 'default'
                      }}
                      onClick={() => {
                        if (usertype === 'user' && order.order_status === 'COMPLETED' && order.delivery_status === 'DELIVERED') {
                          handleOrderSuccess(order.order_id);
                        }
                      }}>
                      <div className={findClassNames(order.order_status, order.delivery_status)}>
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
                                  {/* <strong
                                    style={{ cursor: 'pointer' }}
                                    onClick={() =>
                                      handleOrderClick(order.order_id)
                                    }
                                  > */}
                                  Order No {order.srno} - Total ₹
                                  {order.paymentamount}
                                  {/* </strong> */}
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
                                </div>
                              )}

                              {usertype === 'admin' && (
                                <div className='order-actions'>
                                  {(order.paymentmode === 'DUE - COD/QR/UPI' && order.delivery_status !== 'CANCELLED') ? (
                                    <>
                                      <button
                                        id={`pay-cash-${order.order_id}`}
                                        className=' view-details-btn pay-button'
                                        onClick={() => handlePaymentModeChange(order.order_id, 'Cash')}
                                      >
                                        Cash
                                      </button>
                                      <button
                                        id={`pay-upi-${order.order_id}`}
                                        className=' view-details-btn pay-button'
                                        onClick={() => handlePaymentModeChange(order.order_id, 'UPI')}
                                      >
                                        UPI
                                      </button>
                                    </>
                                  ) : null} {/* No message displayed after payment mode is selected */}
                                </div>
                              )}

                            </div>
                            <div className='text-end'></div>
                            <p>
                              <strong>Customer Name - </strong> {order.name} - {order.mobile}
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
                            {usertype === 'admin' && (
                              <p>
                                <strong >Cost Amount -</strong>{' '}
                                <span>₹{order.costamount}</span>
                              </p>
                            )}
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

export default OrderHistory;
