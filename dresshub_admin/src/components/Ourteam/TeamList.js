import React, { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import SearchBox from "../shared/SearchBox";
import { ConfirmationModal } from "../shared/ConfirmationModal";
import axios from "axios";
import { toast } from "react-toastify";

import useFetch from "../../hooks/useFetch";

const TeamList = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState(null);

  const url = `ourteam/allourteam?page=${page}&limit=${limit}&search=${search}`;

  const { data, loading, error, refetch } = useFetch(url, {
    enabled: true,
    retries: 2,
  });

  const handleDeleteClick = (id) => {
    setSelectedTeamId(id);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem("jwttoken");

      await axios.put(
        `${process.env.REACT_APP_API_URL}ourteam/removeourteam/${selectedTeamId}`,
        {},
        {
          headers: {
            "x-access-token": token,
          },
        }
      );

      toast.success("Team member deleted successfully");

      setShowModal(false);
      setSelectedTeamId(null);
      refetch();

    } catch (err) {
      console.log("Error deleting team member:", err);
      toast.error("Failed to delete team member");
      setShowModal(false);
    }
  };

  const handleSearch = useCallback((value) => {
    setPage(1);
    setSearch(value);
  }, []);

  const team = data?.data || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div className="container mt-4">

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="text-success fw-bold">Team List</h2>

        <SearchBox
          placeholder="Search Team..."
          onSearch={handleSearch}
          delay={500}
        />

        <Link to="/addTeam" className="btn btn-success">
          ➕ Add Team Member
        </Link>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-success text-center">
            <tr>
              <th>No</th>
              <th>Name</th>
              <th>Designation</th>
              <th>Department</th>
              <th>Image</th>
              <th>Description</th>
              <th>Sequence</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="text-center p-3">
                  <Spinner animation="border" variant="success" />
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="8" className="text-center text-danger">
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
            ) : team.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center text-muted py-4">
                  No team members found.
                </td>
              </tr>
            ) : (
              team.map((item, index) => (
                <tr key={item.id} className="text-center">
                  <td>{(page - 1) * limit + index + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.designation}</td>
                  <td>{item.department}</td>

                  <td>
                    <img
                      src={`${process.env.REACT_APP_API_URL}/${item.image}`}
                      alt={item.name}
                      width="50"
                      height="50"
                      style={{
                        objectFit: "cover",
                        borderRadius: "50%",
                      }}
                    />
                  </td>

                  <td>{item.description}</td>
                  <td>{item.sequence}</td>

                  <td>
                    <Link
                      to={`/updateTeam/${item.id}`}
                      className="btn btn-outline-success btn-sm me-2"
                    >
                      ✏️ Edit
                    </Link>

                    <button
                      onClick={() => handleDeleteClick(item.id)}
                      className="btn btn-outline-danger btn-sm"
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

      {/*PAGINATION... */}
      <div className="d-flex justify-content-center align-items-center mt-3 gap-3 flex-wrap">
        <button
          className="btn btn-success btn-sm"
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
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
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next ➡
        </button>
      </div>
     
     {/*ConfirmationModel  */}
      <ConfirmationModal
        show={showModal}
        onHide={() => setShowModal(false)}
        confirmation={confirmDelete}
        operationType="Delete"
        modalMessage="Are you sure you want to delete this team member?"
        wantToAddData={true}
      />
    </div>
  );
};

export default TeamList;