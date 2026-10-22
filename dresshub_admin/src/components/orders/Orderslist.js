import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Spinner from 'react-bootstrap/Spinner';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { ConfirmationModal } from '../shared/ConfirmationModal';
import SearchBar from '../brand/SearchBar';

const Orderslist = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [deletedId, setDeletedId] = useState(null);

  const [viewModalShow, setViewModalShow] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [editingOrderId, setEditingOrderId] = useState(null);
  const [editedValues, setEditedValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchText, setSearchText] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);


  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}orders/allOrders`
      );
      setOrders(response.data);
      setFilteredOrders(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Something went wrong while fetching orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  // const handleDelete = async id => {
  //   console.log(id, 'hii');
  //   try {
  //     const confirmed = window.confirm(
  //       'Are you sure you want to delete this order?'
  //     );
  //     if (confirmed) {
  //       await axios.put(
  //         `${process.env.REACT_APP_API_URL}orders/romoveOrder/${id}`
  //       );
  //       setOrders(orders.filter(item => item.order_id !== id));

  //       window.location.reload();
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };
  const handleEditClick = (order_id) => {
    const order = orders.find(p => p.order_id === order_id);
    if (!order || !order.order_date) return;

    let formattedDate = "";

    // Case 1: if date has slashes (DD/MM/YYYY)
    if (order.order_date.includes("/")) {
      const [day, month, year] = order.order_date.split("/");
      formattedDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }
    // Case 2:  in YYYY-MM-DD
    else if (order.order_date.includes("-")) {
      formattedDate = order.order_date;
    }

    setEditingOrderId(order_id);
    setEditedValues({ order_date: formattedDate });
  };

  const handleValueChange = (field, value) => {
    setEditedValues({ ...editedValues, [field]: value });
  }

  const handleSaveClick = async orderid => {
    // setOrders(prev => prev.map(item => (item.order_id === orderid ? { ...item, ...editedValues } : item)));
    try {

      let updatedValues = { ...editedValues }; // Clone the current edited values

      if (editedValues.order_date) {
        const date = editedValues.order_date;
        const [year, month, day] = date.split("-");
        const formattedDate = `${day}/${month}/${year}`;
        updatedValues = { ...updatedValues, order_date: formattedDate };
        // console.log("Formatted date:", formattedDate); // Debug log
      }


      const url =
        process.env.REACT_APP_API_URL + `orders/updateOrder/${orderid}`;
      await axios.put(url, updatedValues);
      toast.success('Order updated successfully!');
      setEditingOrderId(null);

      fetchData();
    } catch (error) {
      console.error('Error updating Order:', error);
      toast.error('Failed to update the Order.');
    }
  };

  const handleViewClick = (order) => {
    setSelectedOrder(order);
    setViewModalShow(true);
  };

  const removeOrder = (id) => {
    setDeletedId(id);
    setModalShow(true);
  };

  const confirmDeleteOrder = async () => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}orders/romoveOrder/${deletedId}`
      );
      setOrders(orders.filter((order) => order.order_id !== deletedId));
      toast.success('Order Deleted Successfully');
    } catch (err) {
      console.log(err);
      toast.error('Failed to delete order');
    }
    setModalShow(false);
  };

  function handleSearchTextSubmission(value) {
    setSearchText(value);
  }

  useEffect(() => {
    if (searchText !== "") {
      filterOrderList(searchText);
    }

    return () => {
      setSearchText("");
    }
  }, [searchText]);

  async function filterOrderList(value) {
    setLoading(true);
    try {
      let data = await axios.get(`${process.env.REACT_APP_API_URL}orders/searchOrderInOrderList/${value}`);
      if (data.status == 200) {
        let filteredBrands = data.data.filteredData || [];
        if (filteredBrands.length > 0) {
          setOrders(filteredBrands);
          setFilteredOrders(filteredBrands);
          setCurrentPage(1);
          setLoading(false);
        } else {
          setLoading(false);
          toast.warn(`No Matches were found for search text : ${value}`);
        }
      } else {
        setLoading(false);
        toast.error("Error occurred while filtering data");
      }
    } catch (err) {
      setLoading(false);
      toast.error("Error occurred while fetching data");
    }
  }

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };


  return (
    <>
      <div className="container-fluid mt-4">
        <div className="row align-items-center mb-3 w-100 m-0 py-2">
          <div className="col-md-4 col-sm-12 mb-2 mb-md-0 ps-0">
            <h2 className="text-success fw-bold m-0">Orders List</h2>
          </div>
          <div className="col-md-4 col-sm-12 mb-2 mb-md-0 d-flex justify-content-center">
            <div className="w-100" style={{ maxWidth: '400px' }}>
              <SearchBar placeholder='Search ...' searchValueFn={handleSearchTextSubmission} />
            </div>
          </div>
          <div className="col-md-4 col-sm-12 pe-0 d-flex justify-content-md-end justify-content-start">
            <Link to="/orderCreate" className="btn btn-success">
              ➕ Add New Order
            </Link>
          </div>
        </div>

        {/* Items Per Page Selector */}
        <div className='d-flex justify-content-between align-items-center mb-3'>
          <div className='d-flex align-items-center gap-2'>
            <span className='small text-muted'>Show</span>
            <select
              className='form-select form-select-sm'
              style={{ width: '80px' }}
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className='small text-muted'>entries</span>
          </div>
          <div className='text-muted small'>
            Total Orders: <span className='fw-bold text-success'>{filteredOrders.length}</span>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-success text-center">
              <tr>
                <th>SrNo</th>
                <th>Order_id</th>
                <th>Order_date</th>
                <th>Order_time</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center p-3">
                    <Spinner animation="border" variant="success" />
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="5" className="text-center text-danger py-4 fw-semibold">
                    {error}
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-muted py-4">
                    No orders found.
                  </td>
                </tr>
              ) : (currentOrders.map((item, i) => (
                <tr key={i} className="text-center">
                  <td>{indexOfFirstItem + i + 1}</td>
                  <td>{item.order_id}</td>
                  <td>
                    {editingOrderId === item.order_id ? (
                      <div className="d-flex align-items-center justify-content-center">
                        <input
                          type='date'
                          value={editedValues.order_date}
                          className="form-control form-control-sm border-success d-inline w-auto me-2"
                          onChange={e => handleValueChange('order_date', e.target.value)}
                        />
                      </div>
                    ) : (
                      item.order_date
                    )}
                    {editingOrderId !== item.order_id && (
                       <button
                         onClick={() => handleEditClick(item.order_id)}
                         className='btn btn-outline-success btn-sm ms-2'
                         title="Edit Date"
                       >
                         ✏️
                       </button>
                    )}
                  </td>
                  <td>{item.order_time}</td>

                  <td className='now'>
                    <div className="d-flex justify-content-center">
                      <button
                        onClick={() => handleViewClick(item)}
                        className="btn btn-outline-info btn-sm me-2"
                      >
                        👁️ View
                      </button>
                      <Link
                        to={`/orderUpdate/${item.order_id}`}
                        className="btn btn-outline-success btn-sm me-2"
                      >
                        ✏️ Edit
                      </Link>
                      <button
                        onClick={() => removeOrder(item.order_id)}
                        className='btn btn-outline-danger btn-sm me-2'
                      >
                        🗑️ Delete
                      </button>

                      {editingOrderId === item.order_id && (
                        <button
                          onClick={() => handleSaveClick(item.order_id)}
                          className='btn btn-outline-primary btn-sm'
                        >
                          Save Date
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))

              )}
            </tbody>
          </table>
        </div>

        {/* Bottom Pagination */}
        <div className="d-flex justify-content-center align-items-center mt-3 gap-3 flex-wrap">
          {/* Prev Button */}
          <button
            className="btn btn-success btn-sm"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            ⬅ Prev
          </button>

          {/* Page Selector */}
          <div className="d-flex align-items-center gap-2">
            <span className="fw-semibold">Page</span>
            <select
              className="form-select form-select-sm w-auto"
              value={currentPage}
              onChange={(e) => handlePageChange(Number(e.target.value))}
            >
              {Array.from({ length: totalPages || 1 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
            <span className="fw-semibold">of {totalPages || 1}</span>
          </div>

          {/* Next Button */}
          <button
            className="btn btn-success btn-sm"
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next ➡
          </button>
        </div>
      </div>

      <ConfirmationModal
        show={modalShow}
        modalMessage="Do you really want to remove this order?"
        onHide={() => setModalShow(false)}
        confirmation={confirmDeleteOrder}
        operationType="Delete"
        wantToAddData={true}
      />

      <Modal show={viewModalShow} onHide={() => setViewModalShow(false)} size="lg" centered>
        <Modal.Header closeButton className="bg-success text-white">
          <Modal.Title className="text-white">Order Details - {selectedOrder?.order_id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <div className="container">
              <div className="row">
                 <div className="col-md-6 mb-3">
                    <h5 className="text-success border-bottom pb-2">Basic Info</h5>
                    <p className="mb-1"><strong>Order ID:</strong> {selectedOrder.order_id}</p>
                    <p className="mb-1"><strong>Order Date:</strong> {selectedOrder.order_date}</p>
                    <p className="mb-1"><strong>Order Time:</strong> {selectedOrder.order_time}</p>
                    <p className="mb-1"><strong>Order Status:</strong> <span className={`badge ${selectedOrder.order_status === 'Pending' ? 'bg-warning text-dark' : 'bg-success'}`}>{selectedOrder.order_status}</span></p>
                    <p className="mb-1"><strong>User ID:</strong> {selectedOrder.userid}</p>
                 </div>
                 <div className="col-md-6 mb-3">
                    <h5 className="text-success border-bottom pb-2">Payment Info</h5>
                    <p className="mb-1"><strong>Payment Amount:</strong> {selectedOrder.paymentamount}</p>
                    <p className="mb-1"><strong>Payment Status:</strong> {selectedOrder.paymentstatus}</p>
                    <p className="mb-1"><strong>Payment Mode:</strong> {selectedOrder.paymentmode}</p>
                 </div>
              </div>
              <div className="row mt-2">
                 <div className="col-md-6 mb-3">
                    <h5 className="text-success border-bottom pb-2">Delivery Details</h5>
                    <p className="mb-1"><strong>Address ID:</strong> {selectedOrder.addressid}</p>
                    <p className="mb-1"><strong>Delivery Status:</strong> {selectedOrder.delivery_status}</p>
                    <p className="mb-1"><strong>Tracking ID:</strong> {selectedOrder.tracking_id || 'N/A'}</p>
                    <p className="mb-1"><strong>Delivery Partner:</strong> {selectedOrder.delivery_partner || 'N/A'}</p>
                 </div>
                 <div className="col-md-6 mb-3">
                    <h5 className="text-success border-bottom pb-2">Other Info</h5>
                    <p className="mb-1"><strong>Instructions:</strong> {selectedOrder.instructions || 'None'}</p>
                    <p className="mb-1"><strong>Admin Ordered:</strong> {selectedOrder.createdby === 'admin' ? '✅ Yes' : '❌ No'}</p>
                 </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setViewModalShow(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>


    </>

  )
};

export default Orderslist;
