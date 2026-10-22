import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { ConfirmationModal } from '../shared/ConfirmationModal';
import Spinner from 'react-bootstrap/Spinner';
import { toast } from 'react-toastify';
import { ComplainDetailModal } from './ComplainDetailModal';
import SearchBar from '../brand/SearchBar';
export const ComplainsList = () => {
  const [complains, setComplains] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [DetailmodalShow, setDetailmodalShow] = useState(false);
  const [complainDetails, setComplainDetails] = useState({});
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  const getAuthHeaders = () => {
    const token = localStorage.getItem('jwttoken');
    return { headers: { "x-access-token": token } }; // match backend
  };

  const fetchComplainsList = async () => {
    setLoading(true);
    try {
      const url = process.env.REACT_APP_API_URL + 'complains/allcomplains';
      const response = await axios.get(url, getAuthHeaders());
      const sortedComplains = response.data.sort((a, b) => b.srno - a.srno);
      setComplains(sortedComplains);
    } catch (error) {
      console.log(error);
      if (error.response?.status === 401) {
        toast.error('Unauthorized. Please login again.');
        navigate('/login');
      } else {
        setError('Something went wrong while fetching complaints.');
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteComplain = (event, complainid) => {
    event.stopPropagation();
    setDeleteId(complainid);
    setModalShow(true);
  };

  const confirmDeleteComplain = async () => {
    setModalShow(false);
    try {
      const url = `${process.env.REACT_APP_API_URL}complains/removecomplains/${deleteId}`;
      await axios.put(url, {}, getAuthHeaders());
      setComplains(complains.filter((complain) => complain.complainid !== deleteId));
      toast.success('Complain Deleted Successfully');
    } catch (error) {
      console.log(error);
      toast.error('Failed to delete complaint');
    }
  };

  const toggleStatus = async (event, complain) => {
    if (event?.stopPropagation) event.stopPropagation();
    try {
      const updatedStatus = complain.resolvestatus === 'Resolved' ? 'Pending' : 'Resolved';
      complain.resolvestatus = updatedStatus;
      const url = `${process.env.REACT_APP_API_URL}complains/updatecomplains/${complain.complainid}`;
      await axios.put(url, complain, getAuthHeaders());
      fetchComplainsList();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleStatusChange = async (event, complain) => {
    event.stopPropagation();
    const newStatus = event.target.value;
    try {
      const updated = { ...complain, resolvestatus: newStatus };
      const url = `${process.env.REACT_APP_API_URL}complains/updatecomplains/${complain.complainid}`;
      await axios.put(url, updated, getAuthHeaders());
      fetchComplainsList();
      toast.success('Status updated');
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const ShowComplainDetails = (details) => {
    setDetailmodalShow(true);
    setComplainDetails(details);
  };

  const formatDateTime = (datetimeStr) => {
    try {
      return new Date(datetimeStr).toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
        timeZone: 'Asia/Kolkata',
      });
    } catch {
      return 'N/A';
    }
  };

  useEffect(() => {
    fetchComplainsList();
  }, []);

  function handleSearchTextSubmission(value) {
    setSearchText(value);
  }

  useEffect(() => {
    if (searchText !== "") {
      filterComplaintList(searchText);
    }

    return () => {
      setSearchText("");
    }
  }, [searchText]);

  async function filterComplaintList(value) {
    setLoading(true);
    try {
      let data = await axios.get(`${process.env.REACT_APP_API_URL}complains/searchItem/${value}`, getAuthHeaders());
      if (data.status == 200) {
        let filteredBrands = data.data.filteredData || [];
        if (filteredBrands.length > 0) {
          setComplains(filteredBrands);
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

  return (
    <>

      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3">

          <div className='d-flex mb-3'>
            <h2 className="text-success fw-bold">Complain List</h2>
            <SearchBar placeholder='Search ...' searchValueFn={handleSearchTextSubmission} />
          </div>

          <Link to="/complainsadd" className="btn btn-success">
            ➕ Create New Complain
          </Link>
        </div>

        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-success text-center">
              <tr>
                <th>Sr No</th>
                <th>Complain ID</th>
                <th>Order ID</th>
                <th>Name</th>
                <th>Mobile No.</th>
                <th style={{ width: '200px' }}>Subject</th>
                <th style={{ width: '280px' }}>Description</th>
                <th style={{ minWidth: '180px', whiteSpace: 'nowrap' }}>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="10" className="text-center p-3">
                    <Spinner animation="border" variant="success" />
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="10" className="text-center text-danger py-4 fw-semibold">
                    {error}
                  </td>
                </tr>
              ) : complains.length === 0 ? (
                <tr>
                  <td colSpan="10" className="text-center text-muted py-4">
                    No complains found.
                  </td>
                </tr>
              ) : (
                complains.map((temp, index) => (
                  <tr
                    key={temp.complainid}
                    className="text-center"
                    onClick={() => ShowComplainDetails(temp)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td>{index + 1}</td>
                    <td>{temp.complainid}</td>
                    <td>{temp.orderid}</td>
                    <td>{temp.name}</td>
                    <td>{temp.mobile}</td>
                    <td style={{ maxWidth: "200px", whiteSpace: 'normal', wordWrap: "break-word" }}>{temp.subject}</td>
                    <td style={{ maxWidth: "280px", whiteSpace: 'normal', wordWrap: "break-word" }}>{temp.complain_desc}</td>
                    <td>{temp.date_raised ? formatDateTime(temp.date_raised) : 'N/A'}</td>
                    <td>
                      <select
                        value={temp.resolvestatus || 'Pending'}
                        onChange={(e) => handleStatusChange(e, temp)}
                        onClick={(e) => e.stopPropagation()}
                        className={`form-select form-select-sm ${temp.resolvestatus === 'Resolved'
                          ? 'border-success'
                          : temp.resolvestatus === 'In Progress'
                            ? 'border-warning'
                            : temp.resolvestatus === 'Closed'
                              ? 'border-dark'
                              : 'border-secondary'
                          }`}
                        style={{ minWidth: '140px' }}
                      >
                        <option value="Pending">Received</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </td>
                    <td>
                      <div className="d-flex justify-content-center gap-2">
                        <Link
                          to={`/complainsedit/${temp.complainid}`}
                          className="btn btn-outline-success btn-sm me-2"
                        >
                          ✏️ Edit
                        </Link>
                        <button
                          onClick={(e) => deleteComplain(e, temp.complainid)}
                          className="btn btn-outline-danger btn-sm"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmationModal
        show={modalShow}
        modalMessage="Do you really want to delete this complain?"
        onHide={() => setModalShow(false)}
        confirmation={confirmDeleteComplain}
        operationType="Delete"
        wantToAddData={true}
      />

      <ComplainDetailModal
        show={DetailmodalShow}
        details={complainDetails}
        onHide={() => setDetailmodalShow(false)}
        toggleState={() => toggleStatus(null, complainDetails)}
      />
    </>
  );
};

export default ComplainsList;