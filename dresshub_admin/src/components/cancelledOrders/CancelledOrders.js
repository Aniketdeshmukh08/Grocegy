import React from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Spinner from 'react-bootstrap/Spinner';
import { useState, useEffect } from 'react';

const CancelledOrders = () => {
    const [orders , setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [limit] = useState(50);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const params = {
                page: currentPage,
                limit,
                order_status: 'CANCELLED'
            };

            const url = process.env.REACT_APP_API_URL + 'orders/get_orders';
            const response = await axios.get(url, { params });

            setOrders(response.data.orders);
            } catch (error) {
                console.error('Error fetching cancelled orders:', error);
                setError('Something went wrong while fetching orders.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

  return (
    <>
      
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="text-success fw-bold">Cancelled Order List</h2>
        </div>

        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-success text-center">
              <tr>
                <th>SRNO</th>
                <th>Order ID</th>
                <th>Order Date</th>
                <th>Order Status</th>
                {/* <th>Actions</th> */}
              </tr>
            </thead>
            <tbody>
            {loading ? (
                <tr>
                  <td colSpan="4" className="text-center p-3">
                    <Spinner animation="border" variant="success" />
                    {/* <div className="mt-2 text-success">Loading brands...</div> */}
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="4" className="text-center text-danger py-4 fw-semibold">
                    {error}
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center text-muted py-4">
                    No cancelled order found.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.order_id} className="text-center">
                    <td>{orders.indexOf(order) + 1}</td>
                    <td>{order.order_id}</td>
                    <td className="fw-semibold text-success">{order.order_date} - {order.order_time}</td>
                    <td>{order.order_status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </>
  )
}

export default CancelledOrders;
