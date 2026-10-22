import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import SearchBox from "../shared/SearchBox";
import { ConfirmationModal } from "../shared/ConfirmationModal";

const API_BASE = process.env.REACT_APP_API_URL.replace(/\/$/, "") + "/testimonials";

const TestimonialsList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  const fetchTestimonials = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await axios.get(
        `${API_BASE}?page=${page}&limit=${limit}&search=${search}`,
        {
          headers: {
            "x-access-token": localStorage.getItem("jwttoken"),
          },
        }
      );

      setData(res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("Error fetching testimonials:", err.response || err);
      setError("Failed to fetch testimonials.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, [page, search]);

  const handleSearch = useCallback((value) => {
    setPage(1);
    setSearch(value);
  }, []);

  const handleDelete = (id) => {
    setDeleteId(id);
    setModalShow(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    setDeleting(true);
    try {
      await axios.put(
        `${API_BASE}/remove/${deleteId}`,
        {},
        {
          headers: {
            "x-access-token": localStorage.getItem("jwttoken"),
          },
        }
      );

      setModalShow(false);
      setDeleteId(null);
      fetchTestimonials();
    } catch (err) {
      console.error("Delete testimonial error:", err.response || err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="text-success fw-bold">Testimonials List</h2>

        <SearchBox
          placeholder="Search testimonials..."
          onSearch={handleSearch}
          delay={500}
          className="mb-3"
        />

        <Link to="/testimonials/add" className="btn btn-success">
          ➕ Add New Testimonial
        </Link>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-success text-center">
            <tr>
              <th>No</th>
              <th>Author</th>
              <th>Designation</th>
              <th>Text</th>
              <th>Rating</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center p-3">
                  <Spinner animation="border" variant="success" />
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="7" className="text-center text-danger">
                  {error}
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center text-muted py-4">
                  No testimonials found.
                </td>
              </tr>
            ) : (
              data.map((item, i) => (
                <tr key={item.testimonial_Id} className="text-center">
                  <td>{(page - 1) * limit + i + 1}</td>
                  <td>{item.author_name}</td>
                  <td>{item.author_designation}</td>
                  <td>{item.testimonial_text}</td>
                  <td>{item.rating} ⭐</td>
                  <td>
                    {item.author_image ? (
                      <img
                        src={item.author_image}
                        alt="author"
                        className="rounded-circle"
                        style={{ width: "50px", height: "50px", objectFit: "cover" }}
                      />
                    ) : (
                      "No Image"
                    )}
                  </td>
                  <td>
                    <Link
                      to={`/testimonials/edit/${item.testimonial_Id}`}
                      className="btn btn-outline-success btn-sm me-2"
                    >
                      ✏️ Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(item.testimonial_Id)}
                      className="btn btn-outline-danger btn-sm"
                      disabled={deleting}
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
            {Array.from({ length: totalPages }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
          <span className="fw-semibold">of {totalPages}</span>
        </div>

        <button
          className="btn btn-success btn-sm"
          disabled={page === totalPages || totalPages === 0}
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next ➡
        </button>
      </div>

      <ConfirmationModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        confirmation={confirmDelete}
        operationType="Delete"
        modalMessage="Are you sure you want to delete this testimonial?"
        wantToAddData={true}
      />
    </div>
  );
};

export default TestimonialsList;