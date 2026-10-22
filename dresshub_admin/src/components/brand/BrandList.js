import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ConfirmationModal } from '../shared/ConfirmationModal';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Spinner from 'react-bootstrap/Spinner';
import SearchBar from './SearchBar';

const BrandList = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalShow, setModalShow] = useState(false);
  const [deletedId, setDeletedId] = useState(null);
  const [isSortedAlphabetically, setIsSortedAlphabetically] = useState(false);
  const [originalBrands, setOriginalBrands] = useState([]);
  const [showAllBrands, setShowAllBrands] = useState(true);
  const [searchText, setSearchText] = useState("");



  useEffect(() => {
    const fetchBrands = async () => {
      try {
        // const response = await axios.get(`${process.env.REACT_APP_API_URL}brand/allbrands`);
        const token = localStorage.getItem("jwttoken");
        const endpoint = showAllBrands
        ? `${process.env.REACT_APP_API_URL}brand/activeBrandsWithOrders` // Show all active brands with orders
        : `${process.env.REACT_APP_API_URL}products/allBrandsByNumOrders`; // Only brands with active products
        const response = await axios.get(endpoint,
          {
            headers: { 'x-access-token': token }
          });
        setBrands(response.data);
        setOriginalBrands(response.data);
      } catch (error) {
        console.error('Error fetching brands:', error);
        setError('Something went wrong while fetching brands.');
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, [showAllBrands]);

  const removeBrand = (id) => {
    setDeletedId(id);
    setModalShow(true);
  };

  const confirmDeleteBrand = async () => {
    try {
      const token = localStorage.getItem("jwttoken");
      await axios.put(`${process.env.REACT_APP_API_URL}brand/removebrand/${deletedId}`,
        {},
        { headers: { 'x-access-token': token } }
      );
      setBrands(brands.filter((brand) => brand.brand_id !== deletedId));
      toast.success('Brand Deleted Successfully');
    } catch (error) {
      console.error('Error removing brand:', error);
      toast.error('Failed to delete brand');
    }
    setModalShow(false);
  };

  function handleSearchTextSubmission(value){
    setSearchText(value);
  }

  async function searchForBrand(searchParam){
    // const filteredBrands = brands.filter((item)=>item.brand_name===searchParam || item.brand_id===searchParam || item.brand_name.includes(searchParam) || item.brand_id.includes(searchParam));
    setLoading(true);
    try{
      let data = await axios.get(`${process.env.REACT_APP_API_URL}brand/searchItem/${searchParam}`);
      if(data.status==200){ 
        let filteredBrands = data.data.filteredData || [];
        if(filteredBrands.length>0){
          setBrands(filteredBrands);
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
      searchForBrand(searchText);
    }

    return ()=>{
      setSearchText("");
    }
  }, [searchText]);

  return (
    <>
      
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="text-success fw-bold">Brand List</h2>
          <div className="d-flex align-items-center gap-2">
          <SearchBar placeholder='Search Product ...' searchValueFn={handleSearchTextSubmission} />
              <button
                className="btn btn-outline-secondary mx-1 rounded"
                style={{width:"fit-content"}}
                onClick={() => {
                setSearchText('');
                setBrands(originalBrands);
                }}
              >
                  Clear
              </button>

          </div>

          <div className='d-flex gap-2'>
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="showAllBrandsCheck"
                checked={showAllBrands}
                onChange={() => setShowAllBrands(!showAllBrands)}
              />
              <label className="form-check-label" htmlFor="showAllBrandsCheck">
                Show All Brands
              </label>
            </div>
            <Link to="/brandcreate" className="btn btn-success">
              ➕ Add New Brand
            </Link>
            <button
              onClick={() => {
                if(!isSortedAlphabetically){
                  const sortedBrands = [...brands].sort((a,b) => a.brand_name.localeCompare(b.brand_name));
                  setBrands(sortedBrands);
                }
                else{
                  setBrands(originalBrands);
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
                <th>Logo</th>
                <th>SRNO</th>
                <th>Brand ID</th>
                <th>Brand Name</th>
                <th>Total Orders</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center p-3">
                    <Spinner animation="border" variant="success" />
                    {/* <div className="mt-2 text-success">Loading brands...</div> */}
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="5" className="text-center text-danger py-4 fw-semibold">
                    {error}
                  </td>
                </tr>
              ) : brands.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-muted py-4">
                    No brands found.
                  </td>
                </tr>
              ) : (
                brands.map((brand) => (
                  <tr key={brand.brand_id} className="text-center" style={{height:  "80px"}}>
                    <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                      {brand.brand_image ? (
                        <img
                          src={`${process.env.REACT_APP_API_URL}${brand.brand_image.replace(/\\/g, "/")}`}
                          alt={brand.brand_name}
                          style={{
                            width: "60px",
                            height: "60px",
                            objectFit: "contain",
                            borderRadius: "8px",
                            border: "1px solid #ddd",
                            padding: "4px",
                            backgroundColor: "#fff"
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "60px",
                            height: "60px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "auto",
                            backgroundColor: "#f5f5f5",
                            borderRadius: "8px",
                            fontSize: "12px",
                            color: "#888"
                          }}
                        >
                          No Logo
                        </div>
                      )}
                    </td>
                    <td>{brands.indexOf(brand) + 1}</td>
                    <td>{brand.brand_id}</td>
                    <td className="fw-semibold text-success">{brand.brand_name}</td>
                    <td>{brand.total_orders}</td>
                    <td>
                      <Link
                        to={`/brandupdate/${brand.brand_id}`}
                        className="btn btn-outline-success btn-sm me-2"
                      >
                        ✏️ Edit
                      </Link>
                      <button
                        onClick={() => removeBrand(brand.brand_id)}
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
        modalMessage="Do you really want to remove this brand?"
        onHide={() => setModalShow(false)}
        confirmation={confirmDeleteBrand}
        operationType="Delete"
        wantToAddData={true}
      />
    </>
  );
};

export default BrandList;
