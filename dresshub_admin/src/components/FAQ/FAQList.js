import React, { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import SearchBox from "../shared/SearchBox";
import { ConfirmationModal } from "../shared/ConfirmationModal";
import useFetch from "../../hooks/useFetch";
import usePut from "../../hooks/usePut";

const FAQList = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const url = `faq/faqs?page=${page}&limit=${limit}&search=${search}`;

  const { data, loading, error, refetch } = useFetch(url, {
    enabled: true,
    retries: 2,
  });

  const { updateData: deleteFAQ, loading: deleteLoading } = usePut(
    deleteId ? `faq/remove/${deleteId}` : null
  );

  const handleDelete = (id) => {
    setDeleteId(id);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteFAQ({});
      setShowModal(false);
      refetch();
    } catch (err) {
      console.log(err);
      setShowModal(false);
    }
  };

  const handleSearch = useCallback((value) => {
    setPage(1);
    setSearch(value);
  }, []);

  const faqs = data?.data || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="text-success fw-bold">FAQ List</h2>
        {/* Search */}
        <SearchBox
          placeholder="Search FAQs..."
          onSearch={handleSearch}
          delay={500}
          className="mb-3"
        />
        <Link to="/faq/create" className="btn btn-success">
          ➕ Add New FAQ
        </Link>
      </div>



      {/* Table */}
      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-success text-center">
            <tr>
              <th>No</th>
              <th>Question</th>
              <th>Answer</th>
              <th>Type</th>
              <th>Actions</th>
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
                <td colSpan="5" className="text-center text-danger">
                  {error}
                  <div className="mt-2">
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={refetch}
                    >
                      🔄 Retry
                    </button>
                  </div>
                </td>
              </tr>
            ) : faqs.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center text-muted py-4">
                  No FAQs found.
                </td>
              </tr>
            ) : (
              faqs.map((faq, index) => (
                <tr key={faq.faq_id} className="text-center">
                  <td>{(page - 1) * limit + index + 1}</td>
                  <td>{faq.question}</td>
                  <td>{faq.answer}</td>
                  <td>{faq.type}</td>
                  <td>
                    <Link
                      to={`/faq/update/${faq.faq_id}`}
                      className="btn btn-outline-success btn-sm me-2"
                    >
                      ✏️ Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(faq.faq_id)}
                      className="btn btn-outline-danger btn-sm"
                      disabled={deleteLoading}
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

      {/* Pagination */}
      {/* Pagination */}
      <div className="d-flex justify-content-center align-items-center mt-3 gap-3 flex-wrap">

        {/* Prev Button */}
        <button
          className="btn btn-success btn-sm"
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
        >
          ⬅ Prev
        </button>

        {/* Page Selector */}
        <div className="d-flex align-items-center gap-2">
          <span className="fw-semibold">Page</span>
          <select
            className="form-select form-select-sm w-auto"
            value={page}
            onChange={(e) => setPage(Number(e.target.value))}
          >
            {Array.from({ length: totalPages }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
          <span className="fw-semibold">of {totalPages}</span>
        </div>

        {/* Next Button */}
        <button
          className="btn btn-success btn-sm"
          disabled={page === totalPages || totalPages === 0}
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next ➡
        </button>

      </div>


      {/* Confirmation Modal */}
      <ConfirmationModal
        show={showModal}
        onHide={() => setShowModal(false)}
        confirmation={confirmDelete}
        operationType="Delete"
        modalMessage="Are you sure you want to delete this FAQ?"
        wantToAddData={true}
      />
    </div>
  );
};

export default FAQList;
