import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import SearchBox from "../shared/SearchBox";
import { ConfirmationModal } from "../shared/ConfirmationModal";
import Spinner from "react-bootstrap/Spinner";

export default function CustomOrdersList() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination & Search States
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, search]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}customorder/get-all-custom-orders?page=${page}&limit=${limit}&search=${search}`
      );

      if (res.data && Array.isArray(res.data.data)) {
        setOrders(res.data.data);
        setTotalPages(res.data.totalPages || 1);
      } else if (Array.isArray(res.data)) {
        setOrders(res.data);
      } else if (Array.isArray(res.data.orders)) {
        setOrders(res.data.orders);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (orderId) => {
    setDeleteId(orderId);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}customorder/delete-order/${deleteId}`
      );

      toast.success("Order deleted successfully 🗑️", {
        autoClose: 2000,
        position: "top-right",
      });

      setShowModal(false);

      // If deleting the last item on a page > 1, go back one page
      if (orders.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        fetchOrders();
      }
    } catch (error) {
      toast.error("Failed to delete order ❌", {
        autoClose: 2000,
        position: "top-right",
      });
      setShowModal(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleSearch = useCallback((value) => {
    setPage(1); 
    setSearch(value);
  }, []);

  return (
    <div className="container-fluid mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="text-success fw-bold">Custom Order List</h2>
        <SearchBox
          placeholder="Search Order..."
          onSearch={handleSearch}
          delay={500}
          className="mb-3"
        />
        <button
          className="btn btn-success"
          onClick={() => navigate("/custom-orders/create")}
        >
          ➕ Add Custom Order
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-success text-center">
            <tr>
              <th>SR NO</th>
              <th>Order ID</th>
              <th>Customer Name</th>
              <th>Total Amount</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center p-3">
                  <Spinner animation="border" variant="success" />
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center text-muted py-4">
                  No custom orders found
                </td>
              </tr>
            ) : (
              orders.map((order, index) => (
                <tr key={order.order_id || index} className="text-center">
                  <td>{(page - 1) * limit + index + 1}</td>
                  <td>{order.order_id}</td>
                  <td>{order.name || "N/A"}</td>
                  <td>Rs. {order.paymentamount || 0}</td>
                  <td>{formatDate(order.created_at)}</td>
                  <td>
                    <button
                      className="btn btn-outline-success btn-sm me-2 float-none"
                      onClick={() => navigate(`/custom-orders/edit/${order.order_id}`)}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm float-none"
                      onClick={() => handleDeleteClick(order.order_id)}
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!loading && totalPages > 0 && (
        <div className="d-flex justify-content-center align-items-center mt-3 gap-3 flex-wrap">
          <button
            className="btn btn-success btn-sm"
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
          >
            ⬅ Prev
          </button>

          <div className="d-flex align-items-center gap-2">
            <span className="fw-semibold">Page</span>
            <select
              className="form-select form-select-sm w-auto"
              value={page}
              onChange={(e) => setPage(Number(e.target.value))}
            >
              {Array.from({ length: totalPages || 1 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
            <span className="fw-semibold">of {totalPages || 1}</span>
          </div>

          <button
            className="btn btn-success btn-sm"
            disabled={page >= totalPages || totalPages === 0}
            onClick={() => setPage((prev) => prev + 1)}
          >
            Next ➡
          </button>
        </div>
      )}

      <ConfirmationModal
        show={showModal}
        onHide={() => setShowModal(false)}
        confirmation={confirmDelete}
        operationType="Delete"
        modalMessage="Are you sure you want to delete this custom order?"
        wantToAddData={true}
      />
    </div>
  );
}
