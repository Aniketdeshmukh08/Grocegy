import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Spinner from 'react-bootstrap/Spinner';
import { ConfirmationModal } from '../shared/ConfirmationModal';
import SearchBar from '../brand/SearchBar';
import { set } from 'jodit/esm/core/helpers';
import ClearButton from '../clear/clear';

const UsersList = () => {
  const [userList, setUserList] = useState<any[]>([]);
  const [originalList, setOriginalList] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number| null>(null);

  const [actionType, setActionType] =
  useState<'delete' | 'activate' | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalShow, setModalShow] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [searchText, setSearchText] = useState<string>("");

  const callApiUsersList = async () => {
    setLoading(true);
    try {
      const url = process.env.REACT_APP_API_URL + 'users/allusers';
      const response = await axios.get(url);
    setUserList(response.data);
    setOriginalList(response.data);
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    callApiUsersList();
  }, []);

  const openDeleteModal = (id: number) => {
    setSelectedUserId(id);
    setActionType('delete');
    setModalMessage('Do you really want to delete this user?');
    setModalShow(true);
  };

  const openActivateModal = (id: number) => {
    setSelectedUserId(id);
    setActionType('activate');
    setModalMessage('Do you want to activate this user?');
    setModalShow(true);
  };

  const openDeactivateModal = (id: number) => {
    setSelectedUserId(id);
    setActionType('delete');
    setModalMessage('Do you want to deactivate this user?');
    setModalShow(true);
  }

  const closeModal = () => {
    setModalShow(false);
    setSelectedUserId(null);
  };

  // const deleteUser = async (id: any) => {
  //   // eslint-disable-next-line no-restricted-globals
  //   var val = confirm('Sure you want to delete user?');
  //   if (val === true) {
  //     const url = process.env.REACT_APP_API_URL + 'users/removeuser/' + id;
  //     const response = await axios.delete(url);
  //     console.log(response);
  //     toast.success('User Deleted Successfully');
  //   } else {
  //     toast.error('User not Deleted');
  //   }
  //   callApiExamsList();
  // };

  const handleConfirmAction = async () => {
  if (!selectedUserId || !actionType) return;

  try {
    if (actionType === 'delete') {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}users/removeuser/${selectedUserId}`
      );
      toast.success('User Deactivated Successfully');
    }

    if (actionType === 'activate') {
      await axios.put(
        `${process.env.REACT_APP_API_URL}users/activateuser/${selectedUserId}`
      );
      toast.success('User Activated Successfully');
    }

    callApiUsersList();
  } catch (error) {
    toast.error('Operation failed');
  }

  closeModal();
  setActionType(null);
};

  function handleSearchTextSubmission(value: string){
    setSearchText(value);
  }

  async function searchForUser(searchParam: string){
    setLoading(true);
    try{
      let data = await axios.get(`${process.env.REACT_APP_API_URL}users/searchItem/${searchParam}`);
      if(data.status==200){ 
        let filteredBrands = data.data.filteredData || [];
        if(filteredBrands.length>0){
          setUserList(filteredBrands);
          setLoading(false);
        }else {
          setLoading(false);
          toast.warn(`No Matches were found for search text : ${searchParam}`);
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

  useEffect(()=>{
    if(searchText!==""){
      searchForUser(searchText);
    }

    return ()=>{
      setSearchText("");
    }
  }, [searchText]);

  return (
    <>
      <ToastContainer position="top-right" autoClose={2500} />
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex mb-3">
            <h2 className="text-success fw-bold">Users List</h2>
            <SearchBar placeholder='Search Users ...' searchValueFn={handleSearchTextSubmission} />
            <ClearButton
                data={userList}
                setData={setUserList}
                searchText={searchText}
                setSearchText={setSearchText}
                originalData={originalList} />  
          </div>
          <Link to="/useradd" className="btn btn-success">
            ➕ Create New User
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
                <th>Created Date</th>
                <th style={{ minWidth: '180px', whiteSpace: 'nowrap' }}>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={10} className="text-center p-3">
                    <Spinner animation="border" variant="success" />
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={10} className="text-center text-danger py-4 fw-semibold">
                    {error}
                  </td>
                </tr>
              ) : userList.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center text-muted py-4">
                    No users found.
                  </td>
                </tr>
              ) : (
                userList.map((item, index) => (
                  <tr key={index} className="text-center">
                    <td className="text-center">{index + 1}</td>
                    <td className="text-center">{item.userid}</td>
                    <td>{item.username}</td>
                    <td>{item.name}</td>
                    <td>{item.email}</td>
                    <td>{item.mobile}</td>
                    <td>{item.password}</td>
                    <td>{item.created_on ? new Date(item.created_on).toLocaleDateString("en-GB") : "N/A"}</td>
                    
                    <td className='text-center'>
                      {item.status === 1 ? (
                        <button 
                          className="btn btn-success btn-sm"
                          onClick={() => openDeactivateModal(item.userid)}
                        >
                          Active
                        </button>
                      ) : (
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => openActivateModal(item.userid)}
                        >
                          Inactive
                        </button>
                      )}
                    </td>

                    <td>
                      <div className="d-flex justify-content-center gap-2">
                        <Link
                          to={`/useredit/${item.userid}`}
                          className="btn btn-outline-success btn-sm me-2"
                        >
                         ✏️ Edit
                        </Link>
                        <button
                          onClick={() => openDeleteModal(item.userid)}
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
        modalMessage={modalMessage}
        onHide={closeModal}
        confirmation={handleConfirmAction}
        operationType={actionType === 'delete' ? 'Deactivate' : 'Activate'}
        wantToAddData={true}
      />
    </>
  );
};

export default UsersList;