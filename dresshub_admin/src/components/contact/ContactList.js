import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ConfirmationModal } from '../shared/ConfirmationModal';
import Spinner from 'react-bootstrap/Spinner';
import 'react-toastify/dist/ReactToastify.css';
import SearchBar from '../brand/SearchBar';

// Status mapping & dropdown options
const statusMap = {
  0: 'Pending',
  1: 'In Progress',
  2: 'Resolved',
  3: 'Closed',
};

const statusOptions = [
  { value: 0, label: 'Pending' },
  { value: 1, label: 'In Progress' },
  { value: 2, label: 'Resolved' },
  { value: 3, label: 'Closed' },
];

const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalShow, setModalShow] = useState(false);
  const [deletedId, setDeletedId] = useState(null);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const token = localStorage.getItem('jwttoken');
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}contact/allContacts`,
        {
          headers: {
            'x-access-token': token
          }
        }
      );
      setContacts(response.data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      setError('Something went wrong while fetching contacts.');
    } finally {
      setLoading(false);
    }
  };

  const removeContact = (id) => {
    setDeletedId(id);
    setModalShow(true);
  };

  const confirmDeleteContact = async () => {
    try {
      const token = localStorage.getItem('jwttoken');
      await axios.put(
        `${process.env.REACT_APP_API_URL}contact/removeContact/${deletedId}`,
        {},
        {
          headers: {
            'x-access-token': token
          }
        }
      );
      setContacts(contacts.filter((contact) => contact.contactid !== deletedId));
      toast.success('Contact Deleted Successfully');
    } catch (error) {
      console.error('Error removing contact:', error);
      toast.error('Failed to delete contact');
    }
    setModalShow(false);
  };

  // Handle status change from dropdown
  const handleStatusChange = async (contactId, newStatusValue) => {
    try {
      const token = localStorage.getItem('jwttoken');

      await axios.put(
        `${process.env.REACT_APP_API_URL}contact/updateResolveStatus/${contactId}`,
        { resolvestatus: statusMap[newStatusValue] }, // backend expects string status
        {
          headers: {
            'x-access-token': token
          }
        }
      );

      setContacts(prev =>
        prev.map(c =>
          c.contactid === contactId ? { ...c, resolvestatus: newStatusValue } : c
        )
      );

      toast.success(`Status updated to "${statusMap[newStatusValue]}"`);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update resolve status. Please try again.');
    }
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

  function handleSearchTextSubmission(value){
    setSearchText(value);
  }

  useEffect(()=>{
    if(searchText!==""){
      filterContactList(searchText);
    }

    return ()=>{
      setSearchText("");
    }
  }, [searchText]);

  async function filterContactList(value){
    setLoading(true);
    try{
      let token = localStorage.getItem('jwttoken');
      let data = await axios.get(`${process.env.REACT_APP_API_URL}contact/searchItem/${value}`, {
        headers: {
          'x-access-token': token
        }
      });
      if(data.status==200){ 
        let filteredBrands = data.data.filteredData || [];
        if(filteredBrands.length>0){
          setContacts(filteredBrands);
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
            <h2 className="text-success fw-bold">Contact List</h2>
            <SearchBar placeholder='Search ...' searchValueFn={handleSearchTextSubmission} />
          </div>
          
          <Link to="/AddContact" className="btn btn-success">
            ➕ Add New Contact
          </Link>
        </div>

        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-success text-center">
              <tr>
                <th>SRNO</th>
                <th>Contact ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile No</th>
                <th>Address</th>
                <th>Subject</th>
                <th>Message</th>
                <th style={{ minWidth: '180px', whiteSpace: 'nowrap' }}>Contact Date</th>
                <th style={{ minWidth: '180px', whiteSpace: 'nowrap' }}>Created At</th>
                <th>Resolve Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="11" className="text-center p-3"> 
                    <Spinner animation="border" variant="success" />
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="11" className="text-center text-danger py-4 fw-semibold"> 
                    {error}
                  </td>
                </tr>
              ) : contacts.length === 0 ? (
                <tr>
                  <td colSpan="11" className="text-center text-muted py-4"> 
                    No contacts found.
                  </td>
                </tr>
              ) : (
                contacts.map((contact, index) => (
                  <tr key={contact.contactid} className="text-center">
                    <td>{index + 1}</td>
                    <td>{contact.contactid}</td>
                    <td className="fw-semibold text-success">{contact.name}</td>
                    <td>{contact.email}</td>
                    <td>{contact.mobile}</td>
                    <td>{contact.address}</td>
                    <td>{contact.subject}</td>
                    <td>
                      <div className="text-truncate" style={{ maxWidth: '200px' }} title={contact.message}>
                        {contact.message}
                      </div>
                    </td>
                    <td>{formatDateTime(contact.contactdate)}</td>
                    <td>{formatDateTime(contact.created_at)}</td>
                    <td>
                      <select
                        className={`form-select form-select-sm ${
                          contact.resolvestatus === 2 // Resolved
                            ? 'border-success'
                            : contact.resolvestatus === 1 // In Progress
                            ? 'border-warning'
                            : contact.resolvestatus === 3 // Closed 
                            ? 'border-dark'
                            : 'border-secondary'
                        }`}
                        value={contact.resolvestatus}
                        style={{ minWidth: '140px' }}
                        onChange={(e) => handleStatusChange(contact.contactid, parseInt(e.target.value))}
                      >
                        {statusOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <div className="d-flex justify-content-center gap-2">
                        <Link
                          to={`/UpdateContact/${contact.contactid}`}
                          className="btn btn-outline-primary btn-sm me-2"
                        >
                          ✏️ Edit
                        </Link>
                        <button
                          onClick={() => removeContact(contact.contactid)}
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
        modalMessage="Do you really want to remove this contact?"
        onHide={() => setModalShow(false)}
        confirmation={confirmDeleteContact}
        operationType="Delete"
        wantToAddData={true}
      />
    </>
  );
};

export default ContactList;