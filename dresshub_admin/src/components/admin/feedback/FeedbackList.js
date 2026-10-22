import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ConfirmationModal } from '../../shared/ConfirmationModal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Modal, Spinner } from 'react-bootstrap';
import SearchBar from '../../brand/SearchBar';

const FeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalShow, setModalShow] = useState(false);
  const [deletedId, setDeletedId] = useState(null);
  const [viewModalShow, setViewModalShow] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [searchText, setSearchText] = useState("");

  const fetchFeedbacks = async () => {

    console.log('feedback/getfeedbacks');

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}feedback/getfeedbacks`,
        {
          headers: {
            "x-access-token": localStorage.getItem("jwttoken")
          }
        }
      );
      

      setFeedbacks(response.data);
    } catch (err) {
      console.error('Error fetching feedbacks:', err);
      setError('Something went wrong while fetching feedbacks.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks()
  },[]);

  const removeFeedback = id => {
    setDeletedId(id);
    setModalShow(true);
  };

  const handleViewFeedback = feedback => {
    setSelectedFeedback(feedback);
    setViewModalShow(true);
  };

  const confirmDeleteFeedback = async () => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}feedback/removefeedback/${deletedId}`,
        {},
        {
          headers: {
            "x-access-token": localStorage.getItem("jwttoken")
          }
        }
      );
      setFeedbacks(prev => prev.filter(fb => fb.fId !== deletedId));
      toast.success('Feedback removed successfully');
    } catch (err) {
      console.error('Error removing feedback:', err);
      toast.error('Failed to delete feedback');
    }
    setModalShow(false);
  };

  function handleSearchTextSubmission(value) {
    
    if (value.trim() !== "") {
      setSearchText(value);
    } else {
      setSearchText("");
    }
  }

  useEffect(() => {
    if (searchText !== "") {
      filterFeedBack(searchText);
      
    }else{
      fetchFeedbacks();
    }

    // return () => {
    //   setSearchText("");
    // }
  }, [searchText]);

  async function filterFeedBack(value) {
    setLoading(true);

    try {
      let data = await axios.get(`${process.env.REACT_APP_API_URL}feedback/searchItem/${value}`,
        {
          headers: {
            "x-access-token": localStorage.getItem("jwttoken")
          }
        }
      );
      if (data.status === 200) {
        let filteredBrands = data.data.filteredData || [];

        if (filteredBrands.length > 0) {
          
          setFeedbacks(filteredBrands);
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
    <div>
      <ToastContainer position='top-right' autoClose={2500} />
      <div className='container mt-4'>
        <div className='d-flex justify-content-between align-items-center mb-3'>
          <h2 className='text-success fw-bold'>Feedback List</h2>
          <SearchBar placeholder='Search ...' searchValueFn={handleSearchTextSubmission} />
        </div>
        <div className='table-responsive'>
          <table className='table table-bordered table-hover align-middle'>
            <thead className='table-success text-center'>
              <tr>
                <th>SR NO</th>
                <th>User Name</th>
                <th>User ID</th>
                <th>Feedback ID</th>
                <th>Feedback Date</th>
                <th>Rating</th>
                <th>Message</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan='6' className='text-center p-3'>
                    <Spinner animation='border' variant='success' />
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan='6'
                    className='text-center text-danger py-4 fw-semibold'
                  >
                    {error}
                  </td>
                </tr>
              ) : feedbacks.length === 0 ? (
                <tr>
                  <td colSpan='6' className='text-center text-muted py-4'>
                    No feedbacks found.
                  </td>
                </tr>
              ) : (
                feedbacks.map((fb, index) => (
                  <tr key={fb.fId} className='text-center'>
                    <td>{index + 1}</td>
                    <td className='fw-semibold text-success'>{fb.name}</td>
                    <td>{fb.userid}</td>
                    <td>{fb.fId}</td>
                    <td>
                      {fb.createdAt
                        ? (() => {
                          try {
                            const date = new Date(fb.createdAt);
                            return isNaN(date.getTime()) ? '-' : date.toLocaleDateString();
                          } catch (error) {
                            console.log('Date parsing error:', error, fb.createdAt);
                            return '-';
                          }
                        })()
                        : '-'
                      }
                    </td>
                    <td>{fb.rating}</td>
                    <td className='text-truncate' style={{ maxWidth: '200px' }}>
                      {fb.message
                        ? fb.message.slice(0, 40) +
                        (fb.message.length > 40 ? '…' : '')
                        : '-'}
                    </td>
                    <td>
                      <button
                        onClick={() => handleViewFeedback(fb)}
                        className='btn btn-outline-primary btn-sm me-2'
                      >
                        👁 View
                      </button>
                      <button
                        onClick={() => removeFeedback(fb.fId)}
                        className='btn btn-outline-danger btn-sm'
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
      </div>

      <Modal
        show={viewModalShow}
        onHide={() => setViewModalShow(false)}
        size='sm'
        centered
        backdrop='static'
        className='confirmation-modal'
      >
        <Modal.Header className='bg-light border-bottom-0'>
          <Modal.Title className='w-100 text-center text-success fs-5'>
            Feedback Details
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className='d-flex justify-content-center'>
          {selectedFeedback ? (
            <div className='text-start '>
              <p className='mb-1'>
                <strong>Feedback ID:</strong> {selectedFeedback.fId}
              </p>
              <p className='mb-1'>
                <strong>User Name:</strong> {selectedFeedback.name}
              </p>
              <p className='mb-1'>
                <strong>User ID:</strong> {selectedFeedback.userid}
              </p>
              <p className='mb-1'>
                <strong>Email:</strong> {selectedFeedback.email}
              </p>
              <p className='mb-1'>
                <strong>Mobile:</strong> {selectedFeedback.mobile}
              </p>
              <p className='mb-1'>
                <strong>Rating:</strong> {selectedFeedback.rating}
              </p>
              <p className='mb-1'>
                <strong>Message:</strong> {selectedFeedback.message}
              </p>
            </div>
          ) : (
            <Spinner animation='border' variant='success' />
          )}
        </Modal.Body>

        <Modal.Footer className='justify-content-center border-top-0 pb-4 pt-0'>
          <button
            className='btn btn-outline-dark px-4'
            onClick={() => setViewModalShow(false)}
          >
            Close
          </button>
        </Modal.Footer>
      </Modal>

      <ConfirmationModal
        show={modalShow}
        modalMessage='Do you really want to remove this feedback?'
        onHide={() => setModalShow(false)}
        confirmation={confirmDeleteFeedback}
        operationType='Delete'
        wantToAddData={true}
      />
    </div>
  );
};

export default FeedbackList;
