import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ConfirmationModal } from '../shared/ConfirmationModal';
import { toast } from 'react-toastify';
import Spinner from 'react-bootstrap/Spinner';
import 'react-toastify/dist/ReactToastify.css';
import SearchBar from '../brand/SearchBar';

const VendorList = () => {
  const [vendorList, setVendorList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalShow, setModalShow] = useState(false);
  const [selectedVendorId, setSelectedVendorId] = useState<number | null>(null);
  const [isSortedAlphabetically, setIsSortedAlphabetically] = useState(false);
  const [originalVendorList, setOriginalVendorList] = useState<any[]>([]);
  const [searchText, setSearchText] = useState<string>("");

  const callApiExamsList = async () => {
    try {
      const token = localStorage.getItem('jwttoken');
      const url = process.env.REACT_APP_API_URL + 'vendor/allvendors';
      const response = await axios.get(url, {
        headers: {
          'x-access-token': token || ''
        }
      });
      setVendorList(response.data);
      setOriginalVendorList(response.data);
    } catch (error) {
      console.error('Error fetching vendors:', error);
      setError('Something went wrong while fetching vendors.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    callApiExamsList();
  }, []);

  const deleteVendor = async (id: number) => {
    try {
      const token = localStorage.getItem('jwttoken');
      const url = process.env.REACT_APP_API_URL + 'vendor/removevendor/' + id;
      await axios.put(url, {}, {
        headers: {
          'x-access-token': token || ''
        }
      });
      setVendorList(vendorList.filter((vendor) => vendor.vendor_det_srno !== id));
      toast.success('Vendor Deleted Successfully');
    } catch (error) {
      console.error('Error deleting vendor:', error);
      toast.error('Failed to delete vendor');
    }
  };

  const handleDeleteClick = (id: number) => {
    setSelectedVendorId(id);
    setModalShow(true);
  };

  const handleConfirmDelete = () => {
    if (selectedVendorId !== null) {
      deleteVendor(selectedVendorId);
      setModalShow(false);
    }
  };

  function handleSearchTextSubmission(value: string){
    setSearchText(value);
  }

  useEffect(()=>{
    if(searchText!==""){
      filterVendorList(searchText);
    }

    return ()=>{
      setSearchText("");
    }
  }, [searchText]);

  async function filterVendorList(value:string) {
    setLoading(true);
    try{
      let token = localStorage.getItem('jwttoken');
      let data = await axios.get(`${process.env.REACT_APP_API_URL}vendor/searchItem/${value}`, 
        {headers: 
          {
            'x-access-token': token || ""
          }
        }
      );
      if(data.status==200){ 
        let filteredBrands = data.data.filteredData || [];
        if(filteredBrands.length>0){
          setVendorList(filteredBrands);
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
          
          <div className="d-flex mb-3">
            <h2 className="text-success fw-bold">Vendor List</h2>
            <SearchBar placeholder='Search ...' searchValueFn={handleSearchTextSubmission} />
          </div>
          
          <div className='d-flex gap-2'>
            <Link to="/vendoradd" className="btn btn-success">
              ➕ Add New Vendor
            </Link>
            <button
              onClick={() => {
                if (!isSortedAlphabetically) {
                  const sortedVendors = [...vendorList].sort((a, b) => a.vendor_name.localeCompare(b.vendor_name));
                  setVendorList(sortedVendors);
                } else {
                  setVendorList(originalVendorList);
                }
                setIsSortedAlphabetically(!isSortedAlphabetically);
              }}
              className='btn btn-success'>
              {isSortedAlphabetically ? 'Remove Sort' : 'Sort by Name'}
            </button>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-success text-center">
              <tr>
                <th>SRNO</th>
                <th>Vendor ID</th>
                <th>Vendor Name</th>
                <th>Vendor Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center p-3">
                    <Spinner animation="border" variant="success" />
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={5} className="text-center text-danger py-4 fw-semibold">
                    {error}
                  </td>
                </tr>
              ) : vendorList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center text-muted py-4">
                    No vendors found.
                  </td>
                </tr>
              ) : (
                vendorList.map((vendor, index) => (
                  <tr key={vendor.vendor_id} className="text-center">
                    <td>{index + 1}</td>
                    <td>{vendor.vendor_id}</td>
                    <td className="fw-semibold text-success">{vendor.vendor_name}</td>
                    <td>{vendor.vendor_description}</td>
                    <td>
                      <Link
                        to={`/vendoredit/${vendor.vendor_id}`}
                        className="btn btn-outline-success btn-sm me-2"
                      >
                       ✏️ Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(vendor.vendor_det_srno)}
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
        modalMessage="Do you really want to remove this vendor?"
        onHide={() => setModalShow(false)}
        confirmation={handleConfirmDelete}
        operationType="Delete"
        wantToAddData={true}
      />
    </>
  );
};

export default VendorList;
