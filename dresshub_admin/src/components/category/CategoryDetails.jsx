import React, { useState, useCallback, useEffect } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Spinner from 'react-bootstrap/Spinner';
import { ConfirmationModal } from '../shared/ConfirmationModal';
import SearchBox from "../shared/SearchBox";

const CategoryDetails = () => {
  const [data, setData] = useState({ data: [], total: 0 });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [limit] = useState(10);

  // ================= FETCH DATA =================
  const fetchAllUsers = async () => {
    try {
      setIsLoading(true);
      setError('');

      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}category/categories?page=${page}&limit=${limit}&search=${search}`,
        {
          headers: {
            'x-access-token': localStorage.getItem('jwttoken')
          }
        }
      );

      setData(res.data);

    } catch (err) {
      console.error("FETCH ERROR:", err.response?.data || err);
      setError('Something went wrong while fetching categories.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, [page, search, limit]); // ✅ added limit (safe)

  // ================= SEARCH =================
  const handleSearch = useCallback((value) => {
    setPage(1);
    setSearch(value);
  }, []);

  // ================= ENABLE / DISABLE =================
  const handleEnableDisable = async (id, isactive) => {
    const stat = isactive === 1 ? 0 : 1; // ✅ better logic

    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}category/updatestatus/${id}`,
        { stat },
        {
          headers: {
            'x-access-token': localStorage.getItem('jwttoken')
          }
        }
      );

      toast.success('Category Status Changed successfully!');
      fetchAllUsers();

    } catch (err) {
      console.error(err);
      toast.error('Error updating category!');
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}category/removeCategory/${id}`,
        {
          headers: {
            'x-access-token': localStorage.getItem('jwttoken')
          }
        }
      );

      toast.success('Category deleted successfully!');
      fetchAllUsers();

      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);

    } catch (err) {
      console.error(err);
      toast.error('Error deleting category!');
    }
  };

  const categories = data?.data || [];

  // ✅ FIXED (important)
  const totalPages = Math.max(1, Math.ceil((data?.total || 0) / limit));

  return (
    <>
      <div className="container mt-4">

        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-3">

          <div className="d-flex align-items-center" style={{ gap: "20px" }}>
            <h2 className="text-success fw-bold mb-0">Category Details</h2>

            <SearchBox
              placeholder="Search Category..."
              onSearch={handleSearch}
              delay={500}
            />
          </div>

          <Link to="/CategoryCreate" className="btn btn-success">
            ➕ Add New Category
          </Link>
        </div>

        {/* TABLE */}
        <div className="table-responsive">
          <table className='table table-bordered table-hover align-middle'>
            <thead className="table-success text-center">
              <tr>
                <th>Sr No.</th>
                <th>Category ID</th>
                <th>Category Name</th>
                <th>Image</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="text-center p-3">
                    <Spinner animation="border" variant="success" />
                  </td>
                </tr>

              ) : error ? (
                <tr>
                  <td colSpan="5" className="text-center text-danger">
                    {error}
                  </td>
                </tr>

              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-muted">
                    No categories found.
                  </td>
                </tr>

              ) : (
                categories.map((user, i) => (
                  <tr key={i} className="text-center">
                    <td>{(page - 1) * limit + i + 1}</td>
                    <td>{user.category_id}</td>
                    <td className="fw-semibold text-success">{user.categoryname}</td>

                    <td>
                      {user.categoryimage ? (
                        <img
                          src={`${process.env.REACT_APP_API_URL}uploads/categories/${user.categoryimage}`}
                          alt={user.categoryimage}
                          width='50'
                        />
                      ) : 'No Image'}
                    </td>

                    <td>
                      <Link
                        to={`/categoryUpdate/${user.category_id}`}
                        className='btn btn-outline-success btn-sm me-2'
                      >
                        ✏️ Edit
                      </Link>

                      <button
                        onClick={() => {
                          setIsDeleteModalOpen(true);
                          setCategoryToDelete(user.category_id);
                        }}
                        className='btn btn-outline-danger btn-sm me-2'
                      >
                        🗑️ Delete
                      </button>

                      <button
                        className='btn btn-sm btn-outline-primary'
                        onClick={() => handleEnableDisable(user.category_id, user.isactive)}
                      >
                        {user.isactive === 1 ? 'Disable' : 'Enable'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PAGINATION */}
      <div className="d-flex justify-content-center align-items-center mt-3 gap-3 flex-wrap">

        {/* PREV */}
        <button
          className="btn btn-success btn-sm"
          disabled={page === 1}
          onClick={() => {
            if (page > 1) setPage(prev => prev - 1);
          }}
        >
          ⬅ Prev
        </button>

        {/* PAGE SELECT */}
        <div className="d-flex align-items-center gap-2">
          <span>Page</span>
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
          <span>of {totalPages}</span>
        </div>

        {/* NEXT */}
        <button
          className="btn btn-success btn-sm"
          disabled={page === totalPages}
          onClick={() => {
            if (page < totalPages) setPage(prev => prev + 1);
          }}
        >
          Next ➡
        </button>
      </div>

      {/* DELETE MODAL */}
      <ConfirmationModal
        show={isDeleteModalOpen}
        modalMessage="Are you sure you want to delete this category?"
        onHide={() => setIsDeleteModalOpen(false)}
        confirmation={() => handleDelete(categoryToDelete)}
        operationType="Delete"
        wantToAddData={true}
      />
    </>
  );
};

export default CategoryDetails;