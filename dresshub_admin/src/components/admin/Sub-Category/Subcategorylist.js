import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ConfirmationModal } from '../../shared/ConfirmationModal';
import { Spinner } from 'react-bootstrap';
import SearchBar from '../../brand/SearchBar';

const Subcategorylist = () => {
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalShow, setModalShow] = useState(false);
  const [deletedId, setDeletedId] = useState(null);
  const [isSortedAlphabetically, setIsSortedAlphabetically] = useState(false);
  const [originalSubcategories, setOriginalSubcategories] = useState([]);
  const [searchText, setSearchText] = useState("");

  const fetchSubcategorylist = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('jwttoken');
      const url = process.env.REACT_APP_API_URL + 'subCategory/allSubCategoryadmin';
      const response = await axios.get(url, {
        headers: {
          'x-access-token': token
        }
      });
      setSubcategories(response.data);
      console.log("response.data", response.data);

      setOriginalSubcategories(response.data);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      setError('Something went wrong while fetching subcategories.');
    } finally {
      setLoading(false);
    }
  };

  const handleEnableDisable = async (id, isactive) => {
    let stat;
    if (isactive === 1) {
      stat = 2;
    } else {
      stat = 1;
    }
    try {
      const token = localStorage.getItem('jwttoken');
      const url =
        process.env.REACT_APP_API_URL + 'subCategory/updatestatus/' + id;
      await axios.put(url,
        { stat: stat },
        {
          headers: {
            'x-access-token': token
          }
        }
      );
      toast.success('Subcategory status updated successfully!');
      await fetchSubcategorylist();
    } catch (error) {
      console.log(error);
      toast.error('Failed to update status of subcategory.');
    }

  }

  const openDeleteModal = (id) => {
    setDeletedId(id);
    setModalShow(true);
  };

  const deleteSubcategory = async () => {
    try {
      const token = localStorage.getItem('jwttoken');
      const url =
        process.env.REACT_APP_API_URL +
        'subCategory/romoveSubCategory/' +
        deletedId;
      await axios.put(url,
        {},
        {
          headers: {
            'x-access-token': token
          }
        }
      );
      setSubcategories(subcategories.filter(item => item.subcategory_id !== deletedId));
      toast.success('Subcategory deleted successfully!');
    } catch (error) {
      console.log(error);
      toast.error('Failed to delete subcategory.');
    } finally {
      setModalShow(false);
    }
  };

  const toggleSort = () => {
    if (!isSortedAlphabetically) {
      const sorted = [...subcategories].sort((a, b) =>
        a.subcategoryname.localeCompare(b.subcategoryname)
      );
      setSubcategories(sorted);
    } else {
      setSubcategories(originalSubcategories);
    }
    setIsSortedAlphabetically(!isSortedAlphabetically);
  };

  useEffect(() => {
    fetchSubcategorylist();
  }, []);

  function handleSearchTextSubmission(value) {
    setSearchText(value);
  }
  useEffect(() => {
    if (searchText.trim() === "") {
      fetchSubcategorylist()
    } else {
      filterSubCategoryData(searchText);
    }
  }, [searchText])
  // useEffect(()=>{
  //   if(searchText!==""){
  //     filterSubCategoryData(searchText);
  //   }

  //   return ()=>{
  //     setSearchText("");
  //   }
  // }, [searchText]);

  async function filterSubCategoryData(value) {
    setLoading(true);
    try {

      let data = await axios.get(`${process.env.REACT_APP_API_URL}subCategory/searchItem/${value}`);

      if (data.status == 200) {
        let filteredBrands = data.data.filteredData || [];
        if (filteredBrands.length > 0) {
          setSubcategories(filteredBrands);
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
      <ToastContainer position="top-right" autoClose={2500} />
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className='d-flex mb-3'>
            <h2 className="text-success fw-bold">Subcategory List</h2>
            {/* <SearchBar placeholder='Search ...' searchValueFn={handleSearchTextSubmission} /> */}
            <SearchBar
              placeholder="Search Custom Products..."
              searchValueFn={handleSearchTextSubmission}
              onClear={fetchSubcategorylist}
            />

          </div>
          <div className="d-flex gap-2">
            <Link to="/subcategoryadd" className="btn btn-success">
              ➕ Add New Subcategory
            </Link>
            <button
              onClick={toggleSort}
              className="btn btn-success"
            >
              {isSortedAlphabetically ? 'Remove Sort' : 'Sort by Name'}
            </button>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-success text-center">
              <tr>
                <th>SRNO</th>
                <th>Subcategory ID</th>
                <th>Subcategory Name</th>
                <th>Category ID</th>
                <th>Actions</th>
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
              ) : subcategories.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-muted py-4">
                    No subcategories found.
                  </td>
                </tr>
              ) : (
                subcategories.map((subcategory, index) => (
                  <tr key={subcategory.subcategory_id} className="text-center">
                    <td>{subcategory.sequence}</td>
                    <td>{subcategory.subcategory_id}</td>
                    <td className="fw-semibold text-success">{subcategory.subcategoryname}</td>
                    <td>{subcategory.category_id}</td>
                    <td>
                      <div className="d-flex justify-content-center gap-2">
                        <div className="form-check form-switch d-flex align-items-center">
                          <input
                            className={`form-check-input ${subcategory.isactive == 1 ? 'bg-success' : ''}`}
                            type="checkbox"
                            role="switch"
                            checked={subcategory.isactive == 1}
                            onChange={() => handleEnableDisable(subcategory.subcategory_id, subcategory.isactive)}
                          />
                        </div>
                        <Link
                          to={`/subcategoryedit/${subcategory.subcategory_id}`}
                          className="btn btn-outline-success btn-sm"
                        >
                          ✏️ Edit
                        </Link>
                        <button
                          onClick={() => openDeleteModal(subcategory.subcategory_id)}
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
        modalMessage="Do you really want to remove this subcategory?"
        onHide={() => setModalShow(false)}
        confirmation={deleteSubcategory}
        operationType="Delete"
        wantToAddData={true}
      />
    </>
  );
};

export default Subcategorylist;