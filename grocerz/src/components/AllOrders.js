import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import DashboardRoutes from './DashboardRoutes';
import loaderGif from '../assets/images/loader.gif';
const AllOrders = () => {
  const usertype = localStorage.getItem('usertype');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deliverypartners, setDeliveryPartners] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [clickedButton, setClickedButton] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(50);
  const [selectedId, setSelectedId] = useState(null);
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [showdeliveredPopup, setShowDeliveredPopup] = useState(false);
  const [showcompletedPopup, setShowCompletedPopup] = useState(false);
  const navigate = useNavigate();

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
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
      const url =
        process.env.REACT_APP_API_URL + 'orders/markascompleted/' + orderid;
      const response = await axios.put(url);
      fetchOrders();
    } catch (error) {
      console.error('Error fetching cart items', error);
    } finally {
      setLoading(false);
      setSelectedId(null);
      setShowCompletedPopup(false);
    }
  };
  const handleOrderCancel = async orderid => {
    setLoading(true);
    try {
      const url =
        process.env.REACT_APP_API_URL + 'orders/markascancelled/' + orderid;
      const response = await axios.put(url);
      handleDeliveryCancel(orderid);
      fetchOrders();
    } catch (error) {
      console.error('Error fetching cart items', error);
    } finally {
      setLoading(false);
      setSelectedId(null);
      setShowCancelPopup(false);
    }
  };
  const handleDelivered = async orderid => {
    setLoading(true);
    try {
      const url =
        process.env.REACT_APP_API_URL + 'orders/markdelivered/' + orderid;
      const response = await axios.put(url);
      fetchOrders();
    } catch (error) {
      console.error('Error fetching cart items', error);
    } finally {
      setLoading(false);
      setSelectedId(null)
      setShowDeliveredPopup(false);
    }
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


  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setCurrentPage(1);
    setClickedButton(newFilter);
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 50,
      };

      if (filter !== 'ALL') {
        params.order_status = filter;
      }
      const url = process.env.REACT_APP_API_URL + 'orders/get_orders'
      const response = await axios.get(url, { params });
      setOrders(response.data.orders);
      const totalOrders = (response.data.totalOrders);
      setTotalPages(Math.ceil(totalOrders / limit));
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
    finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchOrders();
  }, [currentPage, filter]);

  return (
    <>
      <section className='blog about-blog'>
        <div className='container'>
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
                <div className="d-flex align-items-center justify-content-between mt-3">
                  <button
                    className="shop-btn my-1"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    &laquo; Previous
                  </button>

                  {/* <div className="d-flex justify-content-center">
                    <button
                      className={`shop-btn mx-1 ${clickedButton === 'ALL' ? 'active' : ''}`}
                      onClick={() => handleFilterChange('ALL')}
                    >
                      All Orders
                    </button>
                    <button
                      className={`shop-btn mx-1 ${clickedButton === 'Placed' ? 'active' : ''}`}
                      onClick={() => handleFilterChange('Placed')}
                    >
                      Pending Orders
                    </button>
                    <button
                      className={`shop-btn mx-1 ${clickedButton === 'COMPLETED' ? 'active' : ''}`}
                      onClick={() => handleFilterChange('COMPLETED')}
                    >
                      Delivered
                    </button>
                    <button
                      className={`shop-btn mx-1 ${clickedButton === 'CANCELLED' ? 'active' : ''}`}
                      onClick={() => handleFilterChange('CANCELLED')}
                    >
                      Cancelled
                    </button>
                  </div> */}
                  <span className="mx-3 d-flex align-items-center gap-2 badge bg-light text-dark p-2 fs-4">
                    <select
                      className="form-select form-select-sm fw-bold text-primary"
                      style={{ width: '90px' }}
                      value={currentPage}
                      onChange={(e) => handlePageChange(Number(e.target.value))}
                    >
                      {[...Array(totalPages)].map((_, index) => (
                        <option key={index + 1} value={index + 1}>
                          Page {index + 1}
                        </option>
                      ))}
                    </select>
                    <span className="text-muted">of {totalPages}</span>
                  </span>

                  <button
                    className="shop-btn my-1"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next &raquo;
                  </button>
                </div>
                <div className='d-flex justify-content-between'>
                  <div>
                    <h3>
                      {clickedButton.charAt(0).toUpperCase() + clickedButton.slice(1).toLowerCase()} Orders
                    </h3>

                  </div>
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
                          <div className='col-sm-12 '>
                            <div className='order-card'>
                              <div className='order-details'>
                                <h5 className='card-title'>
                                  Order No {order.srno} - Total ₹
                                  {order.paymentamount}
                                </h5>
                              </div>

                              {usertype === 'admin' && (
                                <div className='order-actions'>
                                  {order.order_status === 'Placed' && (
                                    <button
                                      className='mark-cancelled-btn'
                                      onClick={() => {
                                        setSelectedId(order.order_id);
                                        setShowCancelPopup(true)
                                      }
                                      }
                                    >
                                      Cancel Order
                                    </button>
                                  )}
                                  {order.delivery_status === 'Pending' && (
                                    <button
                                      className='mark-complete-btn'
                                      onClick={() => {
                                        setSelectedId(order.order_id);
                                        setShowDeliveredPopup(true)
                                      }
                                      }
                                    >
                                      Mark Delivered
                                    </button>
                                  )}
                                  {order.order_status === 'Placed' && (
                                    <button
                                      className='mark-complete-btn'
                                      onClick={() => {
                                        setSelectedId(order.order_id)
                                        setShowCompletedPopup(true)
                                      }
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

                              {/* {usertype === 'admin' && (
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
                                  ) : null}
                                </div>
                              )} */}

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
                              <strong>Payment Status -</strong>{' '}
                               <span>{order.paymentstatus}</span>
                              {/* {order.paymentmode == "Both" ? `cash: ${order.payment_cash} + online: ${order.payment_online}` : 
                              (order.paymentmode == "cash" ? `cash: ${order.payment_cash}` :
                              order.paymentmode == "online" ? `online: ${order.payment_online}` :` ${order.paymentmode}`)} */}
                            </p>
                            <p>
                              <strong>Paid Amount - </strong>{' '}
                              <span>Cash - {order.payment_cash || 0} / Online  - {order.payment_online ||0}</span>{' '}
                            </p>
                            <p>
                              <strong>Bill Status - </strong>{' '}
                              <span>{order.billstatus ? 'Final' : 'Not Final'}</span>{' '}
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
        {showCancelPopup && (
          <div className='popup-overlay'>
            <div className='popup-content'>
              <h3>Cancel Order</h3>
              <h3>Are you sure you want to cancel this order?</h3>

              <button className='btn shop-btn' onClick={() => { handleOrderCancel(selectedId) }}>
                Mark Cancelled
              </button>
              <button className='btn shop-btn' onClick={() => setShowCancelPopup(false)}>
                Cancel
              </button>
            </div>
          </div>
        )}
        {showcompletedPopup && (
          <div className='popup-overlay'>
            <div className='popup-content'>
              <h3>Mark Complete</h3>
              <h3>Are you sure you want to mark this order as Completed?</h3>

              <button className='btn shop-btn' onClick={() => { handleMarkComplete(selectedId) }}>
                Mark completed
              </button>
              <button className='btn shop-btn' onClick={() => setShowCompletedPopup(false)}>
                Cancel
              </button>
            </div>
          </div>
        )}
        {showdeliveredPopup && (
          <div className='popup-overlay'>
            <div className='popup-content'>
              <h3>Mark Delivered</h3>
              <h3>Are you sure you want to mark this order as delivered?</h3>
              <button className='btn shop-btn' onClick={() => { handleDelivered(selectedId) }}>
                Mark Delivered
              </button>
              <button className='btn shop-btn' onClick={() => setShowDeliveredPopup(false)}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </section >
    </>
  );
};

export default AllOrders;
