import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Spinner from 'react-bootstrap/Spinner';
import SearchBar from '../brand/SearchBar';
import { toast } from 'react-toastify';
import { set } from 'jodit/esm/core/helpers';
import ClearButton from '../clear/clear';

const UsersDetails = () => {
  const [userList, setUserList] = useState([]);
  const [originalList, setOriginalList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchText, setSearchText] = useState("");

  const fetchUsersList = async () => {
    setLoading(true);
    try {
      const url = `${process.env.REACT_APP_API_URL}users/allusersdetails`;
      const response = await axios.get(url);
      setUserList(response.data);
      setOriginalList(response.data);
    } catch (error) {
      console.log("Error fetching users:", error);
      setError('Failed to fetch user details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersList();
  }, []);

  function handleSearchTextSubmission(value){
    setSearchText(value);
  }

  useEffect(()=>{
    if(searchText!==""){
      filterUserDetails(searchText);
    }

    return ()=>{
      setSearchText("");
    }
  }, [searchText]);

  async function filterUserDetails(value) {
    setLoading(true);
    try{
      let data = await axios.get(`${process.env.REACT_APP_API_URL}users/searchDetailsItem/${value}`);
      if(data.status==200){ 
        let filteredBrands = data.data.filteredData || [];
        if(filteredBrands.length>0){
          setUserList(filteredBrands);
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
    <div className="container mt-4">
      <div className='d-flex justify-content-between align-items-center mb-3'>
        <h2 className="text-success fw-bold mb-3">Users Details</h2>
        <SearchBar placeholder='Search ...' searchValueFn={handleSearchTextSubmission} />
          <ClearButton
            data={userList}
            setData={setUserList}
            searchText={searchText}
            setSearchText={setSearchText}
            originalData={originalList} />
      </div>
      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-success text-center">
            <tr>
              <th>Sr No</th>
              <th>User ID</th>
              <th>Username</th>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile No.</th>
              <th>Payment Amount</th>
              <th>Cost Amount</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="text-center p-3">
                  <Spinner animation="border" variant="success" />
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={8} className="text-center text-danger py-4 fw-semibold">
                  {error}
                </td>
              </tr>
            ) : userList.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center text-muted py-4">
                  No users found.
                </td>
              </tr>
            ) : (
              userList.map((user, index) => (
                <tr key={user.userid} className="text-center">
                  <td>{index + 1}</td>
                  <td>{user.userid}</td>
                  <td>{user.username}</td>
                  <td>{user.name}</td>
                  <td>{user.email ? user.email : '-'}</td>
                  <td>{user.mobile ? user.mobile : '-'}</td>
                  <td>{user.total_paymentamount}</td>
                  <td>{user.total_costamount}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersDetails;

