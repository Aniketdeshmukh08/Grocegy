import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ConfirmationModal } from '../shared/ConfirmationModal';
import { toast } from 'react-toastify';
import Spinner from 'react-bootstrap/Spinner';
import 'react-toastify/dist/ReactToastify.css';

const WishlistList = () => {
  const [data, setData] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [deletedId, setDeletedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const handleDelete = (userid) => {
    setDeletedId(userid);
    setModalShow(true);
  };

  const confirmDeleteWishlist = async () => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}wishlist/emptyWishList/${deletedId}`
      );
      // Update state locally to reflect the change immediately
      setData(prevData => prevData.filter(item => item.userid !== deletedId));
      toast.success("Wishlist for the user has been emptied!");
    } catch (err) {
      console.log(err);
      toast.error("Failed to empty the wishlist.");
    } finally {
      setModalShow(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}wishlist/allWishlistItems`
        );
        setData(response.data);
      } catch (error) {
        console.log(error);
        setError("Could not fetch wishlist data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []); // Dependency array is empty to fetch only once on mount

  return (
    <>
      
      <div className='container mt-4'>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className='text-success fw-bold'>Wishlist Details</h2>
          <Link to='/wishlistCreate' className='btn btn-success'>
            ➕ Add New Wishlist Item
          </Link>
        </div>
        <div className="table-responsive">
          <table className='table table-bordered table-hover align-middle'>
            <thead className='table-success text-center'>
              <tr>
                <th>Sr. No.</th>
                <th>User ID</th>
                <th>Product ID</th>
                <th>Wishlist Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="text-center p-3"><Spinner animation="border" variant="success" /></td></tr>
              ) : error ? (
                <tr><td colSpan="5" className="text-center text-danger py-4 fw-semibold">{error}</td></tr>
              ) : data.length === 0 ? (
                <tr><td colSpan="5" className="text-center text-muted py-4">No wishlist items found.</td></tr>
              ) : (
                data.map((item, i) => (
                  <tr key={i} className="text-center">
                    <td>{item.srno}</td>
                    <td className="fw-semibold text-success">{item.userid}</td>
                    <td>{item.productid}</td>
                    <td>{new Date(item.wishlist_date).toLocaleDateString()}</td>
                    <td>
                      <Link to={`/wishlistUpdate/${item.userid}`} className='btn btn-outline-success btn-sm me-2'>
                        ✏️ Edit
                      </Link>
                      <button onClick={() => handleDelete(item.userid)} className='btn btn-outline-danger btn-sm'>
                        🗑️ Empty Wishlist
                      </button>
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
        modalMessage="You are about to empty the entire wishlist for this user. Are you sure?"
        onHide={() => setModalShow(false)}
        confirmation={confirmDeleteWishlist}
        operationType="Delete"
        wantToAddData={true}
      />
    </>
  );
};

export default WishlistList;