import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { DataAppContext } from '../../DataContext';
import logo from '../../assets/images/logo.png';
import { marketCategory } from '../../utils/category';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
const Header = () => {
  const { appstate, logout_user } = useContext(DataAppContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { loginstatus } = appstate;
  const userid = localStorage.getItem('userid');
  const [searchText, setSearchText] = useState('');
  const { wishlistCount, updateWishlistCount } = useContext(DataAppContext);
  const { cartCount, updateCartCount } = useContext(DataAppContext);
  const [category, setCategory] = useState(marketCategory);

  const [modal, setModal] = useState(false);
  const [formData, setFormData] = useState({
    productName: '',
    productDesc: '',
    quantity: '',
    username: '',
    contact: '',
  });
  const [alertModal, setAlertModal] = useState(false);
  const [totalOrders, setTotalOrders] = useState(0);
  const userType = localStorage.getItem('usertype');

  useEffect(() => {
    if (userType === 'admin') {
      //fetchTotalOrders();
    }
  }, [userType]);

  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    console.log('Updated Suggestions:', suggestions);
  }, [suggestions]);

  const fetchTotalOrders = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}orders/getTotalOrders`
      );
      if (response.status === 200) {
        setTotalOrders(response.data.totalOrders);
      }
    } catch (error) {
      console.error('Error fetching total orders:', error);
    }
  };

  function handleAutoLogout(token) {
    if (!token) return;
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    if (decodedToken.exp < currentTime) {
      logout_user();
    }
  }
  const token = localStorage.getItem('jwttoken');
  handleAutoLogout(token);
  const formatcategoryName = name => {
    return name.replace(/\s+/g, '-').toLowerCase(); // Replace spaces with hyphens and convert to lowercase
  };

  // useEffect(() => {
  //   const fetchCategories = async () => {
  //     try {
  //       const response = await axios.get(`${process.env.REACT_APP_API_URL}category/allCategory`);
  //       setCategories(response.data);
  //     } catch (error) {
  //       console.error("Error fetching categories:", error);
  //     }
  //   };
  //   fetchCategories();
  // }, []);

  const securePages = [
    '/dashboard',
    '/wishlist',
    '/OrderHistory',
    '/orderhistory',
    '/profile',
    '/address',
  ];

  const checkLoginAndRedirect = () => {
    const token = localStorage.getItem('jwttoken');
    if (!token) {
      navigate('/login');
    }
  };

  const checkPageAccess = () => {
    const token = localStorage.getItem('jwttoken');
    let currentPage = window.location.pathname;
    if (securePages.includes(currentPage) && !token) {
      navigate('/login');
    }
  };

  useEffect(() => {
    const cart =
      localStorage.getItem('cart') &&
      JSON.parse(localStorage.getItem('cart'));
    updateCartCount(cart ? cart.length : 0);
  }, [location]);

  useEffect(() => {
    checkPageAccess();
  }, [navigate]);

  const tooglmenu = () => {
    let submenu = document.getElementById('subMenu');
    let empt = document.querySelector('.empty');
    submenu.classList.toggle('open-dropdown');
    empt.classList.toggle('active');
  };

  const handleLogout = () => {
    logout_user();
    localStorage.clear();
    navigate('/login');
  };

  const fetchSuggestions = async query => {
    if (query.length > 1) {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}products/search?q=${query}&suggestions=true`
        );
        setSuggestions(response.data);
      } catch (error) {
        console.error('Error fetching search suggestions:', error);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleChange = e => {
    const query = e.target.value;
    setSearchText(query);
    //fetchSuggestions(query);
  };

  const handleSelect = selectedName => {
    setSearchText(selectedName);
    setSuggestions([]);
  };

  const handleSearch = async () => {
    if (searchText.trim()) {
      try {
        navigate(`/productsearchlist?q=${encodeURIComponent(searchText)}`);
        // const apiUrl = `${process.env.REACT_APP_API_URL}products/search?q=${encodeURIComponent(searchText)}`;
        // const response = await axios.get(apiUrl);

        // if (response.data && response.data.length > 0) {
        //   navigate(`/product/${response.data[0].productid}`);
        // } else {
        //   console.warn("No valid product ID found, redirecting to search list");
        //   navigate(`/productsearchlist?q=${encodeURIComponent(searchText)}`);
        // }
      } catch (error) {
        console.error(
          'Error fetching product ID:',
          error.response?.data || error.message
        );
        navigate(`/productsearchlist?q=${encodeURIComponent(searchText)}`);
      }
    }
  };

  function getDeliverySlot(orderTime) {
    const hours = orderTime.getHours();

    if (hours < 11) {
      return '12 PM - 3 PM';
    } else if (hours >= 11 && hours < 14) {
      return '3 PM - 6 PM';
    } else if (hours >= 14 && hours < 17) {
      return '6 PM - 9 PM';
    } else if (hours >= 17 && hours < 20) {
      const nextDay = new Date(orderTime);
      nextDay.setDate(nextDay.getDate() + 1);
      return `Next Day: 10 AM - 12 PM`;
    } else if (hours >= 10) {
      return '10 AM - 12 PM';
    } else {
      return 'No Delivery Slot Available';
    }
  }

  const orderTime = new Date();
  const deliverySlot = getDeliverySlot(orderTime);

  const fetchWishListItems = async () => {
    try {
      if (userid) {
        const url = `${process.env.REACT_APP_API_URL}wishlist/usersWishlist/${userid}`;
        const response = await axios.get(url);
        updateWishlistCount(response.data.length);
      }
    } catch (error) {
      console.error('Error fetching cart items', error);
    }
  };

  const fetchCustomProductData = async () => {
    try {
      const url = `${process.env.REACT_APP_API_URL}customProduct/add`;
      const response = await axios.post(url, formData);
    } catch (error) {
      console.error('Error sending data', error);
    }
  };
  const handleCustomProduct = e => {
    fetchCustomProductData();
    e.preventDefault();
    setModal(!modal);
    setAlertModal(!alertModal);
  };

  useEffect(() => {
    fetchWishListItems();
  }, []);
  return (
    <>
      <header id='header' class='header'>
        <div class='header-top-section d-block d-lg-none'>
          <div class='container'>
            <div class='header-top'>
              {/* <div class="header-profile">
                <Link to="/home">
                  <span>Home</span>
                </Link>
                <Link to="/dashboard">
                  <span>Account</span>
                </Link>
                <Link to="/contact">
                  <span>Contact</span>
                </Link>
                <Link to="/feedback">
                  <span>Feedback</span>
                </Link>
              </div> */}
              {/* <div><p className="delivery-slot">Next Delivery Slot {deliverySlot}</p></div> */}
              <div class='header-contact'>
                <div class='header-top-contact'>
                  <a href='#' class='top-contact phone'>
                    <span>
                      <svg
                        width='20'
                        height='21'
                        viewBox='0 0 20 21'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          d='M6.23801 8.53196C7.50029 10.7178 9.16931 12.4839 11.3767 13.7235C11.5568 13.8249 11.6712 13.8023 11.8147 13.6555C12.2344 13.2261 12.653 12.7946 13.1007 12.3965C13.925 11.6639 14.9111 11.6596 15.704 12.4137C16.565 13.2315 17.4054 14.0709 18.22 14.9351C19.0097 15.7733 19.0183 16.7886 18.2566 17.6452C17.7377 18.2299 17.1896 18.7931 16.6168 19.325C15.6771 20.1967 14.5378 20.2593 13.3478 20.0381C11.6529 19.7231 10.1327 18.9776 8.69029 18.0767C5.22711 15.9114 2.60544 12.9888 0.899747 9.26775C0.458488 8.3054 0.132668 7.30313 0.0258596 6.23936C-0.0917375 5.07094 0.181218 4.04385 1.06158 3.21312C1.48881 2.8107 1.88691 2.37699 2.30552 1.96594C3.26571 1.02517 4.34459 1.01438 5.31126 1.95084C6.0697 2.68663 6.81952 3.43321 7.55207 4.19382C8.49393 5.17235 8.49609 6.16492 7.57149 7.16503C7.15505 7.616 6.71703 8.04323 6.23801 8.53196ZM1.16299 5.81644C1.12523 5.82507 1.08855 5.8337 1.05079 5.84341C1.26225 6.61696 1.4025 7.42072 1.69811 8.16083C3.24414 12.021 5.87335 14.9782 9.38508 17.1619C10.6948 17.9764 12.0747 18.6485 13.6153 18.9301C14.6672 19.1222 15.5756 18.9517 16.2801 18.0606C16.5693 17.6948 16.9383 17.3917 17.2652 17.055C17.8035 16.5005 17.8089 16.1251 17.2716 15.5813C16.538 14.839 15.799 14.1022 15.0578 13.3675C14.5723 12.8863 14.2044 12.8841 13.7124 13.3642C13.2453 13.8195 12.7922 14.2888 12.325 14.7441C11.9603 15.0991 11.6313 15.1627 11.1911 14.9135C10.5805 14.5672 9.95364 14.2316 9.39695 13.8087C7.68693 12.5098 6.22075 10.9853 5.25408 9.03795C4.91855 8.3615 4.98544 8.10149 5.52164 7.58579C5.94455 7.17905 6.36639 6.77016 6.77421 6.34832C7.23489 5.87254 7.23381 5.5068 6.76666 5.02994C6.01792 4.2661 5.26163 3.50981 4.49994 2.75784C4.02848 2.29176 3.62498 2.29284 3.14272 2.75784C2.71981 3.16565 2.31955 3.59612 1.89339 3.99854C1.36798 4.49266 1.10905 5.0882 1.16299 5.81644Z'
                          fill='#27AE60'
                        />
                        <path
                          d='M11.0349 0C11.953 0.295611 12.829 0.486571 13.6274 0.850151C17.0614 2.4102 19.1944 5.04373 19.969 8.75073C20.0683 9.22436 19.9259 9.51457 19.5741 9.58146C19.2008 9.65159 18.9549 9.44337 18.8535 8.95032C18.3043 6.26177 16.877 4.16445 14.5962 2.64971C13.5637 1.96463 12.4298 1.52013 11.215 1.27954C11.0877 1.25473 10.9529 1.23531 10.8407 1.17705C10.5796 1.04111 10.4372 0.799444 10.558 0.529726C10.6443 0.333371 10.8536 0.192039 11.0349 0Z'
                          fill='#27AE60'
                        />
                        <path
                          d='M16.3863 9.17931C16.3776 9.48679 16.2363 9.70472 15.9191 9.75542C15.6095 9.80505 15.3797 9.66804 15.2815 9.36703C15.193 9.09515 15.1574 8.80602 15.0614 8.53846C14.3839 6.64504 13.0795 5.43023 11.1203 4.9361C11.0318 4.91345 10.9423 4.89834 10.8538 4.87569C10.5053 4.78722 10.3144 4.53908 10.3597 4.23376C10.4082 3.90686 10.6823 3.7159 11.0458 3.75474C13.5294 4.02446 16.095 6.5803 16.3712 9.05739C16.3755 9.09623 16.3809 9.13507 16.3863 9.17931Z'
                          fill='#27AE60'
                        />
                      </svg>
                    </span>
                    <span class='contact-text'>8757499345</span>

                    <span>
                      <svg
                        width='17'
                        height='12'
                        viewBox='0 0 17 12'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          d='M8.24976 11.6506C6.05064 11.6506 3.85153 11.6513 1.65176 11.65C0.57874 11.6493 0.000808974 11.0669 0.000161795 9.98673C0.000161795 7.2058 -0.000485385 4.42422 0.000808974 1.64264C0.00145615 0.587739 0.587154 0.000747299 1.64141 0.000747299C6.072 0.000100119 10.5032 -0.000547061 14.9338 0.000747299C15.9855 0.000747299 16.5686 0.589034 16.5693 1.64782C16.5705 4.4294 16.5699 7.21033 16.5693 9.99191C16.5686 11.0701 15.9894 11.65 14.9125 11.65C12.6914 11.6513 10.4709 11.6506 8.24976 11.6506ZM1.7016 0.990285C1.79867 1.09578 1.86533 1.17473 1.93782 1.24722C3.65802 2.95836 5.37887 4.6695 7.10037 6.38C7.88928 7.16373 8.67949 7.16503 9.4671 6.38259C11.1886 4.67274 12.9088 2.96159 14.6297 1.2498C14.7028 1.17732 14.7701 1.09901 14.8711 0.990285C10.4651 0.990285 6.10695 0.990285 1.7016 0.990285ZM10.709 6.50037C10.0263 7.25628 9.3545 7.93905 8.27694 7.93776C7.19874 7.93582 6.53732 7.23492 5.88626 6.53726C4.51359 7.9397 3.1584 9.32467 1.86016 10.6514C6.1173 10.6514 10.4748 10.6514 14.7727 10.6514C13.4382 9.28842 12.0888 7.90993 10.709 6.50037ZM5.03069 5.86937C3.68844 4.50965 2.33324 3.13633 0.999407 1.78502C0.999407 4.47146 0.999407 7.19609 0.999407 9.97055C2.38761 8.55776 3.73827 7.18444 5.03069 5.86937ZM11.5387 5.80012C12.8661 7.15079 14.2193 8.52734 15.5752 9.90648C15.5752 7.18444 15.5752 4.46046 15.5752 1.71318C14.1993 3.10592 12.8473 4.47535 11.5387 5.80012Z'
                          fill='#27AE60'
                        />
                      </svg>
                    </span>
                    <span class='contact-text'>grocji@gmail.com</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class='header-top-section d-none d-lg-flex'>
          <div class='container'>
            <div class='header-top'>
              <div class='header-profile'>
                <Link to='/home'>
                  <span>Home</span>
                </Link>
                <Link to='/dashboard'>
                  <span>Account</span>
                </Link>
                {/* <a href="order.html">
                  <span>Track Order</span>
                </a> */}
                <Link to='/contact'>
                  <span>Contact</span>
                </Link>
                <Link to='/feedback'>
                  <span>Feedback</span>
                </Link>
              </div>
              <div>
                <p className='delivery-slot'>
                  Next Delivery Slot {deliverySlot}
                </p>
              </div>
              <div class='header-contact'>
                <div class='header-top-contact'>
                  <a href='#' class='top-contact phone'>
                    <span>
                      <svg
                        width='20'
                        height='21'
                        viewBox='0 0 20 21'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          d='M6.23801 8.53196C7.50029 10.7178 9.16931 12.4839 11.3767 13.7235C11.5568 13.8249 11.6712 13.8023 11.8147 13.6555C12.2344 13.2261 12.653 12.7946 13.1007 12.3965C13.925 11.6639 14.9111 11.6596 15.704 12.4137C16.565 13.2315 17.4054 14.0709 18.22 14.9351C19.0097 15.7733 19.0183 16.7886 18.2566 17.6452C17.7377 18.2299 17.1896 18.7931 16.6168 19.325C15.6771 20.1967 14.5378 20.2593 13.3478 20.0381C11.6529 19.7231 10.1327 18.9776 8.69029 18.0767C5.22711 15.9114 2.60544 12.9888 0.899747 9.26775C0.458488 8.3054 0.132668 7.30313 0.0258596 6.23936C-0.0917375 5.07094 0.181218 4.04385 1.06158 3.21312C1.48881 2.8107 1.88691 2.37699 2.30552 1.96594C3.26571 1.02517 4.34459 1.01438 5.31126 1.95084C6.0697 2.68663 6.81952 3.43321 7.55207 4.19382C8.49393 5.17235 8.49609 6.16492 7.57149 7.16503C7.15505 7.616 6.71703 8.04323 6.23801 8.53196ZM1.16299 5.81644C1.12523 5.82507 1.08855 5.8337 1.05079 5.84341C1.26225 6.61696 1.4025 7.42072 1.69811 8.16083C3.24414 12.021 5.87335 14.9782 9.38508 17.1619C10.6948 17.9764 12.0747 18.6485 13.6153 18.9301C14.6672 19.1222 15.5756 18.9517 16.2801 18.0606C16.5693 17.6948 16.9383 17.3917 17.2652 17.055C17.8035 16.5005 17.8089 16.1251 17.2716 15.5813C16.538 14.839 15.799 14.1022 15.0578 13.3675C14.5723 12.8863 14.2044 12.8841 13.7124 13.3642C13.2453 13.8195 12.7922 14.2888 12.325 14.7441C11.9603 15.0991 11.6313 15.1627 11.1911 14.9135C10.5805 14.5672 9.95364 14.2316 9.39695 13.8087C7.68693 12.5098 6.22075 10.9853 5.25408 9.03795C4.91855 8.3615 4.98544 8.10149 5.52164 7.58579C5.94455 7.17905 6.36639 6.77016 6.77421 6.34832C7.23489 5.87254 7.23381 5.5068 6.76666 5.02994C6.01792 4.2661 5.26163 3.50981 4.49994 2.75784C4.02848 2.29176 3.62498 2.29284 3.14272 2.75784C2.71981 3.16565 2.31955 3.59612 1.89339 3.99854C1.36798 4.49266 1.10905 5.0882 1.16299 5.81644Z'
                          fill='#27AE60'
                        />
                        <path
                          d='M11.0349 0C11.953 0.295611 12.829 0.486571 13.6274 0.850151C17.0614 2.4102 19.1944 5.04373 19.969 8.75073C20.0683 9.22436 19.9259 9.51457 19.5741 9.58146C19.2008 9.65159 18.9549 9.44337 18.8535 8.95032C18.3043 6.26177 16.877 4.16445 14.5962 2.64971C13.5637 1.96463 12.4298 1.52013 11.215 1.27954C11.0877 1.25473 10.9529 1.23531 10.8407 1.17705C10.5796 1.04111 10.4372 0.799444 10.558 0.529726C10.6443 0.333371 10.8536 0.192039 11.0349 0Z'
                          fill='#27AE60'
                        />
                        <path
                          d='M16.3863 9.17931C16.3776 9.48679 16.2363 9.70472 15.9191 9.75542C15.6095 9.80505 15.3797 9.66804 15.2815 9.36703C15.193 9.09515 15.1574 8.80602 15.0614 8.53846C14.3839 6.64504 13.0795 5.43023 11.1203 4.9361C11.0318 4.91345 10.9423 4.89834 10.8538 4.87569C10.5053 4.78722 10.3144 4.53908 10.3597 4.23376C10.4082 3.90686 10.6823 3.7159 11.0458 3.75474C13.5294 4.02446 16.095 6.5803 16.3712 9.05739C16.3755 9.09623 16.3809 9.13507 16.3863 9.17931Z'
                          fill='#27AE60'
                        />
                      </svg>
                    </span>
                    <span class='contact-text'>8757499344, 8757499345</span>
                  </a>
                  <div class='divider'></div>
                  <a href='#' class='top-contact email'>
                    <span>
                      <svg
                        width='17'
                        height='12'
                        viewBox='0 0 17 12'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          d='M8.24976 11.6506C6.05064 11.6506 3.85153 11.6513 1.65176 11.65C0.57874 11.6493 0.000808974 11.0669 0.000161795 9.98673C0.000161795 7.2058 -0.000485385 4.42422 0.000808974 1.64264C0.00145615 0.587739 0.587154 0.000747299 1.64141 0.000747299C6.072 0.000100119 10.5032 -0.000547061 14.9338 0.000747299C15.9855 0.000747299 16.5686 0.589034 16.5693 1.64782C16.5705 4.4294 16.5699 7.21033 16.5693 9.99191C16.5686 11.0701 15.9894 11.65 14.9125 11.65C12.6914 11.6513 10.4709 11.6506 8.24976 11.6506ZM1.7016 0.990285C1.79867 1.09578 1.86533 1.17473 1.93782 1.24722C3.65802 2.95836 5.37887 4.6695 7.10037 6.38C7.88928 7.16373 8.67949 7.16503 9.4671 6.38259C11.1886 4.67274 12.9088 2.96159 14.6297 1.2498C14.7028 1.17732 14.7701 1.09901 14.8711 0.990285C10.4651 0.990285 6.10695 0.990285 1.7016 0.990285ZM10.709 6.50037C10.0263 7.25628 9.3545 7.93905 8.27694 7.93776C7.19874 7.93582 6.53732 7.23492 5.88626 6.53726C4.51359 7.9397 3.1584 9.32467 1.86016 10.6514C6.1173 10.6514 10.4748 10.6514 14.7727 10.6514C13.4382 9.28842 12.0888 7.90993 10.709 6.50037ZM5.03069 5.86937C3.68844 4.50965 2.33324 3.13633 0.999407 1.78502C0.999407 4.47146 0.999407 7.19609 0.999407 9.97055C2.38761 8.55776 3.73827 7.18444 5.03069 5.86937ZM11.5387 5.80012C12.8661 7.15079 14.2193 8.52734 15.5752 9.90648C15.5752 7.18444 15.5752 4.46046 15.5752 1.71318C14.1993 3.10592 12.8473 4.47535 11.5387 5.80012Z'
                          fill='#27AE60'
                        />
                      </svg>
                    </span>
                    <span class='contact-text'>grocji@gmail.com</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class='header-center-section d-none d-lg-flex'>
          <div class='container'>
            <div class='header-center w-100'>
              <div className='col-lg-4'>
                <div class='logo '>
                  <Link to='/home'>
                    {/* <h2>Grocji</h2> */}
                    <img src={logo} alt='logo' className='logo-image' />
                  </Link>
                </div>
              </div>
              {/*
              <div class='header-search-btn1 '>
                <input
                  value={searchText}
                  onChange={e => setSearchText(e.target.value)}
                  type='text'
                  placeholder='Search Product.....'
                  className=''
                />
              */}

              <div class='col-lg-4 d-flex align-items-center'>
                <div class='header-search-btn1 d-flex align-items-center w-100'>
                  <input
                    value={searchText}

                    onChange={handleChange}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchText)}
                    type='text'
                    placeholder='Search Product.....'
                    className=''
                  />

                  {/* Dropdown for Suggestions */}
                  {/* {suggestions.length > 0 && ( */}
                  {/* <ul className="suggestions-dropdown">
                      {suggestions.map((item, index) => (
                        <li key={index} onClick={() => handleSelect(item.prod_name)}>
                          {item.prod_name}
                        </li>
                      ))}
                    </ul> */}
                  {/* )} */}

                  <button
                    onClick={() => handleSearch(searchText)}
                    className='search-btn btn-primary'
                  >
                    Search
                  </button>
                </div>
              </div>
              {/* <div class="divider"></div>
                <div id="allcat">
                  <button type="button" onclick="selectBoxHandler('allcat')">
                    <span class="item-text">All Categories</span>
                    <span>
                      <svg
                        width="10"
                        height="5"
                        viewBox="0 0 10 5"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect
                          x="9.18359"
                          y="0.90918"
                          width="5.78538"
                          height="1.28564"
                          transform="rotate(135 9.18359 0.90918)"
                          fill="#8E8E8E"
                        ></rect>
                        <rect
                          x="5.08984"
                          y="5"
                          width="5.78538"
                          height="1.28564"
                          transform="rotate(-135 5.08984 5)"
                          fill="#8E8E8E"
                        ></rect>
                      </svg>
                    </span>
                  </button>
                  <div class="slectbox-body" style={{ display: "none" }}>
                    <div
                      class="clickAway position-fixed"
                      onclick="selectBoxHandler('allcat')"
                    ></div>
                    <ul class="country-options">
                      <li class="all-option">
                        <span class="option-text item-text">Vegetable</span>
                      </li>
                      <li class="all-option">
                        <span class="option-text item-text">Fruits</span>
                      </li>
                      <li class="all-option">
                        <span class="option-text item-text">Juice</span>
                      </li>
                      <li class="all-option">
                        <span class="option-text item-text">Meat</span>
                      </li>
                    </ul>
                  </div>
                </div> */}
              {/*
                <button onClick={handleSearch} class='search-btn'>
                  Search
                </button>
              </div> */}

              {/* {userType === 'admin' && (
                <div className="total-orders">
                  <strong>Total Orders:</strong> <strong>{totalOrders}</strong>
                </div>
              )} */}

              <div class='col-lg-4'>
                <div class='header-cart-items'>
                  {/* <div class="header-compaire">
                    <a href="compaire.html" class="cart-item">
                      <span>
                        <svg
                          width="29"
                          height="24"
                          viewBox="0 0 29 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8.00353 2.70598C8.00353 3.09348 7.99103 3.41431 7.97853 3.41431C7.96603 3.41431 7.76186 3.45181 7.53269 3.50181C3.57436 4.30181 0.620193 7.43098 0.0701934 11.406C-0.0589733 12.3143 -0.00480663 13.6977 0.191027 14.6227C0.68686 16.9893 2.22436 19.2102 4.25769 20.5102L4.49519 20.6602L5.08269 20.2185C5.40353 19.9768 5.67019 19.7685 5.67019 19.7518C5.67019 19.7393 5.56603 19.6727 5.44103 19.606C4.80353 19.2727 3.97436 18.606 3.41186 17.9768C2.34519 16.781 1.66186 15.3227 1.44103 13.7893C1.36186 13.2227 1.36186 12.0977 1.44103 11.5602C1.61186 10.4226 2.01186 9.34765 2.61186 8.40598C3.36186 7.23515 4.50353 6.21015 5.75353 5.58098C6.38686 5.26431 7.26603 4.96431 7.87019 4.85598L8.00353 4.83098V5.41431C8.00353 5.73515 8.01186 5.99765 8.02436 5.99765C8.06603 5.99765 10.6702 4.02681 10.6702 3.99765C10.6702 3.96848 8.06603 1.99764 8.02436 1.99764C8.01186 1.99764 8.00353 2.31431 8.00353 2.70598Z"
                            fill="black"
                          />
                          <path
                            d="M13.5914 5.11119C13.2706 5.35286 13.0122 5.56536 13.0247 5.58203C13.0372 5.60286 13.1622 5.68203 13.3081 5.76119C14.5289 6.45286 15.6664 7.61953 16.3706 8.91536C16.7956 9.69453 17.1539 10.8279 17.2539 11.7112C17.3372 12.407 17.2872 13.6029 17.1539 14.2362C16.5789 16.9612 14.6831 19.157 12.0664 20.132C11.7372 20.2529 10.8456 20.4987 10.7289 20.4987C10.6831 20.4987 10.6706 20.3945 10.6706 19.9154C10.6706 19.5945 10.6622 19.332 10.6497 19.332C10.6081 19.332 8.00391 21.3029 8.00391 21.332C8.00391 21.3612 10.6081 23.332 10.6497 23.332C10.6622 23.332 10.6706 23.0154 10.6706 22.6237V21.9195L10.8289 21.8945C11.2164 21.832 12.3122 21.5362 12.6706 21.3945C15.9206 20.1237 18.1456 17.307 18.6081 13.8737C18.7289 12.9904 18.6747 11.607 18.4831 10.707C17.9872 8.34036 16.4497 6.11953 14.4164 4.81953L14.1789 4.66953L13.5914 5.11119Z"
                            fill="black"
                          />
                          <circle cx="21.668" cy="7" r="7" fill="#34A853" />
                          <path
                            d="M21.6716 10.1087C21.1666 10.1065 20.7351 9.97337 20.3772 9.70916C20.0192 9.44496 19.7454 9.06037 19.5558 8.5554C19.3662 8.05043 19.2714 7.44212 19.2714 6.73047C19.2714 6.02095 19.3662 5.41477 19.5558 4.91193C19.7476 4.40909 20.0224 4.02557 20.3804 3.76136C20.7405 3.49716 21.1709 3.36506 21.6716 3.36506C22.1723 3.36506 22.6016 3.49822 22.9596 3.76456C23.3175 4.02876 23.5913 4.41229 23.7809 4.91513C23.9727 5.41584 24.0686 6.02095 24.0686 6.73047C24.0686 7.44425 23.9738 8.05362 23.7841 8.55859C23.5945 9.06143 23.3207 9.44602 22.9628 9.71236C22.6048 9.97656 22.1744 10.1087 21.6716 10.1087ZM21.6716 9.25533C22.1147 9.25533 22.461 9.03906 22.7103 8.60653C22.9617 8.17401 23.0874 7.54865 23.0874 6.73047C23.0874 6.18714 23.0299 5.72798 22.9148 5.35298C22.8019 4.97585 22.6389 4.69034 22.4258 4.49645C22.2149 4.30043 21.9635 4.20241 21.6716 4.20241C21.2305 4.20241 20.8843 4.41974 20.6329 4.8544C20.3814 5.28906 20.2547 5.91442 20.2525 6.73047C20.2525 7.27592 20.309 7.73722 20.4219 8.11435C20.537 8.48935 20.7 8.77379 20.9109 8.96768C21.1218 9.15945 21.3754 9.25533 21.6716 9.25533Z"
                            fill="#F9FFFB"
                          />
                        </svg>
                      </span>
                    </a>
                  </div> */}
                  <div>
                    {loginstatus && (
                      <>
                        <div class='header-favourite'>
                          <Link
                            to='/wishlist'
                            class='cart-item position-relative'
                          >
                            <span>
                              <svg
                                width='28'
                                height='23'
                                viewBox='0 0 28 23'
                                fill='none'
                                xmlns='http://www.w3.org/2000/svg'
                              >
                                <path
                                  d='M4.97214 5.02422C3.71435 5.18246 2.6616 5.7007 1.7705 6.60267C0.970091 7.40971 0.489057 8.26421 0.213053 9.37586C-0.275867 11.3024 0.0789948 13.2013 1.25398 14.9855C2.00708 16.1288 2.98097 17.1772 4.76711 18.7754C5.90266 19.7921 9.36848 22.7591 9.53802 22.858C9.69574 22.953 9.75488 22.9648 10.09 22.9648C10.4252 22.9648 10.4843 22.953 10.642 22.858C10.8116 22.7591 14.2853 19.7881 15.413 18.7754C17.207 17.1692 18.173 16.1249 18.9261 14.9855C20.1011 13.2013 20.4559 11.3024 19.967 9.37586C19.691 8.26421 19.21 7.40971 18.4096 6.60267C17.6131 5.7996 16.7614 5.33674 15.6456 5.09938C15.0857 4.9807 14.0526 4.96883 13.5637 5.0796C12.1995 5.3763 11.1546 6.0607 10.2004 7.27916L10.09 7.41762L9.98357 7.27916C9.04122 6.08443 8.01212 5.40004 6.69913 5.09938C6.30878 5.00839 5.4098 4.96883 4.97214 5.02422ZM6.28907 6.23081C7.40885 6.42861 8.37487 7.0774 9.13979 8.14948C9.26991 8.33542 9.43156 8.55696 9.49465 8.64795C9.78643 9.05937 10.3936 9.05937 10.6854 8.64795C10.7485 8.55696 10.9102 8.33542 11.0403 8.14948C12.0851 6.68575 13.5401 5.9974 15.1251 6.21498C16.8837 6.4563 18.2558 7.69058 18.7802 9.50641C19.1942 10.9424 19.0128 12.4497 18.2597 13.8066C17.6289 14.942 16.5761 16.1328 14.7427 17.7824C13.8555 18.5776 10.1255 21.7978 10.09 21.7978C10.0506 21.7978 6.33638 18.5895 5.4374 17.7824C2.61823 15.2466 1.50633 13.6642 1.23821 11.8088C1.06472 10.6101 1.31312 9.32047 1.91639 8.30377C2.82326 6.77278 4.58968 5.9341 6.28907 6.23081Z'
                                  fill='black'
                                />
                                {/* <circle cx="20.9141" cy="7" r="7" fill="#34A853" ></circle>
                                <path
                                  d="M20.9177 10.1087C20.4127 10.1065 19.9812 9.97337 19.6233 9.70916C19.2653 9.44496 18.9915 9.06037 18.8019 8.5554C18.6123 8.05043 18.5174 7.44212 18.5174 6.73047C18.5174 6.02095 18.6123 5.41477 18.8019 4.91193C18.9937 4.40909 19.2685 4.02557 19.6265 3.76136C19.9866 3.49716 20.4169 3.36506 20.9177 3.36506C21.4184 3.36506 21.8477 3.49822 22.2057 3.76456C22.5636 4.02876 22.8374 4.41229 23.027 4.91513C23.2188 5.41584 23.3147 6.02095 23.3147 6.73047C23.3147 7.44425 23.2199 8.05362 23.0302 8.55859C22.8406 9.06143 22.5668 9.44602 22.2089 9.71236C21.8509 9.97656 21.4205 10.1087 20.9177 10.1087ZM20.9177 9.25533C21.3608 9.25533 21.7071 9.03906 21.9564 8.60653C22.2078 8.17401 22.3335 7.54865 22.3335 6.73047C22.3335 6.18714 22.276 5.72798 22.1609 5.35298C22.048 4.97585 21.885 4.69034 21.6719 4.49645C21.461 4.30043 21.2096 4.20241 20.9177 4.20241C20.4766 4.20241 20.1304 4.41974 19.879 4.8544C19.6275 5.28906 19.5008 5.91442 19.4986 6.73047C19.4986 7.27592 19.5551 7.73722 19.668 8.11435C19.7831 8.48935 19.9461 8.77379 20.157 8.96768C20.3679 9.15945 20.6215 9.25533 20.9177 9.25533Z"
                                  fill="#F9FFFB"
                                /> */}
                              </svg>
                              <span className='wishlistbadge'>
                                {wishlistCount}
                              </span>
                            </span>
                          </Link>
                        </div>
                      </>
                    )}
                  </div>
                  <div>
                    {loginstatus && (
                      <>
                        <div class='header-cart'>
                          <Link to='/cart' class='cart-item position-relative'>
                            <span>
                              <svg
                                width='24'
                                height='23'
                                viewBox='0 0 24 23'
                                fill='none'
                                xmlns='http://www.w3.org/2000/svg'
                              >
                                <path
                                  d='M16.1568 8.1772C16.0284 7.84626 15.7343 7.81766 14.2887 7.81766H13.0875V7.2947C13.0875 6.48165 12.9716 5.91374 12.6899 5.32949C12.1804 4.2713 11.3272 3.5318 10.2213 3.1886C9.68279 3.02517 8.87923 2.95572 8.39047 3.02926C7.03602 3.24172 5.88039 4.09562 5.29223 5.31315C5.00642 5.90966 4.89045 6.48165 4.89045 7.2947V7.82175H3.68511C2.23954 7.82175 1.94546 7.85035 1.81705 8.19354C1.75078 8.41008 1.12948 13.0637 0.864385 15.0697C0.632431 16.8184 0.417045 18.469 0.259648 19.711C-0.0137267 21.8519 -0.00544266 21.8846 0.00284141 21.9214V21.9255C0.0401198 22.0644 0.408761 22.428 0.520596 22.5342L1.00521 23H16.9438L17.3041 22.6854C17.4657 22.5424 18 22.0562 18 21.8152C18 21.6517 16.1899 8.27117 16.1568 8.1772ZM16.6911 21.5046C16.687 21.5332 16.6538 21.619 16.5958 21.6803L16.513 21.7702H1.46498L1.2496 21.5414L2.09871 15.2863C2.39694 13.0596 2.66203 11.1189 2.81943 9.95855C2.88984 9.45193 2.92298 9.19453 2.93955 9.06788C3.49872 9.06379 5.94252 9.0597 8.98278 9.0597H15.0302L15.0384 9.10465C15.1047 9.4315 16.6621 21.141 16.6911 21.5046ZM6.1372 7.82175V7.35598C6.1372 7.04139 6.17862 6.6083 6.22418 6.40811C6.46856 5.38669 7.30111 4.5573 8.34077 4.29173C8.77568 4.1855 9.48811 4.22228 9.92302 4.37753H9.92717C10.3828 4.5287 10.7556 4.77384 11.0994 5.14972C11.6544 5.74623 11.8408 6.28145 11.8408 7.27018V7.82175H6.1372Z'
                                  fill='black'
                                />
                                {/* <circle cx="17" cy="7" r="7" fill="#34A853" /> */}
                                {/* <path
                                  d="M17.0036 10.1087C16.4986 10.1065 16.0672 9.97337 15.7092 9.70916C15.3513 9.44496 15.0775 9.06037 14.8878 8.5554C14.6982 8.05043 14.6034 7.44212 14.6034 6.73047C14.6034 6.02095 14.6982 5.41477 14.8878 4.91193C15.0796 4.40909 15.3544 4.02557 15.7124 3.76136C16.0725 3.49716 16.5029 3.36506 17.0036 3.36506C17.5043 3.36506 17.9336 3.49822 18.2916 3.76456C18.6495 4.02876 18.9233 4.41229 19.113 4.91513C19.3047 5.41584 19.4006 6.02095 19.4006 6.73047C19.4006 7.44425 19.3058 8.05362 19.1162 8.55859C18.9265 9.06143 18.6527 9.44602 18.2948 9.71236C17.9368 9.97656 17.5064 10.1087 17.0036 10.1087ZM17.0036 9.25533C17.4468 9.25533 17.793 9.03906 18.0423 8.60653C18.2937 8.17401 18.4194 7.54865 18.4194 6.73047C18.4194 6.18714 18.3619 5.72798 18.2468 5.35298C18.1339 4.97585 17.9709 4.69034 17.7579 4.49645C17.5469 4.30043 17.2955 4.20241 17.0036 4.20241C16.5625 4.20241 16.2163 4.41974 15.9649 4.8544C15.7135 5.28906 15.5867 5.91442 15.5846 6.73047C15.5846 7.27592 15.641 7.73722 15.754 8.11435C15.869 8.48935 16.032 8.77379 16.2429 8.96768C16.4539 9.15945 16.7074 9.25533 17.0036 9.25533Z"
                                  fill="#F9FFFB"
                                /> */}
                              </svg>
                              <span className='cartbadge'>{cartCount}</span>
                            </span>
                          </Link>
                        </div>
                      </>
                    )}
                  </div>
                  <div>
                    {loginstatus && (
                      <>
                        <div class='header-user'>
                          <Link to='/dashboard'>
                            <span>
                              <svg
                                width='20'
                                height='20'
                                viewBox='0 0 20 20'
                                fill='none'
                                xmlns='http://www.w3.org/2000/svg'
                              >
                                <path
                                  d='M19.992 19.729C19.9004 18.043 19.438 16.4886 18.617 15.1176C17.6046 13.4237 16.2096 12.1244 14.4679 11.2475C14.0773 11.0522 13.878 10.9645 13.3878 10.7772L12.9334 10.6138L13.4954 10.1833C14.5476 9.38621 15.3408 8.08689 15.6118 6.70387C15.6955 6.28936 15.7035 5.22917 15.6317 4.78278C15.4643 3.77043 14.9582 2.70227 14.2766 1.92507C13.4356 0.976485 12.2439 0.30291 11.0084 0.079713C10.7971 0.0398565 10.1515 0 9.75289 0C9.60542 0 9.55361 0.00398565 9.53766 0.0079713H9.53368C9.49781 0.011957 9.42607 0.0239139 9.33838 0.0358709H9.32642C9.25468 0.0438422 9.17896 0.0557991 9.10323 0.0677561C8.1666 0.195297 7.01873 0.73336 6.25349 1.41092C5.27302 2.27581 4.59147 3.50339 4.38023 4.78278C4.3045 5.22917 4.31646 6.28936 4.40016 6.70387C4.67118 8.08689 5.46433 9.38621 6.51654 10.1833L7.07852 10.6138L6.62415 10.7772C6.13392 10.9645 5.93464 11.0522 5.54404 11.2475C3.80231 12.1244 2.40335 13.4237 1.39498 15.1176C0.569948 16.4926 0.107613 18.043 0.0159426 19.729L0 20H0.255082H1.1957H18.8123H19.4938H20.008L19.992 19.729ZM5.56397 4.98605C5.73934 3.92188 6.28537 2.95735 7.10642 2.25986C7.91949 1.57035 8.94779 1.19171 10 1.19171C10.2352 1.19171 10.4743 1.21164 10.7094 1.24751C13.1606 1.64607 14.8386 3.95775 14.444 6.39299C14.2686 7.45715 13.7226 8.42168 12.9016 9.11917C12.0885 9.80869 11.0602 10.1873 10.008 10.1873C9.77282 10.1873 9.53368 10.1674 9.29853 10.1315C6.84735 9.72898 5.16939 7.42128 5.56397 4.98605ZM2.54285 15.5281C3.73057 13.7146 5.31287 12.4751 7.25389 11.8414C8.17059 11.5424 9.09526 11.391 10.004 11.391C10.9127 11.391 11.8374 11.5424 12.7541 11.8414C14.6951 12.4751 16.2814 13.7146 17.4651 15.5281C18.047 16.4169 18.5134 17.6963 18.7086 18.8721H1.29932C1.49462 17.6963 1.96094 16.4169 2.54285 15.5281Z'
                                  fill='black'
                                />
                              </svg>
                            </span>
                          </Link>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <nav class='mobile-menu d-block d-lg-none'>
          <div class='mobile-menu-header d-flex justify-content-between align-items-center'>
            {/* <button
              class="btn"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvasWithBothOptions"
              aria-controls="offcanvasWithBothOptions"
            >
              <span>
                <svg
                  width="14"
                  height="9"
                  viewBox="0 0 14 9"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="14" height="1" fill="#1D1D1D" />
                  <rect y="8" width="14" height="1" fill="#1D1D1D" />
                  <rect y="4" width="10" height="1" fill="#1D1D1D" />
                </svg>
              </span>
            </button> */}

            <Link to='/home' class='mobile-header-logo'>
              <img src={logo} alt='logo' className='logo-image' />
            </Link>

            <div className='offcanvas-body'>
              <div class='header-input'>
                <input
                  value={searchText}
                  onChange={e => setSearchText(e.target.value)}
                  type='text'
                  placeholder='Search....'
                />
                { }
                <span onClick={handleSearch}>
                  <svg
                    width='22'
                    height='22'
                    viewBox='0 0 22 22'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M13.9708 16.4151C12.5227 17.4021 10.9758 17.9723 9.27353 18.0062C5.58462 18.0802 2.75802 16.483 1.05056 13.1945C-1.76315 7.77253 1.33485 1.37571 7.25086 0.167548C12.2281 -0.848249 17.2053 2.87895 17.7198 7.98579C17.9182 9.95558 17.5566 11.7939 16.5852 13.5061C16.4512 13.742 16.483 13.8725 16.6651 14.0553C18.2412 15.6386 19.8112 17.2272 21.3735 18.8244C22.1826 19.6513 22.2058 20.7559 21.456 21.4932C20.7697 22.1678 19.7047 22.1747 18.9764 21.4793C18.3623 20.8917 17.7774 20.2737 17.1796 19.6688C16.118 18.5929 15.0564 17.5153 13.9708 16.4151ZM2.89545 9.0364C2.91692 12.4172 5.59664 15.1164 8.91967 15.1042C12.2384 15.092 14.9138 12.3493 14.8889 8.98505C14.864 5.63213 12.1826 2.92508 8.89047 2.92857C5.58204 2.93118 2.87397 5.68958 2.89545 9.0364Z'
                      fill='#fff'
                    ></path>
                  </svg>
                </span>
              </div>
            </div>

            {/* <Link to="/wishlist" class="cart-item">
              <span>
                <svg
                  width="28"
                  height="23"
                  viewBox="0 0 28 23"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4.97214 5.02422C3.71435 5.18246 2.6616 5.7007 1.7705 6.60267C0.970091 7.40971 0.489057 8.26421 0.213053 9.37586C-0.275867 11.3024 0.0789948 13.2013 1.25398 14.9855C2.00708 16.1288 2.98097 17.1772 4.76711 18.7754C5.90266 19.7921 9.36848 22.7591 9.53802 22.858C9.69574 22.953 9.75488 22.9648 10.09 22.9648C10.4252 22.9648 10.4843 22.953 10.642 22.858C10.8116 22.7591 14.2853 19.7881 15.413 18.7754C17.207 17.1692 18.173 16.1249 18.9261 14.9855C20.1011 13.2013 20.4559 11.3024 19.967 9.37586C19.691 8.26421 19.21 7.40971 18.4096 6.60267C17.6131 5.7996 16.7614 5.33674 15.6456 5.09938C15.0857 4.9807 14.0526 4.96883 13.5637 5.0796C12.1995 5.3763 11.1546 6.0607 10.2004 7.27916L10.09 7.41762L9.98357 7.27916C9.04122 6.08443 8.01212 5.40004 6.69913 5.09938C6.30878 5.00839 5.4098 4.96883 4.97214 5.02422ZM6.28907 6.23081C7.40885 6.42861 8.37487 7.0774 9.13979 8.14948C9.26991 8.33542 9.43156 8.55696 9.49465 8.64795C9.78643 9.05937 10.3936 9.05937 10.6854 8.64795C10.7485 8.55696 10.9102 8.33542 11.0403 8.14948C12.0851 6.68575 13.5401 5.9974 15.1251 6.21498C16.8837 6.4563 18.2558 7.69058 18.7802 9.50641C19.1942 10.9424 19.0128 12.4497 18.2597 13.8066C17.6289 14.942 16.5761 16.1328 14.7427 17.7824C13.8555 18.5776 10.1255 21.7978 10.09 21.7978C10.0506 21.7978 6.33638 18.5895 5.4374 17.7824C2.61823 15.2466 1.50633 13.6642 1.23821 11.8088C1.06472 10.6101 1.31312 9.32047 1.91639 8.30377C2.82326 6.77278 4.58968 5.9341 6.28907 6.23081Z"
                    fill="black"
                  />
                  <circle cx="20.9141" cy="7" r="7" fill="#34A853" />
                  <path
                    d="M20.9177 10.1087C20.4127 10.1065 19.9812 9.97337 19.6233 9.70916C19.2653 9.44496 18.9915 9.06037 18.8019 8.5554C18.6123 8.05043 18.5174 7.44212 18.5174 6.73047C18.5174 6.02095 18.6123 5.41477 18.8019 4.91193C18.9937 4.40909 19.2685 4.02557 19.6265 3.76136C19.9866 3.49716 20.4169 3.36506 20.9177 3.36506C21.4184 3.36506 21.8477 3.49822 22.2057 3.76456C22.5636 4.02876 22.8374 4.41229 23.027 4.91513C23.2188 5.41584 23.3147 6.02095 23.3147 6.73047C23.3147 7.44425 23.2199 8.05362 23.0302 8.55859C22.8406 9.06143 22.5668 9.44602 22.2089 9.71236C21.8509 9.97656 21.4205 10.1087 20.9177 10.1087ZM20.9177 9.25533C21.3608 9.25533 21.7071 9.03906 21.9564 8.60653C22.2078 8.17401 22.3335 7.54865 22.3335 6.73047C22.3335 6.18714 22.276 5.72798 22.1609 5.35298C22.048 4.97585 21.885 4.69034 21.6719 4.49645C21.461 4.30043 21.2096 4.20241 20.9177 4.20241C20.4766 4.20241 20.1304 4.41974 19.879 4.8544C19.6275 5.28906 19.5008 5.91442 19.4986 6.73047C19.4986 7.27592 19.5551 7.73722 19.668 8.11435C19.7831 8.48935 19.9461 8.77379 20.157 8.96768C20.3679 9.15945 20.6215 9.25533 20.9177 9.25533Z"
                    fill="#F9FFFB"
                  />
                </svg>
              </span>
            </Link>

            <Link to="/cart" class="cart-item">
              <span>
                <svg
                  width="24"
                  height="23"
                  viewBox="0 0 24 23"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16.1568 8.1772C16.0284 7.84626 15.7343 7.81766 14.2887 7.81766H13.0875V7.2947C13.0875 6.48165 12.9716 5.91374 12.6899 5.32949C12.1804 4.2713 11.3272 3.5318 10.2213 3.1886C9.68279 3.02517 8.87923 2.95572 8.39047 3.02926C7.03602 3.24172 5.88039 4.09562 5.29223 5.31315C5.00642 5.90966 4.89045 6.48165 4.89045 7.2947V7.82175H3.68511C2.23954 7.82175 1.94546 7.85035 1.81705 8.19354C1.75078 8.41008 1.12948 13.0637 0.864385 15.0697C0.632431 16.8184 0.417045 18.469 0.259648 19.711C-0.0137267 21.8519 -0.00544266 21.8846 0.00284141 21.9214V21.9255C0.0401198 22.0644 0.408761 22.428 0.520596 22.5342L1.00521 23H16.9438L17.3041 22.6854C17.4657 22.5424 18 22.0562 18 21.8152C18 21.6517 16.1899 8.27117 16.1568 8.1772ZM16.6911 21.5046C16.687 21.5332 16.6538 21.619 16.5958 21.6803L16.513 21.7702H1.46498L1.2496 21.5414L2.09871 15.2863C2.39694 13.0596 2.66203 11.1189 2.81943 9.95855C2.88984 9.45193 2.92298 9.19453 2.93955 9.06788C3.49872 9.06379 5.94252 9.0597 8.98278 9.0597H15.0302L15.0384 9.10465C15.1047 9.4315 16.6621 21.141 16.6911 21.5046ZM6.1372 7.82175V7.35598C6.1372 7.04139 6.17862 6.6083 6.22418 6.40811C6.46856 5.38669 7.30111 4.5573 8.34077 4.29173C8.77568 4.1855 9.48811 4.22228 9.92302 4.37753H9.92717C10.3828 4.5287 10.7556 4.77384 11.0994 5.14972C11.6544 5.74623 11.8408 6.28145 11.8408 7.27018V7.82175H6.1372Z"
                    fill="black"
                  />
                  <circle cx="17" cy="7" r="7" fill="#34A853" />
                  <path
                    d="M17.0036 10.1087C16.4986 10.1065 16.0672 9.97337 15.7092 9.70916C15.3513 9.44496 15.0775 9.06037 14.8878 8.5554C14.6982 8.05043 14.6034 7.44212 14.6034 6.73047C14.6034 6.02095 14.6982 5.41477 14.8878 4.91193C15.0796 4.40909 15.3544 4.02557 15.7124 3.76136C16.0725 3.49716 16.5029 3.36506 17.0036 3.36506C17.5043 3.36506 17.9336 3.49822 18.2916 3.76456C18.6495 4.02876 18.9233 4.41229 19.113 4.91513C19.3047 5.41584 19.4006 6.02095 19.4006 6.73047C19.4006 7.44425 19.3058 8.05362 19.1162 8.55859C18.9265 9.06143 18.6527 9.44602 18.2948 9.71236C17.9368 9.97656 17.5064 10.1087 17.0036 10.1087ZM17.0036 9.25533C17.4468 9.25533 17.793 9.03906 18.0423 8.60653C18.2937 8.17401 18.4194 7.54865 18.4194 6.73047C18.4194 6.18714 18.3619 5.72798 18.2468 5.35298C18.1339 4.97585 17.9709 4.69034 17.7579 4.49645C17.5469 4.30043 17.2955 4.20241 17.0036 4.20241C16.5625 4.20241 16.2163 4.41974 15.9649 4.8544C15.7135 5.28906 15.5867 5.91442 15.5846 6.73047C15.5846 7.27592 15.641 7.73722 15.754 8.11435C15.869 8.48935 16.032 8.77379 16.2429 8.96768C16.4539 9.15945 16.7074 9.25533 17.0036 9.25533Z"
                    fill="#F9FFFB"
                  />
                </svg>
              </span>
            </Link>

            <Link to="/dashboard">
              <span>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19.992 19.729C19.9004 18.043 19.438 16.4886 18.617 15.1176C17.6046 13.4237 16.2096 12.1244 14.4679 11.2475C14.0773 11.0522 13.878 10.9645 13.3878 10.7772L12.9334 10.6138L13.4954 10.1833C14.5476 9.38621 15.3408 8.08689 15.6118 6.70387C15.6955 6.28936 15.7035 5.22917 15.6317 4.78278C15.4643 3.77043 14.9582 2.70227 14.2766 1.92507C13.4356 0.976485 12.2439 0.30291 11.0084 0.079713C10.7971 0.0398565 10.1515 0 9.75289 0C9.60542 0 9.55361 0.00398565 9.53766 0.0079713H9.53368C9.49781 0.011957 9.42607 0.0239139 9.33838 0.0358709H9.32642C9.25468 0.0438422 9.17896 0.0557991 9.10323 0.0677561C8.1666 0.195297 7.01873 0.73336 6.25349 1.41092C5.27302 2.27581 4.59147 3.50339 4.38023 4.78278C4.3045 5.22917 4.31646 6.28936 4.40016 6.70387C4.67118 8.08689 5.46433 9.38621 6.51654 10.1833L7.07852 10.6138L6.62415 10.7772C6.13392 10.9645 5.93464 11.0522 5.54404 11.2475C3.80231 12.1244 2.40335 13.4237 1.39498 15.1176C0.569948 16.4926 0.107613 18.043 0.0159426 19.729L0 20H0.255082H1.1957H18.8123H19.4938H20.008L19.992 19.729ZM5.56397 4.98605C5.73934 3.92188 6.28537 2.95735 7.10642 2.25986C7.91949 1.57035 8.94779 1.19171 10 1.19171C10.2352 1.19171 10.4743 1.21164 10.7094 1.24751C13.1606 1.64607 14.8386 3.95775 14.444 6.39299C14.2686 7.45715 13.7226 8.42168 12.9016 9.11917C12.0885 9.80869 11.0602 10.1873 10.008 10.1873C9.77282 10.1873 9.53368 10.1674 9.29853 10.1315C6.84735 9.72898 5.16939 7.42128 5.56397 4.98605ZM2.54285 15.5281C3.73057 13.7146 5.31287 12.4751 7.25389 11.8414C8.17059 11.5424 9.09526 11.391 10.004 11.391C10.9127 11.391 11.8374 11.5424 12.7541 11.8414C14.6951 12.4751 16.2814 13.7146 17.4651 15.5281C18.047 16.4169 18.5134 17.6963 18.7086 18.8721H1.29932C1.49462 17.6963 1.96094 16.4169 2.54285 15.5281Z"
                    fill="black"
                  />
                </svg>
              </span>
            </Link> */}
          </div>

          <div
            class='offcanvas offcanvas-start'
            data-bs-scroll='true'
            tabindex='-1'
            id='offcanvasWithBothOptions'
          >
            <div class='offcanvas-body'>
              <div class='header-top'>
                <div class='header-cart '>
                  <div class='header-compaire'>
                    <a href='compaire.html' class='cart-item'>
                      <span>
                        <svg
                          width='29'
                          height='24'
                          viewBox='0 0 29 24'
                          fill='none'
                          xmlns='http://www.w3.org/2000/svg'
                        >
                          <path
                            d='M8.00353 2.70598C8.00353 3.09348 7.99103 3.41431 7.97853 3.41431C7.96603 3.41431 7.76186 3.45181 7.53269 3.50181C3.57436 4.30181 0.620193 7.43098 0.0701934 11.406C-0.0589733 12.3143 -0.00480663 13.6977 0.191027 14.6227C0.68686 16.9893 2.22436 19.2102 4.25769 20.5102L4.49519 20.6602L5.08269 20.2185C5.40353 19.9768 5.67019 19.7685 5.67019 19.7518C5.67019 19.7393 5.56603 19.6727 5.44103 19.606C4.80353 19.2727 3.97436 18.606 3.41186 17.9768C2.34519 16.781 1.66186 15.3227 1.44103 13.7893C1.36186 13.2227 1.36186 12.0977 1.44103 11.5602C1.61186 10.4226 2.01186 9.34765 2.61186 8.40598C3.36186 7.23515 4.50353 6.21015 5.75353 5.58098C6.38686 5.26431 7.26603 4.96431 7.87019 4.85598L8.00353 4.83098V5.41431C8.00353 5.73515 8.01186 5.99765 8.02436 5.99765C8.06603 5.99765 10.6702 4.02681 10.6702 3.99765C10.6702 3.96848 8.06603 1.99764 8.02436 1.99764C8.01186 1.99764 8.00353 2.31431 8.00353 2.70598Z'
                            fill='black'
                          />
                          <path
                            d='M13.5914 5.11119C13.2706 5.35286 13.0122 5.56536 13.0247 5.58203C13.0372 5.60286 13.1622 5.68203 13.3081 5.76119C14.5289 6.45286 15.6664 7.61953 16.3706 8.91536C16.7956 9.69453 17.1539 10.8279 17.2539 11.7112C17.3372 12.407 17.2872 13.6029 17.1539 14.2362C16.5789 16.9612 14.6831 19.157 12.0664 20.132C11.7372 20.2529 10.8456 20.4987 10.7289 20.4987C10.6831 20.4987 10.6706 20.3945 10.6706 19.9154C10.6706 19.5945 10.6622 19.332 10.6497 19.332C10.6081 19.332 8.00391 21.3029 8.00391 21.332C8.00391 21.3612 10.6081 23.332 10.6497 23.332C10.6622 23.332 10.6706 23.0154 10.6706 22.6237V21.9195L10.8289 21.8945C11.2164 21.832 12.3122 21.5362 12.6706 21.3945C15.9206 20.1237 18.1456 17.307 18.6081 13.8737C18.7289 12.9904 18.6747 11.607 18.4831 10.707C17.9872 8.34036 16.4497 6.11953 14.4164 4.81953L14.1789 4.66953L13.5914 5.11119Z'
                            fill='black'
                          />
                          <circle cx='21.668' cy='7' r='7' fill='#34A853' />
                          <path
                            d='M21.6716 10.1087C21.1666 10.1065 20.7351 9.97337 20.3772 9.70916C20.0192 9.44496 19.7454 9.06037 19.5558 8.5554C19.3662 8.05043 19.2714 7.44212 19.2714 6.73047C19.2714 6.02095 19.3662 5.41477 19.5558 4.91193C19.7476 4.40909 20.0224 4.02557 20.3804 3.76136C20.7405 3.49716 21.1709 3.36506 21.6716 3.36506C22.1723 3.36506 22.6016 3.49822 22.9596 3.76456C23.3175 4.02876 23.5913 4.41229 23.7809 4.91513C23.9727 5.41584 24.0686 6.02095 24.0686 6.73047C24.0686 7.44425 23.9738 8.05362 23.7841 8.55859C23.5945 9.06143 23.3207 9.44602 22.9628 9.71236C22.6048 9.97656 22.1744 10.1087 21.6716 10.1087ZM21.6716 9.25533C22.1147 9.25533 22.461 9.03906 22.7103 8.60653C22.9617 8.17401 23.0874 7.54865 23.0874 6.73047C23.0874 6.18714 23.0299 5.72798 22.9148 5.35298C22.8019 4.97585 22.6389 4.69034 22.4258 4.49645C22.2149 4.30043 21.9635 4.20241 21.6716 4.20241C21.2305 4.20241 20.8843 4.41974 20.6329 4.8544C20.3814 5.28906 20.2547 5.91442 20.2525 6.73047C20.2525 7.27592 20.309 7.73722 20.4219 8.11435C20.537 8.48935 20.7 8.77379 20.9109 8.96768C21.1218 9.15945 21.3754 9.25533 21.6716 9.25533Z'
                            fill='#F9FFFB'
                          />
                        </svg>
                      </span>
                    </a>
                  </div>
                  <div class='header-favourite'>
                    <a href='wishlist.html' class='cart-item'>
                      <span>
                        <svg
                          width='28'
                          height='23'
                          viewBox='0 0 28 23'
                          fill='none'
                          xmlns='http://www.w3.org/2000/svg'
                        >
                          <path
                            d='M4.97214 5.02422C3.71435 5.18246 2.6616 5.7007 1.7705 6.60267C0.970091 7.40971 0.489057 8.26421 0.213053 9.37586C-0.275867 11.3024 0.0789948 13.2013 1.25398 14.9855C2.00708 16.1288 2.98097 17.1772 4.76711 18.7754C5.90266 19.7921 9.36848 22.7591 9.53802 22.858C9.69574 22.953 9.75488 22.9648 10.09 22.9648C10.4252 22.9648 10.4843 22.953 10.642 22.858C10.8116 22.7591 14.2853 19.7881 15.413 18.7754C17.207 17.1692 18.173 16.1249 18.9261 14.9855C20.1011 13.2013 20.4559 11.3024 19.967 9.37586C19.691 8.26421 19.21 7.40971 18.4096 6.60267C17.6131 5.7996 16.7614 5.33674 15.6456 5.09938C15.0857 4.9807 14.0526 4.96883 13.5637 5.0796C12.1995 5.3763 11.1546 6.0607 10.2004 7.27916L10.09 7.41762L9.98357 7.27916C9.04122 6.08443 8.01212 5.40004 6.69913 5.09938C6.30878 5.00839 5.4098 4.96883 4.97214 5.02422ZM6.28907 6.23081C7.40885 6.42861 8.37487 7.0774 9.13979 8.14948C9.26991 8.33542 9.43156 8.55696 9.49465 8.64795C9.78643 9.05937 10.3936 9.05937 10.6854 8.64795C10.7485 8.55696 10.9102 8.33542 11.0403 8.14948C12.0851 6.68575 13.5401 5.9974 15.1251 6.21498C16.8837 6.4563 18.2558 7.69058 18.7802 9.50641C19.1942 10.9424 19.0128 12.4497 18.2597 13.8066C17.6289 14.942 16.5761 16.1328 14.7427 17.7824C13.8555 18.5776 10.1255 21.7978 10.09 21.7978C10.0506 21.7978 6.33638 18.5895 5.4374 17.7824C2.61823 15.2466 1.50633 13.6642 1.23821 11.8088C1.06472 10.6101 1.31312 9.32047 1.91639 8.30377C2.82326 6.77278 4.58968 5.9341 6.28907 6.23081Z'
                            fill='black'
                          />
                          <circle cx='20.9141' cy='7' r='7' fill='#34A853' />
                          <path
                            d='M20.9177 10.1087C20.4127 10.1065 19.9812 9.97337 19.6233 9.70916C19.2653 9.44496 18.9915 9.06037 18.8019 8.5554C18.6123 8.05043 18.5174 7.44212 18.5174 6.73047C18.5174 6.02095 18.6123 5.41477 18.8019 4.91193C18.9937 4.40909 19.2685 4.02557 19.6265 3.76136C19.9866 3.49716 20.4169 3.36506 20.9177 3.36506C21.4184 3.36506 21.8477 3.49822 22.2057 3.76456C22.5636 4.02876 22.8374 4.41229 23.027 4.91513C23.2188 5.41584 23.3147 6.02095 23.3147 6.73047C23.3147 7.44425 23.2199 8.05362 23.0302 8.55859C22.8406 9.06143 22.5668 9.44602 22.2089 9.71236C21.8509 9.97656 21.4205 10.1087 20.9177 10.1087ZM20.9177 9.25533C21.3608 9.25533 21.7071 9.03906 21.9564 8.60653C22.2078 8.17401 22.3335 7.54865 22.3335 6.73047C22.3335 6.18714 22.276 5.72798 22.1609 5.35298C22.048 4.97585 21.885 4.69034 21.6719 4.49645C21.461 4.30043 21.2096 4.20241 20.9177 4.20241C20.4766 4.20241 20.1304 4.41974 19.879 4.8544C19.6275 5.28906 19.5008 5.91442 19.4986 6.73047C19.4986 7.27592 19.5551 7.73722 19.668 8.11435C19.7831 8.48935 19.9461 8.77379 20.157 8.96768C20.3679 9.15945 20.6215 9.25533 20.9177 9.25533Z'
                            fill='#F9FFFB'
                          />
                        </svg>
                      </span>
                    </a>
                  </div>
                </div>
                <div class='shop-btn'>
                  <button
                    type='button'
                    class='btn-close'
                    data-bs-dismiss='offcanvas'
                    aria-label='Close'
                  ></button>
                </div>
              </div>
              <div class='header-input'>
                <input type='text' placeholder='Search....' />
                <span>
                  <svg
                    width='22'
                    height='22'
                    viewBox='0 0 22 22'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M13.9708 16.4151C12.5227 17.4021 10.9758 17.9723 9.27353 18.0062C5.58462 18.0802 2.75802 16.483 1.05056 13.1945C-1.76315 7.77253 1.33485 1.37571 7.25086 0.167548C12.2281 -0.848249 17.2053 2.87895 17.7198 7.98579C17.9182 9.95558 17.5566 11.7939 16.5852 13.5061C16.4512 13.742 16.483 13.8725 16.6651 14.0553C18.2412 15.6386 19.8112 17.2272 21.3735 18.8244C22.1826 19.6513 22.2058 20.7559 21.456 21.4932C20.7697 22.1678 19.7047 22.1747 18.9764 21.4793C18.3623 20.8917 17.7774 20.2737 17.1796 19.6688C16.118 18.5929 15.0564 17.5153 13.9708 16.4151ZM2.89545 9.0364C2.91692 12.4172 5.59664 15.1164 8.91967 15.1042C12.2384 15.092 14.9138 12.3493 14.8889 8.98505C14.864 5.63213 12.1826 2.92508 8.89047 2.92857C5.58204 2.93118 2.87397 5.68958 2.89545 9.0364Z'
                      fill='#fff'
                    ></path>
                  </svg>
                </span>
              </div>

              <div class='category-dropdown'>
                <ul class='category-list'>
                  {category &&
                    category.map((item, index) => (
                      <li className='category-list-item' key={index}>
                        <Link to={`/category/${item.categoryname.replace(/&/g, 'and').replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, '-').toLowerCase()}/${item.category_id}`}>
                          <div class='dropdown-item d-flex justify-content-between align-items-center'>
                            <div class='dropdown-list-item d-flex'>
                              <span class='dropdown-img'>
                                <img src={item.image} alt='category image' />
                                {/* <svg
                                  aria-hidden="true"
                                  focusable="false"
                                  data-prefix="fas"
                                  data-icon="anchor"
                                  class="svg-inline--fa fa-anchor w-4 h-4"
                                  role="img"
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 576 512"
                                >
                                  <path
                                    fill="currentColor"
                                    d="M352 176C369.7 176 384 190.3 384 208C384 225.7 369.7 240 352 240H320V448H368C421 448 464 405 464 352V345.9L456.1 352.1C447.6 362.3 432.4 362.3 423 352.1C413.7 343.6 413.7 328.4 423 319L479 263C488.4 253.7 503.6 253.7 512.1 263L568.1 319C578.3 328.4 578.3 343.6 568.1 352.1C559.6 362.3 544.4 362.3 535 352.1L528 345.9V352C528 440.4 456.4 512 368 512H208C119.6 512 48 440.4 48 352V345.9L40.97 352.1C31.6 362.3 16.4 362.3 7.029 352.1C-2.343 343.6-2.343 328.4 7.029 319L63.03 263C72.4 253.7 87.6 253.7 96.97 263L152.1 319C162.3 328.4 162.3 343.6 152.1 352.1C143.6 362.3 128.4 362.3 119 352.1L112 345.9V352C112 405 154.1 448 208 448H256V240H224C206.3 240 192 225.7 192 208C192 190.3 206.3 176 224 176H234.9C209 158.8 192 129.4 192 96C192 42.98 234.1 0 288 0C341 0 384 42.98 384 96C384 129.4 366.1 158.8 341.1 176H352zM288 128C305.7 128 320 113.7 320 96C320 78.33 305.7 64 288 64C270.3 64 256 78.33 256 96C256 113.7 270.3 128 288 128z"
                                  ></path>
                                </svg> */}
                              </span>
                              <span class='dropdown-text'>
                                {item.categoryname}
                              </span>
                            </div>
                            <div class='drop-down-list-icon'>
                              <span>
                                <svg
                                  width='15'
                                  height='15'
                                  viewBox='0 0 6 9'
                                  fill='none'
                                  xmlns='http://www.w3.org/2000/svg'
                                >
                                  <rect
                                    x='1.5'
                                    y='0.818359'
                                    width='5.78538'
                                    height='1.28564'
                                    transform='rotate(45 1.5 0.818359)'
                                  />
                                  <rect
                                    x='5.58984'
                                    y='4.90918'
                                    width='5.78538'
                                    height='1.28564'
                                    transform='rotate(135 5.58984 4.90918)'
                                  />
                                </svg>
                              </span>
                            </div>
                          </div>
                        </Link>
                      </li>
                    ))}

                  {/* <li class="category-list-item">
                    <a href="product-sidebar.html">
                      <div class="dropdown-item d-flex justify-content-between align-items-center">
                        <div class="dropdown-list-item d-flex">
                          <span class="dropdown-img">
                            <svg
                              aria-hidden="true"
                              focusable="false"
                              data-prefix="fas"
                              data-icon="anchor"
                              class="svg-inline--fa fa-anchor w-4 h-4"
                              role="img"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 576 512"
                            >
                              <path
                                fill="currentColor"
                                d="M352 176C369.7 176 384 190.3 384 208C384 225.7 369.7 240 352 240H320V448H368C421 448 464 405 464 352V345.9L456.1 352.1C447.6 362.3 432.4 362.3 423 352.1C413.7 343.6 413.7 328.4 423 319L479 263C488.4 253.7 503.6 253.7 512.1 263L568.1 319C578.3 328.4 578.3 343.6 568.1 352.1C559.6 362.3 544.4 362.3 535 352.1L528 345.9V352C528 440.4 456.4 512 368 512H208C119.6 512 48 440.4 48 352V345.9L40.97 352.1C31.6 362.3 16.4 362.3 7.029 352.1C-2.343 343.6-2.343 328.4 7.029 319L63.03 263C72.4 253.7 87.6 253.7 96.97 263L152.1 319C162.3 328.4 162.3 343.6 152.1 352.1C143.6 362.3 128.4 362.3 119 352.1L112 345.9V352C112 405 154.1 448 208 448H256V240H224C206.3 240 192 225.7 192 208C192 190.3 206.3 176 224 176H234.9C209 158.8 192 129.4 192 96C192 42.98 234.1 0 288 0C341 0 384 42.98 384 96C384 129.4 366.1 158.8 341.1 176H352zM288 128C305.7 128 320 113.7 320 96C320 78.33 305.7 64 288 64C270.3 64 256 78.33 256 96C256 113.7 270.3 128 288 128z"
                              ></path>
                            </svg>
                          </span>
                          <span class="dropdown-text">Vegetable</span>
                        </div>
                        <div class="drop-down-list-icon">
                          <span>
                            <svg
                              width="15"
                              height="15"
                              viewBox="0 0 6 9"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <rect
                                x="1.5"
                                y="0.818359"
                                width="5.78538"
                                height="1.28564"
                                transform="rotate(45 1.5 0.818359)"
                              />
                              <rect
                                x="5.58984"
                                y="4.90918"
                                width="5.78538"
                                height="1.28564"
                                transform="rotate(135 5.58984 4.90918)"
                              />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </a>
                  </li>
                  <li class="category-list-item">
                    <a href="product-sidebar.html">
                      <div class="dropdown-item d-flex justify-content-between align-items-center">
                        <div class="dropdown-list-item d-flex">
                          <span class="dropdown-img">
                            <svg
                              aria-hidden="true"
                              focusable="false"
                              data-prefix="fas"
                              data-icon="gamepad"
                              class="svg-inline--fa fa-gamepad w-4 h-4"
                              role="img"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 640 512"
                            >
                              <path
                                fill="currentColor"
                                d="M448 64H192C85.96 64 0 149.1 0 256s85.96 192 192 192h256c106 0 192-85.96 192-192S554 64 448 64zM247.1 280h-32v32c0 13.2-10.78 24-23.98 24c-13.2 0-24.02-10.8-24.02-24v-32L136 279.1C122.8 279.1 111.1 269.2 111.1 256c0-13.2 10.85-24.01 24.05-24.01L167.1 232v-32c0-13.2 10.82-24 24.02-24c13.2 0 23.98 10.8 23.98 24v32h32c13.2 0 24.02 10.8 24.02 24C271.1 269.2 261.2 280 247.1 280zM431.1 344c-22.12 0-39.1-17.87-39.1-39.1s17.87-40 39.1-40s39.1 17.88 39.1 40S454.1 344 431.1 344zM495.1 248c-22.12 0-39.1-17.87-39.1-39.1s17.87-40 39.1-40c22.12 0 39.1 17.88 39.1 40S518.1 248 495.1 248z"
                              ></path>
                            </svg>
                          </span>
                          <span class="dropdown-text">Fruits</span>
                        </div>
                        <div class="drop-down-list-icon">
                          <span>
                            <svg
                              width="15"
                              height="15"
                              viewBox="0 0 6 9"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <rect
                                x="1.5"
                                y="0.818359"
                                width="5.78538"
                                height="1.28564"
                                transform="rotate(45 1.5 0.818359)"
                              />
                              <rect
                                x="5.58984"
                                y="4.90918"
                                width="5.78538"
                                height="1.28564"
                                transform="rotate(135 5.58984 4.90918)"
                              />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </a>
                  </li>
                  <li class="category-list-item">
                    <a href="product-sidebar.html">
                      <div class="dropdown-item d-flex justify-content-between align-items-center">
                        <div class="dropdown-list-item d-flex">
                          <span class="dropdown-img">
                            <svg
                              aria-hidden="true"
                              focusable="false"
                              data-prefix="fas"
                              data-icon="mobile-screen-button"
                              class="svg-inline--fa fa-mobile-screen-button w-4 h-4"
                              role="img"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 384 512"
                            >
                              <path
                                fill="currentColor"
                                d="M304 0h-224c-35.35 0-64 28.65-64 64v384c0 35.35 28.65 64 64 64h224c35.35 0 64-28.65 64-64V64C368 28.65 339.3 0 304 0zM192 480c-17.75 0-32-14.25-32-32s14.25-32 32-32s32 14.25 32 32S209.8 480 192 480zM304 64v320h-224V64H304z"
                              ></path>
                            </svg>
                          </span>
                          <span class="dropdown-text">Juice</span>
                        </div>
                        <div class="drop-down-list-icon">
                          <span>
                            <svg
                              width="15"
                              height="15"
                              viewBox="0 0 6 9"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <rect
                                x="1.5"
                                y="0.818359"
                                width="5.78538"
                                height="1.28564"
                                transform="rotate(45 1.5 0.818359)"
                              />
                              <rect
                                x="5.58984"
                                y="4.90918"
                                width="5.78538"
                                height="1.28564"
                                transform="rotate(135 5.58984 4.90918)"
                              />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </a>
                  </li>
                  <li class="category-list-item">
                    <a href="product-sidebar.html">
                      <div class="dropdown-item d-flex justify-content-between align-items-center">
                        <div class="dropdown-list-item d-flex">
                          <span class="dropdown-img">
                            <svg
                              aria-hidden="true"
                              focusable="false"
                              data-prefix="fas"
                              data-icon="house"
                              class="svg-inline--fa fa-house w-4 h-4"
                              role="img"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 576 512"
                            >
                              <path
                                fill="currentColor"
                                d="M575.8 255.5C575.8 273.5 560.8 287.6 543.8 287.6H511.8L512.5 447.7C512.5 450.5 512.3 453.1 512 455.8V472C512 494.1 494.1 512 472 512H456C454.9 512 453.8 511.1 452.7 511.9C451.3 511.1 449.9 512 448.5 512H392C369.9 512 352 494.1 352 472V384C352 366.3 337.7 352 320 352H256C238.3 352 224 366.3 224 384V472C224 494.1 206.1 512 184 512H128.1C126.6 512 125.1 511.9 123.6 511.8C122.4 511.9 121.2 512 120 512H104C81.91 512 64 494.1 64 472V360C64 359.1 64.03 358.1 64.09 357.2V287.6H32.05C14.02 287.6 0 273.5 0 255.5C0 246.5 3.004 238.5 10.01 231.5L266.4 8.016C273.4 1.002 281.4 0 288.4 0C295.4 0 303.4 2.004 309.5 7.014L564.8 231.5C572.8 238.5 576.9 246.5 575.8 255.5L575.8 255.5z"
                              ></path>
                            </svg>
                          </span>
                          <span class="dropdown-text">Meat</span>
                        </div>
                        <div class="drop-down-list-icon">
                          <span>
                            <svg
                              width="15"
                              height="15"
                              viewBox="0 0 6 9"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <rect
                                x="1.5"
                                y="0.818359"
                                width="5.78538"
                                height="1.28564"
                                transform="rotate(45 1.5 0.818359)"
                              />
                              <rect
                                x="5.58984"
                                y="4.90918"
                                width="5.78538"
                                height="1.28564"
                                transform="rotate(135 5.58984 4.90918)"
                              />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </a>
                  </li>
                  <li class="category-list-item">
                    <a href="product-sidebar.html">
                      <div class="dropdown-item d-flex justify-content-between align-items-center">
                        <div class="dropdown-list-item d-flex">
                          <span class="dropdown-img">
                            <svg
                              aria-hidden="true"
                              focusable="false"
                              data-prefix="fas"
                              data-icon="basketball"
                              class="svg-inline--fa fa-basketball w-4 h-4"
                              role="img"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 512 512"
                            >
                              <path
                                fill="currentColor"
                                d="M148.7 171.3L64.21 86.83c-28.39 32.16-48.9 71.38-58.3 114.8C19.41 205.4 33.34 208 48 208C86.34 208 121.1 193.9 148.7 171.3zM194.5 171.9L256 233.4l169.2-169.2C380 24.37 320.9 0 256 0C248.6 0 241.2 .4922 233.1 1.113C237.8 16.15 240 31.8 240 48C240 95.19 222.8 138.4 194.5 171.9zM208 48c0-14.66-2.623-28.59-6.334-42.09C158.2 15.31 118.1 35.82 86.83 64.21l84.48 84.48C193.9 121.1 208 86.34 208 48zM171.9 194.5C138.4 222.8 95.19 240 48 240c-16.2 0-31.85-2.236-46.89-6.031C.4922 241.2 0 248.6 0 256c0 64.93 24.37 124 64.21 169.2L233.4 256L171.9 194.5zM317.5 340.1L256 278.6l-169.2 169.2C131.1 487.6 191.1 512 256 512c7.438 0 14.75-.4922 22.03-1.113C274.2 495.8 272 480.2 272 464C272 416.8 289.2 373.6 317.5 340.1zM363.3 340.7l84.48 84.48c28.39-32.16 48.9-71.38 58.3-114.8C492.6 306.6 478.7 304 464 304C425.7 304 390.9 318.1 363.3 340.7zM447.8 86.83L278.6 256l61.52 61.52C373.6 289.2 416.8 272 464 272c16.2 0 31.85 2.236 46.89 6.031C511.5 270.8 512 263.4 512 256C512 191.1 487.6 131.1 447.8 86.83zM304 464c0 14.66 2.623 28.59 6.334 42.09c43.46-9.4 82.67-29.91 114.8-58.3l-84.48-84.48C318.1 390.9 304 425.7 304 464z"
                              ></path>
                            </svg>
                          </span>
                          <span class="dropdown-text">Smoothie</span>
                        </div>
                        <div class="drop-down-list-icon">
                          <span>
                            <svg
                              width="15"
                              height="15"
                              viewBox="0 0 6 9"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <rect
                                x="1.5"
                                y="0.818359"
                                width="5.78538"
                                height="1.28564"
                                transform="rotate(45 1.5 0.818359)"
                              />
                              <rect
                                x="5.58984"
                                y="4.90918"
                                width="5.78538"
                                height="1.28564"
                                transform="rotate(135 5.58984 4.90918)"
                              />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </a>
                  </li>
                  <li class="category-list-item">
                    <a href="product-sidebar.html">
                      <div class="dropdown-item d-flex justify-content-between align-items-center">
                        <div class="dropdown-list-item d-flex">
                          <span class="dropdown-img">
                            <svg
                              aria-hidden="true"
                              focusable="false"
                              data-prefix="fas"
                              data-icon="bicycle"
                              class="svg-inline--fa fa-bicycle w-4 h-4"
                              role="img"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 640 512"
                            >
                              <path
                                fill="currentColor"
                                d="M347.2 32C358.1 32 369.8 38.44 375.4 48.78L473.3 229.1C485.5 226.1 498.5 224 512 224C582.7 224 640 281.3 640 352C640 422.7 582.7 480 512 480C441.3 480 384 422.7 384 352C384 311.1 402.4 276.3 431.1 252.8L409.4 212.7L324.7 356.2C320.3 363.5 312.5 368 304 368H255C247.1 431.1 193.3 480 128 480C57.31 480 0 422.7 0 352C0 281.3 57.31 224 128 224C138.7 224 149.2 225.3 159.2 227.8L185.8 174.7L163.7 144H120C106.7 144 96 133.3 96 120C96 106.7 106.7 96 120 96H176C183.7 96 190.1 99.71 195.5 105.1L222.9 144H372.3L337.7 80H311.1C298.7 80 287.1 69.25 287.1 56C287.1 42.75 298.7 32 311.1 32H347.2zM440 352C440 391.8 472.2 424 512 424C551.8 424 584 391.8 584 352C584 312.2 551.8 280 512 280C508.2 280 504.5 280.3 500.8 280.9L533.1 340.6C539.4 352.2 535.1 366.8 523.4 373.1C511.8 379.4 497.2 375.1 490.9 363.4L458.6 303.7C447 316.5 440 333.4 440 352V352zM108.8 328.6L133.1 280.2C131.4 280.1 129.7 280 127.1 280C88.24 280 55.1 312.2 55.1 352C55.1 391.8 88.24 424 127.1 424C162.3 424 190.9 400.1 198.2 368H133.2C112.1 368 99.81 346.7 108.8 328.6H108.8zM290.3 320L290.4 319.9L217.5 218.7L166.8 320H290.3zM257.4 192L317 274.8L365.9 192H257.4z"
                              ></path>
                            </svg>
                          </span>
                          <span class="dropdown-text">Bread</span>
                        </div>
                        <div class="drop-down-list-icon">
                          <span>
                            <svg
                              width="15"
                              height="15"
                              viewBox="0 0 6 9"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <rect
                                x="1.5"
                                y="0.818359"
                                width="5.78538"
                                height="1.28564"
                                transform="rotate(45 1.5 0.818359)"
                              />
                              <rect
                                x="5.58984"
                                y="4.90918"
                                width="5.78538"
                                height="1.28564"
                                transform="rotate(135 5.58984 4.90918)"
                              />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </a>
                  </li>
                  <li class="category-list-item">
                    <a href="product-sidebar.html">
                      <div class="dropdown-item d-flex justify-content-between align-items-center">
                        <div class="dropdown-list-item d-flex">
                          <span class="dropdown-img">
                            <svg
                              aria-hidden="true"
                              focusable="false"
                              data-prefix="fas"
                              data-icon="street-view"
                              class="svg-inline--fa fa-street-view w-4 h-4"
                              role="img"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 512 512"
                            >
                              <path
                                fill="currentColor"
                                d="M320 64C320 99.35 291.3 128 256 128C220.7 128 192 99.35 192 64C192 28.65 220.7 0 256 0C291.3 0 320 28.65 320 64zM288 160C323.3 160 352 188.7 352 224V272C352 289.7 337.7 304 320 304H318.2L307.2 403.5C305.4 419.7 291.7 432 275.4 432H236.6C220.3 432 206.6 419.7 204.8 403.5L193.8 304H192C174.3 304 160 289.7 160 272V224C160 188.7 188.7 160 224 160H288zM63.27 414.7C60.09 416.3 57.47 417.8 55.33 419.2C51.7 421.6 51.72 426.4 55.34 428.8C64.15 434.6 78.48 440.6 98.33 446.1C137.7 456.1 193.5 464 256 464C318.5 464 374.3 456.1 413.7 446.1C433.5 440.6 447.9 434.6 456.7 428.8C460.3 426.4 460.3 421.6 456.7 419.2C454.5 417.8 451.9 416.3 448.7 414.7C433.4 406.1 409.9 399.8 379.7 394.2C366.6 391.8 358 379.3 360.4 366.3C362.8 353.3 375.3 344.6 388.3 347C420.8 352.9 449.2 361.2 470.3 371.8C480.8 377.1 490.6 383.5 498 391.4C505.6 399.5 512 410.5 512 424C512 445.4 496.5 460.1 482.9 469C468.2 478.6 448.6 486.3 426.4 492.4C381.8 504.7 321.6 512 256 512C190.4 512 130.2 504.7 85.57 492.4C63.44 486.3 43.79 478.6 29.12 469C15.46 460.1 0 445.4 0 424C0 410.5 6.376 399.5 13.96 391.4C21.44 383.5 31.24 377.1 41.72 371.8C62.75 361.2 91.24 352.9 123.7 347C136.7 344.6 149.2 353.3 151.6 366.3C153.1 379.3 145.4 391.8 132.3 394.2C102.1 399.8 78.57 406.1 63.27 414.7H63.27z"
                              ></path>
                            </svg>
                          </span>
                          <span class="dropdown-text">Sea Food</span>
                        </div>
                        <div class="drop-down-list-icon">
                          <span>
                            <svg
                              width="15"
                              height="15"
                              viewBox="0 0 6 9"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <rect
                                x="1.5"
                                y="0.818359"
                                width="5.78538"
                                height="1.28564"
                                transform="rotate(45 1.5 0.818359)"
                              />
                              <rect
                                x="5.58984"
                                y="4.90918"
                                width="5.78538"
                                height="1.28564"
                                transform="rotate(135 5.58984 4.90918)"
                              />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </a>
                  </li>
                  <li class="category-list-item">
                    <a href="product-sidebar.html">
                      <div class="dropdown-item d-flex justify-content-between align-items-center">
                        <div class="dropdown-list-item d-flex">
                          <span class="dropdown-img">
                            <svg
                              aria-hidden="true"
                              focusable="false"
                              data-prefix="fab"
                              data-icon="android"
                              class="svg-inline--fa fa-android w-4 h-4"
                              role="img"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 576 512"
                            >
                              <path
                                fill="currentColor"
                                d="M420.5 301.9a24 24 0 1 1 24-24 24 24 0 0 1 -24 24m-265.1 0a24 24 0 1 1 24-24 24 24 0 0 1 -24 24m273.7-144.5 47.94-83a10 10 0 1 0 -17.27-10h0l-48.54 84.07a301.3 301.3 0 0 0 -246.6 0L116.2 64.45a10 10 0 1 0 -17.27 10h0l47.94 83C64.53 202.2 8.24 285.5 0 384H576c-8.24-98.45-64.54-181.8-146.9-226.6"
                              ></path>
                            </svg>
                          </span>
                          <span class="dropdown-text">Pet Food</span>
                        </div>
                        <div class="drop-down-list-icon">
                          <span>
                            <svg
                              width="15"
                              height="15"
                              viewBox="0 0 6 9"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <rect
                                x="1.5"
                                y="0.818359"
                                width="5.78538"
                                height="1.28564"
                                transform="rotate(45 1.5 0.818359)"
                              />
                              <rect
                                x="5.58984"
                                y="4.90918"
                                width="5.78538"
                                height="1.28564"
                                transform="rotate(135 5.58984 4.90918)"
                              />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </a>
                  </li>
                  <li class="category-list-item">
                    <a href="product-sidebar.html">
                      <div class="dropdown-item d-flex justify-content-between align-items-center">
                        <div class="dropdown-list-item d-flex">
                          <span class="dropdown-img">
                            <svg
                              aria-hidden="true"
                              focusable="false"
                              data-prefix="fas"
                              data-icon="circle-half-stroke"
                              class="svg-inline--fa fa-circle-half-stroke w-4 h-4"
                              role="img"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 512 512"
                            >
                              <path
                                fill="currentColor"
                                d="M512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256zM256 64V448C362 448 448 362 448 256C448 149.1 362 64 256 64z"
                              ></path>
                            </svg>
                          </span>
                          <span class="dropdown-text">Milk & Drinks</span>
                        </div>
                        <div class="drop-down-list-icon">
                          <span>
                            <svg
                              width="15"
                              height="15"
                              viewBox="0 0 6 9"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <rect
                                x="1.5"
                                y="0.818359"
                                width="5.78538"
                                height="1.28564"
                                transform="rotate(45 1.5 0.818359)"
                              />
                              <rect
                                x="5.58984"
                                y="4.90918"
                                width="5.78538"
                                height="1.28564"
                                transform="rotate(135 5.58984 4.90918)"
                              />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </a>
                  </li>
                  <li class="category-list-item">
                    <a href="product-sidebar.html">
                      <div class="dropdown-item d-flex justify-content-between align-items-center">
                        <div class="dropdown-list-item d-flex">
                          <span class="dropdown-img">
                            <svg
                              aria-hidden="true"
                              focusable="false"
                              data-prefix="fas"
                              data-icon="gears"
                              class="svg-inline--fa fa-gears w-4 h-4"
                              role="img"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 640 512"
                            >
                              <path
                                fill="currentColor"
                                d="M286.3 155.1C287.4 161.9 288 168.9 288 175.1C288 183.1 287.4 190.1 286.3 196.9L308.5 216.7C315.5 223 318.4 232.1 314.7 241.7C312.4 246.1 309.9 252.2 307.1 257.2L304 262.6C300.1 267.6 297.7 272.4 294.2 277.1C288.5 284.7 278.5 287.2 269.5 284.2L241.2 274.9C230.5 283.8 218.3 290.9 205 295.9L198.1 324.9C197 334.2 189.8 341.6 180.4 342.8C173.7 343.6 166.9 344 160 344C153.1 344 146.3 343.6 139.6 342.8C130.2 341.6 122.1 334.2 121 324.9L114.1 295.9C101.7 290.9 89.5 283.8 78.75 274.9L50.53 284.2C41.54 287.2 31.52 284.7 25.82 277.1C22.28 272.4 18.98 267.5 15.94 262.5L12.92 257.2C10.13 252.2 7.592 247 5.324 241.7C1.62 232.1 4.458 223 11.52 216.7L33.7 196.9C32.58 190.1 31.1 183.1 31.1 175.1C31.1 168.9 32.58 161.9 33.7 155.1L11.52 135.3C4.458 128.1 1.62 119 5.324 110.3C7.592 104.1 10.13 99.79 12.91 94.76L15.95 89.51C18.98 84.46 22.28 79.58 25.82 74.89C31.52 67.34 41.54 64.83 50.53 67.79L78.75 77.09C89.5 68.25 101.7 61.13 114.1 56.15L121 27.08C122.1 17.8 130.2 10.37 139.6 9.231C146.3 8.418 153.1 8 160 8C166.9 8 173.7 8.418 180.4 9.23C189.8 10.37 197 17.8 198.1 27.08L205 56.15C218.3 61.13 230.5 68.25 241.2 77.09L269.5 67.79C278.5 64.83 288.5 67.34 294.2 74.89C297.7 79.56 300.1 84.42 304 89.44L307.1 94.83C309.9 99.84 312.4 105 314.7 110.3C318.4 119 315.5 128.1 308.5 135.3L286.3 155.1zM160 127.1C133.5 127.1 112 149.5 112 175.1C112 202.5 133.5 223.1 160 223.1C186.5 223.1 208 202.5 208 175.1C208 149.5 186.5 127.1 160 127.1zM484.9 478.3C478.1 479.4 471.1 480 464 480C456.9 480 449.9 479.4 443.1 478.3L423.3 500.5C416.1 507.5 407 510.4 398.3 506.7C393 504.4 387.8 501.9 382.8 499.1L377.4 496C372.4 492.1 367.6 489.7 362.9 486.2C355.3 480.5 352.8 470.5 355.8 461.5L365.1 433.2C356.2 422.5 349.1 410.3 344.1 397L315.1 390.1C305.8 389 298.4 381.8 297.2 372.4C296.4 365.7 296 358.9 296 352C296 345.1 296.4 338.3 297.2 331.6C298.4 322.2 305.8 314.1 315.1 313L344.1 306.1C349.1 293.7 356.2 281.5 365.1 270.8L355.8 242.5C352.8 233.5 355.3 223.5 362.9 217.8C367.6 214.3 372.5 210.1 377.5 207.9L382.8 204.9C387.8 202.1 392.1 199.6 398.3 197.3C407 193.6 416.1 196.5 423.3 203.5L443.1 225.7C449.9 224.6 456.9 224 464 224C471.1 224 478.1 224.6 484.9 225.7L504.7 203.5C511 196.5 520.1 193.6 529.7 197.3C535 199.6 540.2 202.1 545.2 204.9L550.5 207.9C555.5 210.1 560.4 214.3 565.1 217.8C572.7 223.5 575.2 233.5 572.2 242.5L562.9 270.8C571.8 281.5 578.9 293.7 583.9 306.1L612.9 313C622.2 314.1 629.6 322.2 630.8 331.6C631.6 338.3 632 345.1 632 352C632 358.9 631.6 365.7 630.8 372.4C629.6 381.8 622.2 389 612.9 390.1L583.9 397C578.9 410.3 571.8 422.5 562.9 433.2L572.2 461.5C575.2 470.5 572.7 480.5 565.1 486.2C560.4 489.7 555.6 492.1 550.6 496L545.2 499.1C540.2 501.9 534.1 504.4 529.7 506.7C520.1 510.4 511 507.5 504.7 500.5L484.9 478.3zM512 352C512 325.5 490.5 304 464 304C437.5 304 416 325.5 416 352C416 378.5 437.5 400 464 400C490.5 400 512 378.5 512 352z"
                              ></path>
                            </svg>
                          </span>
                          <span class="dropdown-text">Protein</span>
                        </div>
                        <div class="drop-down-list-icon">
                          <span>
                            <svg
                              width="15"
                              height="15"
                              viewBox="0 0 6 9"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <rect
                                x="1.5"
                                y="0.818359"
                                width="5.78538"
                                height="1.28564"
                                transform="rotate(45 1.5 0.818359)"
                              />
                              <rect
                                x="5.58984"
                                y="4.90918"
                                width="5.78538"
                                height="1.28564"
                                transform="rotate(135 5.58984 4.90918)"
                              />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </a>
                  </li> */}
                </ul>
              </div>
            </div>
          </div>
        </nav>

        <div class='header-bottom d-lg-block'>
          <div class='container'>
            <div class='header-nav'>
              <div class='header-nav-menu-section'>
                <div
                  class='category-menu-section position-relative'
                  onClick={tooglmenu}
                >
                  <div class='empty position-fixed'></div>
                  <button class='dropdown-btn'>
                    <span class='dropdown-icon'>
                      <svg
                        width='14'
                        height='9'
                        viewBox='0 0 14 9'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <rect width='14' height='1' />
                        <rect y='8' width='14' height='1' />
                        <rect y='4' width='10' height='1' />
                      </svg>
                      <span class='list-text'>All Categories</span>
                    </span>
                    <span>
                      <svg
                        width='9'
                        height='5'
                        viewBox='0 0 9 5'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <rect
                          x='8.18359'
                          y='0.910156'
                          width='5.78538'
                          height='1.28564'
                          transform='rotate(135 8.18359 0.910156)'
                          fill='#1D1D1D'
                        ></rect>
                        <rect
                          x='4.08984'
                          y='5'
                          width='5.78538'
                          height='1.28564'
                          transform='rotate(-135 4.08984 5)'
                          fill='#1D1D1D'
                        ></rect>
                      </svg>
                    </span>
                  </button>
                  <div class='category-dropdown position-absolute' id='subMenu'>
                    <ul class='category-list'>
                      {category &&
                        category.map((item, index) => (
                          <li class='category-list-item' key={index + 'grocji'}>
                            <Link to={`/category/${item.categoryname.replace(/&/g, 'and').replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, '-').toLowerCase()}/${item.category_id}`}>
                              <div class='dropdown-item d-flex justify-content-between align-items-center'>
                                <div class='dropdown-list-item d-flex'>
                                  <span class='dropdown-img'>
                                    <img src={item.image} alt='cat image' />
                                    {/* <svg
                                     aria-hidden="true"
                                     focusable="false"
                                     data-prefix="fas"
                                     data-icon="anchor"
                                     class="svg-inline--fa fa-anchor w-4 h-4"
                                     role="img"
                                     xmlns="http://www.w3.org/2000/svg"
                                     viewBox="0 0 576 512"
                                   >
                                     <path d="M352 176C369.7 176 384 190.3 384 208C384 225.7 369.7 240 352 240H320V448H368C421 448 464 405 464 352V345.9L456.1 352.1C447.6 362.3 432.4 362.3 423 352.1C413.7 343.6 413.7 328.4 423 319L479 263C488.4 253.7 503.6 253.7 512.1 263L568.1 319C578.3 328.4 578.3 343.6 568.1 352.1C559.6 362.3 544.4 362.3 535 352.1L528 345.9V352C528 440.4 456.4 512 368 512H208C119.6 512 48 440.4 48 352V345.9L40.97 352.1C31.6 362.3 16.4 362.3 7.029 352.1C-2.343 343.6-2.343 328.4 7.029 319L63.03 263C72.4 253.7 87.6 253.7 96.97 263L152.1 319C162.3 328.4 162.3 343.6 152.1 352.1C143.6 362.3 128.4 362.3 119 352.1L112 345.9V352C112 405 154.1 448 208 448H256V240H224C206.3 240 192 225.7 192 208C192 190.3 206.3 176 224 176H234.9C209 158.8 192 129.4 192 96C192 42.98 234.1 0 288 0C341 0 384 42.98 384 96C384 129.4 366.1 158.8 341.1 176H352zM288 128C305.7 128 320 113.7 320 96C320 78.33 305.7 64 288 64C270.3 64 256 78.33 256 96C256 113.7 270.3 128 288 128z"></path>
                                   </svg> */}
                                  </span>
                                  <span class='dropdown-text'>
                                    {item.categoryname}
                                  </span>
                                </div>
                                <div class='drop-down-list-icon'>
                                  <span>
                                    <svg
                                      width='10'
                                      height='10'
                                      viewBox='0 0 6 9'
                                      fill='none'
                                      xmlns='http://www.w3.org/2000/svg'
                                    >
                                      <rect
                                        x='1.5'
                                        y='0.818359'
                                        width='5.78538'
                                        height='1.28564'
                                        transform='rotate(45 1.5 0.818359)'
                                      />
                                      <rect
                                        x='5.58984'
                                        y='4.90918'
                                        width='5.78538'
                                        height='1.28564'
                                        transform='rotate(135 5.58984 4.90918)'
                                      />
                                    </svg>
                                  </span>
                                </div>
                              </div>
                            </Link>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
                <div className='d-none d-lg-flex'>
                  {/* <button class='shop-btn me-1 shop-btn-mobile'
                      onClick={() => {setModal(!modal)}}
                    >
                    Custom Product
                    </button> */}
                  {modal && (
                    <div className='popup-overlay'>
                      <div className='popup-content'>
                        <h3>Custom Products</h3>

                        <div class='question-section login-section '>
                          <div class='review-form box-shadows'>
                            <form onSubmit={handleCustomProduct}>
                              <div class=' account-inner-form'>
                                <div class='review-form-name'>
                                  <input
                                    name='productName'
                                    type='text'
                                    id='fname'
                                    class='form-control'
                                    placeholder='Product Name'
                                    value={formData.productName}
                                    onChange={e => {
                                      setFormData(previousState => {
                                        return {
                                          ...previousState,
                                          productName: e.target.value,
                                        };
                                      });
                                    }}
                                  />
                                </div>
                                <div class='review-textarea my-3'>
                                  <textarea
                                    name='description'
                                    class='form-control'
                                    placeholder='Product description'
                                    id='floatingTextarea'
                                    rows='2'
                                    value={formData.message}
                                    onChange={e => {
                                      setFormData(previousState => {
                                        return {
                                          ...previousState,
                                          productDesc: e.target.value,
                                        };
                                      });
                                    }}
                                  ></textarea>
                                </div>
                                <div class='review-form-name'>
                                  <input
                                    name='quantity'
                                    type='number'
                                    class='form-control'
                                    placeholder='Quantity'
                                    value={formData.quantity}
                                    onChange={e => {
                                      setFormData(previousState => {
                                        return {
                                          ...previousState,
                                          quantity: e.target.value,
                                        };
                                      });
                                    }}
                                  />
                                </div>
                                <div class='review-form-name'>
                                  <input
                                    name='username'
                                    type='text'
                                    class='form-control'
                                    placeholder='Name'
                                    value={formData.username}
                                    onChange={e => {
                                      setFormData(previousState => {
                                        return {
                                          ...previousState,
                                          username: e.target.value,
                                        };
                                      });
                                    }}
                                  />
                                </div>
                                <div class='review-form-name'>
                                  <input
                                    name='contact'
                                    type='text'
                                    class='form-control'
                                    placeholder='Contact No.'
                                    value={formData.contact}
                                    onChange={e => {
                                      setFormData(previousState => {
                                        return {
                                          ...previousState,
                                          contact: e.target.value,
                                        };
                                      });
                                    }}
                                  />
                                </div>
                              </div>
                              <button
                                type='submit'
                                className='shop-btn login-btn btn-success text-white'
                              >
                                Submit request
                              </button>
                            </form>
                          </div>
                        </div>
                        <button
                          className='btn-warning'
                          onClick={() => setModal(!modal)}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  )}
                  {alertModal && (
                    <div className='popup-overlay'>
                      <div className='popup-content'>
                        <h3>Request Submitted !</h3>
                        <button
                          className='btn-warning'
                          onClick={() => setAlertModal(!alertModal)}
                        >
                          OK
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <div class='header-nav-menu d-none d-lg-flex'>
                  <ul class='menu-list'>
                    {/* <li>
                      <Link to="/home">
                        <span class="list-text">Home</span>
                      </Link>
                    </li>

                    <li>
                      <Link to="/contact">
                        <span class="list-text">Contact</span>
                      </Link>
                    </li> */}
                  </ul>
                </div>

                <div class='header-nav-menu d-block d-lg-none'>
                  <ul class='menu-list'>
                    {/* <li>
                      <Link to="/home">
                        <span class="list-text">Home</span>
                      </Link>
                    </li>

                    <li>
                      <Link to="/contact">
                        <span class="list-text">Contact</span>
                      </Link>
                    </li> */}
                  </ul>
                </div>
              </div>
              <div className='d-none d-lg-flex'>
                <Link to='/home'>
                  <button class='shop-btn me-1'>Home</button>
                </Link>
                {/* <Link to='/category/grocj35599'>
                  <button class='shop-btn me-1'>Grocji Daily</button>
                </Link> */}
                {/* <Link to='/offers'>
                  <button class='shop-btn me-1'>Offers</button>
                </Link> */}
                <Link to='/contact'>
                  <button class='shop-btn me-1'>Contact</button>
                </Link>
                <Link to='/cart' className='shop-btn position-relative' style={{ overflow: 'visible' }} >
                  Cart
                  {cartCount > 0 && !loginstatus && (
                    <span className="position-absolute d-flex align-items-center justify-content-center" style={{ top: '-6px', right: '-6px', backgroundColor: '#0B6623', color: 'white', borderRadius: '50%', width: '24px', height: '24px', fontSize: '14px', fontWeight: 'bold', zIndex: 10 }}>{cartCount}</span>
                  )}
                </Link>
                {loginstatus ? (
                  <>
                    <Link to='/dashboard'>
                      <button class='shop-btn me-1'>Dashboard</button>
                    </Link>

                    <button class='shop-btn me-1' onClick={handleLogout}>
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to='/login'>
                      <button class='shop-btn me-1'>Login</button>
                    </Link>
                    <Link to='/register'>
                      <button class='shop-btn me-1'>Register</button>
                    </Link>
                  </>
                )}
              </div>

              <div className='d-block d-lg-none d-flex flex-nowrap align-items-center'>
                <Link to='/home'>
                  <button class='shop-btn me-1 shop-btn-mobile'>Home</button>
                </Link>
                <Link to='/category/grocj35599'>
                  <button class='shop-btn me-1 shop-btn-mobile'>Daily</button>
                </Link>
                <Link to='/offers'>
                  <button class='shop-btn me-1 shop-btn-mobile'>Offers</button>
                </Link>
                <Link to='/cart'>
                  <button class='shop-btn me-1 shop-btn-mobile'>Cart</button>
                </Link>
                {/* <Link to='/contact'>
                  <button class='shop-btn me-1 shop-btn-mobile'>Contact</button>
                </Link> */}
                {loginstatus ? (
                  <>
                    <Link to='/dashboard'>
                      <button class='shop-btn me-1 shop-btn-mobile'>
                        Dashboard
                      </button>
                    </Link>

                    <button
                      class='shop-btn me-1 shop-btn-mobile'
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to='/login'>
                      <button class='shop-btn me-1 shop-btn-mobile'>
                        Login
                      </button>
                    </Link>
                    <Link to='/register'>
                      <button class='shop-btn me-1 shop-btn-mobile'>
                        Register
                      </button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* <div class="header-bottom d-lg-block">
          <div class="container">
            <div class="header-nav">
              <div class="header-nav-menu-section">
                
                <div class="header-nav-menu">
                  <ul class="menu-list">
                    <li>
                      <Link to="/home">
                        <span class="list-text">Home</span>
                      </Link>
                    </li>
                    
                    <li>
                      <Link to="/contact">
                        <span class="list-text">Contact</span>
                      </Link>
                    </li>
                    
                  </ul>
                </div>
              </div>
              <div>
                {loginstatus ? (
                  <>
                    <Link to="/dashboard"><button class="shop-btn me-1">Dashboard</button></Link>
                    <Link to="/cart"><button class="shop-btn me-1">Cart</button></Link>
                    <button class="shop-btn" onClick={handleLogout}>Logout</button>
                  </>
                ) : (
                  <><Link to="/login">
                    <button class="shop-btn me-1">Login</button>
                  </Link>
                    <Link to="/register">
                      <button class="shop-btn ms-5">Register</button>
                    </Link></>
                )}
              </div>
            </div>
          </div>
        </div> */}
      </header>
    </>
  );
};

export default Header;