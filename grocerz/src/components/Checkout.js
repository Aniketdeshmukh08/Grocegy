import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
//Do not use hashedbitqr
//import qr from '../assets/images/hashedbitqr.jpg';
import grocjiqr from '../assets/images/grocjiqr.jpeg';
import axios from 'axios';
import GuestAddess from './GuestAddess';
import loaderGif from '../assets/images/loader.gif';
import { ConfirmationModal } from './shared/ConfirmationModal';
// import 'bootstrap/dist/css/bootstrap.min.css';

function Checkout() {
  // Setting up single button to place order
  const [formData, setFormData] = useState({
    name: '',
    line1: '',
    line2: '',
    line3: '',
    city: '',
    state: '',
    country: '',
    pin: '',
    contact: '',
    alternatecontact: '',
    landmark: '',
  });
  const [error, setError] = useState('');
  const [showPincodeModal, setShowPincodeModal] = useState(false);
  const [pincodeModalMessage, setPincodeModalMessage] = useState('');

  const [editMode, setEditMode] = useState(false);
  const [currentEditingId, setCurrentEditingId] = useState(null);

  const handleSubmit = async (e) => {
    // e.preventDefault();
    if (
      (formData.name || '').trim() === '' ||
      (formData.line1 || '').trim() === '' ||
      (formData.city || '').trim() === '' ||
      (formData.state || '').trim() === '' ||
      (formData.country || '').trim() === '' ||
      (formData.pin || '').trim() === '' ||
      (formData.contact || '').trim() === ''
    ) {
      alert('Please fill in all mandatory fields.');
      return;
    }

    // Check if pin code is a number
    if (isNaN(formData.pin.trim())) {
      setPincodeModalMessage('Pin code must be a number.');
      setShowPincodeModal(true);
      return;
    }

    // Check if contact numbers are 10 digits
    if (
      !/^\d{10}$/.test(formData.contact.trim())
    ) {
      alert('Contact numbers must be 10-digit numbers.');
      return;
    }

    try {
      const orderForUserId = localStorage.getItem('orderForUserId');
      const userId = orderForUserId || localStorage.getItem('userid') || '';

      if (editMode) {
        const id = currentEditingId;
        const response = await axios.put(
          `${process.env.REACT_APP_API_URL}address/updateAddress/${currentEditingId}`,
          { userid: userId, ...formData }
        );
        setFormData({
          name: '',
          line1: '',
          line2: '',
          line3: '',
          city: '',
          state: '',
          country: '',
          pin: '',
          contact: '',
          alternatecontact: '',
          landmark: '',
        });
        // alert('Address updated successfully.');
        setIsModalOpen(false);
        setEditMode(false);
        setCurrentEditingId(null);
        const uid = response.data.userid;
        const aid = response.data.addressid;
        const obj = { aid: aid, uid: uid };
        fetchAddresses(userId);
        return obj;
      }

      if (userId) {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}address/addAddress`,
          { userid: userId, ...formData }
        );
        setFormData({
          name: '',
          line1: '',
          line2: '',
          line3: '',
          city: '',
          state: '',
          country: '',
          pin: '',
          contact: '',
          alternatecontact: '',
          landmark: '',
        });
        const uid = response.data.userid;
        const aid = response.data.addressid;
        const obj = { aid: aid, uid: uid };
        fetchAddresses(userId);
        setIsModalOpen(false);
        return obj;
      }
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}users/addguestuser`,
        { ...formData }
      );
      setFormData({
        name: '',
        line1: '',
        line2: '',
        line3: '',
        city: '',
        state: '',
        country: '',
        pin: '',
        contact: '',
        alternatecontact: '',
        landmark: '',
      });
      const uid = response.data.userid;
      const aid = response.data.addressid;
      const obj = { aid: aid, uid: uid };
      return obj;
    } catch (error) {
      console.error('API error:', error);
      return {};
    }
  };

  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentMode, setPaymentMode] = useState('DUE - COD/QR/UPI');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [text, setText] = useState("");
  var userId = localStorage.getItem('userid') || '';
  var usertype = localStorage.getItem('usertype') || '';
  const [productdiscount, setProductDiscount] = useState(0);
  const [totalOriginalMRP, setTotalOriginalMRP] = useState(0);
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [checkoutstatus, setCheckoutStatus] = useState(false);

  // For admin user search functionality
  const [showUserSearchModal, setShowUserSearchModal] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [searchError, setSearchError] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // For coupon/discount functionality
  const [couponCode, setCouponCode] = useState('');
  const [isCouponApplied, setIsCouponApplied] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [MaxdiscountAmount, setMaxDiscountAmount] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountMsg, setDiscountMsg] = useState(false);

  const fetchCartItems = async () => {
    setLoading(true);
    try {
      const userId = localStorage.getItem('userid') || '';
      if (userId) {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}cart/userCart/${userId}`
        );
        const items = response.data;
        setCartItems(items);
      } else {
        const storedCartItems = localStorage.getItem('cart').length
          ? JSON.parse(localStorage.getItem('cart'))
          : [];
        setCartItems([...storedCartItems]);
      }
    } catch (error) {
      console.error('Error fetching cart items', error);
    }
    setLoading(false);
  };

  const location = useLocation();
  const { product } = location.state || {};

  const calculateTotal = () => {
    if (cartItems.length > 0) {
      let total = cartItems.reduce(
        (total, item) =>
          total +
          (Number(item.price) * item.quantity -
            Number(item.discount) * item.quantity),
        0
      );
      setTotalAmount(total);

      let totalMRP = cartItems.reduce(
        (total, item) =>
          total +
          (Number(item.price) * item.quantity),
        0
      );
      setTotalOriginalMRP(totalMRP);
    } else {
      setTotalAmount(0);
      setTotalOriginalMRP(0);
    }
  };

  useEffect(() => {
    if (product) {
      let total = (Number(product.price) * (((product.quantity === undefined) ? 1 : product.quantity)) -
        Number(product.discount) * ((product.quantity === undefined) ? 1 : product.quantity));
      setTotalAmount(total);

      let totalMRP = Number(product.price) * (((product.quantity === undefined) ? 1 : product.quantity));
      setTotalOriginalMRP(totalMRP);
    } else {
      calculateTotal();
    }
  }, [cartItems]);

  const fetchAddresses = async (targetUserId = null) => {
    const orderForUserId = localStorage.getItem('orderForUserId');
    const userId = targetUserId || orderForUserId || localStorage.getItem('userid') || '';

    if (!userId) return;

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}address/getByuserId/${userId}`
      );
      const addressesData = response.data || [];
      setAddresses(addressesData);
      if (addressesData.length > 0) {
        const defaultAddress = addressesData.find(
          addr => addr.is_default === 1
        );

        setSelectedAddressId(
          defaultAddress
            ? defaultAddress.addressid
            : addressesData[0].addressid
        );
      } else {
        setSelectedAddressId(null);
      }

    } catch (error) {
      console.error('Error fetching addresses', error);
    }
  };

  useEffect(() => {
    if (product) {
      setCartItems([product]);
    } else {
      fetchCartItems();
    }
    fetchAddresses();
  }, [product]);

  const handletextChange = (event) => {
    setText(event.target.value);
  };
  //console.log(event.target.value);
  const placeOrder = async () => {
    setIsPlacingOrder(true);
    let userData = {};
    let orderData = {};
    let cartData;

    if (product) {
      cartData = [{
        productid: product.productid,
        quantity: (product.quantity === undefined) ? 1 : product.quantity,
        original_mrp: Number(product.price) * ((product.quantity === undefined) ? 1 : product.quantity),
        price_final: Number(product.price) * ((product.quantity === undefined) ? 1 : product.quantity) -
          Number(product.discount) * ((product.quantity === undefined) ? 1 : product.quantity), instructions: text,

      }]
    } else {
      cartData = cartItems.map(item => ({
        productid: item.productid,
        quantity: item.quantity,
        original_mrp: Number(item.price) * item.quantity,
        price_final:
          Number(item.price) * item.quantity -
          Number(item.discount) * item.quantity,
        instructions: text,
      }));
    }

    try {
      const orderForUserId = localStorage.getItem('orderForUserId');
      const orderForAddressId = localStorage.getItem('orderForAddressId');

      if (orderForUserId || userId) {
        // Validate address selection for logged-in users
        const finalAddressId = orderForAddressId || selectedAddressId;
        if (!finalAddressId) {
          alert('Please select a delivery address');
          setIsPlacingOrder(false);
          return;
        }

        orderData = {
          cartData,
          userid: orderForUserId ? orderForUserId : userId,
          addressId: finalAddressId,
          paymentMode: paymentMode,
          productdiscount,
          totalDiscount: Math.ceil(discountAmount),
          createdby: orderForUserId ? usertype : (usertype || 'user')
        };
      } else {
        // Guest checkout
        userData = await handleSubmit();
        if (!userData || !userData.uid || !userData.aid) {
          alert('Please fill in all required address details');
          setIsPlacingOrder(false);
          return;
        }

        orderData = {
          cartData,
          userid: userData.uid,
          addressId: userData.aid,
          paymentMode: paymentMode,
          totalDiscount: 0,
          createdby: 'guest'
        };
      }

      const orderResponse = await axios.post(
        `${process.env.REACT_APP_API_URL}checkout/checkout`,
        orderData
      );

      if (orderResponse.data.status === 'success') {
        const orderId = orderResponse.data.orderid;
        const soldProductData = cartData.map(item => ({
          productid: item.productid,
          quantity: item.quantity,
        }));
        await axios.post(
          `${process.env.REACT_APP_API_URL}orders/soldproductcount`,
          soldProductData
        );
        setLoader(false);
        localStorage.removeItem('cart');
        localStorage.removeItem('orderForUserId');
        localStorage.removeItem('orderForAddressId');
        navigate(`/orderplaced/${orderId}`);
      } else {
        alert('Failed to place order. Please try again.');
        setIsPlacingOrder(false);
      }
    } catch (error) {
      setLoader(false);
      console.error('Error placing order', error);
      alert('Error placing order. Please try again.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const modalAction = (address = null) => {
    if (address && address.addressid !== undefined) {
      setEditMode(true);
      setFormData(address);
      setCurrentEditingId(address.addressid);
    } else {
      setEditMode(false);
      setFormData({
        name: '',
        line1: '',
        line2: '',
        line3: '',
        city: '',
        state: '',
        country: '',
        pin: '',
        contact: '',
        alternatecontact: '',
        landmark: '',
      });
      setCurrentEditingId(null);
    }
    setIsModalOpen(!isModalOpen);
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Are you sure you want to delete this address?')) {
      return;
    }

    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}address/deleteAddress/${addressId}`
      );

      // Refresh addresses after deletion
      await fetchAddresses();

      // If deleted address was selected, clear selection
      if (selectedAddressId === addressId) {
        setSelectedAddressId(null);
      }

      alert('Address deleted successfully');
    } catch (error) {
      console.error('Error deleting address:', error);
      alert('Failed to delete address. Please try again.');
    }
  };

  const fillpindetails = async () => {
    if (!formData.pin || formData.pin.trim() === '') return;

    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}pincodes/check/${formData.pin}`);
      if (response.data.success) {
        setError('');
        setFormData(prevState => ({
          ...prevState,
          city: response.data.data.city,
          state: response.data.data.state,
          country: response.data.data.country || 'India',
        }));
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setPincodeModalMessage(err.response.data.message || 'Sorry! We do not serve in this area.');
      } else {
        setPincodeModalMessage('Error verifying pincode. Please try again.');
      }
      setShowPincodeModal(true);
      setError('');
      setFormData(prevState => ({
        ...prevState,
        city: '',
        state: '',
        country: '',
      }));
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    let totalOriginalMRP = 0;
    let totalPriceFinal = 0;

    if (cartItems.length > 0) {
      totalOriginalMRP = cartItems.reduce(
        (sum, item) => sum + Number(item.price) * item.quantity,
        0
      );
      totalPriceFinal = cartItems.reduce(
        (sum, item) =>
          sum + (Number(item.price) * item.quantity - Number(item.discount) * item.quantity),
        0
      );
    }

    const discountValue = totalOriginalMRP - totalPriceFinal;
    setProductDiscount(discountValue);
  }, [cartItems]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const verifyCouponCode = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}discount/discountbycc/${couponCode}`);
      if (response.data.length > 0) {
        const discountPercentage = response.data[0].percentage;
        const fixedDiscount = response.data[0].amount;
        const maxDiscountAmount = response.data[0].maxdiscount;
        setDiscountPercentage(discountPercentage)
        setMaxDiscountAmount(maxDiscountAmount)
        calculateTotalDiscount(maxDiscountAmount, discountPercentage, fixedDiscount);
        setIsCouponApplied(true);
        setDiscountMsg(false)
      } else {
        setDiscountPercentage(0)
        setIsCouponApplied(false);
        setDiscountAmount(0)
      }
    } catch (error) {
      console.error('Error fetching addresses', error);
      setIsCouponApplied(false);
    }
  }

  const calculateTotalDiscount = (DisAmount = 99999, DisPercentage, DiscAmount) => {
    let finalDiscount = 0;
    if (DiscAmount > 0) {
      finalDiscount = DiscAmount;
    }
    else {
      const discount = (DisPercentage / 100) * totalAmount;
      finalDiscount = Math.min(discount, DisAmount);
    }
    setDiscountAmount(finalDiscount)
  }

  const orderCount = async () => {
    try {
      const userId = localStorage.getItem('userid') || '';
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}orders/getOrderCountByUserId/${userId}`
      );
      if (data) {
        const totalOrders = data.totalOrders
        if (totalOrders === 0) {
          setDiscountPercentage(5)
          setMaxDiscountAmount(500);
          const discount = Number((5 / 100) * totalAmount);
          setDiscountAmount(discount)
          setIsCouponApplied(true);
          setDiscountMsg(true)
        }
      }
    } catch (error) {
      console.error('Error fetching addresses', error);
      setIsCouponApplied(false);
    }
  }

  const handleSearchUser = async () => {
    if (!searchInput.trim()) {
      setSearchError('Please enter username, phone, or email');
      return;
    }

    setIsSearching(true);
    setSearchError('');
    setSearchResult(null);

    try {
      const cleanSearchTerm = searchInput.trim().toLowerCase();
      const baseUrl = process.env.REACT_APP_API_URL.replace(/\/$/, '');
      const url = `${baseUrl}/users/searchbyvalue/${encodeURIComponent(cleanSearchTerm)}`;

      const response = await axios.get(url);

      if (response.data.success && response.data.user) {
        const user = response.data.user;
        const address = response.data.address;
        setSearchResult({
          userId: user.userid,
          name: user.name,
          email: user.email,
          phone: user.mobile,
          username: user.username,
          addressId: address?.addressid || null
        });
      } else {
        setSearchError(response.data.message || 'User not found');
      }
    } catch (error) {
      console.error('Search error:', error);
      if (error.response) {
        setSearchError(error.response.data.message || 'Search failed');
      } else if (error.request) {
        setSearchError('No response from server. Check your connection.');
      } else {
        setSearchError('Search request failed: ' + error.message);
      }
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectUser = async () => {
    localStorage.setItem('orderForUserId', searchResult.userId);
    setSelectedUser(searchResult);

    if (searchResult.addressId) {
      localStorage.setItem('orderForAddressId', searchResult.addressId);
      setSelectedAddressId(searchResult.addressId);

      // Fetch addresses for the selected user
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}address/getByuserId/${searchResult.userId}`
        );
        const addressesData = response.data || [];
        setAddresses(addressesData);
      } catch (error) {
        console.error('Error fetching user addresses:', error);
      }
    } else {
      localStorage.removeItem('orderForAddressId');
      setSelectedAddressId(null);
      setAddresses([]);
    }

    // Fetch addresses for the selected user
    fetchAddresses(searchResult.userId);

    setShowUserSearchModal(false);
    setSearchInput('');
    setSearchResult(null);
    setSearchError('');
  };

  const handleClearSelectedUser = () => {
    localStorage.removeItem('orderForUserId');
    localStorage.removeItem('orderForAddressId');
    setSelectedAddressId(null);
    fetchAddresses(); // Reload current user's addresses
  };

  return (
    <>
      <section className='blog about-blog'>
        <div className='container'>
          <div className="blog-heading about-heading">
            <h1 className="heading">Checkout</h1>
          </div>
          {loading && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '50vh',
              }}
            >
              <img
                src={loaderGif}
                alt='Loading...'
                style={{ width: '80px', height: '80px' }}
              />
            </div>
          )}
        </div>
      </section>

      {usertype === 'admin' && (
        <div className="text-center my-4">
          {localStorage.getItem('orderForUserId') ? (
            <div className="d-flex justify-content-center align-items-center gap-3">
              <span className="badge bg-success fs-5 px-3 py-2">
                Ordering for: {searchResult?.name || 'Selected User'}
              </span>
              <button
                className="btn btn-warning px-4 py-2"
                onClick={handleClearSelectedUser}
              >
                Clear Selection
              </button>
            </div>
          ) : (
            <button
              className="btn btn-success px-4 py-2"
              onClick={() => setShowUserSearchModal(true)}
            >
              Place Order for someone else
            </button>
          )}
        </div>
      )}

      {showUserSearchModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content p-3">
              <div className="modal-header border-0">
                <h5 className="modal-title">Search User</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowUserSearchModal(false)}
                  aria-label="Close"
                ></button>
              </div>

              <div className="modal-body">
                <input
                  type="text"
                  className="form-control mb-3 p-2"
                  placeholder="Enter name, username, phone, or email"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearchUser()}
                />

                {isSearching && (
                  <div className="text-center my-3">
                    <div className="spinner-border text-success" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                )}

                {searchError && (
                  <div className="alert alert-danger text-center mb-3">
                    {searchError}
                  </div>
                )}

                {searchResult && (
                  <div className="bg-light p-3 rounded mb-3">
                    <h4 className="text-success mb-2">User Found</h4>
                    <p><strong>Name:</strong> {searchResult.name || 'N/A'}</p>
                    <p><strong>Phone:</strong> {searchResult.phone || 'N/A'}</p>
                    <p><strong>Email:</strong> {searchResult.email || 'N/A'}</p>
                  </div>
                )}
              </div>

              <div className="modal-footer border-0 d-flex justify-content-center gap-2">
                <button
                  className="btn btn-success px-4"
                  onClick={handleSearchUser}
                  disabled={isSearching || !searchInput.trim()}
                >
                  Search User
                </button>

                {searchResult && (
                  <button
                    className="btn btn-primary px-4"
                    onClick={handleSelectUser}
                  >
                    Select User
                  </button>
                )}

                <button
                  className="btn btn-danger px-4"
                  onClick={() => setShowUserSearchModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <section className='checkout product footer-padding'>
        <div className='container'>
          <div className='checkout-section'>
            <div className='row gy-5 gy-lg-0'>
              <div className="col-lg-6">
                <div className="d-flex flex-column h-100 mt-2">
                  <div className="border shadow p-3" style={{ overflowY: "hidden" }}>
                    <h5 className='wrapper-heading'>
                      {userId
                        ? 'Select Delivery Address'
                        : 'Add Details To Order'}
                    </h5>
                    <div className='profile-section address-section addresses'>
                      <div className=''>
                        {userId ? (
                          <>
                            <div className='' style={{ height: "350px", overflowY: "auto" }}>
                              {addresses.map((address, index) => (
                                <div
                                  key={address.addressid}
                                  onClick={() =>
                                    setSelectedAddressId(address.addressid)
                                  }
                                  className='seller-info'
                                  style={{
                                    backgroundColor:
                                      address.addressid === selectedAddressId
                                        ? 'rgba(52, 168, 83, 0.2)'
                                        : 'white',
                                  }}
                                >
                                  <div className='d-flex justify-content-between align-items-center'>
                                    <h4 className='heading-custom-font-1'>
                                      Address - {index + 1}
                                    </h4>

                                    <div className='d-flex gap-2'>
                                      <button
                                        type='button'
                                        className='btn btn-warning btn-sm'
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          modalAction(address);
                                        }}
                                      >
                                        Edit
                                      </button>
                                      <button
                                        type='button'
                                        className='btn btn-danger btn-sm'
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDeleteAddress(address.addressid);
                                        }}
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  </div>

                                  <p>Name - {address.name}</p>
                                  <p>Address - {address.line1}</p>
                                  <p>
                                    City - {address.city}, {address.state},{' '}
                                    {address.country}, {address.pin},
                                  </p>
                                  <p>Landmark - {address.landmark}</p>
                                  <p>
                                    Contact - {address.contact}&nbsp;&nbsp;{' '}
                                    {address.alternatecontact}
                                  </p>
                                </div>
                              ))}
                              {!loading && addresses.length === 0 && (
                                <div
                                  className='alert alert-danger my-4 text-custom-font-1'
                                  role='alert'
                                >
                                  Please, add an address to proceed.
                                </div>
                              )}

                            </div>
                            <button
                              type='button'
                              className='shop-btn'
                              onClick={modalAction}
                            >
                              Add New Address
                            </button>
                          </>
                        ) : (
                          <>
                            <GuestAddess
                              setFormData={setFormData}
                              setError={setError}
                              formData={formData}
                              error={error}
                            />
                          </>
                        )}
                        <form onSubmit={handleSubmit}>
                          <div
                            className={`modal fade ${isModalOpen ? 'show d-block' : 'd-none'}`}
                            tabIndex="-1"
                            role="dialog"
                            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                          >
                            <div className="modal-dialog modal-dialog-centered" role="document">
                              <div className="modal-content">
                                <div className="d-flex justify-content-between align-items-center">
                                  <h5 className="m-0 ms-3">
                                    {editMode ? 'Edit Address' : 'Add Your Address'}
                                  </h5>
                                  <img src='assets/images/homepage-one/close-btn.png' onClick={modalAction} alt="close-btn" className="me-3 mt-2 cursor-pointer img-hover" />
                                </div>
                                <div className="modal-body">
                                  <div className="mb-3">
                                    <label htmlFor="name" className="form-label fs-4">
                                      Name*
                                    </label>
                                    <input
                                      type="text"
                                      id="name"
                                      className="form-control fs-4"
                                      name="name"
                                      value={formData.name || ''}
                                      placeholder="Name"
                                      onChange={handleChange}
                                    />
                                  </div>
                                  <div className="mb-3">
                                    <label htmlFor="userphone" className="form-label fs-4">
                                      Contact*
                                    </label>
                                    <input
                                      type="tel"
                                      id="userphone"
                                      className="form-control fs-4"
                                      name="contact"
                                      value={formData.contact || ''}
                                      placeholder="Contact"
                                      onChange={handleChange}
                                    />
                                  </div>
                                  <div className="mb-3">
                                    <label htmlFor="useraddress" className="form-label fs-4">
                                      Address*
                                    </label>
                                    <input
                                      type="text"
                                      id="useraddress"
                                      className="form-control fs-4"
                                      name="line1"
                                      value={formData.line1 || ''}
                                      placeholder="Enter your Address"
                                      onChange={handleChange}
                                    />
                                  </div>
                                  <div className="row">
                                    <div className="col-md-6 mb-3 fs-4">
                                      <label htmlFor="landmark" className="form-label fs-4">
                                        Landmark
                                      </label>
                                      <input
                                        type="text"
                                        id="landmark"
                                        className="form-control fs-4"
                                        name="landmark"
                                        value={formData.landmark || ''}
                                        placeholder="Landmark"
                                        onChange={handleChange}
                                      />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                      <label htmlFor="zip" className="form-label fs-4">
                                        Pin*
                                      </label>
                                      <input
                                        type="number"
                                        id="zip"
                                        className="form-control fs-4"
                                        name="pin"
                                        value={formData.pin || ''}
                                        placeholder="Pin"
                                        onChange={handleChange}
                                        onBlur={fillpindetails}
                                      />
                                    </div>
                                  </div>
                                  <div className="row">
                                    <div className="col-md-6 mb-3">
                                      <label htmlFor="city" className="form-label fs-4">
                                        City*
                                      </label>
                                      <input
                                        type="text"
                                        id="city"
                                        value={formData.city || ''}
                                        className="form-control fs-4"
                                        name="city"
                                        placeholder="City"
                                        onChange={handleChange}
                                        disabled
                                        style={{ backgroundColor: '#e9ecef', cursor: 'not-allowed' }}
                                      />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                      <label htmlFor="state" className="form-label fs-4">
                                        State*
                                      </label>
                                      <input
                                        type="text"
                                        id="state"
                                        value={formData.state || ''}
                                        className="form-control fs-4"
                                        name="state"
                                        placeholder="State"
                                        onChange={handleChange}
                                        disabled
                                        style={{ backgroundColor: '#e9ecef', cursor: 'not-allowed' }}
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="modal-footer">
                                  <button
                                    type='button'
                                    className="btn btn-warning btn-lg px-4 fs-3"
                                    onClick={modalAction}
                                  >
                                    Close
                                  </button>
                                  <button className="btn btn-success btn-lg  px-4 fs-3">
                                    {editMode ? 'Save Changes' : 'Add Address'}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='col-lg-6'>
                <div className='checkout-wrapper'>
                  <div className='account-section billing-section box-shadows'>
                    <h5 className='wrapper-heading'>Order Summary</h5>
                    <div className='order-summery'>
                      <div className='subtotal product-total'>
                        <h5 className='wrapper-heading'>Total Amount</h5>
                        <h5 className='wrapper-heading'>&#8377;{totalOriginalMRP}</h5>
                      </div>
                      <div className='subtotal product-total'>
                        <h5 className='wrapper-heading'>Delivery Charges</h5>
                        <h5 className='wrapper-heading'>&#8377; 0</h5>
                      </div>
                      <div className='subtotal product-total'>
                        <h5 className='wrapper-heading'> Product Discount</h5>
                        <h5 className='wrapper-heading'>&#8377; {Math.ceil(productdiscount)}</h5>
                      </div>
                      <div className='subtotal total'>
                        <h5 className='wrapper-heading'>Payable Amount</h5>
                        <h5 className='wrapper-heading price'>
                          &#8377; {Math.floor(totalOriginalMRP - Math.ceil(productdiscount))}
                        </h5>
                      </div>

                      <h5 className='heading-custom-font-1'>
                        Payment Mode - Cash on Delivery / UPI / QR
                      </h5>

                      {totalAmount < 100 && (
                        <div
                          className='alert alert-danger my-4 text-custom-font-1'
                          role='alert'
                        >
                          Minimum Cart Value should be 100.
                        </div>
                      )}
                      <div className='checkout-footer mt-5'>
                        <button
                          className='shop-btn d-block'
                          onClick={placeOrder}
                          disabled={totalAmount < 100 || isPlacingOrder || (userId && !selectedAddressId)}
                        >
                          {isPlacingOrder
                            ? 'Placing Your Order...'
                            : 'Place Order'}
                        </button>
                        {userId && !selectedAddressId && (
                          <div className='alert alert-warning mt-3 text-center' role='alert'>
                            Please select a delivery address
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="col-lg-6">
                <div className="d-flex flex-column h-100 mt-2">
                  <div className="border shadow p-3" style={{ height: "150px", overflowY: "auto" }}>
                    <div>
                      <h5>Instructions</h5>
                      <textarea
                        value={text}
                        onChange={handletextChange}
                        rows="4"
                        cols="50"
                        placeholder="Type here..."
                        className="w-100 mt-2 fs-4"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {loader && (
        <div className='loader-overlay'>
          <img src={loaderGif} alt='Loading...' className='loader-green' />
        </div>
      )}

      <ConfirmationModal
        show={showPincodeModal}
        onHide={() => setShowPincodeModal(false)}
        title="Notification"
        modalMessage={pincodeModalMessage}
        wantToAddData={true}
        confirmation={() => setShowPincodeModal(false)}
        operationType="Close"
        hideCancel={true}
      />
    </>
  );
}

export default Checkout;