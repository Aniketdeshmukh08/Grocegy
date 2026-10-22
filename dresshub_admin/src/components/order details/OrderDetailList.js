import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ConfirmationModal } from '../shared/ConfirmationModal'; // Assuming this component exists
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Spinner from 'react-bootstrap/Spinner';
import SearchBar from '../brand/SearchBar';

const OrderDetailsList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalShow, setModalShow] = useState(false);
  const [deletedId, setDeletedId] = useState(null);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}orderdetails/orderDetails`
        );
        setData(response.data);
      } catch (error) {
        console.error('Error fetching order details:', error);
        setError('Something went wrong while fetching order details.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = (id) => {
    setDeletedId(id);
    setModalShow(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}orderdetails/removeOrderProduct/${deletedId}`
      );
      setData(data.filter((item) => item.order_id !== deletedId));
      toast.success('Order Detail Deleted Successfully');
    } catch (err) {
      console.error('Error deleting order detail:', err);
      toast.error('Failed to delete order detail');
    }
    setModalShow(false);
  };

  function handleSearchTextSubmission(value){
    setSearchText(value);
  }

  useEffect(()=>{
    if(searchText!==""){
      filterOrderDetailsList(searchText);
    }

    return ()=>{
      setSearchText("");
    }
  }, [searchText]);

  async function filterOrderDetailsList(value) {
    setLoading(true);
    try{
      let data = await axios.get(`${process.env.REACT_APP_API_URL}orderdetails/searchItem/${value}`);
      if(data.status==200){ 
        let filteredBrands = data.data.filteredData || [];
        if(filteredBrands.length>0){
          setData(filteredBrands);
          setLoading(false);
        }else {
          setLoading(false);
          toast.warn(`No Matches were found for search text : ${value}`);
        }
      }else {
        setLoading(false);
        toast.error("Error occurred while filtering data");
      }
    }catch(err){
      setLoading(false);
      toast.error("Error occurred while fetching data");
    }
  }

  return (
    <>
      
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          
          <div className='d-flex mb-3'>
            <h2 className="text-success fw-bold">Order Details List</h2>
            <SearchBar placeholder='Search ...' searchValueFn={handleSearchTextSubmission} />
          </div>
          
          <Link to="/orderDetailsCreate" className="btn btn-success">
            ➕ Add New Order Detail
          </Link>
        </div>

        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-success text-center">
              <tr>
                <th>No</th>
                <th>Order ID</th>
                <th>Product ID</th>
                <th>Quantity</th>
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
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-muted py-4">
                    No order details found.
                  </td>
                </tr>
              ) : (
                data.map((item, i) => (
                  <tr key={i} className="text-center">
                    <td>{i + 1}</td>
                    <td>{item.order_id}</td>
                    <td>{item.productid}</td>
                    <td>{item.quantity}</td>
                    <td>
                      <Link
                        to={`/orderDetailsUpdate/${item.order_id}`}
                        className="btn btn-outline-success btn-sm me-2"
                      >
                        ✏️ Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(item.order_id)}
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
      </div>

      <ConfirmationModal
        show={modalShow}
        modalMessage="Do you really want to remove this order detail?"
        onHide={() => setModalShow(false)}
        confirmation={confirmDelete}
        operationType="Delete"
        wantToAddData={true}
      />
    </>
  );
};

export default OrderDetailsList;