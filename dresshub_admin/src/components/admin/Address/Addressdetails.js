import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ConfirmationModal } from '../../shared/ConfirmationModal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Spinner from 'react-bootstrap/Spinner';

// New Imports matching FAQList
import SearchBox from '../../shared/SearchBox'; 
import useFetch from '../../../hooks/useFetch';
import usePut from '../../../hooks/usePut';

const Addressdetails = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [deletedId, setDeletedId] = useState(null);

  // Fetch paginated and searched data
  const url = `address/allAddress?page=${page}&limit=${limit}&search=${search}`;
  const { data: responseData, loading, error, refetch } = useFetch(url, {
    enabled: true,
    retries: 2,
  });

  // Setup Delete Hook
  const { updateData: deleteAddress, loading: deleteLoading } = usePut(
    deletedId ? `address/deleteAddress/${deletedId}` : null
  );

  const handleDelete = id => {
    setDeletedId(id);
    setModalShow(true);
  };

  const confirmDeleteAddress = async () => {
    if (!deletedId) return;
    try {
      await deleteAddress({}); // Triggers the PUT request
      toast.success('Address Deleted Successfully');
      setModalShow(false);
      refetch(); // Reload the current page of addresses
    } catch (error) {
      console.log(error);
      toast.error('Failed to delete Address');
      setModalShow(false);
    }
  };

  const handleSearch = useCallback((value) => {
    setPage(1); // Reset to first page when searching
    setSearch(value);
  }, []);

  // Extract data from the paginated API response
  const addresses = responseData?.data || [];
  const totalPages = responseData?.totalPages || 1;

  return (
    <>
      <ToastContainer position='top-right' autoClose={2500} />
      <div className='container mt-4'>
        {/* Header Section: Title, Search, Add Button */}
        <div className='d-flex justify-content-between align-items-center mb-3'>
          <h2 className='text-success fw-bold'>Address Details</h2>
          
          <SearchBox
            placeholder="Search Address..."
            onSearch={handleSearch}
            delay={500}
            className="mb-0"
          />

          <Link to='/addressadd' className='btn btn-success'>
            ➕ Add New Address
          </Link>
        </div>

        {/* Table Section */}
        <div className='table-responsive'>
          <table className='table table-bordered table-hover align-middle'>
            <thead className='table-success text-center'>
              <tr>
                <th>Sr_No</th>
                <th>UserId</th>
                <th>AddressId</th>
                <th>Name</th>
                <th>Line1</th>
                <th>Line2</th>
                <th>Line3</th>
                <th>City</th>
                <th>State</th>
                <th>Country</th>
                <th>Pincode</th>
                <th>Contact</th>
                <th>AlternateContact</th>
                <th>Landmark</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="15" className='text-center p-3'>
                    <Spinner animation="border" variant="success" />
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="15" className="text-center text-danger py-4 fw-semibold">
                    {error}
                    <div className="mt-2">
                      <button className="btn btn-sm btn-outline-danger" onClick={refetch}>
                        🔄 Retry
                      </button>
                    </div>
                  </td>
                </tr>
              ) : addresses.length === 0 ? (
                <tr>
                  <td colSpan="15" className="text-center text-muted py-4">
                    No Addresses Found.
                  </td>
                </tr>
              ) : (
                addresses.map((user, index) => {
                  return (
                    <tr key={user.addressid} className='text-center'>
                      {/* Calculate continuous serial number across pages */}
                      <td>{(page - 1) * limit + index + 1}</td>
                      <td>{user.userid}</td>
                      <td>{user.addressid}</td>
                      <td className='fw-semibold text-success'>{user.name}</td>
                      <td>{user.line1}</td>
                      <td>{user.line2}</td>
                      <td>{user.line3}</td>
                      <td>{user.city}</td>
                      <td>{user.state}</td>
                      <td>{user.country}</td>
                      <td>{user.pin}</td>
                      <td>{user.contact}</td>
                      <td>{user.alternatecontact}</td>
                      <td>{user.landmark}</td>
                      <td>
                        <div className='d-flex justify-content-center gap-2'>
                          <Link
                            to={`/addressupdate/${user.addressid}`}
                            className='btn btn-outline-success btn-sm me-2'
                          >
                            ✏️ Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(user.addressid)}
                            className='btn btn-outline-danger btn-sm'
                            disabled={deleteLoading}
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
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
      </div>

      <ConfirmationModal
        show={modalShow}
        modalMessage='Do you really want to delete this Address?'
        onHide={() => setModalShow(false)}
        confirmation={confirmDeleteAddress}
        operationType='Delete'
        wantToAddData={true}
      />
    </>
  );
};

export default Addressdetails;