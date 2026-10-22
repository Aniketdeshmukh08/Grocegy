import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { ConfirmationModal } from '../shared/ConfirmationModal';
import Spinner from 'react-bootstrap/Spinner';
import 'react-toastify/dist/ReactToastify.css';
import SearchBar from '../brand/SearchBar';
import { set } from 'jodit/esm/core/helpers';
import ClearButton from '../clear/clear';

const CustomerDetails = () => {
  const [customers, setCustomers] = useState([]);
  const [originalcustomers, setOriginalCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [searchText, setSearchText] = useState('');

  const fetchCustomers = async () => {
    try {
      //const resAllUsers = await axios.get(`${process.env.REACT_APP_API_URL}customer/showallcustomer`);
      //  setData(resAllUsers.data);

      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}customer/customer/customerDetails`
      );
      console.log(res);
      setCustomers(res.data);
      setOriginalCustomers(res.data);
      // const resUserData = await axios.get(`${process.env.REACT_APP_API_URL}customer/customerDetails`);
      // setData(resUserData.data);
    } catch (err) {
      toast.error('Failed to fetch customers');
    } finally {
        setLoading(false);
      }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    
    try {
      const token = localStorage.getItem('jwttoken');
      await axios.put(
        `${process.env.REACT_APP_API_URL}customer/customer/removeCustomerAndUser/${deleteId}`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': token
          }
        }
      );
      setCustomers(prevCustomers => 
        prevCustomers.filter(cust => cust.userid !== deleteId)
      );
      toast.success('Customer deleted successfully');
    } catch (err) {
      console.error('Error deleting customer:', err);
      toast.error('Failed to delete customer');
      fetchCustomers();
    } finally {
      closeDeleteModal();
    }
  };

   const openDeleteModal = (id) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteId(null);
    setIsDeleteModalOpen(false);
  };

  function handleSearchTextSubmission(value){
    setSearchText(value);
  }

  useEffect(()=>{
    if(searchText!==""){
      filterSearchText(searchText);
    }

    return ()=>{
      setSearchText("");
    }
  }, [searchText]);

  async function filterSearchText(value){
    setLoading(true);
    try{
      let data = await axios.get(`${process.env.REACT_APP_API_URL}customer/searchItem/${value}`);
      if(data.status==200){ 
        let filteredBrands = data.data.filteredData || [];
        if(filteredBrands.length>0){
          setCustomers(filteredBrands);
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
    <div>
      <ToastContainer position="top-right" autoClose={2500} />
      <div className="container-fluid mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex mb-3">
              <h2 className="text-success fw-bold">Customer List</h2>
              <SearchBar placeholder='Search Customers ...' searchValueFn={handleSearchTextSubmission} />
            <ClearButton
              data={customers}
              setData={setCustomers}
              searchText={searchText}
              setSearchText={setSearchText}
              originalData={originalcustomers} /> 
            </div>
          <Link to="/CustomerCreate" className="btn btn-success">
            ➕ Add New Customer
          </Link>
        </div>

        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-success text-center">
              <tr>
                <th>SR No</th>
                <th>User ID</th>
                <th>Username</th>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Password</th>  
                <th>City</th>
                <th>Address</th>
                <th>Contact</th>
                <th>Pincode</th>
                <th>Profile</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="12" className="text-center p-3">
                    <Spinner animation="border" variant="success" />
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="12" className="text-center text-danger py-4 fw-semibold">
                    {error}
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan="12" className="text-center text-muted py-4">
                    No customers found.
                  </td>
                </tr>
              ) : (
                customers.map((user, i) => (
                  <tr key={i} className="text-center">
                    <td>{user.cust_det_srno}</td>
                    <td>{user.userid}</td>
                    <td>{user.username}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.mobile}</td>
                    <td>{user.password}</td>
                    <td>{user.city}</td>
                    <td>{user.address}</td>
                    <td>{user.alternatecontact}</td>
                    <td>{user.pincode}</td>
                    <td>
                      {user.profile_photo ? (
                        <img
                          src={user.profile_photo}
                          alt="profile"
                          style={{ height: '40px', width: '40px', objectFit: 'cover' }}
                          className="rounded"
                        />

                      ) : (
                        'N/A'
                      )}
                    </td>
                    <td>
                      <Link
                        to={`/customerUpdate/${user.userid}`}
                        className="btn btn-outline-success btn-sm me-2"
                      >
                        ✏️ Edit
                      </Link>
                      <button
                        onClick={() => openDeleteModal(user.userid)}
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

        <ConfirmationModal
          show={isDeleteModalOpen}
          modalMessage="Do you really want to remove this customer?"
          onHide={closeDeleteModal}
          confirmation={handleDelete}
          operationType="Delete"
          wantToAddData={true}
        />
      </div>
    </div>
  );
};

export default CustomerDetails;
