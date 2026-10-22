// import React, { useState, useEffect } from 'react';
// import './App.css';
// import 'react-toastify/dist/ReactToastify.css';
// import { BrowserRouter, Route, Routes } from 'react-router-dom';
// import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
// import DataApp from './DataContext';
// import './assets/css/style.css';
// import ErrorRedirectPage from './components/ErrorRedirectPage.js'
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { ToastContainer } from 'react-toastify';


// import Loader from './components/loader/Loader';
// import Checkout from './components/Checkout';
// import Header from './components/shared/Header';
// import Icon from './components/shared/Icon';
// import Footer from './components/shared/Footer';
// import Home from './components/Home';
// import Product from './components/Product';
// import ProductDetails from './components/ProductDetails';
// import Register from './components/auth/Register';
// import Login from './components/auth/Login';
// import Forgetpassword from './components/auth/Forgetpassword';
// import Contact from './components/Contact';
// import CustomProduct from './components/CustomProduct';
// import Category from './components/Category';
// import Address from './components/Address';
// import AddressList from './components/AddressList';

// import ShopByBrand from './components/ShopByBrand';
// import LoginAndSecurityPage from './components/LoginAndSecurity';
// import Nameedit from './components/Editpages/Nameedit';
// import Emailedit from './components/Editpages/Emailedit';
// import Mobilenoedit from './components/Editpages/mobilenoedit';
// import ChangePassword from './components/Editpages/ChangePassword';

// import ShopCart from './components/ShopCart';
// import Wishlist from './components/Wishlist';

// import OrderDetail from './components/OrderDetail';
// import OrderHistory from './components/OrderHistory';
// import PreviousOrder from './components/PreviousOrder.js';
// import OrderHistory2 from './components/OrderHistory2.js';
// import PaymentPage from './components/PaymentPage';
// import Dashboard from './components/Dashboard';
// import Productlist from './components/Productlist';
// import OrderPlaced from './components/OrderPlaced';
// import OrderSuccess from './components/OrderSuccess';
// import OrderDetailsPrint from './components/OrderDetailsPrint';

// import About from './components/About';
// import ProductSearchList from './components/ProductSearchList';
// import OurTeam from './components/OurTeam';
// import Complainform from './components/Complainform';
// import Faq from './components/Faq';

// import Refund from './components/static/Refund';

// import Feedback from './components/Feedback';
// import Offers from './components/Offers';

// import AboutUs from './components/AboutUs';


// import PrivacyPolicy from './components/static/PrivacyPolicy.js';
// import TermsandCondition from './components/TermsandCondititon';
// import ShippingandDelivery from './components/ShippingandDelivery.js'
// import DeleteAccount from './components/auth/DeleteAccount.js';
// import QuickFeedback from './components/QuickFeedback';
// import AllOrders from './components/AllOrders.js';
// import DeletedOrders from './components/DeletedOrders.js';

// import Career from './components/Career.js';


// function App() {
//   const location = useLocation();
//   const [users, setUsers] = useState([]);

//   // FETCH DATA FROM NODE + MYSQL
//   useEffect(() => {
//     fetch("http://localhost:5000/users")
//       .then(res => res.json())
//       .then(data => {
//         console.log("DB DATA:", data);
//         setUsers(data);
//       })
//       .catch(err => console.log(err));
//   }, []);

//   return (
//     <>
//       <Header />

//       {/* OPTIONAL: SHOW DATABASE DATA TEMPORARILY */}
//       <div style={{ padding: "20px", background: "#f5f5f5" }}>
//         <h3>Database Users (Test)</h3>

//         {users.map((u, i) => (
//           <div key={i}>
//             <p>{u.name}</p>
//             <p>{u.email}</p>
//           </div>
//         ))}
//       </div>

//       <Routes>
//         <Route path='/home' element={<Home />} />
//         <Route path='/' element={<Home />} />
//         <Route path='*' element={<ErrorRedirectPage msg="Page Not Found" />} />
//       </Routes>

//       <Icon />
//       <Footer />
//       <ToastContainer />
//     </>
//   );
// }
//   return (
//      <>
//         <Header />
//         <Routes>
//           <Route path='/loader' element={<Loader />} />
//           <Route path='/home' element={<Home />} />
//           <Route path='/category/:category_id' element={<Productlist />} />
//           <Route path='/category/:categoryname/:category_id' element={<Productlist />} />
//           <Route path='/category/:categoryname/:category_id/:subcategoryname/:subcategory_id' element={<Productlist />} />
//           {/* <Route path="/productdetail" element={<ProductDetails />} /> */}
//           {/* <Route path="/category/:categoryid" element={<CategoryBack />} /> */}
//           {<Route path='/product/:shortedProductName/:productid' element={<ProductDetails />} /> }
//           {<Route path='/product/:productid' element={<ProductDetails />} /> }
//           <Route path='/product/:productid' element={<ProductDetails />} />
//           <Route path='/category/shopbybrand' element={<ShopByBrand />}/>

//           <Route path='/cart' element={<ShopCart />} />
//           <Route path='/wishlist' element={<Wishlist />} />
//           <Route path='/checkout' element={<Checkout />} />
//           <Route path='/paymentpage' element={<PaymentPage />} />
//           <Route path='/ordersuccess/:orderid' element={<OrderSuccess />} />
//           <Route path='/orderplaced/:orderid' element={<OrderPlaced />} />
//           <Route path='/dashboard' element={<Dashboard />} />
//           <Route path='/allorders' element={<AllOrders />} />
//           <Route path='/deletedorders' element={<DeletedOrders />} />

//           <Route path='/register' element={<Register />} />
//           <Route path='/login' element={<Login />} />
//           <Route path='/forgetpassword' element={<Forgetpassword />} />
//           <Route path="/feedback" element={<Feedback />} />
//           <Route path='/quickfeedback' element={<QuickFeedback/>}/>
//           <Route path='/contact' element={<Contact />} />
//           <Route path='/complainform' element={<Complainform />} />
//           <Route path='/customproduct' element={<CustomProduct />} />
//           <Route path='/about' element={<About />} />
//           <Route path='/ourteam' element={<OurTeam />} />
//           <Route path='/aboutus' element={<AboutUs />} />

//           <Route path='/loginandsecurity' element={<LoginAndSecurityPage />} />
//           <Route path='/address' element={<AddressList />} />
//           <Route path='/addressnew' element={<Address />} />
//           <Route path='/nameedit' element={<Nameedit />} />
//           <Route path='/emailedit' element={<Emailedit />} />
//           <Route path='/mobilenoedit' element={<Mobilenoedit />} />
//           <Route path='/changepassword' element={<ChangePassword />} />
//           <Route path='/orderdetail' element={<OrderDetail />} />
//           <Route path='/deleteaccount' element={<DeleteAccount />} />
//           <Route
//             path='/orderhistory/orderdetail/:orderid'
//             element={<OrderDetail />}
//           />
//           <Route path='/orderhistory' element={<OrderHistory />} />
//           <Route path='/previousorders' element={<PreviousOrder/>}/>
//           <Route path='/orderhistory2' element={<OrderHistory2 />} />
//           <Route
//             path='/orderhistory/orderdetailsprint/:orderid/:usertype'
//             element={<OrderDetailsPrint />}
//           />
//           <Route
//             path='/orderhistory/orderdetailsprint/:orderid/:usertype/:invoice'
//             element={<OrderDetailsPrint />}
//           />
//           <Route path='/productsearchlist' element={<ProductSearchList />} />
//           <Route path='/faq' element={<Faq />} />
//           <Route path='/career' element={<Career />} />

//           <Route path='/refund' element={<Refund />} />

//           <Route path='/offers' element={<Offers />} />

//           <Route path='/privacypolicy' element={<PrivacyPolicy />} />
//           <Route path='/termsandcondition' element={<TermsandCondition />} />
//           <Route path='/shippinganddelivery' element={<ShippingandDelivery />} />
          
//           <Route path='/' element={<Home />} />
//           <Route path="*" element={<ErrorRedirectPage msg="We couldn’t find the page you are looking for." />} />
          
//         </Routes>
//         {/* <Home /> */}
//         <Icon />
        
//         <Footer />

//         <ToastContainer/>

//      </>
//   );
// }

// export default App;

import React, { useState, useEffect } from "react";
import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import { Routes, Route, useLocation } from "react-router-dom";
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './assets/css/style.css';
import { ToastContainer } from 'react-toastify';

// COMPONENTS
import Header from './components/shared/Header';
import Footer from './components/shared/Footer';
import Icon from './components/shared/Icon';
import Home from './components/Home';
import ErrorRedirectPage from './components/ErrorRedirectPage';

// ROUTES COMPONENTS (shortened for safety)
import Loader from './components/loader/Loader';
import Checkout from './components/Checkout';
import Productlist from './components/Productlist';
import ProductDetails from './components/ProductDetails';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Contact from './components/Contact';
import Wishlist from './components/Wishlist';
import ShopCart from './components/ShopCart';
import OrderHistory from './components/OrderHistory';

function App() {
  const location = useLocation();
  const [users, setUsers] = useState([]);

  // FETCH MYSQL DATA
  useEffect(() => {
    fetch("http://localhost:5000/users")
      .then(res => res.json())
      .then(data => {
        console.log("DB DATA:", data);
        setUsers(data);
      })
      .catch(err => console.log(err));
  }, []);

  return (
    <>
      <Header />

      {/* TEMP DB DISPLAY */}
      <div style={{ padding: "20px", background: "#f5f5f5" }}>
        <h3>Database Users</h3>

        {users.map((u, i) => (
          <div key={i}>
            <p>{u.name}</p>
            <p>{u.email}</p>
            <hr />
          </div>
        ))}
      </div>

      {/* ROUTES */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/cart" element={<ShopCart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/orderhistory" element={<OrderHistory />} />
        <Route path="/productlist" element={<Productlist />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/loader" element={<Loader />} />

        <Route path="*" element={<ErrorRedirectPage msg="Page Not Found" />} />
      </Routes>

      <Icon />
      <Footer />
      <ToastContainer />
    </>
  );
}

export default App;