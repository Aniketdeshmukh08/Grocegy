import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DashboardRoutes from './DashboardRoutes';
import loaderGif from '../assets/images/loader.gif';

const DeletedOrders = () => {
  const usertype = localStorage.getItem('usertype');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(50);
  const [deliverypartners, setDeliveryPartners] = useState([]);

  const navigate = useNavigate();

  const fetchDeliveryPartnerName = async () => {
    try {
      const url = `${process.env.REACT_APP_API_URL}users/getdeliverypartnername`;
      const response = await axios.get(url);
      setDeliveryPartners(response.data);
    } catch (error) {
      console.error('Error fetching delivery partner:', error);
    }
  };

  const fetchDeletedOrders = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit,
        order_status: 'CANCELLED'
      };

      const url = process.env.REACT_APP_API_URL + 'orders/get_orders';
      const response = await axios.get(url, { params });

      setOrders(response.data.orders);
      const totalOrders = response.data.totalOrders;
      setTotalPages(Math.ceil(totalOrders / limit));
    } catch (error) {
      console.error('Error fetching deleted orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchDeletedOrders();
    fetchDeliveryPartnerName();
  }, [currentPage]);

  if (usertype !== 'admin') {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'red', fontWeight: 'bold' }}>
        Access denied: Admins only.
      </div>
    );
  }

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleOrderClick = (orderid) => {
    navigate(`/orderhistory/orderdetail/${orderid}`);
  };

  const findClassNames = () => 'card-body bg-danger bg-opacity-25';

  return (
    <>
      <section className='blog about-blog'>
        <div className='container'>
          <div className='blog-heading about-heading'>
            <h1 className='heading'>Deleted Orders</h1>
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

                {loading ? (
                  <div className='loader-div'>
                    <img className='loader-img' src={loaderGif} alt='Loading...' />
                  </div>
                ) : orders.length > 0 ? (
                  orders.map((order, index) => (
                    <div key={index} className='card mt-3'>
                      <div className={findClassNames(order.order_status, order.delivery_status)}>
                        <div className='row'>
                          <div className='col-sm-12'>
                            <div className='order-card'>
                              <div className='order-details'>
                                <h5 className='card-title'>
                                  Order No {order.srno} - Total ₹{order.paymentamount}
                                </h5>
                              </div>
                              <div className='order-actions'>
                                <button
                                  className='view-details-btn'
                                  onClick={() => handleOrderClick(order.order_id)}
                                >
                                  View Details
                                </button>
                              </div>
                            </div>
                            <p><strong>Customer Name:</strong> {order.name} - {order.mobile}</p>
                            <p><strong>Order ID:</strong> {order.order_id}</p>
                            <p><strong>Placed on:</strong> {order.order_date}, {order.order_time}</p>
                            <p><strong>Order Status:</strong> {order.order_status}</p>
                            <p><strong>Delivery Status:</strong> {order.delivery_status}</p>
                            <p>
                              <strong>Delivery Partner:</strong>
                              {deliverypartners.map((partner) =>
                                partner.userid === order.delivery_partner ? (
                                  <span key={partner.userid}> {partner.name}</span>
                                ) : null
                              )}
                            </p>
                            <p><strong>Payment Status:</strong> {order.paymentstatus}</p>
                            <p>
                              <strong>Paid Amount:</strong> Cash - {order.payment_cash || 0} / Online - {order.payment_online || 0}
                            </p>
                            <p>
                              <strong>Bill Status:</strong> {order.billstatus ? 'Final' : 'Not Final'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No deleted orders found.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default DeletedOrders;
