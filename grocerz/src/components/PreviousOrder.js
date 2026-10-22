import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DashboardRoutes from './DashboardRoutes';
import loaderGif from '../assets/images/loader.gif';

const PreviousOrder = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ordersPerPage = 5;
  const [loading, setLoading] = useState(false);


  const fetchOrders = async () => {
    setLoading(true);
    try {
      const url = `${process.env.REACT_APP_API_URL}orders/completedOrders`;
      const response = await axios.get(url);
      setOrders(response.data);
      setTotalPages(Math.ceil(response.data.length / ordersPerPage));
    } catch (error) {
      console.error('Error fetching completed orders', error);
      setOrders([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
    window.scrollTo(0, 0);
  }, [currentPage]);

  // Pagination logic
  const paginatedOrders = orders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  // Card color logic
  const findClassNames = (order_status, delivery_status) => {
    if (order_status === 'COMPLETED' && delivery_status === 'DELIVERED') {
      return 'card-body bg-opacity-25 bg-success';
    }
    return 'card-body bg-warning bg-opacity-25';
  };

  // Order detail navigation
  const handleOrderClick = orderid => {
    window.location.href = `/orderhistory/orderdetail/${orderid}`;
  };

  return (
    <>
      <section className='blog about-blog'>
        <div className='container'>
          <div className='blog-heading about-heading'>
            <h1 className='heading'>Previous Orders</h1>
          </div>
        </div>
      </section>
      <section className='user-profile footer-padding'>
        <div className='container'>
          <div className='user-profile-section box-shadows'>
            <div className='user-dashboard'>
              <DashboardRoutes />
              <div className='container'>
                <div className="d-flex justify-content-center align-items-center mb-4 flex-wrap gap-3">
                  <button
                    className="btn btn-success btn-lg px-4"
                    onClick={() => setCurrentPage(currentPage - 1)}
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
                    <span className="fw-bold">of {totalPages}</span>
                  </div>
                  <button
                    className="btn btn-success btn-lg px-4"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next &raquo;
                  </button>
                </div>
                {loading ? (
                  <div className='loader-div'>
                    <img className='loader-img' src={loaderGif} alt='Loading...' />
                  </div>
                ) : paginatedOrders.length > 0 ? (
                  paginatedOrders.map((order, index) => (
                    <div key={index} className='card mt-3  h-50vh overflow-y-auto '>
                      <div className={findClassNames(order.order_status, order.delivery_status)}>
                        <div className='row'>
                          <div className='col-sm-12'>
                            <div  style={{display:'flex', flexDirection:'column',backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', marginBottom: '15px', fontSize: '1.5rem'}}>
                              <div className='order-details' style={{display:'flex', justifyContent:"space-between"}}>
                                <h5 className='card-title'>
                                  Order No {order.srno} - Total ₹{order.paymentamount}
                                </h5>
                                <button
                                  className='view-details-btn'
                                  onClick={() => handleOrderClick(order.order_id)}
                                >
                                  View Details
                                </button>
                              </div>
                              <p>
                                <strong>Customer Name -</strong> {order.name} - {order.mobile}
                              </p>
                              <p>
                                <strong>Order ID -</strong> {order.order_id}
                              </p>
                              <p>
                                <strong>Placed on -</strong> {order.order_date}, {order.order_time}
                              </p>
                              <p>
                                <strong>Order Status -</strong> {order.order_status}
                              </p>
                              <p>
                                <strong>Delivery Status -</strong> {order.delivery_status}
                              </p>
                              <p>
                                <strong>Address ID -</strong> {order.addressid}
                              </p>
                              <p>
                                <strong>Cost Amount -</strong> ₹{order.costamount}
                              </p>
                              <p>
                                <strong>Total Discount -</strong> ₹{order.totaldiscount}
                              </p>
                              <p>
                                <strong>Additional Discount -</strong> ₹{order.additionaldiscount}
                              </p>
                              <p>
                                <strong>Coupon Discount -</strong> ₹{order.coupondiscount}
                              </p>
                              <p>
                                <strong>Payment Amount -</strong> ₹{order.paymentamount}
                              </p>
                              <p>
                                <strong>Payment Status -</strong> {order.paymentstatus}
                              </p>
                              <p>
                                <strong>Payment Mode -</strong> {order.paymentmode}
                              </p>
                              <p>
                                <strong>Order Tracking ID -</strong> {order.tracking_id}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No completed orders found.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PreviousOrder;
