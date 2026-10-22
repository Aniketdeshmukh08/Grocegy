import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ConfirmationModal } from '../../shared/ConfirmationModal';
import { toast, ToastContainer } from 'react-toastify';
import { Spinner, Modal, Button } from 'react-bootstrap';
import { Formik, Field, Form } from 'formik';
import _ from 'lodash';
import 'react-toastify/dist/ReactToastify.css';
import SearchBar from '../../brand/SearchBar';

const CustomProductList = () => {
  const [productsList, setproductsList] = useState([]);
  const [requestid, setrequestid] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [isNoChangesModalOpen, setIsNoChangesModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [userDetails, setUserDetails] = useState({ name: '', contact: '' });
  const [error, setError] = useState('');
  const [editProductData, setEditProductData] = useState({
    requestid: '',
    name: '',
    contact: '',
    userid: '',
    product_name: '',
    product_desc: '',
    quantity: '',
  });
  const [originalProductData, setOriginalProductData] = useState({});
  const userid = localStorage.getItem('userid');

  const [searchText, setSearchText] = useState("");

  const fetchallproducts = async () => {
    try {
      const token = localStorage.getItem('jwttoken');
      const url = process.env.REACT_APP_API_URL + 'customProduct/getall';
      const response = await axios.get(url, {
        headers: {
          'x-access-token': token
        }
      });
      // console.log(response);
      // console.log("Fetched Products:", response.data);
      setproductsList(response.data);
    } catch (error) {
      console.log(error);
      setError('Something went wrong while fetching custom products.');
    } finally {
      setLoading(false);
    }
  };

  // const fetchUserDetails = async () => {
  //   if (!userid) return;
  //   try {
  //     const url = `${process.env.REACT_APP_API_URL}users/getusername&mobile/${userid}`;
  //     const response = await axios.get(url);

  //     console.log("User Details API Response:", response.data);

  //     if (response.data && response.data.name && response.data.mobile) {
  //       setUserDetails({
  //         name: response.data.name,
  //         contact: response.data.mobile,  
  //       });
  //     } else {
  //       console.error("Invalid API response structure:", response.data);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching user details:', error);
  //   }
  // };

  const openDeleteModal = (reqid) => {
    setrequestid(reqid);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setrequestid(null);
    setIsDeleteModalOpen(false);
  };

  const openEditModal = async (reqid) => {
    try {
      const token = localStorage.getItem('jwttoken');
      const url = `${process.env.REACT_APP_API_URL}customProduct/getbyproductid/${reqid}`;
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          'x-access-token': token
        }
      });
      const productData = response.data[0];
      setEditProductData(productData);
      setOriginalProductData(productData);
      setIsEditModalOpen(true);
    } catch (error) {
      console.error('Error fetching product details:', error);
      toast.error('Failed to fetch product details');
    }
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditProductData({
      requestid: '',
      name: '',
      contact: '',
      userid: '',
      product_name: '',
      product_desc: '',
      quantity: '',
    });
    setOriginalProductData({});
  };

  const handleEditSubmit = (values) => {
    if (_.isEqual(originalProductData, values)) {
      setIsNoChangesModalOpen(true);
      return;
    }
    setEditProductData(values);
    setIsConfirmationModalOpen(true);
  };

  const confirmUpdateProduct = async () => {
    setUpdateLoading(true);
    try {
      const token = localStorage.getItem('jwttoken');
      const url = `${process.env.REACT_APP_API_URL}customProduct/updateProduct/${editProductData.requestid}`;
      await axios.put(url, editProductData, {
        headers: {
          "Content-Type": "application/json",
          'x-access-token': token
        }
      });
      toast.success('Product updated successfully!');
      setIsConfirmationModalOpen(false);
      closeEditModal();
      fetchallproducts(); // Refresh the list
    } catch (error) {
      console.error("Update failed:", error);
      toast.error('Failed to update product');
    } finally {
      setUpdateLoading(false);
      console.log("productlist", productsList);

    }
  };

  const closeModals = () => {
    setIsConfirmationModalOpen(false);
    setIsNoChangesModalOpen(false);
  };

  const deleteProduct = async () => {
    if (requestid !== null) {
      try {
        const token = localStorage.getItem('jwttoken');
        const url = `${process.env.REACT_APP_API_URL}customProduct/removeproduct/${requestid}`;
        await axios.put(url, {},
          {
          headers: {
            'x-access-token': token
          },
        });
        setproductsList(prevList => prevList.filter(item => item.requestid !== requestid));
        toast.success('Product Deleted Successfully');
        // fetchallproducts(); 

      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error('Failed to delete product');
      } finally {
        closeDeleteModal();
      }
    }
  };

  useEffect(() => {
    fetchallproducts();
    // fetchUserDetails();
  }, []);
function handleSearchTextSubmission(value) {
  // Always update the searchText
  setSearchText(value);
}

useEffect(() => {
  if (searchText.trim() === "") {
    // If user cleared the search, reload full data
    fetchallproducts();
  } else {
    // Otherwise, perform search
    filterCustomProducts(searchText);
  }
}, [searchText]);

  // function handleSearchTextSubmission(value) {
  //     setSearchText(value);
  // }

  // useEffect(() => {
  //   if (searchText !== "") {
  //     filterCustomProducts(searchText);
  //   }

  //   return () => {
  //     setSearchText("");
  //   }
  // }, [searchText]);

  async function filterCustomProducts(value) {
    setLoading(true);
    try {
      let data = await axios.get(`${process.env.REACT_APP_API_URL}customProduct/searchItem/${value}`);

      if (data.status == 200) {
        let filteredBrands = data.data.filteredData || [];
        if (filteredBrands.length > 0) {
          setproductsList(filteredBrands);
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
      <ToastContainer position="top-right" autoClose={2500} />
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className='d-flex mb-3'>
            <h2 className="text-success fw-bold">Custom Product List</h2>
            {/* <SearchBar placeholder='Search Custom Products ...' searchValueFn={handleSearchTextSubmission} /> */}
            <SearchBar
              placeholder="Search Custom Products..."
              searchValueFn={handleSearchTextSubmission}
              onClear={fetchallproducts} // ✅ reload full list on Clear
            />

          </div>
          <Link to='/addcustomproduct' className='btn btn-success'>
            ➕ Add New Custom Product
          </Link>
        </div>

        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-success text-center">
              <tr>
                <th>Sr No</th>
                <th>Product name</th>
                <th>Product description</th>
                <th>Quantity</th>
                <th>UserId</th>
                <th>Name</th>
                <th>Contact</th>
                <th colSpan={3}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" className="text-center p-3">
                    <Spinner animation="border" variant="success" />
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="9" className="text-center text-danger py-4 fw-semibold">
                    {error}
                  </td>
                </tr>
              ) : productsList.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center text-muted py-4">
                    No custom products found.
                  </td>
                </tr>
              ) : (
                productsList.map((item, index) => (
                  <tr key={item.requestid || index} className="text-center">
                    <td>{index + 1}</td>
                    <td className='fw-semibold text-success'>{item.product_name}</td>
                    <td>{item.product_desc}</td>
                    <td>{item.quantity}</td>
                    <td>{item.userid}</td>
                    <td>{item.name || "N/A"}</td>
                    <td>{item.contact || "N/A"}</td>
                    <td>
                      <div className='d-flex justify-content-center gap-2'>
                        <button
                          className='btn btn-outline-success btn-sm'
                          onClick={() => openEditModal(item.requestid)}
                        >
                          ✏️ Edit
                        </button>

                        <button
                          className='btn btn-outline-danger btn-sm'
                          onClick={() => openDeleteModal(item.requestid)}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                    {/* <td>
                  {item.status === 1 && (
                    <button
                     className='btn btn-success btn-sm'
                    >
                      Activate User
                    </button>
                  )}
                </td> */}
                  </tr>
                )))}
            </tbody>
          </table>
        </div>
      </div>
      <br></br>

      <ConfirmationModal
        show={isDeleteModalOpen}
        modalMessage="Do you really want to delete this product?"
        onHide={closeDeleteModal}
        confirmation={deleteProduct}
        operationType="Delete"
        wantToAddData={true}
      />

      {/* Edit Product Modal */}
      <Modal show={isEditModalOpen} onHide={closeEditModal} size="lg" centered>
        <Modal.Header closeButton className="bg-success text-white">
          <Modal.Title>Edit Custom Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            enableReinitialize={true}
            initialValues={editProductData}
            onSubmit={handleEditSubmit}
          >
            {({ values, handleChange }) => (
              <Form>
                <div className="mb-3 row">
                  <label className="col-md-4 col-form-label text-end fw-semibold text-success">
                    Name:
                  </label>
                  <div className="col-md-8">
                    <Field name="name" type="text" className="form-control" required />
                  </div>
                </div>

                <div className="mb-3 row">
                  <label className="col-md-4 col-form-label text-end fw-semibold text-success">
                    Contact:
                  </label>
                  <div className="col-md-8">
                    <Field
                      name="contact"
                      type="text"
                      className="form-control"
                      value={values.contact}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d{0,10}$/.test(value)) {
                          handleChange(e);
                        }
                      }}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3 row">
                  <label className="col-md-4 col-form-label text-end fw-semibold text-success">
                    User ID:
                  </label>
                  <div className="col-md-8">
                    <Field name="userid" type="text" className="form-control" required />
                  </div>
                </div>

                <div className="mb-3 row">
                  <label className="col-md-4 col-form-label text-end fw-semibold text-success">
                    Product Name:
                  </label>
                  <div className="col-md-8">
                    <Field name="product_name" type="text" className="form-control" required />
                  </div>
                </div>

                <div className="mb-3 row">
                  <label className="col-md-4 col-form-label text-end fw-semibold text-success">
                    Product Description:
                  </label>
                  <div className="col-md-8">
                    <Field name="product_desc" type="text" className="form-control" required />
                  </div>
                </div>

                <div className="mb-4 row">
                  <label className="col-md-4 col-form-label text-end fw-semibold text-success">
                    Quantity:
                  </label>
                  <div className="col-md-8">
                    <Field name="quantity" type="text" className="form-control" required />
                  </div>
                </div>

                <div className="text-center">
                  <Button type="submit" variant="success" className="me-3 px-4" disabled={updateLoading}>
                    {updateLoading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        Updating...
                      </>
                    ) : (
                      'Update Product'
                    )}
                  </Button>
                  <Button variant="outline-danger" onClick={closeEditModal} className="px-4">
                    Cancel
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>

      {/* Update Confirmation Modal */}
      <ConfirmationModal
        show={isConfirmationModalOpen}
        modalMessage="Do you really want to update this product?"
        onHide={closeModals}
        confirmation={confirmUpdateProduct}
        operationType="Update"
        wantToAddData={true}
      />

      {/* No Changes Modal */}
      {isNoChangesModalOpen && (
        <Modal show={isNoChangesModalOpen} onHide={closeModals} centered>
          <Modal.Header closeButton>
            <Modal.Title>No Changes Detected</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>No changes have been made to the product details.</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModals}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}

    </div>

  );
};

export default CustomProductList;
