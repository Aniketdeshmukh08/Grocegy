import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Spinner from 'react-bootstrap/Spinner';

const DeletedOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [inputValue, setInputValue] = useState(''); // For typing in input
  const [searchTerm, setSearchTerm] = useState(''); // Actual search applied

  const [error, setError] = useState('');
  const [limit] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const params = {
          page: currentPage,
          limit,
          order_status: 'DELETED',
        };

        const url =
          process.env.REACT_APP_API_URL + 'orderdetails/getDeletedOrders';
        const response = await axios.get(url, { params });

        console.log('API response:', response.data);

        setOrders(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching deleted orders:', error);
        setError('Something went wrong while fetching deleted orders.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentPage, limit]);

  // Function for search button click
  const handleSearch = () => {
    setSearchTerm(inputValue); 
  };

  return (
    <>
      
      <div className='container mt-4'>
        <div className='d-flex justify-content-between align-items-center mb-3'>
          <h2 className='text-danger fw-bold'>Deleted Order List</h2>
        </div>

        {/* Search Box */}
        <div className='input-group p-md-5'>
          <input
            className='form-control mr-sm-2'
            type='search'
            placeholder='Search by Order ID'
            aria-label='Search'
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button
            className='btn btn-outline-success'
            type='button'
            onClick={handleSearch}
          >
            Search
          </button>
        </div>

        {/* Orders Table */}
        <div className='table-responsive'>
          <table className='table table-bordered table-hover align-middle'>
            <thead className='table-danger text-center'>
              <tr>
                <th>SRNO</th>
                <th>Order ID</th>
                <th>Order Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan='4' className='text-center p-3'>
                    <Spinner animation='border' variant='danger' />
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan='4'
                    className='text-center text-danger py-4 fw-semibold'
                  >
                    {error}
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan='4' className='text-center text-muted py-4'>
                    No deleted orders found.
                  </td>
                </tr>
              ) : (
                orders
                  .filter((order) =>
                    order.order_id.toString().includes(searchTerm)
                  )
                  .map((order, index) => (
                    <tr key={order.order_id} className='text-center'>
                      <td>{index + 1}</td>
                      <td>{order.order_id}</td>
                      <td className='fw-semibold text-danger'>
                        {order.order_date} -{' '}
                        {order.order_time?.slice(
                          0,
                          order.order_time.lastIndexOf(':')
                        )}
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default DeletedOrders;
